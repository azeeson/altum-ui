import type {
	SelectOption,
	SelectProps,
	SelectSelectionMode,
} from './Select.types';
export type {
	SelectInputProps,
	SelectOption,
	SelectProps,
	SelectSelectionMode,
} from './Select.types';

import {
	useCallback,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	type FocusEvent,
	type KeyboardEvent,
	type MouseEvent,
	type Ref,
} from 'react';
import type {DropdownPopup, DropdownTriggerSlotProps} from '../Dropdown/Dropdown';
import {Dropdown} from '../Dropdown/Dropdown';
import {Listbox, type ListboxHandle} from '../Listbox/Listbox';
import {SearchField} from '../SearchField/SearchField';
import {FieldBaseIcon, TextField} from '../TextField/TextField';
import {useControlledState} from '../../hooks/useControlledState';
import {useLocale} from '../../locales/localeContext';
import {cn} from '../../core/utils/cn';
import {uEvMerge, uRef} from '../../core/utils/bundle';
import {getFormControlState} from '../../core/utils/form';
import {hidePopover, popoverFromInvoker, showPopover} from '../../core/utils/popover';
import {handleEnterKeyDown, handleListHighlightKeyDown, isKey} from '../../core/utils/keyboard';
import {
	defaultListboxFilterFn,
	filterListboxOptions,
	findListboxOption,
	getListboxOptionDomId,
	getListboxOptionText,
	getListboxPath,
} from '../../core/utils/listboxOptions';
import {ruSlice as ru_customSelect} from '../../locales/slices/customSelect.ru';
import {ruSlice as ru_select} from '../../locales/slices/select.ru';
import selectField from '../../styles/selectField.module.css';
import styles from './Select.module.css';

const localeFallback = {
	select: ru_select,
	customSelect: ru_customSelect,
};

const ENABLED_OPTION = '[role="option"]:not([disabled]):not([hidden])';

function toValueArray(
	mode: SelectSelectionMode,
	value: string | string[] | undefined,
): string[] {
	if (value === undefined) return [];
	if (mode === 'multiple' || mode === 'path') {
		return Array.isArray(value) ? value : value ? [value] : [];
	}
	if (Array.isArray(value)) return value[0] ? [value[0]] : [];
	return value ? [value] : [];
}

function defaultEmptyValue(mode: SelectSelectionMode): string | string[] {
	return mode === 'single' ? '' : [];
}

function optionIndexFromId(listboxId: string, id: string): number | undefined {
	const prefix = `${listboxId}-option-`;
	if (!id.startsWith(prefix)) return undefined;
	const index = Number(id.slice(prefix.length));
	return Number.isInteger(index) ? index : undefined;
}

type HighlightStep = 'next' | 'prev' | 'first' | 'last';

function optionAt(
	list: readonly HTMLElement[],
	current: number,
	step: HighlightStep,
): HTMLElement | undefined {
	if (list.length === 0) return undefined;
	if (step === 'first') return list[0];
	if (step === 'last') return list[list.length - 1];
	if (step === 'next') return list[current < 0 ? 0 : (current + 1) % list.length];
	return list[current < 0 ? list.length - 1 : (current - 1 + list.length) % list.length];
}

function listOptions(listboxId: string): HTMLElement[] {
	const root = document.getElementById(listboxId);
	if (!root) return [];
	return Array.from(root.querySelectorAll<HTMLElement>(ENABLED_OPTION));
}

function chevronIcon(readOnly: boolean) {
	return (
		<svg
			className={styles.arrow}
			data-readonly={readOnly ? '' : undefined}
			viewBox='0 0 24 24'
			aria-hidden='true'
		>
			<path d='M6 9l6 6 6-6' />
		</svg>
	);
}

function isTextTriggerAs(as: string | undefined): boolean {
	return as === 'input' || as === 'textarea';
}

/**
 * Выбор из списка: одно поле и панель с опциями.
 * Печатный триггер и chips задают `SuggestField`, `AutocompleteField`, `MultiSelect` через `inputProps`.
 *
 * @component
 * @example
 * <Select options={options} value={city} onChange={setCity} label="Город" filterable />
 */
