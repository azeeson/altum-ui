import type {
	FormMessageProps,
	FieldErrorProps,
} from './FormMessage.types';
export type {
	FormMessageVariant,
	FormMessageProps,
	FieldErrorProps,
} from './FormMessage.types';

import {forwardRef} from 'react';
import styles from './FormMessage.module.css';
import {cn} from '../../utils/cn';

/**
 * Inline-сообщение под полем или над формой: подсказка, ошибка, успех.
 *
 * @component
 * @example
 * <FormMessage variant="error">{errors.email}</FormMessage>
 */
export const FormMessage = forwardRef<HTMLParagraphElement, FormMessageProps>(function FormMessage(
	{
		variant = 'hint',
		children,
		className,
		style,
		role,
		id,
		...rest
	},
	ref,
) {
	const resolvedRole = role ?? (variant === 'error' ? 'alert' : undefined);

	return (
		<p
			ref={ref}
			className={cn(styles.message, styles[variant], className)}
			style={style}
			id={id}
			{...rest}
			data-variant={variant}
			role={resolvedRole}
		>
			{children}
		</p>
	);
});

FormMessage.displayName = 'FormMessage';

/**
 * Ошибка поля формы (`FormMessage variant="error"`).
 *
 * @component
 * @example
 * <FieldError>{errors.password}</FieldError>
 */
export const FieldError = forwardRef<HTMLParagraphElement, FieldErrorProps>(function FieldError(
	{children, ...rest},
	ref,
) {
	return (
		<FormMessage
			ref={ref}
			{...rest}
			variant='error'
		>
			{children}
		</FormMessage>
	);
});

FieldError.displayName = 'FieldError';
