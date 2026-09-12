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
export interface FormMessageProps extends Omit<ComponentPropsWithoutRef<'p'>, 'color'> {
	/** @default 'hint' */
	variant?: FormMessageVariant;
	children: React.ReactNode;
}
