import type {Ref} from 'react';
import {TextFieldProps} from '../TextField/TextField';

/**
 * Свойства `MaskedField`.
 */
export interface MaskedFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
	/** Шаблон маски: `9` — цифра пользователя, остальные символы — литералы */
	mask: string;
	/** Только «чистые» цифры пользователя без литералов маски */
	value: string;
	onChange: (value: string) => void;
	/** Узел `<input>`. */
	inputRef?: Ref<HTMLInputElement>;
	/**
	 * Показывать маску как placeholder (`9` → `_`).
	 * @default false
	 */
	maskAsPlaceholder?: boolean;
}
