import type {
	StepStatus,
	StepItem,
	StepsProps,
} from './Steps.types';
export type {
	StepStatus,
	StepItem,
	StepsProps,
} from './Steps.types';

import React, {forwardRef} from 'react';
import styles from './Steps.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../LocaleProvider/LocaleProvider';

function resolveStatus(item: StepItem, index: number, currentStep: number): StepStatus {
	if (item.status) return item.status;
	if (index < currentStep) return 'complete';
	if (index === currentStep) return 'current';
	return 'pending';
}

/**
 * Пошаговый индикатор: horizontal/vertical, error/complete, кликабельные шаги.
 *
 * @component
 * @example
 * <Steps
 *   orientation="vertical"
 *   currentStep={1}
 *   onStepClick={setStep}
 *   items={[
 *     { title: 'Контакты', status: 'complete' },
 *     { title: 'Оплата', status: 'error' },
 *   ]}
 * />
 */
export const Steps = forwardRef<HTMLOListElement, StepsProps>(function Steps(
	{
		currentStep,
		items,
		orientation = 'horizontal',
		onStepClick,
		size = 'md',
		showConnectors = true,
		className,
		'aria-label': ariaLabel,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	return (
		<ol
			ref={ref}
			className={cn(
				styles.steps,
				styles[orientation],
				styles[size],
				showConnectors ? '' : styles.noConnectors,
				className,
			)}
			aria-label={ariaLabel ?? t('steps.ariaLabel')}
			data-size={size}
			{...rest}
		>
			{items.map((item, index) => {
				const status = resolveStatus(item, index, currentStep);
				const clickable = !!onStepClick && !item.disabled;

				const itemClasses = cn(styles.stepItem, styles[`status_${status}`], clickable ? styles.clickable : '');

				const mark = item.icon ?? (
					status === 'complete' ? '✓' : status === 'error' ? '!' : index + 1
				);

				const content = (
					<>
						<div className={styles.circle} aria-hidden>
							{mark}
						</div>
						<div className={styles.labelBlock}>
							<div className={styles.stepLabel}>
								{item.title}
							</div>
							{item.description != null && (
								<div className={styles.stepDesc}>
									{item.description}
								</div>
							)}
						</div>
					</>
				);

				return (
					<li
						key={index}
						className={itemClasses}
						aria-current={status === 'current' ? 'step' : undefined}
					>
						{clickable ? (
							<button
								type='button'
								className={styles.stepButton}
								disabled={item.disabled}
								onClick={() => onStepClick(index)}
							>
								{content}
							</button>
						) : content}
					</li>
				);
			})}
		</ol>
	);
});

Steps.displayName = 'Steps';
