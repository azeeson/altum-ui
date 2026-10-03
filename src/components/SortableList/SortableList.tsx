import type {SortableItem, SortableListProps} from './SortableList.types';
export type {SortableItem, SortableListVariant, SortableListProps} from './SortableList.types';

import {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type CSSProperties,
	type KeyboardEvent,
	type MouseEvent,
	type PointerEvent,
	type ReactNode,
} from 'react';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {LiveRegion} from '../LiveRegion/LiveRegion';
import {VirtualList} from '../VirtualList/VirtualList';
import {IconChevronUp} from '../../icons/icons/IconChevronUp';
import {IconChevronDown} from '../../icons/icons/IconChevronDown';
import {IconDragHandle} from '../../icons/icons/IconDragHandle';
import {isKey} from '../../core/utils/keyboard';
import {moveArrayItem} from '../../core/utils/arrayMove';
import {cn} from '../../core/utils/cn';
import {uRef} from '../../core/utils/bundle';
import {useFallbackId} from '../../hooks/useFallbackId';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_sortable} from '../../locales/slices/sortable.ru';
import styles from './SortableList.module.css';
import {
	beginSortableDrag,
	cancelSortableDrag,
	DRAG_IGNORE,
	isSortableDragActive,
	SORTABLE_HANDLE,
	SORTABLE_ID,
	SORTABLE_INDEX,
	SORTABLE_MOVE,
} from './SortableList.drag';

const localeFallback = {
	sortable: ru_sortable,
};

const DEFAULT_VIRTUAL_THRESHOLD = 40;
const DEFAULT_ESTIMATE_SIZE = 56;
const DEFAULT_VIRTUAL_HEIGHT = 360;
/** Совпадает с `gap` в SortableList.module.css (`--altum-g-space-2`). */
const LIST_GAP_PX = 8;

type PendingDrag = {
	from: number;
	pointerId: number;
	clientY: number;
};

/**
 * Список с drag-and-drop перестановкой любых элементов (`id` + `renderItem` / `content`).
 * Сдвиг указателя пишется в DOM и не перерисовывает список.
 * Длинные списки — `VirtualList`; на время drag виртуализация отключается (полный DOM).
 *
 * @component
 * @example
 * <SortableList items={items} onOrderChange={setItems} rootRef={listRef} />
 * <SortableList
 *   variant="plain"
 *   items={tasks}
 *   onOrderChange={setTasks}
 *   renderItem={(task) => <Item title={task.title} />}
 * />
 */
