import type {ListboxOption} from '../../core/utils/listboxOptions';
import type {ListboxHandle, ListboxProps} from './Listbox.types';
export type {
	ListboxOption,
	ListboxGroup,
	ListboxEntry,
	ListboxSeparator,
	ListboxNavigation,
	ListboxProps,
	ListboxHandle,
} from './Listbox.types';

import {useLayoutEffect, useMemo, useRef, type KeyboardEvent, type MouseEvent, type ReactNode} from 'react';
import {getListboxOptionDomId} from '../../core/utils/listboxOptions';
import {useSelectionRoot} from '../../base/SelectionGroup';
import {
	buildListboxView,
	LISTBOX_HIGHLIGHTED_ATTR,
	LISTBOX_INDEX_ATTR,
	type ListboxSlot,
} from './Listbox.utils';
import {ListboxGroup} from './ListboxGroup';
import {ListboxRow} from './ListboxRow';
import {Separator} from '../Separator/Separator';
import {VirtualList, type VirtualListHandle} from '../VirtualList/VirtualList';
import {cn} from '../../core/utils/cn';
import {uRef} from '../../core/utils/bundle';
import {handleRovingFocusKeyDown} from '../../core/utils/keyboard';
import {useFallbackId} from '../../hooks/useFallbackId';
import {useLocale} from '../../locales/localeContext';
import scroll from '../../styles/scrollable.module.css';
import utilities from '../../styles/utilities.module.css';
import styles from './Listbox.module.css';
import {ruSlice as ru_listbox} from '../../locales/slices/listbox.ru';

const localeFallback = {
	listbox: ru_listbox,
};

const EMPTY_VALUES: string[] = [];

/** Авто-включение при `options.length > 100` (только плоский список без групп). */
const LISTBOX_VIRTUALIZE_THRESHOLD = 100;
const LISTBOX_OPTION_ESTIMATE = 40;
const LISTBOX_SEPARATOR_ESTIMATE = 1;
const ENABLED_OPTION = '[role="option"]:not([disabled]):not([hidden])';

function listboxSlotKey(item: ListboxSlot<ListboxOption>): string {
	return item.type === 'separator' ? item.key : item.option.value;
}

function optionIndexFromId(listboxId: string, id: string): number | undefined {
	const prefix = `${listboxId}-option-`;
	if (!id.startsWith(prefix)) return undefined;
	const index = Number(id.slice(prefix.length));
	return Number.isInteger(index) ? index : undefined;
}

