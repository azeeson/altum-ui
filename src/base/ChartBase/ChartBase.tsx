import {cn} from '../../core/utils/cn';
import styles from './ChartBase.module.css';
import type {ChartBaseProps} from './ChartBase.types';

/**
 * Контейнер SVG-графика: ширина 100%, overflow visible у `svg`.
 *
 * @component
 */
export const ChartBase = ({
	children,
	className,
	rootRef,
	...rest
}: ChartBaseProps) => (
	<div
		ref={rootRef}
		className={cn(styles.root, className)}
		{...rest}
	>
		{children}
	</div>
);
