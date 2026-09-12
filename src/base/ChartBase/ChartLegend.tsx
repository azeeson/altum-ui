import {cn} from '../../utils/cn';
import unstyled from '../../styles/unstyledControl.module.css';
import styles from './ChartLegend.module.css';
import type {ChartLegendProps} from './ChartBase.types';

/**
 * Легенда серий (скрывается, если серия одна — см. `showWhenSingle`).
 */
export function ChartLegend({
	items,
	className,
	layout = 'inline',
	showWhenSingle = false,
	onItemHover,
}: ChartLegendProps) {
	if (items.length === 0) return null;
	if (!showWhenSingle && items.length <= 1) return null;
	const interactive = onItemHover != null;
	return (
		<div className={cn(styles.legend, layout === 'stack' && styles.stack, className)}>
			{items.map((item) => {
				const itemKey = item.id ?? item.name;
				const body = (
					<>
						<span
							className={styles.swatch}
							style={{background: item.color}}
						/>
						<span className={styles.legendLabel}>
							{item.name}
						</span>
						{item.detail != null && (
							<span className={styles.legendDetail}>
								{item.detail}
							</span>
						)}
					</>
				);
				const itemClassName = cn(
					interactive && unstyled.control,
					styles.legendItem,
					item.active && styles.legendItemActive,
				);
				if (onItemHover) {
					return (
						<button
							key={itemKey}
							type='button'
							className={itemClassName}
							onMouseEnter={() => onItemHover(itemKey)}
							onMouseLeave={() => onItemHover(null)}
						>
							{body}
						</button>
					);
				}
				return (
					<span key={itemKey} className={itemClassName}>
						{body}
					</span>
				);
			})}
		</div>
	);
}
ChartLegend.displayName = 'ChartLegend';
