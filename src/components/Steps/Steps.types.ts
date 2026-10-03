import type React from 'react';
import type {Ref} from 'react';

export type StepStatus = 'pending' | 'current' | 'complete' | 'error';

export interface StepItem {
	title: string;
	description?: React.ReactNode;
	/** Явный статус; иначе выводится из `currentStep` */
	status?: StepStatus;
	disabled?: boolean;
	/** Кастомная иконка в круге (вместо номера / ✓) */
	icon?: React.ReactNode;
}

/**
 * Свойства `Steps`.
 */
export interface StepsProps extends Omit<React.ComponentPropsWithoutRef<'ol'>, 'children'> {
	currentStep: number;
	items: StepItem[];
	/** @default 'horizontal' */
	orientation?: 'horizontal' | 'vertical';
	/** Клик по шагу (индекс) */
	onStepClick?: (index: number) => void;
	/** @default 'md' */
	size?: 'sm' | 'md' | 'lg';
	/** Показать соединители. @default true */
	showConnectors?: boolean;
	/** DOM-узел списка. */
	rootRef?: Ref<HTMLOListElement>;
}
