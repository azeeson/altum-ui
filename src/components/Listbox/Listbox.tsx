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

import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
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
import {VirtualList, type VirtualListHandle} from '../VirtualList/VirtualList';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {useFallbackId} from '../../hooks/useFallbackId';
import {useLocale} from '../../locales/localeContext';
import unstyled from '../../styles/unstyledControl.module.css';
import styles from './Listbox.module.css';

/** Авто-включение при `options.length > 100` (только плоский список без групп). */
const LISTBOX_VIRTUALIZE_THRESHOLD = 100;
const LISTBOX_OPTION_ESTIMATE = 40;

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
		className,
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
	const listboxId = useFallbackId(providedId);
	const rootRef = useRef<HTMLDivElement>(null);
	const virtualRef = useRef<VirtualListHandle>(null);
	const hasNamedGroups = !!(groups && groups.length > 0);
	const resolvedGroups = useMemo(
		() => (hasNamedGroups ? resolveListboxGroups(options, groups) : null),
		[groups, hasNamedGroups, options],
	);
	const flatOptions = useMemo(() => (
		resolvedGroups ? flattenResolvedListboxGroups(resolvedGroups) : options
	), [options, resolvedGroups]);
	const [highlightedIndex, setHighlight] = useControlledStateWithCallback(
		controlledHighlight,
		defaultHighlightedIndex,
		onHighlightChange,
	);
	const isRoving = navigation === 'roving';

	const revealOption = useCallback((index: number, focus: boolean) => {
		if (index < 0) return;
		virtualRef.current?.scrollToIndex(index);
		requestAnimationFrame(() => {
			const node = document.getElementById(getListboxOptionDomId(listboxId, index));
			if (focus) {
				node?.focus({preventScroll: true});
				return;
			}
			node?.scrollIntoView({block: 'nearest'});
		});
	}, [listboxId]);

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
		revealOption(highlightedIndex, false);
	}, [flatOptions.length, highlightedIndex, revealOption]);

	const isOptionDisabled = useCallback((index: number) => (
		!!flatOptions[index]?.disabled
	), [flatOptions]);

	const moveHighlight = useCallback((direction: 1 | -1) => {
		const next = moveListboxHighlight(
			highlightedIndex,
			flatOptions.length,
			direction,
			{isDisabled: isOptionDisabled},
		);
		if (next < 0) return;
		setHighlight(next);
		revealOption(next, isRoving);
	}, [
		flatOptions.length,
		highlightedIndex,
		isOptionDisabled,
		isRoving,
		revealOption,
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
		revealOption(next, isRoving);
	}, [
		flatOptions.length,
		isOptionDisabled,
		isRoving,
		revealOption,
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
		focusOption: (index: number) => revealOption(index, true),
	}), [
		highlightEdge,
		highlightedIndex,
		isRoving,
		listboxId,
		moveHighlight,
		selectAt,
		revealOption,
	]);

	const selectedSet = new Set(value);
	const rovingTabStop = isRoving
		? (highlightedIndex >= 0
			? highlightedIndex
			: findEnabledListboxIndex(flatOptions.length, 'start', isOptionDisabled))
		: -1;

	const renderOption = (option: ListboxOption, index: number) => {
		const optionDisabled = disabled || !!option.disabled;
		const isSelected = selectedSet.has(option.value);
		const isHighlighted = index === highlightedIndex;
		const text = getListboxOptionText(option);

		return (
			<button
				{...option.buttonProps}
				key={`${option.value}-${index}`}
				id={getListboxOptionDomId(listboxId, index)}
				type='button'
				role='option'
				aria-selected={isSelected}
				aria-disabled={optionDisabled || undefined}
				aria-label={
					option.buttonProps?.['aria-label']
					?? (typeof option.label !== 'string' ? text : undefined)
				}
				tabIndex={isRoving && !optionDisabled && index === rovingTabStop ? 0 : -1}
				disabled={optionDisabled}
				className={cn(
					unstyled.control,
					styles.option,
					isSelected && styles.selected,
					isHighlighted && styles.highlighted,
					showCheck && styles.optionWithCheck,
					option.buttonProps?.className,
				)}
				onMouseDown={(event) => {
					if (preventOptionMouseDown) event.preventDefault();
				}}
				onMouseEnter={() => setHighlight(index)}
				onMouseLeave={(event) => {
					if (event.currentTarget.contains(document.activeElement)) return;
					setHighlight(-1);
				}}
				onFocus={() => setHighlight(index)}
				onClick={() => {
					if (!optionDisabled) onSelect?.(option.value);
				}}
			>
				{showCheck ? (
					<span className={styles.optionCheck} aria-hidden='true'>
						{isSelected ? <IconCheckmark size={14} /> : null}
					</span>
				) : null}
				<span className={cn(styles.label, multiline && styles.labelMultiline)}>
					{option.label}
				</span>
			</button>
		);
	};

	const renderGrouped = () => {
		if (!resolvedGroups) return null;
		let flatIndex = -1;
		return resolvedGroups.map((group) => {
			if (group.options.length === 0) return null;
			const groupLabelId = `${listboxId}-group-${group.id}`;
			const hasLabel = group.label != null;
			const ariaLabelFromString = typeof group.label === 'string' ? group.label : undefined;
			return (
				<div
					key={group.id}
					role='group'
					className={styles.group}
					aria-label={ariaLabelFromString}
					aria-labelledby={hasLabel && !ariaLabelFromString ? groupLabelId : undefined}
				>
					{hasLabel ? (
						<div id={groupLabelId} className={styles.groupLabel}>
							{group.label}
						</div>
					) : null}
					{group.options.map((option) => {
						flatIndex += 1;
						return renderOption(option, flatIndex);
					})}
				</div>
			);
		});
	};

	const isEmpty = flatOptions.length === 0;
	const shouldVirtualize = !hasNamedGroups && (
		virtualized ?? flatOptions.length > LISTBOX_VIRTUALIZE_THRESHOLD
	);

	return (
		<div
			{...rest}
			ref={rootRef}
			id={listboxId}
			className={cn(
				styles.listbox,
				hasNamedGroups && styles.listboxGrouped,
				shouldVirtualize && styles.listboxVirtualized,
				className,
			)}
			role='listbox'
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledBy}
			aria-multiselectable={multiple || undefined}
			aria-busy={loading || undefined}
			aria-disabled={disabled || undefined}
			aria-activedescendant={
				!isRoving && highlightedIndex >= 0
					? getListboxOptionDomId(listboxId, highlightedIndex)
					: undefined
			}
			tabIndex={-1}
			onKeyDown={composeEventHandlers(onKeyDown, (event) => {
				if (disabled || flatOptions.length === 0) return;
				handleListHighlightKeyDown(event, {
					onNext: () => moveHighlight(1),
					onPrev: () => moveHighlight(-1),
					onFirst: () => highlightEdge('start'),
					onLast: () => highlightEdge('end'),
					onSelect: highlightedIndex >= 0 ? () => selectAt(highlightedIndex) : undefined,
					includeSpace: true,
				});
			})}
		>
			{isEmpty ? (
				<div className={styles.emptyState} aria-live='polite'>
					{noOptionsText}
				</div>
			) : shouldVirtualize ? (
				<VirtualList
					ref={virtualRef}
					scrollElement={rootRef}
					items={flatOptions}
					estimateSize={LISTBOX_OPTION_ESTIMATE}
					gap={4}
					getItemKey={(item) => item.value}
					className={styles.virtualList}
					renderItem={({item, index}) => renderOption(item, index)}
				/>
			) : hasNamedGroups ? (
				renderGrouped()
			) : (
				flatOptions.map((option, index) => renderOption(option, index))
			)}
		</div>
	);
});

Listbox.displayName = 'Listbox';
