import {
	type RefObject,
	useLayoutEffect,
} from 'react';

/**
 * Помечает соседние узлы родителя `rootRef` как `inert`,
 * пока overlay-панель открыта (фон недоступен для фокуса / AT).
 * Снимает `inert` при деактивации / размонтировании (если атрибут ставил этот хук).
 *
 * @param active - Панель открыта.
 * @param rootRef - Корень портала панели (sibling'и получают `inert`).
 *
 * @returns Ничего — атрибут inert на соседних узлах.
 *
 * @example
 * useInertSiblings(isOpen, portalRootRef);
 */
export function useInertSiblings(
	active: boolean,
	rootRef: RefObject<HTMLElement | null>,
): void {
	useLayoutEffect(() => {
		if (!active) return;

		const root = rootRef.current;
		const parent = root?.parentElement;
		if (!root || !parent) return;

		const mutated: Array<{
			element: HTMLElement;
			hadInert: boolean;
		}> = [];

		Array.from(parent.children).forEach((child) => {
			if (!(child instanceof HTMLElement) || child === root) return;
			mutated.push({
				element: child,
				hadInert: child.hasAttribute('inert'),
			});
			child.setAttribute('inert', '');
		});

		return () => {
			mutated.forEach(({element, hadInert}) => {
				if (!hadInert) {
					element.removeAttribute('inert');
				}
			});
		};
	}, [active, rootRef]);
}
