import type {
	ListboxOption,
	ListboxProps,
	ListboxHandle,
} from './Listbox.types';
export type {
	ListboxOption,
	ListboxGroup,
	ListboxNavigation,
	ListboxProps,
	ListboxHandle,
} from './Listbox.types';

import React, {
	forwardRef,
	useCallback,
	useEffect,
	useId,
	useImperativeHandle,
	useMemo,
	useRef,
	type ComponentPropsWithoutRef,
} from 'react';
import {
	findEnabledListboxIndex,
	flattenResolvedListboxGroups,
	getListboxOptionDomId,
	getListboxOptionText,
	moveListboxHighlight,
	resolveListboxGroups,
} from '../../utils/listboxOptions';
import {handleListHighlightKeyDown} from '../../utils/keyboard';
import {IconCheckmark} from '../../icons/icons/IconCheckmark';
import {ListOptionBase, ListOptionBaseLabel} from '../../base/ListOptionBase';
import {VirtualList} from '../VirtualList/VirtualList';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import styles from './Listbox.module.css';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {useLocale} from '../LocaleProvider/LocaleProvider';

/** Авто-включение при `options.length > 100` (только плоский список без групп). */
const LISTBOX_VIRTUALIZE_THRESHOLD = 100;
const LISTBOX_OPTION_ESTIMATE = 40;

interface ListboxOptionRowProps {
	option: ListboxOption;
	index: number;
	listboxId: string;
	isSelected: boolean;
	isHighlighted: boolean;
	disabled: boolean;
	showCheck: boolean;
	multiline: boolean;
	preventOptionMouseDown: boolean;
	onHighlight: (index: number) => void;
	onSelect?: (value: string) => void;
	registerOptionRef?: (index: number, node: HTMLElement | null) => void;
	/** @default true */
	wrapAsListItem?: boolean;
	tabIndex?: number;
}

const ListboxOptionRow = React.memo(function ListboxOptionRow({
	option,
	index,
	listboxId,
	isSelected,
	isHighlighted,
	disabled,
	showCheck,
	multiline,
	preventOptionMouseDown,
	onHighlight,
	onSelect,
	registerOptionRef,
	wrapAsListItem = true,
	tabIndex = -1,
}: ListboxOptionRowProps) {
	const optionId = getListboxOptionDomId(listboxId, index);
	const text = getListboxOptionText(option);

	const optionNode = (
		<ListOptionBase
			{...option.buttonProps}
			ref={(node) => registerOptionRef?.(index, node)}
			id={optionId}
			role='option'
			aria-selected={isSelected}
			aria-disabled={disabled || undefined}
			aria-label={
				option.buttonProps?.['aria-label']
				?? (typeof option.label !== 'string' ? text : undefined)
			}
			tabIndex={tabIndex}
			disabled={disabled}
			selected={isSelected}
			highlighted={isHighlighted}
			multiline={multiline}
			className={cn(
				showCheck ? styles.optionWithCheck : '',
				option.buttonProps?.className,
			)}
			onMouseDown={(event) => {
				if (preventOptionMouseDown) {
					event.preventDefault();
				}
			}}
			onMouseEnter={() => onHighlight(index)}
			onFocus={() => onHighlight(index)}
			onClick={() => {
				if (!disabled) {
					onSelect?.(option.value);
				}
			}}
		>
			{showCheck && (
				<span className={styles.optionCheck} aria-hidden='true'>
					{isSelected ? <IconCheckmark size={14} /> : null}
				</span>
			)}
			<ListOptionBaseLabel multiline={multiline}>
				{option.label}
			</ListOptionBaseLabel>
		</ListOptionBase>
	);

	if (!wrapAsListItem) return optionNode;

	return (
		<li role='presentation'>
			{optionNode}
		</li>
	);
});

/**
 * Список опций с roving focus или highlight-навигацией для Select и CommandPalette.
 *
 * @component
 * @example
 * <Listbox
 *   options={options}
 *   value={[selected]}
 *   onSelect={setSelected}
 *   aria-label="Города"
 * />
 */
