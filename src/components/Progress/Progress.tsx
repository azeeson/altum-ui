import type {
	ProgressProps,
	ProgressCircleProps,
} from './Progress.types';
export type {
	ProgressProps,
	ProgressCircleProps,
} from './Progress.types';

import {forwardRef, type ReactNode} from 'react';
import type {ProgressVariant} from './Progress.types';
import styles from './Progress.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';

const CIRCLE_DIAMETER = {
	sm: 40,
	md: 50,
	lg: 64,
} as const;

function progressModel(
	percentage: number,
	indeterminate: boolean,
	variant: ProgressVariant,
	label: ReactNode,
	valueText: ReactNode,
) {
	const n = Math.min(100, Math.max(0, percentage));
	const text = valueText ?? (indeterminate ? undefined : `${Math.round(n)}%`);
	return {
		n,
		text,
		tone: variant === 'auto'
			? (!indeterminate && n >= 100 ? 'success' : 'primary')
			: variant,
		aria: {
			role: 'progressbar' as const,
			'aria-valuemin': indeterminate ? undefined : 0,
			'aria-valuemax': indeterminate ? undefined : 100,
			'aria-valuenow': indeterminate ? undefined : n,
			'aria-valuetext': typeof text === 'string' || typeof text === 'number'
				? String(text)
				: undefined,
			'aria-label': typeof label === 'string' ? label : undefined,
		},
	};
}

/**
 * Горизонтальный индикатор выполнения.
 *
 * @component
 * @example
 * <Progress percentage={65} label="Загрузка" />
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
	{
		percentage = 0,
		indeterminate = false,
		label,
		valueText,
		showValueText = true,
		size = 'md',
		variant = 'auto',
		className,
		style,
		...rest
	},
	ref,
) {
	const {n, text, tone, aria} = progressModel(percentage, indeterminate, variant, label, valueText);
	const showMeta = label != null || (showValueText && text != null);

	return (
		<div
			ref={ref}
			className={cn(styles.root, styles[`tone_${tone}`], className)}
			style={mergeStyles({['--altum-progress' as string]: n}, style)}
			{...rest}
		>
			{showMeta && (
				<div className={styles.meta}>
					{label != null && (
						<span className={styles.label}>
							{label}
						</span>
					)}
					{showValueText && text != null && (
						<span className={styles.valueText}>
							{text}
						</span>
					)}
				</div>
			)}
			<div
				className={cn(
					styles.progressLine,
					size !== 'md' && styles[size],
					indeterminate && styles.indeterminate,
				)}
				{...aria}
			>
				<div className={styles.progressBar} />
			</div>
		</div>
	);
});

Progress.displayName = 'Progress';

/**
 * Круговой индикатор прогресса.
 *
 * @component
 * @example
 * <ProgressCircle percentage={72} label="CPU" />
 */
export const ProgressCircle = forwardRef<HTMLDivElement, ProgressCircleProps>(function ProgressCircle(
	{
		percentage = 0,
		indeterminate = false,
		size = 'md',
		diameter,
		label,
		valueText,
		showValueText = true,
		variant = 'auto',
		className,
		style,
		...rest
	},
	ref,
) {
	const {n, text, tone, aria} = progressModel(percentage, indeterminate, variant, label, valueText);
	const svgSize = diameter ?? CIRCLE_DIAMETER[size];

	return (
		<div
			ref={ref}
			className={cn(styles.circleRoot, styles[`tone_${tone}`], className)}
			style={mergeStyles({['--altum-progress' as string]: n}, style)}
			{...rest}
			{...aria}
		>
			<svg
				className={cn(styles.progressCircle, indeterminate && styles.circleIndeterminate)}
				width={svgSize}
				height={svgSize}
				viewBox='0 0 40 40'
				aria-hidden
			>
				<circle
					className={styles.progressCircleTrack}
					cx='20'
					cy='20'
					r='16'
				/>
				<circle
					className={styles.progressCircleBar}
					cx='20'
					cy='20'
					r='16'
					pathLength={100}
				/>
			</svg>
			{(label != null || (showValueText && text != null)) && (
				<div className={styles.circleMeta}>
					{showValueText && text != null && (
						<span className={styles.circleValue}>
							{text}
						</span>
					)}
					{label != null && (
						<span className={styles.circleLabel}>
							{label}
						</span>
					)}
				</div>
			)}
		</div>
	);
});

ProgressCircle.displayName = 'ProgressCircle';
