/**
 * Подгоняет высоту элемента под `scrollHeight` (textarea, contentEditable).
 * Сбрасывает height в `auto`, затем выставляет px-значение с учётом min/max.
 * При превышении maxHeight включает вертикальный скролл.
 *
 * @param element - DOM-элемент с изменяемым контентом.
 * @param options - Минимальная высота в px и опциональный maxHeight (число или CSS-строка).
 */
export function adjustElementHeight(
	element: HTMLElement,
	options: {
		minHeightPx?: number;
		maxHeight?: number | string;
	} = {},
): void {
	const {minHeightPx = 0, maxHeight} = options;

	element.style.maxHeight = maxHeight !== undefined
		? (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight)
		: '';

	element.style.height = 'auto';
	const scrollHeight = element.scrollHeight;
	const computedMaxHeight = parseFloat(getComputedStyle(element).maxHeight);
	const maxHeightPx = Number.isFinite(computedMaxHeight) ? computedMaxHeight : Infinity;
	const nextHeight = Math.min(Math.max(scrollHeight, minHeightPx), maxHeightPx);

	element.style.height = `${nextHeight}px`;
	element.style.overflowY = scrollHeight > maxHeightPx ? 'auto' : 'hidden';
}

/**
 * Вычисляет минимальную высоту textarea в px для заданного числа строк.
 * Учитывает line-height, padding и border из computed styles.
 *
 * @param element - Textarea (должен быть в DOM для корректных computed styles).
 * @param minRows - Минимальное число видимых строк.
 * @returns Высота в пикселях.
 */
export function getTextareaMinHeightPx(
	element: HTMLTextAreaElement,
	minRows: number,
): number {
	const style = getComputedStyle(element);
	const controlHeight = parseFloat(style.getPropertyValue('--altum-field-control-height')) || 0;
	const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.25;
	const verticalPadding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
	const verticalBorder = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
	const contentHeight = verticalPadding + verticalBorder + lineHeight * minRows;

	/* Первая видимая строка должна совпадать с высотой chrome TextField. */
	if (minRows <= 1 && controlHeight > 0) {
		return Math.max(contentHeight, controlHeight);
	}

	return contentHeight;
}
