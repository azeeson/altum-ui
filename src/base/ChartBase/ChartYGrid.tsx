import styles from './ChartPlot.module.css';
import type {ChartYGridProps} from './ChartBase.types';

/**
 * Горизонтальная сетка и подписи оси Y.
 */
export function ChartYGrid({
	ticks,
	getY,
	x1,
	x2,
}: ChartYGridProps) {
	return (
		<>
			{ticks.map((tick) => {
				const y = getY(tick);
				return (
					<g key={tick}>
						<line
							x1={x1}
							x2={x2}
							y1={y}
							y2={y}
							className={styles.grid}
						/>
						<text
							x={x1 - 8}
							y={y + 4}
							className={styles.tick}
							textAnchor='end'
						>
							{tick}
						</text>
					</g>
				);
			})}
		</>
	);
}
