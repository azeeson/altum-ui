import type {SuggestFieldProps} from './SuggestField.types';
export type {
	SuggestFieldOption,
	SuggestFieldProps,
} from './SuggestField.types';

import type React from 'react';
import {forwardRef, useCallback, useId} from 'react';
import {TextField} from '../TextField/TextField';
import type {FieldBaseProps} from '../../base/FieldBase';
import {CustomSelect, type CustomSelectRenderTargetContext} from '../CustomSelect/CustomSelect';
import {useCustomSelectComboboxKeyboard} from '../CustomSelect/useCustomSelectComboboxKeyboard';
import {defaultListboxFilterFn, getListboxOptionDomId} from '../../utils/listboxOptions';
import {CustomSelectChevron} from '../CustomSelect/CustomSelect';
import {FieldBaseIcon} from '../../base/FieldBase';
import {useLocale} from '../../locales/localeContext';
import {composeEventHandlers} from '../../utils/composeEvents';
import {cn} from '../../utils/cn';
import {fieldPopupClassName} from '../../base/FieldPopup';
import {useSuggestInput} from './useSuggestInput';

interface SuggestFieldTriggerProps extends Omit<
	FieldBaseProps,
	'value' | 'onChange' | 'postfix'
> {
	ctx: CustomSelectRenderTargetContext;
	inputId: string;
	inputText: string;
	highlightedIndex: number;
	placeholder?: string;
	isInteractive: boolean;
	isReadOnly: boolean;
	name?: string;
	required?: boolean;
	wrapperProps: Omit<
		React.HTMLAttributes<HTMLDivElement>,
		'className' | 'onChange' | 'prefix' | 'onFocus' | 'onBlur' | 'onClick' | 'onKeyDown'
	>;
	onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onBlurCommit: () => void;
	onFocusOpen: () => void;
	onBlurClose: () => void;
	onClearClick: () => void;
	onEnterCustom: () => void;
	onEscapeReset: () => void;
	onFocus?: React.FocusEventHandler<HTMLInputElement>;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	onClick?: React.MouseEventHandler<HTMLInputElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

const SuggestFieldTrigger = forwardRef<HTMLInputElement, SuggestFieldTriggerProps>(
	function SuggestFieldTrigger(
		{
			ctx,
			inputId,
			inputText,
			highlightedIndex,
			label,
			size = 'md',
			width = 'full',
			labelPlacement = 'inline',
			placeholder,
			prefix,
			wrapperProps,
			disabled = false,
			error,
			helperText,
			isInteractive,
			isReadOnly,
			name,
			required,
			onInputChange,
			onBlurCommit,
			onFocusOpen,
			onBlurClose,
			onClearClick,
			onEnterCustom,
			onEscapeReset,
			onClear,
			clearLabel,
			onFocus,
			onBlur,
			onClick,
			onKeyDown,
		},
		ref,
	) {
		const handleComboboxKeyDown = useCustomSelectComboboxKeyboard({
			onEnter: onEnterCustom,
			onEscape: onEscapeReset,
		});
		const {onKeyDown: triggerKeyDown, onClick: triggerClick, ...restTriggerAttrs} = ctx.triggerAttrs;
		const activeDescendantId = highlightedIndex >= 0
			? getListboxOptionDomId(ctx.listboxId, highlightedIndex)
			: undefined;

		return (
			<div
				ref={ctx.triggerRef}
				{...wrapperProps}
			>
				<TextField
					ref={ref}
					{...restTriggerAttrs}
					id={inputId}
					name={name}
					required={required}
					label={label}
					size={size}
					width={width}
					labelPlacement={labelPlacement}
					placeholder={placeholder}
					prefix={prefix}
					value={inputText}
					onChange={onInputChange}
					disabled={disabled}
					readOnly={isReadOnly}
					error={error}
					helperText={helperText}
					active={ctx.open}
					type='text'
					role='combobox'
					aria-autocomplete='list'
					aria-haspopup='listbox'
					aria-controls={ctx.listboxId}
					aria-expanded={ctx.open}
					aria-activedescendant={activeDescendantId}
					autoComplete='off'
					onClear={onClear ? onClearClick : undefined}
					clearLabel={clearLabel}
					postfix={(
						<FieldBaseIcon>
							<CustomSelectChevron
								open={ctx.open}
								readOnly={isReadOnly}
							/>
						</FieldBaseIcon>
					)}
					onFocus={composeEventHandlers(onFocus, () => {
						if (!isInteractive) return;
						onFocusOpen();
					})}
					onBlur={composeEventHandlers(onBlur, () => {
						onBlurClose();
						onBlurCommit();
					})}
					onClick={composeEventHandlers(onClick, (event) => {
						triggerClick?.(event);
					})}
					onKeyDown={composeEventHandlers(onKeyDown, (event) => {
						handleComboboxKeyDown(event, triggerKeyDown);
					})}
				/>
			</div>
		);
	},
);

SuggestFieldTrigger.displayName = 'SuggestField.Trigger';

/**
 * Поле с подсказками из списка: фильтрация при вводе и выбор из dropdown.
 *
 * @component
 * @example
 * <SuggestField label="Город" options={cities} value={city} onChange={setCity} />
 */
export const SuggestField = forwardRef<HTMLInputElement, SuggestFieldProps>(({
	label,
	options,
	value: controlledValue,
	defaultValue = '',
	size = 'md',
	width = 'full',
	labelPlacement = 'inline',
	placeholder,
	prefix,
	postfix: _,
	className = '',
	error,
	helperText,
	name,
	required,
	disabled = false,
	readOnly = false,
	allowCustom = true,
	filterFn = defaultListboxFilterFn,
	noOptionsText: noOptionsTextProp,
	onChange,
	onClear,
	clearLabel,
	id: providedId,
	onFocus,
	onBlur,
	onClick,
	onKeyDown,
	...wrapperProps
}, ref) => {
	const {t} = useLocale();
	const generatedId = useId();
	const inputId = providedId ?? generatedId;
	const suggest = useSuggestInput({
		optionsList: options,
		controlledValue,
		defaultValue,
		disabled,
		readOnly,
		allowCustom,
		filterFn,
		onChange,
		onClear,
	});

	const renderTarget = useCallback((ctx: CustomSelectRenderTargetContext) => (
		<SuggestFieldTrigger
			ref={ref}
			ctx={ctx}
			inputId={inputId}
			inputText={suggest.inputText}
			highlightedIndex={suggest.highlightedIndex}
			label={label}
			size={size}
			width={width}
			labelPlacement={labelPlacement}
			placeholder={placeholder}
			prefix={prefix}
			wrapperProps={wrapperProps}
			disabled={disabled}
			error={error}
			helperText={helperText}
			isInteractive={suggest.isInteractive}
			isReadOnly={suggest.isReadOnly}
			name={name}
			required={required}
			onInputChange={(event) => suggest.handleInputChange(event.target.value)}
			onBlurCommit={suggest.handleBlurCommit}
			onFocusOpen={() => {
				suggest.setIsFocused(true);
				suggest.setIsOpen(true);
			}}
			onBlurClose={() => suggest.setIsFocused(false)}
			onClearClick={suggest.handleClear}
			onEnterCustom={suggest.handleEnterCustom}
			onEscapeReset={suggest.syncInputFromValue}
			onClear={onClear}
			clearLabel={clearLabel}
			onFocus={onFocus}
			onBlur={onBlur}
			onClick={onClick}
			onKeyDown={onKeyDown}
		/>
	), [
		clearLabel,
		disabled,
		error,
		helperText,
		inputId,
		label,
		labelPlacement,
		name,
		onBlur,
		onClear,
		onClick,
		onFocus,
		onKeyDown,
		placeholder,
		prefix,
		ref,
		required,
		size,
		suggest,
		width,
		wrapperProps,
	]);

	return (
		<CustomSelect.Root
			options={options}
			selectionMode='single'
			value={suggest.currentValue}
			onChange={suggest.handleValueChange}
			open={suggest.isOpen}
			onOpenChange={suggest.setIsOpen}
			disabled={disabled}
			readOnly={readOnly}
			filterFn={filterFn}
			filterQuery={suggest.inputText}
			renderTarget={renderTarget}
			widthMode='trigger'
			align='auto'
			triggerMode='combobox'
			mobileTitle={label}
			closeOnSelect
			className={cn(fieldPopupClassName, className)}
		>
			<CustomSelect.List
				aria-label={label}
				navigation='highlight'
				highlightedIndex={suggest.highlightedIndex}
				onHighlightChange={suggest.setHighlightedIndex}
				preventOptionMouseDown
				noOptionsText={noOptionsTextProp ?? t('suggestField.noOptions')}
				showCheck={false}
			/>
		</CustomSelect.Root>
	);
});

SuggestField.displayName = 'SuggestField';
