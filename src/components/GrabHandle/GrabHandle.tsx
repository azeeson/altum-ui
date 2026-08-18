import type {
	GrabHandleProps,
} from './GrabHandle.types';
export type {
	GrabHandleProps,
} from './GrabHandle.types';

import {forwardRef} from 'react';
import styles from './GrabHandle.module.css';
import {cn} from '../../utils/cn';

/**
 * Ручка захвата в стиле iOS для нижней панели (`Sheet`).
 *
 * @component
 * @example
 * <Sheet showHandle open={open} onClose={onClose}>
 *   {content}
 * </Sheet>
 */
export const GrabHandle = forwardRef<HTMLDivElement, GrabHandleProps>(function GrabHandle(
	{className, ...rest},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.handle, className)}
			{...rest}
			aria-hidden
		>
			<span className={styles.handleBar} />
		</div>
	);
});

GrabHandle.displayName = 'GrabHandle';
