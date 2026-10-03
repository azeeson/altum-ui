import type {RefCallback} from 'react';
import {anchorNameFor as popoverAnchorName} from './popover';
import {pointerDelta} from './math';

/**
 * Безопасный `setPointerCapture` с защитой от ошибок на старых браузерах.
 */
export function setPointerCapture(target: Element, pointerId: number): void {
	try {
		target.setPointerCapture(pointerId);
	} catch {
		/* iOS Safari / старые движки могут бросить InvalidStateError */
	}
}

/**
 * Безопасный `releasePointerCapture`.
 */
export function releasePointerCapture(target: Element, pointerId: number): void {
	try {
		if (target.hasPointerCapture?.(pointerId)) {
			target.releasePointerCapture(pointerId);
		}
	} catch {
		/* no-op */
	}
}

/**
 * Есть ли захват указателя на узле.
 */
export function hasPointerCapture(target: Element, pointerId: number): boolean {
	try {
		return Boolean(target.hasPointerCapture?.(pointerId));
	} catch {
		return false;
	}
}

/** CSS Anchor Ident для `position-anchor`. */
export const anchorNameFor = popoverAnchorName;

/**
 * Якорь панели — рамка `TextField` (`data-field-chrome`), не input внутри слота.
 */
export function bindFieldChromeRef(
	ref: RefCallback<HTMLElement>,
): RefCallback<HTMLElement> {
	return (node) => {
		if (!node) {
			ref(null);
			return;
		}
		const chrome = node.closest('[data-field-chrome]');
		ref(chrome instanceof HTMLElement ? chrome : node);
	};
}

/**
 * Пишет `translate3d` в inline-style (жест без React-рендера).
 */
