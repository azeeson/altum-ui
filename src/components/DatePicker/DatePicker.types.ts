import type {MaskedFieldProps} from '../MaskedField/MaskedField';

/**
 * Свойства `DatePicker`.
 * Chrome и HTML-атрибуты инпута — как у `MaskedField` (`id`, `data-*`, `aria-*`).
 */
export interface DatePickerProps
	extends Omit<MaskedFieldProps, 'mask' | 'value' | 'onChange' | 'active'> {
	value: Date | undefined;
	onChange: (date: Date | undefined) => void;
}
