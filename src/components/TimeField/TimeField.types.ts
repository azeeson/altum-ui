import {MaskedFieldProps} from '../MaskedField/MaskedField';

/**
 * Свойства `TimeField` (поле с маской HH:MM).
 */
export interface TimeFieldProps extends Omit<MaskedFieldProps, 'mask'> {
	value: string;
}
