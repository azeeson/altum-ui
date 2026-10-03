import type {SuggestFieldProps} from './SuggestField.types';
export type {
	SuggestFieldOption,
	SuggestFieldProps,
} from './SuggestField.types';

import {Select} from '../Select/Select';
import {useTextTrigger} from '../Select/useTextTrigger';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_suggestField} from '../../locales/slices/suggestField.ru';

const localeFallback = {
	suggestField: ru_suggestField,
};

/**
 * Поле с подсказками: `Select` с печатным `TextField` (`inputProps`).
 * Ввод фильтрует список, значение — только из options. Freestyle — `AutocompleteField`.
 *
 * @component
 * @example
 * <SuggestField label="Город" options={cities} value={city} onChange={setCity} />
 */
export const SuggestField = ({
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
}: SuggestFieldProps) => {
	const {t} = useLocale(localeFallback);
	const text = useTextTrigger({
		options,
		value,
		defaultValue,
		onChange,
		allowCustom: false,
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
