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

import {useRef, type MouseEvent} from 'react';
import styles from './Steps.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_steps} from '../../locales/slices/steps.ru';

const localeFallback = {
	steps: ru_steps,
};




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
export const Steps = ({
	currentStep,
	items,
	orientation = 'horizontal',
	onStepClick,
	size = 'md',
	showConnectors = true,
	className,
	'aria-label': ariaLabel,
	rootRef,
	...rest
}: StepsProps) => {
	const {t} = useLocale(localeFallback);
	const onStepClickRef = useRef(onStepClick);
	onStepClickRef.current = onStepClick;

	const handleListClick = (event: MouseEvent<HTMLOListElement>) => {
		const target = (event.target as HTMLElement).closest('[data-index]');
		if (!target || target.hasAttribute('disabled')) return;

		const stepIndex = Number(target.getAttribute('data-index'));
		onStepClickRef.current?.(stepIndex);
	};

	return (
		<ol
			ref={rootRef}
			className={cn(styles.steps, className)}
			aria-label={ariaLabel ?? t('steps.ariaLabel')}
			data-orientation={orientation}
			data-size={size !== 'md' ? size : undefined}
			data-connectors={showConnectors ? undefined : 'false'}
			onClick={onStepClick ? handleListClick : undefined}
			{...rest}
		>
			{items.map((item, index) => {
				const status = resolveStatus(item, index, currentStep);
				const clickable = !!onStepClick && !item.disabled;
				const mark = status === 'complete'
					? '✓'
					: status === 'error'
						? '!'
						: status === 'current'
							? index + 1
							: (item.icon ?? index + 1);
				const body = (
					<>
						<span className={cn(utilities.fCenter, styles.circle)} aria-hidden>
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
						className={styles.stepItem}
						data-status={status}
						aria-current={status === 'current' ? 'step' : undefined}
					>
						{clickable ? (
							<button
								type='button'
								className={cn(unstyled.control, styles.body)}
								disabled={item.disabled}
								data-index={index}
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
};