export function SortableList<T extends {id: string} = SortableItem>({
	items = [],
	onOrderChange,
	renderItem,
	variant = 'default',
	className,
	style,
	keyboardReorder = true,
	showMoveButtons = false,
	showDragHandle = true,
	handleOnly = true,
	estimateSize = DEFAULT_ESTIMATE_SIZE,
	virtualThreshold = DEFAULT_VIRTUAL_THRESHOLD,
	height = DEFAULT_VIRTUAL_HEIGHT,
	rootRef,
	onPointerDown,
	onKeyDown,
	onClick,
	'aria-describedby': ariaDescribedBy,
	...rest
}: SortableListProps<T>) {
	const {t} = useLocale(localeFallback);
	const liveRegionId = useFallbackId();
	const [announce, setAnnounce] = useState('');
	const [dragActive, setDragActive] = useState(false);
	const listRef = useRef<HTMLDivElement | null>(null);
	const pendingDragRef = useRef<PendingDrag | null>(null);
	const itemsRef = useRef(items);
	const onOrderRef = useRef(onOrderChange);
	itemsRef.current = items;
	onOrderRef.current = onOrderChange;

	const longList = items.length > virtualThreshold;
	const useVirtual = longList && !dragActive;

	const moveItem = (from: number, dir: -1 | 1) => {
		if (isSortableDragActive()) return;
		const next = moveArrayItem(itemsRef.current, from, from + dir);
		if (!next) return;

		onOrderRef.current(next);
		const movedId = next[from + dir]?.id;
		setAnnounce(t('sortable.moved', {
			position: from + dir + 1,
			total: next.length,
		}));
		requestAnimationFrame(() => {
			const list = listRef.current;
			if (!list || movedId == null) return;
			const row = list.querySelector<HTMLElement>(
				`:scope [${SORTABLE_ID}="${CSS.escape(movedId)}"]`,
			);
			if (!row) return;
			const handle = row.querySelector<HTMLElement>(`[${SORTABLE_HANDLE}]`);
			if (handle) {
				handle.focus();
				return;
			}
			row.querySelector<HTMLElement>(
				`[${SORTABLE_MOVE}="${dir < 0 ? 'up' : 'down'}"]`,
			)?.focus();
		});
	};

	const startDrag = (from: number, pointerId: number, clientY: number) => {
		const list = listRef.current;
		if (!list) return;
		beginSortableDrag({
			list,
			from,
			pointerId,
			clientY,
			onCommit: (start, hover) => {
				const next = moveArrayItem(itemsRef.current, start, hover);
				if (next) onOrderRef.current(next);
			},
			onEnd: () => setDragActive(false),
		});
	};

	// Cancel only on unmount. Inline `uRef(...)` is a new callback every render —
	// React calls the previous one with `null`, which must not abort an active drag.
	useEffect(() => () => {
		cancelSortableDrag(listRef.current);
	}, []);

	useLayoutEffect(() => {
		const pending = pendingDragRef.current;
		if (!dragActive || !pending || useVirtual) return;
		pendingDragRef.current = null;
		startDrag(pending.from, pending.pointerId, pending.clientY);
	}, [dragActive, useVirtual]);

	const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
		onPointerDown?.(event);
		if (event.defaultPrevented || event.button !== 0 || isSortableDragActive()) return;

		const target = event.target as HTMLElement | null;
		const list = listRef.current;
		if (!target || !list) return;

		const handle = target.closest<HTMLElement>(`[${SORTABLE_HANDLE}]`);
		const row = (handle ?? target).closest<HTMLElement>(`[${SORTABLE_INDEX}]`);
		if (!row || !list.contains(row)) return;
		if (handleOnly && !handle) return;
		if (!handle && target.closest(DRAG_IGNORE)) return;

		const from = Number(row.getAttribute(SORTABLE_INDEX));
		if (!Number.isInteger(from)) return;

		event.preventDefault();
		if (useVirtual) {
			pendingDragRef.current = {
				from,
				pointerId: event.pointerId,
				clientY: event.clientY,
			};
			setDragActive(true);
			return;
		}

		startDrag(from, event.pointerId, event.clientY);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		onKeyDown?.(event);
		if (event.defaultPrevented || !keyboardReorder || !event.altKey) return;

		const handle = (event.target as HTMLElement).closest<HTMLElement>(`[${SORTABLE_HANDLE}]`);
		const row = handle?.closest<HTMLElement>(`[${SORTABLE_INDEX}]`);
		if (!handle || !row || !listRef.current?.contains(row)) return;

		const index = Number(row.getAttribute(SORTABLE_INDEX));
		if (!Number.isInteger(index)) return;
		if (isKey(event, 'ArrowUp')) {
			event.preventDefault();
			moveItem(index, -1);
			return;
		}
		if (isKey(event, 'ArrowDown')) {
			event.preventDefault();
			moveItem(index, 1);
		}
	};

	const handleClick = (event: MouseEvent<HTMLDivElement>) => {
		onClick?.(event);
		if (event.defaultPrevented || !keyboardReorder || !showMoveButtons) return;

		const button = (event.target as HTMLElement).closest<HTMLElement>(`[${SORTABLE_MOVE}]`);
		const row = button?.closest<HTMLElement>(`[${SORTABLE_INDEX}]`);
		if (!button || !row || button.hasAttribute('disabled') || !listRef.current?.contains(row)) return;

		const index = Number(row.getAttribute(SORTABLE_INDEX));
		if (!Number.isInteger(index)) return;
		moveItem(index, button.getAttribute(SORTABLE_MOVE) === 'up' ? -1 : 1);
	};

	const describedBy = [ariaDescribedBy, keyboardReorder && announce ? liveRegionId : undefined]
		.filter(Boolean)
		.join(' ') || undefined;
	const showControls = showDragHandle || (showMoveButtons && keyboardReorder);

	const renderRow = (item: T, index: number): ReactNode => (
		<div
			key={item.id}
			role='listitem'
			className={styles.listItem}
			data-sortable-index={index}
			data-sortable-id={item.id}
		>
			{showControls && (
				<div className={styles.controls}>
					{showDragHandle && (
						<ButtonIcon
							size='sm'
							variant='ghost'
							data-sortable-handle=''
							className={styles.handle}
							aria-label={t('sortable.dragItem')}
							icon={<IconDragHandle size={14} />}
						/>
					)}
					{showMoveButtons && keyboardReorder && (
						<div className={styles.moveButtons}>
							{([-1, 1] as const).map((dir) => (
								<ButtonIcon
									key={dir}
									size='sm'
									variant='ghost'
									className={styles.moveBtn}
									data-sortable-move={dir < 0 ? 'up' : 'down'}
									aria-label={t(dir < 0 ? 'sortable.moveUp' : 'sortable.moveDown')}
									disabled={dir < 0 ? index === 0 : index === items.length - 1}
									icon={dir < 0
										? <IconChevronUp size={14} />
										: <IconChevronDown size={14} />}
								/>
							))}
						</div>
					)}
				</div>
			)}
			<div className={styles.content}>
				{renderItem
					? renderItem(item, index)
					: 'content' in item
						? (item as SortableItem).content
						: null}
			</div>
		</div>
	);

	const rootStyle: CSSProperties = {
		...style,
		...(longList
			? {
				height,
				overflow: 'auto',
			}
			: undefined),
	};

	return (
		<div
			ref={uRef(listRef, rootRef)}
			className={cn(styles.listWrapper, className)}
			style={rootStyle}
			{...rest}
			role='list'
			data-variant={variant}
			data-handle-only={handleOnly ? '' : undefined}
			aria-describedby={describedBy}
			onPointerDown={handlePointerDown}
			onKeyDown={handleKeyDown}
			onClick={handleClick}
		>
			{keyboardReorder ? (
				<LiveRegion
					id={liveRegionId}
					message={announce}
				/>
			) : null}
			{useVirtual ? (
				<VirtualList
					items={items}
					estimateSize={estimateSize}
					gap={LIST_GAP_PX}
					scrollElement={listRef}
					getItemKey={(item) => item.id}
					itemWrapper={false}
					renderItem={({item, index}) => renderRow(item, index)}
				/>
			) : (
				items.map((item, index) => renderRow(item, index))
			)}
		</div>
	);
}
