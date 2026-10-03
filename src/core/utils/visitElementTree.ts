import {Fragment, isValidElement, type ReactElement, type ReactNode} from 'react';

function isFragmentElement(
	child: ReactElement,
): child is ReactElement<{children?: ReactNode}> {
	return child.type === Fragment;
}

function eachChild(node: ReactNode, visit: (child: ReactNode) => void): void {
	if (node == null || typeof node === 'boolean') return;
	if (Array.isArray(node)) {
		for (const child of node) eachChild(child, visit);
		return;
	}
	visit(node);
}

/**
 * Обход React-дерева с разворачиванием Fragment.
 * `descend` — заходить ли в `props.children` элемента (по умолчанию да).
 * Без `Children.forEach` / `Children.map` (MANIFEST 2.7).
 */
export function visitElementTree(
	node: ReactNode,
	visit: (element: ReactElement) => void,
	descend: (element: ReactElement) => boolean = () => true,
): void {
	eachChild(node, (child) => {
		if (!isValidElement(child)) return;

		if (isFragmentElement(child)) {
			visitElementTree(child.props.children, visit, descend);
			return;
		}

		visit(child);

		if (!descend(child)) return;

		const nested = (child.props as {children?: ReactNode}).children;
		if (nested != null) {
			visitElementTree(nested, visit, descend);
		}
	});
}
