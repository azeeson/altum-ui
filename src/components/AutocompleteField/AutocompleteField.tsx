import type {AutocompleteFieldProps} from './AutocompleteField.types';
export type {
	AutocompleteFieldOption,
	AutocompleteFieldProps,
} from './AutocompleteField.types';

import {Select} from '../Select/Select';
import {useTextTrigger} from '../Select/useTextTrigger';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_suggestField} from '../../locales/slices/suggestField.ru';

const localeFallback = {
	suggestField: ru_suggestField,
};

/**
 * Freestyle-комбобокс: `Select` с печатным `TextField` (`inputProps`).
 * Значение может быть свободным текстом или пунктом из options.
 *
 * @component
 * @example
 * <AutocompleteField label="Тег" options={tags} value={tag} onChange={setTag} />
 */
export const AutocompleteField = ({
	options,
	value,
	defaultValue = '',
	onChange,
	width = 'full',
	noOptionsText,
	label,
	placeholder,
	name,
	required,
	inputRef,
	onFocus,
	onBlur,
	onClick,
	onKeyDown,
	'aria-label': ariaLabel,
	postfix: _postfix,
	...props
}: AutocompleteFieldProps) => {
	const {t} = useLocale(localeFallback);
	const text = useTextTrigger({
		options,
		value,
		defaultValue,
		onChange,
		allowCustom: true,
		placeholder,
		name,
		required,
		inputRef,
		onFocus,
		onBlur,
		onClick,
		onKeyDown,
	});

	return (
		<Select
			{...props}
			options={options}
			selectionMode='single'
			value={text.value}
			onChange={text.onChange}
			filterQuery={text.filterQuery}
			inputProps={text.inputProps}
			width={width}
			label={label}
			aria-label={ariaLabel}
			listAriaLabel={label ?? ariaLabel}
			mobileTitle={label ?? ariaLabel}
			noOptionsText={noOptionsText ?? t('suggestField.noOptions')}
		/>
	);
};
