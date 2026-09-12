import type {MaskedFieldProps} from '../MaskedField/MaskedField';

/**
 * Свойства `DateField`.
 * Chrome и HTML-атрибуты инпута — как у `MaskedField` (`id`, `data-*`, `aria-*`).
 */
export interface DateFieldProps
	extends Omit<MaskedFieldProps, 'mask' | 'value' | 'onChange' | 'active'> {
	value: Date | undefined;
	onChange: (date: Date | undefined) => void;
}
