import type {
	FormMessageProps,
} from './FormMessage.types';
export type {
	FormMessageVariant,
	FormMessageProps,
} from './FormMessage.types';

import {forwardRef} from 'react';
import {Text} from '../Text/Text';
import fieldMessage from '../../styles/fieldMessage.module.css';
import {cn} from '../../utils/cn';

const COLOR = {
	hint: 'muted',
	error: 'error',
	success: 'success',
} as const;

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
		className,
		role,
		...rest
	},
	ref,
) {
	return (
		<Text
			ref={ref}
			as='p'
			size='xs'
			{...rest}
			color={COLOR[variant]}
			className={cn(fieldMessage.message, className)}
			role={role ?? (variant === 'error' ? 'alert' : undefined)}
		/>
	);
});

FormMessage.displayName = 'FormMessage';