export const Listbox = forwardRef<ListboxHandle, ListboxProps>(function Listbox(
	{
		options,
		groups,
		value = [],
		multiple = false,
		onSelect,
		id: providedId,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		noOptionsText: noOptionsTextProp,
		loading = false,
		className = '',
		showCheck = false,
		navigation = 'roving',
		highlightedIndex: controlledHighlight,
		defaultHighlightedIndex = -1,
		onHighlightChange,
		preventOptionMouseDown = false,
		disabled = false,
		multiline = false,
		virtualized,
		onKeyDown,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const noOptionsText = noOptionsTextProp ?? t('listbox.noOptions');
	const generatedId = useId();
	const listboxId = providedId ?? generatedId;
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const optionRefsRef = useRef(new Map<number, HTMLElement>());

	const hasNamedGroups = !!(groups && groups.length > 0);
	const resolvedGroups = useMemo(
		() => (hasNamedGroups ? resolveListboxGroups(options, groups) : null),
		[groups, hasNamedGroups, options],
	);
	const flatOptions = useMemo(() => {
		if (resolvedGroups) {
			return flattenResolvedListboxGroups(resolvedGroups);
		}
		return options;
	}, [options, resolvedGroups]);

	const [highlightedIndex, setHighlight] = useControlledStateWithCallback(
		controlledHighlight,
		defaultHighlightedIndex,
		onHighlightChange,
	);

	const registerOptionRef = useCallback((index: number, node: HTMLElement | null) => {
		if (node) {
			optionRefsRef.current.set(index, node);
			return;
		}
		optionRefsRef.current.delete(index);
	}, []);

	const getOptionElement = useCallback((index: number) => {
		return optionRefsRef.current.get(index) ?? null;
	}, []);

	useEffect(() => {
		if (flatOptions.length === 0) {
			if (highlightedIndex !== -1) setHighlight(-1);
			return;
		}
		if (highlightedIndex >= flatOptions.length) {
			setHighlight(flatOptions.length - 1);
		}
	}, [highlightedIndex, flatOptions.length, setHighlight]);

	useEffect(() => {
		if (highlightedIndex < 0) return;
		getOptionElement(highlightedIndex)?.scrollIntoView({block: 'nearest'});
	}, [flatOptions.length, getOptionElement, highlightedIndex]);

	const focusOptionAt = useCallback((index: number) => {
		if (index < 0) return;
		getOptionElement(index)?.focus({preventScroll: true});
	}, [getOptionElement]);

	const isOptionDisabled = useCallback((index: number) => {
		return !!flatOptions[index]?.disabled;
	}, [flatOptions]);

	const isRoving = navigation === 'roving';

	const moveHighlight = useCallback((direction: 1 | -1) => {
		const next = moveListboxHighlight(
			highlightedIndex,
			flatOptions.length,
			direction,
			{isDisabled: isOptionDisabled},
		);
		if (next < 0) return;
		setHighlight(next);
		if (navigation === 'roving') {
			focusOptionAt(next);
		}
	}, [
		focusOptionAt,
		highlightedIndex,
		isOptionDisabled,
		navigation,
		flatOptions.length,
		setHighlight,
	]);

	const selectAt = useCallback((index: number) => {
		if (disabled) return undefined;
		const option = flatOptions[index];
		if (!option || option.disabled) return undefined;
		onSelect?.(option.value);
		return option.value;
	}, [disabled, onSelect, flatOptions]);

	const highlightEdge = useCallback((from: 'start' | 'end') => {
		const next = findEnabledListboxIndex(flatOptions.length, from, isOptionDisabled);
		if (next < 0) return;
		setHighlight(next);
		if (navigation === 'roving') focusOptionAt(next);
	}, [
		focusOptionAt,
		isOptionDisabled,
		navigation,
		flatOptions.length,
		setHighlight,
	]);

	useImperativeHandle(ref, () => ({
		highlightNext: () => moveHighlight(1),
		highlightPrev: () => moveHighlight(-1),
		highlightFirst: () => highlightEdge('start'),
		highlightLast: () => highlightEdge('end'),
		selectHighlighted: () => selectAt(highlightedIndex),
		getHighlightedIndex: () => highlightedIndex,
		getActiveDescendantId: () => (
			!isRoving && highlightedIndex >= 0
				? getListboxOptionDomId(listboxId, highlightedIndex)
				: undefined
		),
		focusOption: focusOptionAt,
	}), [
		focusOptionAt,
		highlightEdge,
		highlightedIndex,
		isRoving,
		listboxId,
		moveHighlight,
		selectAt,
	]);

	const handleListKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		if (disabled || flatOptions.length === 0) return;

		handleListHighlightKeyDown(event, {
			onNext: () => moveHighlight(1),
			onPrev: () => moveHighlight(-1),
			onFirst: () => highlightEdge('start'),
			onLast: () => highlightEdge('end'),
			onSelect: highlightedIndex >= 0
				? () => selectAt(highlightedIndex)
				: undefined,
			includeSpace: true,
		});
	};

	const selectedSet = useMemo(() => new Set(value), [value]);

	const rovingTabStop = isRoving
		? (highlightedIndex >= 0
			? highlightedIndex
			: findEnabledListboxIndex(flatOptions.length, 'start', isOptionDisabled))
		: -1;

	const renderOption = useCallback((
		option: ListboxOption,
		index: number,
		wrapAsListItem = true,
	) => {
		const isSelected = selectedSet.has(option.value);
		const isHighlighted = index === highlightedIndex;
		const optionDisabled = disabled || !!option.disabled;

		return (
			<ListboxOptionRow
				key={`${option.value}-${index}`}
				option={option}
				index={index}
				listboxId={listboxId}
				isSelected={isSelected}
				isHighlighted={isHighlighted}
				disabled={optionDisabled}
				showCheck={showCheck}
				multiline={multiline}
				preventOptionMouseDown={preventOptionMouseDown}
				onHighlight={setHighlight}
				onSelect={onSelect}
				registerOptionRef={registerOptionRef}
				wrapAsListItem={wrapAsListItem}
				tabIndex={isRoving && !optionDisabled && index === rovingTabStop ? 0 : -1}
			/>
		);
	}, [
		disabled,
		highlightedIndex,
		isRoving,
		listboxId,
		multiline,
		onSelect,
		preventOptionMouseDown,
		registerOptionRef,
		rovingTabStop,
		selectedSet,
		setHighlight,
		showCheck,
	]);

	const renderGroupedOptions = () => {
		if (!resolvedGroups) return null;

		let flatIndex = -1;
		return resolvedGroups.map((group) => {
			if (group.options.length === 0) return null;

			const groupLabelId = `${listboxId}-group-${group.id}`;
			const hasLabel = group.label != null;
			const ariaLabelFromString = typeof group.label === 'string' ? group.label : undefined;

			return (
				<li
					key={group.id}
					role='presentation'
					className={styles.group}
				>
					<div
						role='group'
						aria-label={ariaLabelFromString}
						aria-labelledby={
							hasLabel && !ariaLabelFromString ? groupLabelId : undefined
						}
					>
						{hasLabel ? (
							<div id={groupLabelId} className={styles.groupLabel}>
								{group.label}
							</div>
						) : null}
						<ul className={styles.groupOptions} role='presentation'>
							{group.options.map((option) => {
								flatIndex += 1;
								return renderOption(option, flatIndex);
							})}
						</ul>
					</div>
				</li>
			);
		});
	};

	const isEmpty = flatOptions.length === 0;
	const shouldVirtualize = !hasNamedGroups && (
		virtualized ?? flatOptions.length > LISTBOX_VIRTUALIZE_THRESHOLD
	);

	const listClassName = cn(
		styles.listbox,
		hasNamedGroups && styles.listboxGrouped,
		shouldVirtualize && styles.listboxVirtualized,
		className,
	);

	const listboxBody = isEmpty ? (
		<li role='presentation'>
			<div className={styles.emptyState} aria-live='polite'>
				{noOptionsText}
			</div>
		</li>
	) : hasNamedGroups ? (
		renderGroupedOptions()
	) : (
		flatOptions.map((option, index) => renderOption(option, index))
	);

	const listboxAttrs = {
		id: listboxId,
		className: listClassName,
		...rest,
		role: 'listbox' as const,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		'aria-multiselectable': multiple || undefined,
		'aria-busy': loading || undefined,
		'aria-disabled': disabled || undefined,
		'aria-activedescendant': !isRoving && highlightedIndex >= 0
			? getListboxOptionDomId(listboxId, highlightedIndex)
			: undefined,
		tabIndex: -1,
		onKeyDown: composeEventHandlers(onKeyDown, handleListKeyDown),
	};

	if (shouldVirtualize) {
		return (
			<div
				{...(listboxAttrs as unknown as ComponentPropsWithoutRef<'div'>)}
				ref={scrollContainerRef}
			>
				{isEmpty ? (
					<div className={styles.emptyState} aria-live='polite'>
						{noOptionsText}
					</div>
				) : (
					<VirtualList
						scrollElement={scrollContainerRef}
						items={flatOptions}
						estimateSize={LISTBOX_OPTION_ESTIMATE}
						gap={4}
						getItemKey={(item) => item.value}
						className={styles.virtualList}
						renderItem={({item, index}) => renderOption(item, index, false)}
					/>
				)}
			</div>
		);
	}

	return (
		<ul
			{...listboxAttrs}
			ref={listRef}
		>
			{listboxBody}
		</ul>
	);
});

Listbox.displayName = 'Listbox';
