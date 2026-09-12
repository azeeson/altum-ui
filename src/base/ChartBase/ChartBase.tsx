import {forwardRef} from 'react';
import {cn} from '../../utils/cn';
import styles from './ChartBase.module.css';
import type {ChartBaseProps} from './ChartBase.types';

/**
 * Контейнер SVG-графика: ширина 100%, overflow visible у `svg`.
 *
 * @component
 */
export const ChartBase = forwardRef<HTMLDivElement, ChartBaseProps>(function ChartBase(
	{children, className, ...rest},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.root, className)}
			{...rest}
		>
			{children}
		</div>
	);
});
ChartBase.displayName = 'ChartBase';
