import type {
	CollapseProps,
} from './Collapse.types';
export type {
	CollapseProps,
} from './Collapse.types';

import {forwardRef, type HTMLAttributes} from 'react';
import styles from './Collapse.module.css';
import {cn} from '../../utils/cn';

/**
 * Плавное раскрытие и сворачивание блока по высоте с учётом reduced motion.
 *
 * @component
 * @example
 * <Collapse open={expanded}>
 *   <p>Дополнительные детали секции</p>
 * </Collapse>
 */
export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(function Collapse(
	{
		open,
		children,
		className,
		reducedMotion,
		...rest
	},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(
				styles.root,
				open && styles.open,
				reducedMotion && styles.instant,
				className,
			)}
			aria-hidden={!open}
			{...(!open ? {inert: ''} as HTMLAttributes<HTMLDivElement> : {})}
			{...rest}
		>
			<div className={styles.inner}>
				{children}
			</div>
		</div>
	);
});

Collapse.displayName = 'Collapse';
