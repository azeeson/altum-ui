import type {AnchorAlign, AnchorSide} from '../types/position';

export type {AnchorAlign, AnchorSide};

export type AnchorPositionStyle = {
	position: 'fixed';
	top: number;
	left: number;
};

export type AnchorPositionResult = AnchorPositionStyle & {
	/** Фактически выбранная сторона после flip по доступному месту. */
	side: AnchorSide;
	/** Фактически выбранное выравнивание после flip по доступному месту. */
	align: AnchorAlign;
};

const OPPOSITE_SIDE: Record<AnchorSide, AnchorSide> = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left',
};

const OPPOSITE_ALIGN: Record<Exclude<AnchorAlign, 'center'>, Exclude<AnchorAlign, 'center'>> = {
	start: 'end',
	end: 'start',
};

/**
 * Свободное место по сторонам trigger (viewport), с учётом gap и отступа от края.
 */
export function getAnchorSideSpace(
	trigger: DOMRect,
	gap = 8,
	edgePadding = 8,
): Record<AnchorSide, number> {
	const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
	const vh = typeof window !== 'undefined' ? window.innerHeight : 0;

	return {
		top: trigger.top - gap - edgePadding,
		bottom: vh - trigger.bottom - gap - edgePadding,
		left: trigger.left - gap - edgePadding,
		right: vw - trigger.right - gap - edgePadding,
	};
}

/**
 * Выбирает сторону относительно trigger: `preferred` — приоритет;
 * если места не хватает — противоположная; если ни одна не вмещает —
 * сторона с большим запасом (как в Dropdown).
 *
 * @param preferred - Желаемая сторона.
 * @param trigger - Bounding box якоря (viewport).
 * @param contentWidth - Ширина плавающего слоя.
 * @param contentHeight - Высота плавающего слоя.
 * @param gap - Зазор между trigger и слоем.
 * @param edgePadding - Минимальный отступ от края viewport при оценке места.
 */
export function resolvePreferredSide(
	preferred: AnchorSide,
	trigger: DOMRect,
	contentWidth: number,
	contentHeight: number,
	gap = 8,
	edgePadding = 8,
): AnchorSide {
	const space = getAnchorSideSpace(trigger, gap, edgePadding);
	const needed = preferred === 'top' || preferred === 'bottom'
		? contentHeight
		: contentWidth;
	const opposite = OPPOSITE_SIDE[preferred];

	if (space[preferred] >= needed) return preferred;
	if (space[opposite] >= needed) return opposite;
	return space[opposite] > space[preferred] ? opposite : preferred;
}

function alignOffset(
	align: AnchorAlign,
	triggerStart: number,
	triggerSize: number,
	contentSize: number,
): number {
	if (align === 'start') return triggerStart;
	if (align === 'end') return triggerStart + triggerSize - contentSize;
	return triggerStart + (triggerSize - contentSize) / 2;
}

function overflowAmount(start: number, size: number, viewport: number, padding: number): number {
	const overflowStart = Math.max(0, padding - start);
	const overflowEnd = Math.max(0, start + size - (viewport - padding));
	return overflowStart + overflowEnd;
}

/**
 * Выбирает выравнивание вдоль стороны: `preferred` — приоритет;
 * при нехватке места flip на противоположное (`start` ↔ `end`).
 * `center` остаётся, если он лучше по суммарному overflow.
 */
function resolvePreferredAlign(
	preferred: AnchorAlign,
	side: AnchorSide,
	trigger: DOMRect,
	contentWidth: number,
	contentHeight: number,
	edgePadding = 8,
): AnchorAlign {
	const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
	const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
	const horizontal = side === 'top' || side === 'bottom';
	const triggerStart = horizontal ? trigger.left : trigger.top;
	const triggerSize = horizontal ? trigger.width : trigger.height;
	const contentSize = horizontal ? contentWidth : contentHeight;
	const viewport = horizontal ? vw : vh;

	const score = (align: AnchorAlign) => overflowAmount(
		alignOffset(align, triggerStart, triggerSize, contentSize),
		contentSize,
		viewport,
		edgePadding,
	);

	if (preferred === 'center') {
		const centerScore = score('center');
		if (centerScore === 0) return 'center';
		const startScore = score('start');
		const endScore = score('end');
		if (startScore === 0 && endScore > 0) return 'start';
		if (endScore === 0 && startScore > 0) return 'end';
		if (centerScore <= startScore && centerScore <= endScore) return 'center';
		return startScore <= endScore ? 'start' : 'end';
	}

	const preferredScore = score(preferred);
	if (preferredScore === 0) return preferred;

	const opposite = OPPOSITE_ALIGN[preferred];
	const oppositeScore = score(opposite);
	if (oppositeScore === 0 || oppositeScore < preferredScore) return opposite;
	return preferred;
}

/**
 * Фиксированная позиция плавающего слоя относительно trigger (Popover / Overlay).
 * `side` — приоритет; при нехватке места flip на противоположную сторону.
 * `align` — приоритет; при нехватке места flip `start` ↔ `end`.
 * Затем clamp к краям viewport с отступом 8px.
 *
 * @param trigger - Якорь.
 * @param content - Измеряемый контент (нужны актуальные размеры).
 * @param side - Предпочтительная сторона относительно trigger.
 * @param align - Выравнивание вдоль стороны.
 * @param gap - Зазор между trigger и content в px (`8` по умолчанию).
 */
export function computeAnchorPosition(
	trigger: HTMLElement,
	content: HTMLElement,
	side: AnchorSide,
	align: AnchorAlign,
	gap = 8,
): AnchorPositionResult {
	const rect = trigger.getBoundingClientRect();
	// Layout-размер без CSS transform: иначе scale-анимация dropdown
	// занижает height и при side=top съедает sideOffset (gap).
	const size = {
		width: content.offsetWidth,
		height: content.offsetHeight,
	};
	const resolvedSide = resolvePreferredSide(
		side,
		rect,
		size.width,
		size.height,
		gap,
	);
	const resolvedAlign = resolvePreferredAlign(
		align,
		resolvedSide,
		rect,
		size.width,
		size.height,
	);

	let top = 0;
	let left = 0;

	if (resolvedSide === 'bottom') top = rect.bottom + gap;
	if (resolvedSide === 'top') top = rect.top - size.height - gap;
	if (resolvedSide === 'left') left = rect.left - size.width - gap;
	if (resolvedSide === 'right') left = rect.right + gap;

	if (resolvedSide === 'top' || resolvedSide === 'bottom') {
		left = alignOffset(resolvedAlign, rect.left, rect.width, size.width);
	} else {
		top = alignOffset(resolvedAlign, rect.top, rect.height, size.height);
	}

	const clamped = clampToViewport(left, top, size.width, size.height);

	return {
		position: 'fixed',
		top: Math.round(clamped.top),
		left: Math.round(clamped.left),
		side: resolvedSide,
		align: resolvedAlign,
	};
}

/**
 * Прижимает прямоугольник к viewport с отступом от краёв.
 */
export function clampToViewport(
	left: number,
	top: number,
	width: number,
	height: number,
	padding = 8,
): {
	left: number;
	top: number
} {
	const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
	const vh = typeof window !== 'undefined' ? window.innerHeight : 0;

	return {
		left: Math.min(Math.max(padding, left), Math.max(padding, vw - width - padding)),
		top: Math.min(Math.max(padding, top), Math.max(padding, vh - height - padding)),
	};
}
