import type {ReactElement, Ref} from 'react';
import {uEvMerge, uRef} from './bundle';

type AnyProps = Record<string, unknown>;

function isEventHandlerKey(key: string): boolean {
	return key.length > 2 && key.startsWith('on') && key.charCodeAt(2) >= 65 && key.charCodeAt(2) <= 90;
}

/**
 * Мержит slot-пропсы в единственный React-элемент.
 * `className` — инлайн-склейка строк; `on*` — {@link uEvMerge} (child → slot);
 * `ref` / `rootRef` — {@link uRef} (нативные элементы и Altum-хосты). Без `Object.keys`.
 */
export function mergeSlotProps<P extends AnyProps>(
	slotProps: P,
	child: ReactElement,
	ref?: Ref<HTMLElement> | null,
): AnyProps {
	const childProps = child.props as AnyProps;
	const out: AnyProps = {
		...childProps,
		...slotProps,
	};

	const slotClass = slotProps.className;
	const childClass = childProps.className;
	out.className = (
		typeof slotClass === 'string' && typeof childClass === 'string'
			? `${slotClass} ${childClass}`
			: typeof slotClass === 'string'
				? slotClass
				: typeof childClass === 'string'
					? childClass
					: undefined
	);

	const slotStyle = slotProps.style;
	const childStyle = childProps.style;
	if (slotStyle != null || childStyle != null) {
		out.style = {
			...(typeof childStyle === 'object' && childStyle ? childStyle : null),
			...(typeof slotStyle === 'object' && slotStyle ? slotStyle : null),
		};
	}

	/* Altum-хосты читают `rootRef`; нативные / forwardRef — `ref`. Слот пишет оба. */
	out.rootRef = uRef(ref, childProps.rootRef as Ref<HTMLElement> | null | undefined);
	out.ref = uRef(ref, childProps.ref as Ref<HTMLElement> | null | undefined);

	for (const key in slotProps) {
		if (!isEventHandlerKey(key)) continue;
		const slotHandler = slotProps[key];
		const childHandler = childProps[key];
		if (typeof slotHandler === 'function' && typeof childHandler === 'function') {
			out[key] = uEvMerge(
				childHandler as (event: {defaultPrevented: boolean}) => void,
				slotHandler as (event: {defaultPrevented: boolean}) => void,
			);
		}
	}

	return out;
}
