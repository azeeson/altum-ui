import React, {forwardRef, useCallback, useId, useRef} from 'react';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconChevronUp} from '../../icons/icons/IconChevronUp';
import {IconChevronDown} from '../../icons/icons/IconChevronDown';
import {IconDragHandle} from '../../icons/icons';
import {isKey} from '../../utils/keyboard';
import styles from './SortableList.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {getSiblingShiftY, useSortableListDnD} from './useSortableListDnD';
import type {SortableItem, SortableListProps} from './SortableList.types';

export type {SortableItem, SortableListVariant, SortableListProps} from './SortableList.types';

/**
 * Список с drag-and-drop перестановкой любых элементов (`id` + `renderItem` / `content`).
 *
 * @component
 * @example
 * <SortableList items={items} onOrderChange={setItems} />
 * <SortableList
 *   variant="plain"
 *   items={tasks}
 *   onOrderChange={setTasks}
 *   renderItem={(task) => <Item><Item.Title>{task.title}</Item.Title></Item>}
 * />
 */
const SortableListInner = forwardRef(function SortableList<
	T extends {id: string} = SortableItem,
>(
	{
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
		'aria-describedby': ariaDescribedBy,
		...rest
	}: SortableListProps<T>,
	ref: React.ForwardedRef<HTMLDivElement>,
) {
	const {t} = useLocale();
	const liveRegionId = useId();
	const listRef = useRef<HTMLDivElement | null>(null) as React.MutableRefObject<HTMLDivElement | null>;
	const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

	const {
		dragLayout,
		announce,
		handlePointerDown,
		moveItemByKeyboard,
	} = useSortableListDnD({
		items,
		onOrderChange,
		listRef,
		itemRefs,
		t,
	});

	const resolveContent = (item: T, index: number): React.ReactNode => {
		if (renderItem) return renderItem(item, index);
		if ('content' in item) return (item as SortableItem).content;
		return null;
	};

	const setItemRef = useCallback((id: string, element: HTMLDivElement | null) => {
		itemRefs.current[id] = element;
	}, []);

	const handleHandleKeyDown = (
		event: React.KeyboardEvent<HTMLElement>,
		index: number,
	) => {
		if (!keyboardReorder) return;
		if (!event.altKey) return;

		if (isKey(event, 'ArrowUp')) {
			event.preventDefault();
			moveItemByKeyboard(index, -1);
			return;
		}
		if (isKey(event, 'ArrowDown')) {
			event.preventDefault();
			moveItemByKeyboard(index, 1);
		}
	};

	const isDraggingPhase = dragLayout?.phase === 'drag';

	const wrapperClasses = cn(
		styles.listWrapper,
		handleOnly ? styles.handleOnly : '',
		variant === 'plain' ? styles.plain : '',
		className,
	);

	const setRefs = useCallback((node: HTMLDivElement | null) => {
		listRef.current = node;
		if (typeof ref === 'function') ref(node);
		else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
	}, [ref]);

	const describedBy = [ariaDescribedBy, keyboardReorder && items.length ? liveRegionId : undefined]
		.filter(Boolean)
		.join(' ') || undefined;

	if (!items?.length) {
		return (
			<div
				className={wrapperClasses}
				style={style}
				ref={setRefs}
				{...rest}
				role='list'
			/>
		);
	}

	return (
		<div
			ref={setRefs}
			className={wrapperClasses}
			style={style}
			{...rest}
			role='list'
			aria-describedby={describedBy}
		>
			{keyboardReorder && (
				<div
					id={liveRegionId}
					className={styles.srOnly}
					aria-live='polite'
				>
					{announce}
				</div>
			)}
			{items.map((item, index) => {
				const isDragging = dragLayout?.draggingId === item.id && isDraggingPhase;
				const isDropping = dragLayout?.draggingId === item.id && dragLayout.phase === 'drop';

				const itemClasses = cn(
					styles.listItem,
					isDragging ? styles.dragging : '',
					isDropping ? styles.dropping : '',
				);

				const itemStyle = mergeStyles(
					dragLayout && !isDragging && !isDropping
						? {transform: `translate3d(0, ${getSiblingShiftY(index, dragLayout)}px, 0)`}
						: undefined,
				);

				const canMoveUp = index > 0;
				const canMoveDown = index < items.length - 1;

				return (
					<div
						key={item.id}
						ref={(element) => setItemRef(item.id, element)}
						role='listitem'
						aria-grabbed={isDragging || isDropping}
						className={itemClasses}
						style={itemStyle}
						onPointerDown={handleOnly
							? undefined
							: (event) => handlePointerDown(event, item.id, index)}
					>
						{(showDragHandle || (showMoveButtons && keyboardReorder)) && (
							<div className={styles.controls}>
								{showDragHandle && (
									<button
										type='button'
										data-sortable-handle
										className={styles.dragHandle}
										aria-label={t('sortable.dragItem')}
										onPointerDown={(event) => handlePointerDown(
											event,
											item.id,
											index,
											{fromHandle: true},
										)}
										onKeyDown={(event) => handleHandleKeyDown(event, index)}
									>
										<IconDragHandle size={14} />
									</button>
								)}

								{showMoveButtons && keyboardReorder && (
									<div className={styles.moveButtons}>
										<ButtonIcon
											size='sm'
											variant='ghost'
											shape='square'
											className={styles.moveBtn}
											data-sortable-move='up'
											aria-label={t('sortable.moveUp')}
											disabled={!canMoveUp}
											icon={<IconChevronUp size={14} />}
											onClick={() => moveItemByKeyboard(index, -1)}
										/>
										<ButtonIcon
											size='sm'
											variant='ghost'
											shape='square'
											className={styles.moveBtn}
											data-sortable-move='down'
											aria-label={t('sortable.moveDown')}
											disabled={!canMoveDown}
											icon={<IconChevronDown size={14} />}
											onClick={() => moveItemByKeyboard(index, 1)}
										/>
									</div>
								)}
							</div>
						)}

						<div className={styles.content}>
							{resolveContent(item, index)}
						</div>
					</div>
				);
			})}
		</div>
	);
});

SortableListInner.displayName = 'SortableList';

export const SortableList = SortableListInner as <T extends {id: string} = SortableItem>(
	props: SortableListProps<T> & {ref?: React.Ref<HTMLDivElement>}
) => React.ReactElement;