export const Select = ({
	options,
	groups,
	selectionMode = 'single',
	value: controlledValue,
	defaultValue,
	onChange,
	defaultOpen = false,
	onOpenChange,
	disabled = false,
	readOnly = false,
	closeOnSelect,
	filterFn = defaultListboxFilterFn,
	filterQuery: controlledFilterQuery,
	defaultFilterQuery = '',
	onFilterQueryChange,
	placeholder,
	loading = false,
	separator = ' / ',
	popupRole = 'listbox',
	filterable = false,
	filterPlaceholder,
	align = 'auto',
	widthMode,
	mobileTitle,
	mobileLeftControls,
	mobileRightControls,
	panelScroll = 'overlay',
	navigation,
	highlightedIndex,
	onHighlightChange,
	showCheck,
	noOptionsText: noOptionsTextProp,
	preventOptionMouseDown,
	listAriaLabel,
	inputProps,
	popupClassName,
	rootRef,
	className = '',
	id: providedId,
	label,
	size = 'md',
	width = 'md',
	prefix,
	postfix: _postfix,
	error,
	description,
	onClear,
	clearLabel,
	'aria-label': ariaLabel,
}: SelectProps) => {
	const {t} = useLocale(localeFallback);
	const generatedId = useId();
	const listboxId = `${generatedId}-listbox`;
	const triggerId = providedId ?? `${generatedId}-trigger`;
	const listboxRef = useRef<ListboxHandle | null>(null);
	const popupRef = useRef<DropdownPopup | null>(null);
	const noOptionsText = noOptionsTextProp ?? t('customSelect.noOptions');
	const {
		onClick: inputOnClick,
		onKeyDown: inputOnKeyDown,
		onFocus: inputOnFocus,
		onBlur: inputOnBlur,
		rootRef: inputRootRef,
		className: inputClassName,
		wrapperClassName: inputWrapperClassName,
		children: inputChildren,
		...inputRest
	} = inputProps ?? {};
	const isTextTrigger = isTextTriggerAs(inputProps?.as);

	const [rawValue, setRawValue] = useControlledState<string | string[]>(
		controlledValue,
		defaultValue ?? defaultEmptyValue(selectionMode),
	);
	const valueArray = toValueArray(selectionMode, rawValue);
	const [filterQuery, setFilterQueryState, isFilterControlled] = useControlledState(
		controlledFilterQuery,
		defaultFilterQuery,
	);
	/** `aria-expanded` для input/div-триггера: браузер ставит его только button+popovertarget. */
	const [listOpen, setListOpen] = useState(defaultOpen);

	const shouldCloseOnSelect = closeOnSelect ?? selectionMode === 'single';
	const {isReadOnly, isInteractive: interactive} = getFormControlState({
		disabled,
		readOnly,
	});
	const isMultiple = selectionMode === 'multiple';
	const isComboboxTrigger = isTextTrigger || isMultiple;
	const resolvedWidthMode = widthMode ?? (isTextTrigger ? 'trigger' : 'trigger-fit');
	const resolvedNavigation = navigation ?? (isTextTrigger ? 'highlight' : undefined);
	const resolvedShowCheck = showCheck ?? (isTextTrigger ? false : selectionMode === 'multiple');
	/** Иначе mousedown по панели/option уводит фокус с триггера → flash blur / light-dismiss. */
	const resolvedPreventMouseDown = preventOptionMouseDown ?? true;
	const keepTriggerFocusOnPanelMouseDown = resolvedPreventMouseDown
		? (event: MouseEvent) => {
			const target = event.target;
			/* Фильтр в панели (SearchField) должен получать фокус. */
			if (
				target instanceof Element
				&& target.closest('input, textarea, [contenteditable="true"]')
			) {
				return;
			}
			event.preventDefault();
		}
		: undefined;
	const highlightNavigation = resolvedNavigation === 'highlight';
	const highlightControlled = highlightedIndex !== undefined;
	const controlledDescendantId = highlightControlled && highlightedIndex >= 0
		? getListboxOptionDomId(listboxId, highlightedIndex)
		: undefined;
	const [highlightMove, setHighlightMove] = useState<{
		options: SelectOption[];
		id: string;
	} | null>(null);
	const activeIdRef = useRef<string | undefined>(undefined);

	const handleOpenChange = useCallback((next: boolean) => {
		setListOpen(next);
		onOpenChange?.(next);
		if (!next && !isFilterControlled) {
			setFilterQueryState('');
			onFilterQueryChange?.('');
		}
	}, [
		isFilterControlled,
		onFilterQueryChange,
		onOpenChange,
		setFilterQueryState,
		setListOpen,
	]);

	const setFilterQuery = useCallback((query: string) => {
		setFilterQueryState(query);
		onFilterQueryChange?.(query);
	}, [onFilterQueryChange, setFilterQueryState]);

	const emitValue = useCallback((nextArray: string[]) => {
		const nextValue: string | string[] = selectionMode === 'single'
			? (nextArray[0] ?? '')
			: nextArray;
		setRawValue(nextValue);
		onChange?.(nextValue);
	}, [onChange, selectionMode, setRawValue]);

	const clearValue = useCallback(() => {
		if (!interactive) return;
		emitValue([]);
	}, [emitValue, interactive]);

	const selectOption = useCallback((optionValue: string) => {
		if (!interactive) return;

		let next: string[];
		if (selectionMode === 'multiple') {
			next = valueArray.includes(optionValue)
				? valueArray.filter((item) => item !== optionValue)
				: [...valueArray, optionValue];
		} else if (selectionMode === 'path') {
			const path = getListboxPath(options, optionValue).map((item) => item.value);
			next = path.length > 0 ? path : [optionValue];
		} else {
			next = [optionValue];
		}
		emitValue(next);
		if (shouldCloseOnSelect) popupRef.current?.hide();
	}, [
		emitValue,
		interactive,
		options,
		selectionMode,
		shouldCloseOnSelect,
		valueArray,
	]);

	const selectedOptions = useMemo(() => {
		if (selectionMode === 'path') {
			return valueArray
				.map((item) => findListboxOption(options, item))
				.filter((item): item is SelectOption => Boolean(item));
		}
		return valueArray
			.map((item) => {
				const matched = findListboxOption(options, item);
				if (matched) return matched;
				if (!item) return undefined;
				return {
					value: item,
					label: item,
				} satisfies SelectOption;
			})
			.filter((item): item is SelectOption => Boolean(item));
	}, [options, selectionMode, valueArray]);

	const filteredOptions = useMemo(
		() => filterListboxOptions({
			options,
			query: filterQuery,
			enabled: true,
			filterFn,
		}),
		[filterFn, filterQuery, options],
	);
	const movedDescendantId = !highlightControlled && highlightMove?.options === filteredOptions
		? highlightMove.id
		: undefined;
	const activeDescendantId = !highlightNavigation
		? undefined
		: highlightControlled
			? controlledDescendantId
			: movedDescendantId;
	activeIdRef.current = activeDescendantId;

	const handleComboboxKeyDown = useCallback((
		event: KeyboardEvent<HTMLElement>,
		triggerKeyDown?: (event: KeyboardEvent<HTMLElement>) => void,
	) => {
		triggerKeyDown?.(event);
		if (event.defaultPrevented || !interactive) return;

		const panel = () => popoverFromInvoker(event.currentTarget);
		/* Input/div без UA aria-expanded: источник правды — :popover-open. */
		const expanded = Boolean(panel()?.matches(':popover-open'));
		const move = (step: HighlightStep) => {
			if (!expanded) showPopover(panel());
			const rows = listOptions(listboxId);
			const current = highlightNavigation
				? rows.findIndex((option) => option.id === activeIdRef.current)
				: rows.indexOf(document.activeElement as HTMLElement);
			const next = optionAt(rows, current, step);
			if (!next) return;
			if (highlightNavigation) {
				activeIdRef.current = next.id;
				if (!highlightControlled) {
					setHighlightMove({
						options: filteredOptions,
						id: next.id,
					});
				}
				listboxRef.current?.scrollToId(next.id);
				const index = optionIndexFromId(listboxId, next.id);
				if (index !== undefined) onHighlightChange?.(index);
				return;
			}
			next.focus({preventScroll: true});
			next.scrollIntoView({block: 'nearest'});
		};
		if (handleListHighlightKeyDown(event, {
			onNext: () => move('next'),
			onPrev: () => move('prev'),
			onFirst: () => move('first'),
			onLast: () => move('last'),
			includeHomeEnd: expanded,
		})) return;

		if (isKey(event, 'Enter') && expanded) {
			event.preventDefault();
			const activeId = highlightNavigation ? activeIdRef.current : undefined;
			const option = highlightNavigation
				? (activeId ? document.getElementById(activeId) : null)
				: document.activeElement;
			if (
				option instanceof HTMLElement
				&& option.getAttribute('role') === 'option'
				&& document.getElementById(listboxId)?.contains(option)
			) {
				option.click();
			}
			hidePopover(panel());
			return;
		}

		if (isKey(event, 'Escape') && expanded) {
			event.preventDefault();
			hidePopover(panel());
		}
	}, [
		filteredOptions,
		highlightControlled,
		highlightNavigation,
		interactive,
		listboxId,
		onHighlightChange,
		setHighlightMove,
	]);

	useLayoutEffect(() => {
		if (!highlightNavigation) return;
		const fromDom = document.getElementById(listboxId)
			?.querySelector<HTMLElement>(ENABLED_OPTION)?.id;
		const id = highlightControlled
			? controlledDescendantId
			: (highlightMove?.options === filteredOptions ? highlightMove.id : fromDom);
		if (id) listboxRef.current?.scrollToId(id);
		if (!highlightControlled && fromDom && highlightMove?.options !== filteredOptions) {
			// id подсветки появляется только после раскладки списка в DOM.
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setHighlightMove({
				options: filteredOptions,
				id: fromDom,
			});
		}
	}, [
		controlledDescendantId,
		filteredOptions,
		highlightControlled,
		highlightMove,
		highlightNavigation,
		listboxId,
	]);

	const selectedOption = selectedOptions[0];
	const hasValue = selectedOptions.length > 0;
	const valueText = selectionMode === 'path'
		? (selectedOptions.length > 0
			? selectedOptions.map((option) => getListboxOptionText(option)).join(separator)
			: null)
		: selectionMode === 'multiple'
			? (selectedOptions.length > 0
				? selectedOptions.map((option) => getListboxOptionText(option)).join(', ')
				: null)
			: (selectedOption
				? (typeof selectedOption.label === 'string'
					? selectedOption.label
					: getListboxOptionText(selectedOption))
				: null);
	const handleClear = onClear ? () => {
		clearValue();
		onClear();
	} : undefined;
	const filterPlaceholderText = filterPlaceholder ?? t('customSelect.filterPlaceholder');
	const defaultChildren = (
		<>
			<span className={selectField.triggerSizer} aria-hidden='true'>
				{placeholder ? <span>
					{placeholder}
				</span> : null}
				{options.map((option) => (
					<span key={option.value}>
						{getListboxOptionText(option)}
					</span>
				))}
			</span>
			<span className={selectField.triggerText}>
				{valueText ?? (
					<span className={selectField.placeholder}>
						{placeholder ?? label}
					</span>
				)}
			</span>
		</>
	);

	return (
		<Dropdown
			rootRef={rootRef}
			defaultOpen={defaultOpen}
			popupRef={popupRef}
			onOpenChange={handleOpenChange}
			popupRole='none'
			triggerMode={isComboboxTrigger ? 'combobox' : 'toggle'}
			className={popupClassName}
			widthMode={resolvedWidthMode}
			align={align}
			mobileTitle={mobileTitle}
			mobileLeftControls={mobileLeftControls}
			mobileRightControls={mobileRightControls}
			panelScroll={panelScroll}
			boxProps={keepTriggerFocusOnPanelMouseDown
				? {onMouseDown: keepTriggerFocusOnPanelMouseDown}
				: undefined}
			trigger={(triggerAttrs: DropdownTriggerSlotProps, triggerRef) => (
				<TextField
					id={triggerId}
					label={label}
					size={size}
					width={width}
					error={error}
					description={description}
					disabled={disabled}
					readOnly={isReadOnly}
					prefix={prefix}
					postfix={(
						<FieldBaseIcon>
							{chevronIcon(isReadOnly)}
						</FieldBaseIcon>
					)}
					onClear={handleClear}
					clearLabel={clearLabel}
					hasValue={hasValue}
					role={isMultiple ? 'combobox' : undefined}
					tabIndex={isMultiple && !disabled ? 0 : undefined}
					aria-disabled={isMultiple ? (disabled || undefined) : undefined}
					aria-busy={loading || undefined}
					aria-controls={listboxId}
					aria-haspopup={popupRole}
					aria-label={ariaLabel}
					aria-activedescendant={activeDescendantId}
					aria-expanded={isComboboxTrigger ? listOpen : triggerAttrs['aria-expanded']}
					popovertarget={triggerAttrs.popovertarget}
					popovertargetaction={triggerAttrs.popovertargetaction}
					{...inputRest}
					as={inputProps?.as ?? (isMultiple ? 'div' : 'button')}
					className={inputClassName ?? (isTextTrigger ? undefined : selectField.trigger)}
					wrapperClassName={inputWrapperClassName ?? cn(
						selectField.field,
						triggerAttrs.className,
						!isTextTrigger && width !== 'full' && selectField.fitContent,
						className,
					)}
					rootRef={uRef(triggerRef, inputRootRef as Ref<HTMLElement> | undefined)}
					onClick={uEvMerge(inputOnClick, (event: MouseEvent<HTMLElement>) => {
						if (!interactive) {
							event.preventDefault();
							return;
						}
						triggerAttrs.onClick?.(event);
						/* div/input — не button-invoker: явный show после жеста. */
						if (isComboboxTrigger && !event.defaultPrevented) {
							showPopover(popoverFromInvoker(event.currentTarget));
						}
					})}
					onFocus={uEvMerge(inputOnFocus, (event: FocusEvent<HTMLElement>) => {
						if (
							isComboboxTrigger
							&& interactive
							&& event.currentTarget.matches(':focus-visible')
						) {
							showPopover(popoverFromInvoker(event.currentTarget));
						}
					})}
					onBlur={inputOnBlur}
					onKeyDown={uEvMerge(inputOnKeyDown, (event: KeyboardEvent<HTMLElement>) => {
						if (!interactive) return;
						if (highlightNavigation) {
							handleComboboxKeyDown(event, triggerAttrs.onKeyDown);
							return;
						}
						triggerAttrs.onKeyDown?.(event);
					})}
				>
					{inputChildren !== undefined
						? inputChildren
						: (isTextTrigger ? null : defaultChildren)}
				</TextField>
			)}
		>
			{filterable && !isTextTrigger ? (
				<div className={styles.filterWrapper}>
					<SearchField
						data-popup-autofocus=''
						size='sm'
						keepPlaceholder
						aria-label={filterPlaceholderText}
						placeholder={filterPlaceholderText}
						value={filterQuery}
						autoComplete='off'
						onChange={(event) => {
							setFilterQuery(event.target.value);
						}}
						onKeyDown={(event) => {
							handleEnterKeyDown(event, () => {
								const first = filteredOptions[0];
								if (first) selectOption(first.value);
							});
						}}
						aria-controls={listboxId}
					/>
				</div>
			) : null}
			<Listbox
				controlRef={listboxRef}
				id={listboxId}
				aria-label={listAriaLabel}
				options={filteredOptions}
				groups={groups}
				value={valueArray}
				multiple={selectionMode === 'multiple'}
				showCheck={resolvedShowCheck}
				noOptionsText={noOptionsText}
				disabled={!interactive}
				navigation={resolvedNavigation}
				onSelect={selectOption}
			/>
		</Dropdown>
	);
};
