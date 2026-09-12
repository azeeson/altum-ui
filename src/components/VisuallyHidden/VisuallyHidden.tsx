import type {
	VisuallyHiddenProps,
} from './VisuallyHidden.types';
export type {
	VisuallyHiddenProps,
} from './VisuallyHidden.types';

import {forwardRef} from 'react';
import srOnly from '../../styles/srOnly.module.css';
import {cn} from '../../utils/cn';

/**
 * Контент скрыт визуально, но доступен скринридерам.
 *
 * @component
 * @example
 * <button type="button">
 *   <IconClose />
 *   <VisuallyHidden>Закрыть</VisuallyHidden>
 * </button>
 */
export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(function VisuallyHidden(
	{
		children,
		as: Component = 'span',
		className,
		...rest
	},
	ref,
) {
	return (
		<Component
			ref={ref as never}
			className={cn(srOnly.srOnly, className)}
			{...rest}
		>
			{children}
		</Component>
	);
});

VisuallyHidden.displayName = 'VisuallyHidden';
