import type {TextareaFieldProps} from './TextareaField.types';
export type {TextareaFieldProps} from './TextareaField.types';

import {forwardRef} from 'react';
import {TextControl, type TextControlProps} from '../../base/TextControl';

/**
 * Многострочное поле с авто-ростом по контенту и тем же API, что у TextField.
 *
 * @component
 * @example
 * <TextareaField label="Комментарий" value={note} onChange={(e) => setNote(e.target.value)} />
 */
export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
	function TextareaField(props, ref) {
		return (
			<TextControl
				{...(props as TextControlProps)}
				ref={ref}
				as='textarea'
			/>
		);
	},
);

TextareaField.displayName = 'TextareaField';
