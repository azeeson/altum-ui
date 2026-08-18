import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Вариант сообщения поля / формы (`FormMessageVariant`).
 */
export type FormMessageVariant = 'error' | 'hint' | 'success';

/**
 * Свойства `FormMessage`.
 */
export interface FormMessageProps extends ComponentPropsWithoutRef<'p'> {
	/** @default 'hint' */
	variant?: FormMessageVariant;
	children: React.ReactNode;
}

/**
 * Свойства `FieldError` — алиас `FormMessage` с `variant="error"`.
 */
export type FieldErrorProps = Omit<FormMessageProps, 'variant'>;
