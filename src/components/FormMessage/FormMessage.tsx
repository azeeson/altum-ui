import type {FormMessageProps} from './FormMessage.types';
export type {
	FormMessageVariant,
	FormMessageProps,
} from './FormMessage.types';

import fieldMessage from '../../styles/fieldMessage.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Inline-сообщение под полем или над формой: подсказка, ошибка, успех.
 *
 * @component
 * @example
 * <FormMessage variant="error">{errors.email}</FormMessage>
 */
export function FormMessage({
	variant = 'hint',
	className,
	role,
	children,
	rootRef,
	...rest
}: FormMessageProps) {
	return (
		<p
			{...rest}
			ref={rootRef}
			className={cn(fieldMessage.message, className)}
			data-variant={variant}
			role={role ?? (variant === 'error' ? 'alert' : undefined)}
		>
			{children}
		</p>
	);
}
