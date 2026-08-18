export type ArrowOrientation = 'horizontal' | 'vertical' | 'both';

export function getNextIndex(
	currentIndex: number,
	length: number,
	key: string,
	orientation: ArrowOrientation = 'horizontal'
): number | null {
	if (length === 0) return null;

	const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
	const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';

	if (key === prevKey || (orientation === 'both' && key === 'ArrowUp')) {
		return (currentIndex - 1 + length) % length;
	}
	if (key === nextKey || (orientation === 'both' && key === 'ArrowDown')) {
		return (currentIndex + 1) % length;
	}
	if (key === 'Home') return 0;
	if (key === 'End') return length - 1;

	return null;
}

export function focusElement(element: HTMLElement | null | undefined) {
	element?.focus({preventScroll: true});
}
