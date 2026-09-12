import {Children, Fragment, isValidElement, type ReactElement, type ReactNode} from 'react';

function isFragmentElement(
	child: ReactElement,
): child is ReactElement<{children?: ReactNode}> {
	return child.type === Fragment;
}

/**
 * Обход React-дерева с разворачиванием Fragment.
 * `descend` — заходить ли в `props.children` элемента (по умолчанию да).
 */
export function visitElementTree(
	node: ReactNode,
	visit: (element: ReactElement) => void,
	descend: (element: ReactElement) => boolean = () => true,
): void {
	Children.forEach(node, (child) => {
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

/** Есть ли в дереве элемент с данным `type` (слот compound-API). */
export function treeContainsType(node: ReactNode, type: unknown): boolean {
	let found = false;
	visitElementTree(node, (element) => {
		if (element.type === type) found = true;
	});
	return found;
}

const DIALOG_TITLE_BRAND: unique symbol = Symbol.for('altum.dialogTitle');

/** Помечает слот заголовка диалога (`DialogBase.Title`, `Modal.Title`, `Sheet.Title`). */
export function markDialogTitle<T>(component: T): T {
	Object.defineProperty(component as object, DIALOG_TITLE_BRAND, {
		value: true,
		enumerable: false,
	});
	return component;
}

function isDialogTitleType(type: unknown): boolean {
	return (typeof type === 'function' || (typeof type === 'object' && type != null))
		&& DIALOG_TITLE_BRAND in (type as object);
}

/** Есть ли в дереве слот заголовка диалога. */
export function treeContainsDialogTitle(node: ReactNode): boolean {
	let found = false;
	visitElementTree(node, (element) => {
		if (isDialogTitleType(element.type)) found = true;
	});
	return found;
}
