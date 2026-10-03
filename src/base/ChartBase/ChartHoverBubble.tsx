import styles from './ChartHoverBubble.module.css';
import type {ChartHoverBubbleProps} from './ChartBase.types';

/**
 * SVG-подсказка у точки/столбца.
 */
export function ChartHoverBubble({
	x,
	y,
	canvasWidth,
	label,
	color,
}: ChartHoverBubbleProps) {
	const approxWidth = Math.min(canvasWidth - 16, Math.max(56, label.length * 6.5 + 16));
	const boxX = Math.min(
		Math.max(8, x - approxWidth / 2),
		canvasWidth - approxWidth - 8,
	);
	const boxY = Math.max(4, y - 28);
	return (
		<g pointerEvents='none'>
			<rect
				x={boxX}
				y={boxY}
				width={approxWidth}
				height={22}
				rx={4}
				className={styles.bubble}
			/>
			{color != null && (
				<circle
					cx={boxX + 10}
					cy={boxY + 11}
					r={3.5}
					fill={color}
				/>
			)}
			<text
				x={boxX + (color != null ? 18 : 8)}
				y={boxY + 15}
				className={styles.text}
			>
				{label}
			</text>
		</g>
	);
}
