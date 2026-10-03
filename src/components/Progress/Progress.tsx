import type {
	ProgressProps,
	ProgressCircleProps,
} from './Progress.types';
export type {
	ProgressProps,
	ProgressCircleProps,
} from './Progress.types';

import type {CSSProperties} from 'react';
import styles from './Progress.module.css';
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';
import {progressModel} from './Progress.utils';
import {unitRatio} from '../../core/utils/math';

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
export const Progress = ({
	percentage = 0,
	indeterminate = false,
	label,
	valueText,
	showValueText = true,
	size = 'md',
	variant = 'auto',
	className,
	style,
	rootRef,
	...rest
}: ProgressProps) => {
	const {n, text, tone, aria} = progressModel(percentage, indeterminate, variant, label, valueText);
	const showMeta = label != null || (showValueText && text != null);
	const ratio = unitRatio(n, 0, 100);

	return (
		<div
			{...rest}
			ref={rootRef}
			className={cn(styles.root, className)}
			style={{
				'--local-ratio': ratio,
				...style
			} as CSSProperties}
			data-tone={tone}
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
				className={styles.progressLine}
				data-size={size !== 'md' ? size : undefined}
				data-indeterminate={indeterminate ? '' : undefined}
				{...aria}
			>
				<div className={styles.progressBar} />
			</div>
		</div>
	);
};

/**
 * Круговой индикатор прогресса.
 *
 * @component
 * @example
 * <ProgressCircle percentage={72} label="CPU" />
 */
export const ProgressCircle = ({
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
	rootRef,
	...rest
}: ProgressCircleProps) => {
	const {n, text, tone, aria} = progressModel(percentage, indeterminate, variant, label, valueText);
	const svgSize = diameter ?? CIRCLE_DIAMETER[size];
	const ratio = unitRatio(n, 0, 100);

	return (
		<div
			{...rest}
			ref={rootRef}
			className={cn(utilities.fColumn, utilities.fCenter, styles.circleRoot, className)}
			style={{
				'--local-ratio': ratio,
				...style
			} as CSSProperties}
			data-tone={tone}
			data-indeterminate={indeterminate ? '' : undefined}
			{...aria}
		>
			<svg
				className={styles.progressCircle}
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
				<div className={cn(utilities.fColumn, utilities.fCenter, styles.circleMeta)}>
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
};
