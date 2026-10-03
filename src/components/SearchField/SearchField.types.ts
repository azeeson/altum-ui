import type {Ref} from 'react';
import {TextFieldProps} from '../TextField/TextField';

/**
 * Свойства `SearchField`.
 * `onClear` наследуется от `TextField`.
 */
export type SearchFieldProps = Omit<TextFieldProps, 'prefix' | 'type' | 'ref'> & {
	/** Узел `<input>`. */
	inputRef?: Ref<HTMLInputElement>;
};
