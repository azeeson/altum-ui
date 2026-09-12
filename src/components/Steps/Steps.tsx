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

import {forwardRef} from 'react';
import styles from './Steps.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../../locales/localeContext';

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
				size !== 'md' && styles[size],
				!showConnectors && styles.noConnectors,
				className,
			)}
			aria-label={ariaLabel ?? t('steps.ariaLabel')}
			{...rest}
		>
			{items.map((item, index) => {
				const status = resolveStatus(item, index, currentStep);
				const clickable = !!onStepClick && !item.disabled;
				const mark = item.icon ?? (
					status === 'complete' ? '✓' : status === 'error' ? '!' : index + 1
				);
				const body = (
					<>
						<span className={styles.circle} aria-hidden>
							{mark}
						</span>
						<span className={styles.stepLabel}>
							{item.title}
						</span>
						{item.description != null && (
							<span className={styles.stepDesc}>
								{item.description}
							</span>
						)}
					</>
				);

				return (
					<li
						key={index}
						className={cn(styles.stepItem, styles[status])}
						aria-current={status === 'current' ? 'step' : undefined}
					>
						{clickable ? (
							<button
								type='button'
								className={cn(unstyled.control, styles.body)}
								disabled={item.disabled}
								onClick={() => onStepClick(index)}
							>
								{body}
							</button>
						) : (
							<div className={styles.body}>
								{body}
							</div>
						)}
					</li>
				);
			})}
		</ol>
	);
});

Steps.displayName = 'Steps';
