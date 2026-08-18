import {useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent} from 'react';
import {moveArrayItem} from '../../utils/arrayMove';
import styles from './SortableList.module.css';
import type {DragLayout, DragSession} from './SortableList.types';
import {DROP_FALLBACK_MS} from './SortableList.types';

interface UseSortableListDnDOptions<T extends {id: string}> {
	items: T[];
	onOrderChange: (newItems: T[]) => void;
	listRef: React.MutableRefObject<HTMLDivElement | null>;
	itemRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
	t: (key: string, params?: Record<string, string | number>) => string;
}

export function useSortableListDnD<T extends {id: string}>({
	items,
	onOrderChange,
	listRef,
	itemRefs,
	t,
}: UseSortableListDnDOptions<T>) {
	const [dragLayout, setDragLayout] = useState<DragLayout | null>(null);
	const [announce, setAnnounce] = useState('');

	const sessionRef = useRef<DragSession | null>(null);
	const onOrderChangeRef = useRef(onOrderChange);
	const itemsRef = useRef(items);

	useEffect(() => {
		onOrderChangeRef.current = onOrderChange;
		itemsRef.current = items;
	});

	const getListGap = useCallback(() => {
		if (!listRef.current) return 8;
		const gap = parseFloat(getComputedStyle(listRef.current).gap);
		return Number.isFinite(gap) ? gap : 8;
	}, [listRef]);

	const getLayoutMiddleY = useCallback((itemId: string) => {
		const listEl = listRef.current;
		const itemEl = itemRefs.current[itemId];
		if (!listEl || !itemEl) return null;

		const listTop = listEl.getBoundingClientRect().top;
		return listTop + itemEl.offsetTop + itemEl.offsetHeight / 2;
	}, [itemRefs, listRef]);

	const clearDragLayout = useCallback(() => {
		listRef.current?.classList.remove(styles.layoutActive);
		setDragLayout(null);
	}, [listRef]);

	const removePointerListeners = useCallback((session: DragSession) => {
		session.captureTarget.removeEventListener('pointermove', session.onPointerMove);
		session.captureTarget.removeEventListener('pointerup', session.onPointerUp);
		session.captureTarget.removeEventListener('lostpointercapture', session.onLostPointerCapture);

		if (session.captureTarget.hasPointerCapture(session.pointerId)) {
			try {
				session.captureTarget.releasePointerCapture(session.pointerId);
			} catch {
				// Указатель уже мог быть отпущен.
			}
		}
	}, []);

	const clearDropAnimation = useCallback((session: DragSession) => {
		if (session.dropFallbackTimer !== null) {
			window.clearTimeout(session.dropFallbackTimer);
			session.dropFallbackTimer = null;
		}
		session.element.removeEventListener('transitionend', session.onTransitionEnd);
	}, []);

	const commitDrop = useCallback((session: DragSession) => {
		if (session.dropCommitted) return;
		session.dropCommitted = true;

		clearDropAnimation(session);

		const updatedItems = moveArrayItem(
			session.items,
			session.fromIndex,
			session.hoverIndex,
		);
		session.element.style.transform = '';
		if (updatedItems) {
			onOrderChangeRef.current(updatedItems as T[]);
		}

		clearDragLayout();
		if (sessionRef.current === session) {
			sessionRef.current = null;
		}
	}, [clearDragLayout, clearDropAnimation]);

	const cancelSession = useCallback((session: DragSession | null) => {
		if (!session) return;

		removePointerListeners(session);
		clearDropAnimation(session);
		session.element.style.transform = '';
		clearDragLayout();

		if (sessionRef.current === session) {
			sessionRef.current = null;
		}
	}, [clearDragLayout, clearDropAnimation, removePointerListeners]);

	useEffect(() => () => cancelSession(sessionRef.current), [cancelSession]);

	const moveItemByKeyboard = useCallback((fromIndex: number, direction: -1 | 1) => {
		if (sessionRef.current) return;

		const toIndex = fromIndex + direction;
		const updated = moveArrayItem(itemsRef.current, fromIndex, toIndex);
		if (!updated) return;

		onOrderChangeRef.current(updated as T[]);
		const moved = updated[toIndex] as T | undefined;
		setAnnounce(t('sortable.moved', {
			position: toIndex + 1,
			total: updated.length,
		}));

		requestAnimationFrame(() => {
			const row = itemRefs.current[moved?.id ?? ''];
			if (!row) return;
			const handle = row.querySelector<HTMLElement>('[data-sortable-handle]');
			if (handle) {
				handle.focus();
				return;
			}
			const moveSelector = direction < 0
				? '[data-sortable-move="up"]'
				: '[data-sortable-move="down"]';
			const moveBtn = row.querySelector<HTMLElement>(moveSelector);
			moveBtn?.focus();
		});
	}, [itemRefs, t]);

	const getDropOffset = useCallback((session: DragSession) => {
		const gap = getListGap();
		let targetOffset = 0;

		if (session.hoverIndex < session.fromIndex) {
			for (let i = session.hoverIndex; i < session.fromIndex; i++) {
				const element = itemRefs.current[session.items[i]!.id];
				if (element) targetOffset -= element.offsetHeight + gap;
			}
		} else {
			for (let i = session.fromIndex + 1; i <= session.hoverIndex; i++) {
				const element = itemRefs.current[session.items[i]!.id];
				if (element) targetOffset += element.offsetHeight + gap;
			}
		}

		return targetOffset;
	}, [getListGap, itemRefs]);

	const startDropAnimation = useCallback((session: DragSession) => {
		session.isDropping = true;
		removePointerListeners(session);
		session.dropCommitted = false;

		setDragLayout((current) => (
			current && current.draggingId === session.id
				? {
					...current,
					phase: 'drop'
				}
				: current
		));

		session.onTransitionEnd = (event: TransitionEvent) => {
			if (event.propertyName !== 'transform' || event.target !== session.element) return;
			commitDrop(session);
		};

		session.element.addEventListener('transitionend', session.onTransitionEnd);

		session.dropFallbackTimer = window.setTimeout(() => {
			if (sessionRef.current === session && !session.dropCommitted) {
				commitDrop(session);
			}
		}, DROP_FALLBACK_MS);

		const targetOffset = getDropOffset(session);
		session.element.style.transform = `translate3d(0, ${targetOffset}px, 0)`;
	}, [commitDrop, getDropOffset, removePointerListeners]);

	const handlePointerDown = useCallback((
		event: ReactPointerEvent<HTMLElement>,
		id: string,
		index: number,
		options?: {fromHandle?: boolean},
	) => {
		if (event.button !== 0 || sessionRef.current) return;

		if (!options?.fromHandle) {
			const target = event.target as HTMLElement | null;
			if (target?.closest('button:not([data-sortable-handle]), a, input, textarea, select, [data-no-drag]')) {
				return;
			}
		}

		const draggingElement = itemRefs.current[id];
		if (!draggingElement) return;

		event.preventDefault();
		event.stopPropagation();

		const captureTarget = event.currentTarget;

		if (captureTarget.setPointerCapture) {
			captureTarget.setPointerCapture(event.pointerId);
		}

		const shiftHeight = draggingElement.offsetHeight + getListGap();

		const layout: DragLayout = {
			draggingId: id,
			fromIndex: index,
			hoverIndex: index,
			shiftHeight,
			phase: 'drag',
		};

		listRef.current?.classList.add(styles.layoutActive);
		setDragLayout(layout);

		const session: DragSession = {
			id,
			fromIndex: index,
			hoverIndex: index,
			items: itemsRef.current,
			pointerId: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			element: draggingElement,
			captureTarget,
			isDropping: false,
			dropCommitted: false,
			onPointerMove: () => undefined,
			onPointerUp: () => undefined,
			onLostPointerCapture: () => undefined,
			onTransitionEnd: () => undefined,
			dropFallbackTimer: null,
		};

		const syncDragFromPointer = (clientX: number, clientY: number) => {
			const dx = clientX - session.startX;
			const dy = clientY - session.startY;
			session.element.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;

			let nextHoverIndex = session.fromIndex;

			for (let i = 0; i < session.items.length; i++) {
				if (i === session.fromIndex) continue;

				const middleY = getLayoutMiddleY(session.items[i]!.id);
				if (middleY === null) continue;

				if (i < session.fromIndex && clientY < middleY) {
					nextHoverIndex = Math.min(nextHoverIndex, i);
				} else if (i > session.fromIndex && clientY > middleY) {
					nextHoverIndex = Math.max(nextHoverIndex, i);
				}
			}

			if (nextHoverIndex !== session.hoverIndex) {
				session.hoverIndex = nextHoverIndex;
				setDragLayout((current) => (
					current && current.draggingId === session.id
						? {
							...current,
							hoverIndex: nextHoverIndex
						}
						: current
				));
			}
		};

		const finishPointerDrag = () => {
			if (
				sessionRef.current !== session
				|| session.isDropping
				|| session.dropCommitted
			) {
				return;
			}

			if (session.fromIndex === session.hoverIndex) {
				cancelSession(session);
				return;
			}

			startDropAnimation(session);
		};

		session.onPointerMove = (moveEvent: PointerEvent) => {
			if (moveEvent.pointerId !== session.pointerId || sessionRef.current !== session) return;
			syncDragFromPointer(moveEvent.clientX, moveEvent.clientY);
		};

		session.onPointerUp = (upEvent: PointerEvent) => {
			if (upEvent.pointerId !== session.pointerId || sessionRef.current !== session) return;
			syncDragFromPointer(upEvent.clientX, upEvent.clientY);
			finishPointerDrag();
		};

		session.onLostPointerCapture = (captureEvent: PointerEvent) => {
			if (
				captureEvent.pointerId !== session.pointerId
				|| sessionRef.current !== session
				|| session.isDropping
				|| session.dropCommitted
			) {
				return;
			}
			syncDragFromPointer(captureEvent.clientX, captureEvent.clientY);
			finishPointerDrag();
		};

		captureTarget.addEventListener('pointermove', session.onPointerMove);
		captureTarget.addEventListener('pointerup', session.onPointerUp);
		captureTarget.addEventListener('lostpointercapture', session.onLostPointerCapture);

		sessionRef.current = session;
	}, [
		cancelSession,
		getLayoutMiddleY,
		getListGap,
		itemRefs,
		listRef,
		startDropAnimation
	]);

	return {
		dragLayout,
		announce,
		handlePointerDown,
		moveItemByKeyboard,
	};
}

export function getSiblingShiftY(index: number, layout: DragLayout): number {
	if (index === layout.fromIndex) return 0;

	const {shiftHeight, hoverIndex, fromIndex} = layout;

	if (index >= hoverIndex && index < fromIndex) {
		return shiftHeight;
	}

	if (index <= hoverIndex && index > fromIndex) {
		return -shiftHeight;
	}

	return 0;
}