export function setTranslate3d(el: HTMLElement, x: number, y = 0): void {
	el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

export type PointerDragMoveContext = {
	dx: number;
	dy: number;
	startX: number;
	startY: number;
	event: PointerEvent;
};

export type BeginPointerDragOptions = {
	target: Element;
	pointerId: number;
	startX: number;
	startY: number;
	onMove: (ctx: PointerDragMoveContext) => void;
	onEnd?: (event: PointerEvent) => void;
};

/**
 * Сессия Pointer Capture: move / up / cancel / lostpointercapture.
 * Возвращает dispose (снять слушатели и capture).
 */
export function beginPointerDrag({
	target,
	pointerId,
	startX,
	startY,
	onMove,
	onEnd,
}: BeginPointerDragOptions): () => void {
	setPointerCapture(target, pointerId);

	const onPointerMove = (event: PointerEvent) => {
		if (event.pointerId !== pointerId) return;
		onMove({
			dx: pointerDelta(event.clientX, startX),
			dy: pointerDelta(event.clientY, startY),
			startX,
			startY,
			event,
		});
	};

	let disposed = false;
	const dispose = () => {
		if (disposed) return;
		disposed = true;
		target.removeEventListener('pointermove', onPointerMove as EventListener);
		target.removeEventListener('pointerup', end as EventListener);
		target.removeEventListener('pointercancel', end as EventListener);
		target.removeEventListener('lostpointercapture', end as EventListener);
		releasePointerCapture(target, pointerId);
	};

	const end = (event: PointerEvent) => {
		if (event.pointerId !== pointerId) return;
		dispose();
		onEnd?.(event);
	};

	target.addEventListener('pointermove', onPointerMove as EventListener);
	target.addEventListener('pointerup', end as EventListener);
	target.addEventListener('pointercancel', end as EventListener);
	target.addEventListener('lostpointercapture', end as EventListener);

	return dispose;
}

/**
 * Дельты указателя относительно старта жеста (для инлайн-обработчиков вне сессии).
 */
export function handlePointerMove(
	event: PointerEvent,
	startX: number,
	startY: number,
): {
	dx: number;
	dy: number;
} {
	return {
		dx: pointerDelta(event.clientX, startX),
		dy: pointerDelta(event.clientY, startY),
	};
}

type ReorderSession = {
	pointerId: number;
	done: boolean;
	from: number;
	hover: number;
	startY: number;
	step: number;
	list: HTMLElement;
	row: HTMLElement;
	nodes: HTMLElement[];
	onCommit: (from: number, hover: number) => void;
	onEnd?: () => void;
	onMove: (event: PointerEvent) => void;
	onUp: (event: PointerEvent) => void;
	onLost: (event: PointerEvent) => void;
};

let reorderSession: ReorderSession | null = null;

function listGap(list: HTMLElement) {
	const gap = parseFloat(getComputedStyle(list).gap);
	return Number.isFinite(gap) ? gap : 8;
}

/**
 * Индекс слота по layout-боксу строки (без transform в mid).
 */
function resolveHoverIndex(
	nodes: readonly HTMLElement[],
	listTop: number,
	from: number,
	clientY: number,
) {
	let hover = from;
	for (let index = 0; index < nodes.length; index++) {
		if (index === from) continue;
		const node = nodes[index];
		if (!node) continue;
		const mid = listTop + node.offsetTop + node.offsetHeight / 2;
		if (index < from && clientY < mid) hover = Math.min(hover, index);
		else if (index > from && clientY > mid) hover = Math.max(hover, index);
	}
	return hover;
}

function shiftNeighbors(
	nodes: readonly HTMLElement[],
	from: number,
	hover: number,
	step: number,
) {
	for (let index = 0; index < nodes.length; index++) {
		if (index === from) continue;
		const node = nodes[index];
		if (!node) continue;
		if (index >= hover && index < from) {
			setTranslate3d(node, 0, step);
		} else if (index <= hover && index > from) {
			setTranslate3d(node, 0, -step);
		} else {
			node.style.transform = '';
		}
	}
}

function placeRows(list: HTMLElement, nodes: readonly HTMLElement[], from: number, hover: number) {
	if (from === hover) return;
	const next = nodes.slice();
	const [moved] = next.splice(from, 1);
	if (!moved) return;
	next.splice(hover, 0, moved);
	for (const node of next) list.appendChild(node);
}

function clearReorderVisual(current: ReorderSession) {
	current.list.removeAttribute('data-layout-active');
	current.row.removeAttribute('data-dragging');
	current.row.removeAttribute('aria-grabbed');
	for (const node of current.nodes) node.style.transform = '';
}

function detachReorder(current: ReorderSession) {
	current.list.removeEventListener('pointermove', current.onMove);
	current.list.removeEventListener('pointerup', current.onUp);
	current.list.removeEventListener('lostpointercapture', current.onLost);
	releasePointerCapture(current.list, current.pointerId);
}

function finishReorder(event: PointerEvent) {
	const current = reorderSession;
	if (!current || event.pointerId !== current.pointerId || current.done) return;
	current.done = true;
	if (event.type === 'pointerup') {
		const listTop = current.list.getBoundingClientRect().top;
		current.hover = resolveHoverIndex(current.nodes, listTop, current.from, event.clientY);
	}
	const {from, hover, list, nodes, onCommit, onEnd} = current;
	detachReorder(current);
	clearReorderVisual(current);
	placeRows(list, nodes, from, hover);
	reorderSession = null;
	if (from !== hover) onCommit(from, hover);
	onEnd?.();
}

export function isReorderDragActive() {
	return reorderSession !== null;
}

/** Сбрасывает жест перестановки без смены порядка. */
export function cancelReorderDrag(list?: HTMLElement | null) {
	const current = reorderSession;
	if (!current || current.done) return;
	if (list && current.list !== list) return;
	current.done = true;
	detachReorder(current);
	clearReorderVisual(current);
	const onEnd = current.onEnd;
	reorderSession = null;
	onEnd?.();
}

export type BeginSortableDragOptions = {
	list: HTMLElement;
	from: number;
	pointerId: number;
	clientY: number;
	/** CSS-селектор строк внутри списка. @default `:scope [data-sortable-index]` */
	rowSelector?: string;
	onCommit: (from: number, hover: number) => void;
	onEnd?: () => void;
};

/**
 * Жест перестановки на корне списка.
 * Сдвиг пишется в `transform`, React не рендерит строки до отпускания.
 */
export function beginSortableDrag({
	list,
	from,
	pointerId,
	clientY,
	rowSelector = ':scope [data-sortable-index]',
	onCommit,
	onEnd,
}: BeginSortableDragOptions) {
	if (reorderSession) return;
	const nodes = Array.from(list.querySelectorAll<HTMLElement>(rowSelector));
	const row = nodes[from];
	if (!row) return;

	setPointerCapture(list, pointerId);
	if (!hasPointerCapture(list, pointerId)) return;

	const current: ReorderSession = {
		pointerId,
		done: false,
		from,
		hover: from,
		startY: clientY,
		step: row.offsetHeight + listGap(list),
		list,
		row,
		nodes,
		onCommit,
		onEnd,
		onMove: (event) => {
			const active = reorderSession;
			if (!active || event.pointerId !== active.pointerId || active.done) return;
			const dy = pointerDelta(event.clientY, active.startY);
			setTranslate3d(active.row, 0, dy);
			const listTop = active.list.getBoundingClientRect().top;
			const hover = resolveHoverIndex(active.nodes, listTop, active.from, event.clientY);
			if (hover === active.hover) return;
			active.hover = hover;
			shiftNeighbors(active.nodes, active.from, hover, active.step);
		},
		onUp: finishReorder,
		onLost: finishReorder,
	};

	reorderSession = current;
	list.setAttribute('data-layout-active', '');
	row.setAttribute('data-dragging', '');
	row.setAttribute('aria-grabbed', 'true');
	list.addEventListener('pointermove', current.onMove);
	list.addEventListener('pointerup', current.onUp);
	list.addEventListener('lostpointercapture', current.onLost);
}
