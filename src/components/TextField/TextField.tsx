import type {TextFieldProps} from './TextField.types';
export type {
	FieldLabelPlacement,
	TextFieldProps,
} from './TextField.types';

import {forwardRef} from 'react';
import {TextControl} from '../../base/TextControl';

/**
 * Текстовое поле с floating / outside label, prefix/postfix, опциональной очисткой и состояниями ошибки.
 *
 * @component
 * @example
 * <TextField
 *   label="Эл. почта"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   onClear={() => setEmail('')}
 *   width="full"
 * />
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(props, ref) {
	return (
		<TextControl
			{...props}
			ref={ref}
			as='input'
			type={props.type ?? 'text'}
		/>
	);
});

TextField.displayName = 'TextField';
