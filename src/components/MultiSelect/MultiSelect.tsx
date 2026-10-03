import type {MultiSelectProps} from './MultiSelect.types';
export type {
	MultiSelectOption,
	MultiSelectProps,
} from './MultiSelect.types';

import type {MouseEvent} from 'react';
import {Select} from '../Select/Select';
import {Chip} from '../Chip/Chip';
import {useControlledState} from '../../hooks/useControlledState';
import {useLocale} from '../../locales/localeContext';
import {getFormControlState} from '../../core/utils/form';
import {findListboxOption, getListboxOptionText} from '../../core/utils/listboxOptions';
import {ruSlice as ru_select} from '../../locales/slices/select.ru';
import selectField from '../../styles/selectField.module.css';
import styles from './MultiSelect.module.css';

const SHOW_CHIP_REMOVE = () => {};

const localeFallback = {
	select: ru_select,
};

/**
 * Multiple-выбор с chips в триггере: декоратор над `Select`
 * (`selectionMode="multiple"`, chips через `inputProps.children`).
 *
 * @component
 * @example
 * <MultiSelect options={tags} value={selected} onChange={setSelected} label="Метки" />
 */
export const MultiSelect = ({
	options,
	groups,
	value: controlledValue,
	defaultValue,
	onChange,
	placeholder,
	loading = false,
	disabled = false,
	readOnly = false,
	label,
	size = 'md',
	width = 'md',
	prefix,
	postfix: _postfix,
	error,
	description,
	onClear,
	clearLabel,
	className = '',
	id: providedId,
	'aria-label': ariaLabel,
	listAriaLabel,
	noOptionsText,
	filterable = false,
	filterPlaceholder,
	showCheck,
	widthMode,
	...popupProps
}: MultiSelectProps) => {
	const {t} = useLocale(localeFallback);
	const {isReadOnly, isInteractive: interactive} = getFormControlState({
		disabled,
		readOnly,
	});
	const [value, setValue] = useControlledState(controlledValue, defaultValue ?? []);
	const selected = value.flatMap((item) => {
		const matched = findListboxOption(options, item);
		if (matched) return [matched];
		if (!item) return [];
		return [
			{
				value: item,
				label: item,
			},
		];
	});
	const commit = (next: string[]) => {
		setValue(next);
		onChange?.(next);
	};

	return (
		<Select
			{...popupProps}
			options={options}
			groups={groups}
			selectionMode='multiple'
			value={value}
			onChange={(next) => {
				commit(Array.isArray(next) ? next : []);
			}}
			disabled={disabled}
			readOnly={readOnly}
			loading={loading}
			filterable={filterable}
			filterPlaceholder={filterPlaceholder}
			showCheck={showCheck ?? false}
			widthMode={widthMode ?? 'trigger'}
			navigation='highlight'
			noOptionsText={noOptionsText}
			listAriaLabel={listAriaLabel ?? label ?? ariaLabel}
			mobileTitle={popupProps.mobileTitle ?? label ?? ariaLabel}
			onClear={onClear}
			clearLabel={clearLabel}
			label={label}
			size={size}
			width={width}
			prefix={prefix}
			error={error}
			description={description}
			className={className}
			id={providedId}
			aria-label={ariaLabel}
			placeholder={placeholder}
			inputProps={{
				children: (
					<>
						<span className={selectField.triggerSizer} aria-hidden='true'>
							{placeholder ? <span>
								{placeholder}
							</span> : null}
							{options.map((option) => (
								<span key={option.value}>
									{getListboxOptionText(option)}
								</span>
							))}
						</span>
						<span className={selectField.triggerText}>
							{selected.length > 0 ? (
								<span
									className={styles.chipsRow}
									onClickCapture={(event: MouseEvent<HTMLSpanElement>) => {
										if (!interactive || isReadOnly) return;
										const chip = (event.target as HTMLElement).closest<HTMLElement>(
											'[data-value][data-removable]',
										);
										if (!chip || !event.currentTarget.contains(chip)) return;
										const removeBtn = (event.target as HTMLElement).closest('button');
										if (!removeBtn || !chip.contains(removeBtn)) return;
										event.preventDefault();
										event.stopPropagation();
										const optionValue = chip.getAttribute('data-value');
										if (optionValue != null) {
											commit(value.filter((item) => item !== optionValue));
										}
									}}
								>
									{selected.map((option) => {
										const chipLabel = getListboxOptionText(option);
										return (
											<Chip
												key={option.value}
												variant='secondary'
												className={styles.chip}
												value={option.value}
												removeLabel={t('select.removeItem', {label: chipLabel})}
												onRemove={isReadOnly ? undefined : SHOW_CHIP_REMOVE}
											>
												{chipLabel}
											</Chip>
										);
									})}
								</span>
							) : (
								<span className={selectField.placeholder}>
									{placeholder ?? label}
								</span>
							)}
						</span>
					</>
				),
			}}
		/>
	);
};
