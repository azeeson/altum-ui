import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Свойства `Collapse`.
 */
export interface CollapseProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	open: boolean;
	children: React.ReactNode;
	/**
	 * Отключить анимацию высоты.
	 * По умолчанию учитывает `prefers-reduced-motion`.
	 */
	reducedMotion?: boolean;
}