/**
 * Список опций. Выбор (value/click) — примитивы `useSelectionRoot` / `data-selection-value`
 * из SelectionGroup; клавиатура, виртуализация и highlight остаются своими у Listbox
 * (не SelectionGroup DOM).
 *
 * В roving стрелки переносят фокус по пунктам, React на это не перерисовывается.
 * В highlight фокус остаётся снаружи, подсветку двигает `controlRef.scrollToId`.
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
export function Listbox<T extends ListboxOption = ListboxOption>({
	options,
	groups,
	value = EMPTY_VALUES,
	multiple = false,
	onSelect,
	customRenderOption,
	id: providedId,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
	noOptionsText: noOptionsTextProp,
	loading = false,
	className,
	showCheck = false,
	navigation = 'roving',
	activeDescendantId,
	disabled = false,
	multiline = false,
	virtualized,
	onKeyDown,
	onClick,
	rootRef,
	controlRef,
	...rest
}: ListboxProps<T>) {
	const {t} = useLocale(localeFallback);
	const noOptionsText = noOptionsTextProp ?? t('listbox.noOptions');
	const listboxId = useFallbackId(providedId);
	const localRootRef = useRef<HTMLDivElement>(null);
	const virtualRef = useRef<VirtualListHandle>(null);
	const isRoving = navigation === 'roving';

	const view = useMemo(
		() => buildListboxView(options, groups),
		[options, groups],
	);
	const selectedSet = useMemo(() => new Set(value), [value]);
	const count = view.options.length;
	const shouldVirtualize = !groups?.length && (
		virtualized ?? count > LISTBOX_VIRTUALIZE_THRESHOLD
	);

	const onSelectRef = useRef(onSelect);
	onSelectRef.current = onSelect;
	const viewRef = useRef(view);
	viewRef.current = view;
	const valueRef = useRef(value);
	valueRef.current = value;

	const selection = useSelectionRoot<string | readonly string[]>({
		type: multiple ? 'checkbox' : 'radio',
		value: multiple ? value : (value[0] ?? ''),
		onChange: (next) => {
			const current = valueRef.current;
			let clicked: string | undefined;
			if (multiple) {
				const nextArr = Array.isArray(next) ? [...next] : [];
				clicked = nextArr.find((entry) => !current.includes(entry))
					?? current.find((entry) => !nextArr.includes(entry));
			} else if (typeof next === 'string') {
				clicked = next;
			}
			if (!clicked) return;
			const option = viewRef.current.options.find((entry) => entry.value === clicked);
			if (option) onSelectRef.current?.(clicked, option as T);
		},
		disabled,
		activateOnFocus: false,
		orientation: 'vertical',
	});

	const slotsRef = useRef(view.slots);
	slotsRef.current = view.slots;
	const estimateSize = useRef((slotIndex: number) => (
		slotsRef.current[slotIndex]?.type === 'separator'
			? LISTBOX_SEPARATOR_ESTIMATE
			: LISTBOX_OPTION_ESTIMATE
	)).current;

	const scrollToId = (id: string) => {
		const root = localRootRef.current;
		if (!root) return;
		root.querySelectorAll<HTMLElement>(`[${LISTBOX_HIGHLIGHTED_ATTR}]`).forEach((node) => {
			node.removeAttribute(LISTBOX_HIGHLIGHTED_ATTR);
		});
		let node = document.getElementById(id);
		if (!(node instanceof HTMLElement) || !root.contains(node)) {
			const optionIndex = optionIndexFromId(listboxId, id);
			const slotIndex = optionIndex === undefined ? undefined : view.slotIndexByOption[optionIndex];
			if (slotIndex !== undefined) virtualRef.current?.scrollToIndex(slotIndex);
			node = document.getElementById(id);
		}
		if (!(node instanceof HTMLElement) || !root.contains(node)) return;
		node.setAttribute(LISTBOX_HIGHLIGHTED_ATTR, 'true');
		node.scrollIntoView({block: 'nearest'});
	};

	const control: ListboxHandle = {
		focusFirst() {
			const first = localRootRef.current?.querySelector<HTMLElement>(ENABLED_OPTION);
			if (!first) return;
			first.focus({preventScroll: true});
			first.scrollIntoView({block: 'nearest'});
		},
		selectHighlighted() {
			const active = document.activeElement;
			const root = localRootRef.current;
			if (!(active instanceof HTMLElement) || !root?.contains(active)) return;
			if (active.getAttribute('role') !== 'option') return;
			active.click();
		},
		scrollToId,
	};
	if (controlRef) controlRef.current = control;

	useLayoutEffect(() => {
		if (!activeDescendantId) return;
		scrollToId(activeDescendantId);
		// Прокрутка только при смене id: scrollToId замыкает текущий список.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeDescendantId]);

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		onKeyDown?.(event);
		if (!isRoving || disabled || count === 0 || event.defaultPrevented) return;
		const list = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(ENABLED_OPTION));
		if (list.length === 0) return;
		const active = document.activeElement;
		const index = active instanceof HTMLElement ? list.indexOf(active) : -1;

		if (event.key === 'Enter' || event.key === ' ') {
			if (active instanceof HTMLElement && list.includes(active)) {
				event.preventDefault();
				active.click();
			}
			return;
		}

		if (index < 0) {
			const edge = event.key === 'ArrowUp' || event.key === 'End' ? list.length - 1 : 0;
			if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') return;
			event.preventDefault();
			list[edge]?.focus({preventScroll: true});
			list[edge]?.scrollIntoView({block: 'nearest'});
			return;
		}

		handleRovingFocusKeyDown(event, {
			currentIndex: index,
			length: list.length,
			orientation: 'vertical',
			onMove: (nextIndex) => {
				const nextTarget = list[nextIndex];
				if (!nextTarget) return;
				nextTarget.focus({preventScroll: true});
				nextTarget.scrollIntoView({block: 'nearest'});
				if (!shouldVirtualize) return;
				const rawIdx = nextTarget.getAttribute(LISTBOX_INDEX_ATTR);
				if (rawIdx == null) return;
				const slotIdx = view.slotIndexByOption[Number(rawIdx)];
				if (slotIdx !== undefined) virtualRef.current?.scrollToIndex(slotIdx);
			},
		});
	};

	const handleClick = (event: MouseEvent<HTMLDivElement>) => {
		onClick?.(event);
		if (disabled || event.defaultPrevented) return;
		selection.onClick(event);
	};

	const slotNode = (slot: ListboxSlot<T>): ReactNode => {
		if (slot.type === 'separator') {
			return (
				<Separator
					key={slot.key}
					decorative
					data-separator=''
				/>
			);
		}
		const option = slot.option;
		const index = slot.index;
		return (
			<ListboxRow
				key={`${option.value}-${index}`}
				option={option}
				index={index}
				id={getListboxOptionDomId(listboxId, index)}
				selected={selectedSet.has(option.value)}
				disabled={disabled || !!option.disabled}
				showCheck={showCheck}
				multiline={multiline}
			>
				{customRenderOption ? customRenderOption(option) : option.label}
			</ListboxRow>
		);
	};

	return (
		<div
			{...rest}
			{...selection.dataProps}
			ref={uRef(localRootRef, rootRef)}
			id={listboxId}
			className={cn(
				utilities.fColumn,
				styles.listbox,
				shouldVirtualize && scroll.area,
				shouldVirtualize && styles.listboxVirtualized,
				className,
			)}
			role='listbox'
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledBy}
			aria-multiselectable={multiple || undefined}
			aria-busy={loading || undefined}
			aria-disabled={disabled || undefined}
			aria-activedescendant={activeDescendantId}
			tabIndex={isRoving && !disabled ? 0 : -1}
			onKeyDown={handleKeyDown}
			onClick={handleClick}
		>
			{view.slots.length === 0 ? (
				<div
					className={styles.emptyState}
					aria-live='polite'
				>
					{noOptionsText}
				</div>
			) : shouldVirtualize ? (
				<VirtualList
					controlRef={virtualRef}
					scrollElement={localRootRef}
					items={view.slots}
					estimateSize={estimateSize}
					gap={4}
					getItemKey={listboxSlotKey}
					renderItem={({item}) => slotNode(item)}
				/>
			) : view.groups ? (
				view.groups.map((group) => (
					<ListboxGroup
						key={group.id}
						id={group.id}
						label={group.label}
						listboxId={listboxId}
					>
						{group.slots.map(slotNode)}
					</ListboxGroup>
				))
			) : (
				view.slots.map(slotNode)
			)}
		</div>
	);
}
