import type {
	FocusTrapProps,
} from './FocusTrap.types';
export type {
	FocusTrapProps,
} from './FocusTrap.types';

import {forwardRef, useRef} from 'react';
import {useFocusTrap} from '../../hooks/useFocusTrap';
import {composeRefs} from '../../utils/composeRefs';

/**
 * Ловушка фокуса: Tab циклится внутри контейнера overlay-панелей.
 *
 * @component
 * @example
 * <FocusTrap active={isOpen} onEscape={onClose}>
 *   <div role="dialog">{content}</div>
 * </FocusTrap>
 */
export const FocusTrap = forwardRef<HTMLDivElement, FocusTrapProps>(function FocusTrap(
	{
		active,
		children,
		className,
		style,
		initialFocusRef,
		returnFocusRef,
		restoreFocus = true,
		onEscape,
		...rest
	},
	ref,
) {
	const containerRef = useRef<HTMLDivElement>(null);

	useFocusTrap({
		active,
		containerRef,
		initialFocusRef,
		returnFocusRef,
		restoreFocus,
		onEscape,
	});

	return (
		<div
			ref={composeRefs(ref, containerRef)}
			className={className}
			style={style}
			{...rest}
		>
			{children}
		</div>
	);
});

FocusTrap.displayName = 'FocusTrap';
