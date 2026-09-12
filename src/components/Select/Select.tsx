import type {SelectProps} from './Select.types';
export type {
	SelectOption,
	SelectProps,
} from './Select.types';

import {forwardRef, type Ref} from 'react';
import {CustomSelect, type CustomSelectRenderTargetContext} from '../CustomSelect/CustomSelect';
import {getListboxOptionText} from '../../utils/listboxOptions';
import {Chip} from '../Chip/Chip';
import {useLocale} from '../../locales/localeContext';
import type {FieldBaseProps} from '../../base/FieldBase';
import styles from './Select.module.css';

/**
 * Select с FieldBase-триггером. Кастомный target — {@link CustomSelect}.
 *
 * @component
 * @example
 * <Select options={options} value={city} onChange={setCity} label="Город" filterable />
 */
export const Select = forwardRef<HTMLDivElement, SelectProps>(function Select(
	{
		selectionMode = 'single',
		placeholder,
		loading = false,
		separator = ' / ',
		popupRole = 'listbox',
		filterable = false,
		filterPlaceholder,
		postfix: _postfix,
		...rootProps
	},
	ref,
) {
	const {
		label,
		size = 'md',
		width = 'md',
		labelPlacement = 'inline',
		prefix,
		error,
		helperText,
		disabled,
		readOnly,
		onClear,
		clearLabel,
		className = '',
		id: providedId,
		options,
		...rest
	} = rootProps;

	return (
		<CustomSelect.Root
			ref={ref}
			{...rest}
			options={options}
			selectionMode={selectionMode}
			disabled={disabled}
			readOnly={readOnly}
			renderTarget={(context) => (
				<SelectTarget
					context={context}
					options={options}
					field={{
						label,
						size,
						width,
						labelPlacement,
						prefix,
						error,
						helperText,
						disabled,
						readOnly,
						onClear,
						clearLabel,
					}}
					placeholder={placeholder}
					className={className}
					loading={loading}
					separator={separator}
					popupRole={popupRole}
					id={providedId}
				/>
			)}
		>
			{filterable ? (
				<CustomSelect.Filter placeholder={filterPlaceholder} />
			) : null}
			<CustomSelect.List />
		</CustomSelect.Root>
	);
});

Select.displayName = 'Select';

const SelectTarget = forwardRef<HTMLDivElement, {
	context: CustomSelectRenderTargetContext;
	options: SelectProps['options'];
	field: FieldBaseProps;
	placeholder?: string;
	className?: string;
	loading?: boolean;
	separator: string;
	popupRole: NonNullable<SelectProps['popupRole']>;
	id?: string;
}>(function SelectTarget({
	context,
	options,
	field,
	placeholder,
	className = '',
	loading = false,
	separator,
	popupRole,
	id: providedId,
}, ref) {
	const {t} = useLocale();
	const {
		selectedOptions,
		open,
		disabled: rootDisabled,
		readOnly: rootReadOnly,
		clearValue,
		triggerAttrs,
		triggerRef,
		listboxId,
		selectionMode,
		removeOption,
	} = context;
	const selectedOption = selectedOptions[0];
	const hasValue = selectedOptions.length > 0;
	const isMultiple = selectionMode === 'multiple';
	const valueText = selectionMode === 'path'
		? (selectedOptions.length > 0
			? selectedOptions.map((option) => getListboxOptionText(option)).join(separator)
			: null)
		: (selectedOption
			? (typeof selectedOption.label === 'string'
				? selectedOption.label
				: getListboxOptionText(selectedOption))
			: null);

	const chips = isMultiple && hasValue
		? (
			<span className={styles.chipsRow}>
				{selectedOptions.map((option) => {
					const chipLabel = getListboxOptionText(option);
					return (
						<Chip
							key={option.value}
							variant='secondary'
							className={styles.chip}
							removeLabel={t('select.removeItem', {label: chipLabel})}
							onRemove={rootReadOnly ? undefined : () => removeOption(option.value)}
						>
							{chipLabel}
						</Chip>
					);
				})}
			</span>
		)
		: null;

	return (
		<CustomSelect.Shell
			ref={ref}
			triggerRef={triggerRef as Ref<HTMLDivElement>}
			triggerAttrs={triggerAttrs}
			id={providedId ?? listboxId.replace(/-listbox$/, '-trigger')}
			{...field}
			disabled={rootDisabled || !!field.disabled}
			readOnly={rootReadOnly || !!field.readOnly}
			open={open}
			isInteractive={!rootDisabled && !rootReadOnly && !field.disabled && !field.readOnly}
			hasValue={hasValue}
			onClear={field.onClear ? () => {
				clearValue();
				field.onClear?.();
			} : undefined}
			className={className}
			popupRole={popupRole}
			sizerContent={(
				<>
					{placeholder ? <span>
						{placeholder}
					</span> : null}
					{options.map((option) => (
						<span key={option.value}>
							{getListboxOptionText(option)}
						</span>
					))}
				</>
			)}
			triggerProps={{
				'aria-busy': loading || undefined,
				'aria-controls': open ? listboxId : undefined,
				'aria-haspopup': popupRole,
			}}
			triggerAs={isMultiple ? 'div' : 'button'}
		>
			{chips ?? valueText ?? (
				<CustomSelect.Placeholder>
					{placeholder ?? field.label}
				</CustomSelect.Placeholder>
			)}
		</CustomSelect.Shell>
	);
});

SelectTarget.displayName = 'Select.Target';
