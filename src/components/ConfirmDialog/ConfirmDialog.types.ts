import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';
import {ButtonProps} from '../Button/Button';

/**
 * Публичный тип `ConfirmDialogSecondaryAction`.
 */
export interface ConfirmDialogSecondaryAction {
	label: string;
	onClick: () => void;
	variant?: ButtonProps['variant'];
	disabled?: boolean;
}

/**
 * Свойства `ConfirmDialog`.
 */
export interface ConfirmDialogProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title' | 'children'> {
	open: boolean;
	title: string;
	message: React.ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	/** `danger` — красная кнопка подтверждения для необратимых действий */
	status?: 'default' | 'danger';
	secondaryAction?: ConfirmDialogSecondaryAction;
	onConfirm: () => void;
	onCancel: () => void;
	onClose?: () => void;
	onOpenChange?: (open: boolean) => void;
	loading?: boolean;
}
