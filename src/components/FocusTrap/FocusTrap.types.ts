import type React from 'react';
import type {
	RefObject,
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Свойства `FocusTrap`.
 */
export interface FocusTrapProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	active: boolean;
	children: React.ReactNode;
	initialFocusRef?: RefObject<HTMLElement | null>;
	returnFocusRef?: RefObject<HTMLElement | null>;
	/** @default true — выключайте при restore через useOverlayPanel */
	restoreFocus?: boolean;
	onEscape?: () => void;
}
