import type {CSSProperties, MouseEvent} from 'react';
import {cn} from '../../core/utils/cn';
import unstyled from '../../styles/unstyledControl.module.css';
import styles from './ChartLegend.module.css';
import type {ChartLegendProps} from './ChartBase.types';

/**
 * Легенда серий (скрывается, если серия одна — см. `showWhenSingle`).
 * Наведение на пункт делегируется с корня (`data-legend`).
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

	function onOver(event: MouseEvent<HTMLDivElement>) {
		if (!onItemHover) return;
		const target = event.target;
		if (!(target instanceof Element)) return;
		const id = target.closest('[data-legend]')?.getAttribute('data-legend');
		if (id) onItemHover(id);
	}

	function onLeave() {
		onItemHover?.(null);
	}

	return (
		<div
			className={cn(styles.legend, className)}
			data-layout={layout}
			onMouseOver={interactive ? onOver : undefined}
			onMouseLeave={interactive ? onLeave : undefined}
		>
			{items.map((item) => {
				const itemKey = item.id ?? item.name;
				const body = (
					<>
						<span
							className={styles.swatch}
							style={{'--local-swatch': item.color} as CSSProperties}
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
				if (onItemHover) {
					return (
						<button
							key={itemKey}
							type='button'
							className={cn(unstyled.control, styles.legendItem)}
							data-legend={itemKey}
							data-active={item.active ? '' : undefined}
						>
							{body}
						</button>
					);
				}
				return (
					<span key={itemKey} className={styles.legendItem}>
						{body}
					</span>
				);
			})}
		</div>
	);
}
