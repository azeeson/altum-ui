import {TextFieldProps} from '../TextField/TextField';

/**
 * Свойства `NumberField`.
 */
export interface NumberFieldProps extends Omit<TextFieldProps, 'type' | 'onChange'> {
	value?: number;
	min?: number;
	max?: number;
	step?: number;
	/** `undefined` — пустое поле (после очистки или ручного удаления). */
	onChange?: (val: number | undefined) => void;
}
