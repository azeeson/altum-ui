import type {
	ProgressProps,
	ProgressCircleProps,
} from './Progress.types';
export type {
	ProgressProps,
	ProgressCircleProps,
} from './Progress.types';

import {forwardRef} from 'react';
import styles from './Progress.module.css';
import {cn} from '../../utils/cn';

const CIRCLE_DIAMETER = {
	sm: 40,
	md: 50,
	lg: 64,
} as const;

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
		variant: variantProp = 'auto',
		className,
		style,
		...rest
	},
	ref,
) {
	const normalized = Math.min(100, Math.max(0, percentage));
	const resolvedValueText = valueText ?? (indeterminate ? undefined : `${Math.round(normalized)}%`);
	const showMeta = label != null || (showValueText && resolvedValueText != null);
	const tone = variantProp === 'auto'
		? (!indeterminate && normalized >= 100 ? 'success' : 'primary')
		: variantProp;

	return (
		<div
			ref={ref}
			className={cn(styles.root, className)}
			style={style}
			{...rest}
		>
			{showMeta && (
				<div className={styles.meta}>
					{label != null && (
						<span className={styles.label}>
							{label}
						</span>
					)}
					{showValueText && resolvedValueText != null && (
						<span className={styles.valueText}>
							{resolvedValueText}
						</span>
					)}
				</div>
			)}
			<div
				className={cn(
					styles.progressLine,
					size !== 'md' ? styles[size] : '',
					styles[`tone_${tone}`],
					indeterminate ? styles.indeterminate : '',
				)}
				role='progressbar'
				aria-valuemin={indeterminate ? undefined : 0}
				aria-valuemax={indeterminate ? undefined : 100}
				aria-valuenow={indeterminate ? undefined : normalized}
				aria-valuetext={
					typeof resolvedValueText === 'string' || typeof resolvedValueText === 'number'
						? String(resolvedValueText)
						: undefined
				}
				aria-label={typeof label === 'string' ? label : undefined}
			>
				<div
					className={styles.progressBar}
					style={indeterminate ? undefined : {width: `${normalized}%`}}
				/>
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
		variant: variantProp = 'auto',
		className,
		style,
		...rest
	},
	ref,
) {
	const normalized = Math.min(100, Math.max(0, percentage));
	const radius = 16;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (normalized / 100) * circumference;
	const resolvedValueText = valueText ?? (indeterminate ? undefined : `${Math.round(normalized)}%`);
	const tone = variantProp === 'auto'
		? (!indeterminate && normalized >= 100 ? 'success' : 'primary')
		: variantProp;
	const svgSize = diameter ?? CIRCLE_DIAMETER[size];

	return (
		<div
			ref={ref}
			className={cn(styles.circleRoot, styles[`tone_${tone}`], className)}
			style={style}
			{...rest}
			role='progressbar'
			aria-valuemin={indeterminate ? undefined : 0}
			aria-valuemax={indeterminate ? undefined : 100}
			aria-valuenow={indeterminate ? undefined : normalized}
			aria-label={typeof label === 'string' ? label : undefined}
		>
			<svg
				className={cn(styles.progressCircle, indeterminate ? styles.circleIndeterminate : '')}
				width={svgSize}
				height={svgSize}
				viewBox='0 0 40 40'
				aria-hidden
			>
				<circle
					className={styles.progressCircleTrack}
					cx='20'
					cy='20'
					r={radius}
				/>
				<circle
					className={styles.progressCircleBar}
					cx='20'
					cy='20'
					r={radius}
					strokeDasharray={circumference}
					strokeDashoffset={indeterminate ? circumference * 0.75 : strokeDashoffset}
				/>
			</svg>
			{(label != null || (showValueText && resolvedValueText != null)) && (
				<div className={styles.circleMeta}>
					{showValueText && resolvedValueText != null && (
						<span className={styles.circleValue}>
							{resolvedValueText}
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
