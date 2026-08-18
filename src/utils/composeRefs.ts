import type React from 'react';

/**
 * Допустимый ref для {@link composeRefs}: object ref, callback ref или `undefined`.
 *
 * @template T - Тип DOM-элемента или компонента.
 */
export type PossibleRef<T> = React.Ref<T> | undefined;

function setRef<T>(ref: PossibleRef<T>, value: T): void {
	if (typeof ref === 'function') {
		ref(value);
		return;
	}
	if (ref != null) {
		(ref as React.MutableRefObject<T>).current = value;
	}
}

/**
 * Объединяет несколько ref в один callback ref.
 * При монтировании/размонтировании вызывает все переданные ref с одним и тем же node.
 *
 * @template T - Тип элемента.
 * @param refs - Список object/callback ref; `undefined` пропускаются.
 * @returns Callback ref для передачи в `ref={...}`.
 *
 * @example
 * const mergedRef = composeRefs(forwardedRef, localRef);
 * <input ref={mergedRef} />
 */
export function composeRefs<T>(
	...refs: Array<PossibleRef<T>>
): React.RefCallback<T> {
	return (node) => {
		refs.forEach((ref) => setRef(ref, node));
	};
}
