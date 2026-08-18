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
	/**
	 * Показывать маску как placeholder (`9` → `_`).
	 * Виден при `labelPlacement` `outside` / `none` (в `inline` placeholder скрыт).
	 * @default false
	 */
	maskAsPlaceholder?: boolean;
}
