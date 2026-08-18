import type {SuggestFieldOption, SuggestFieldProps} from './SuggestField.types';
export type {
	SuggestFieldOption,
	SuggestFieldProps,
} from './SuggestField.types';

import React, {forwardRef, useCallback, useEffect, useId, useMemo, useState} from 'react';
import {TextField} from '../TextField/TextField';
import type {FieldBaseProps} from '../../base/FieldBase';
import {CustomSelect, type CustomSelectRenderTargetContext} from '../CustomSelect/CustomSelect';
import {useCustomSelectComboboxKeyboard} from '../CustomSelect/useCustomSelectComboboxKeyboard';
import {type ListboxFilterFn, defaultListboxFilterFn, getListboxDisplayValue, getListboxOptionDomId, getListboxOptionText, matchListboxOption} from '../../utils/listboxOptions';
import {CustomSelectChevron} from '../CustomSelect/CustomSelect';
import {FieldBase} from '../../base/FieldBase';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import styles from './SuggestField.module.css';

interface SuggestFieldTriggerProps extends Omit<
	FieldBaseProps,
	'value' | 'onChange' | 'postfix'
> {
	ctx: CustomSelectRenderTargetContext;
	inputId: string;
	inputText: string;
	highlightedIndex: number;
	placeholder?: string;
	wrapperClassName: string;
	className: string;
	wrapperProps: Omit<
		React.HTMLAttributes<HTMLDivElement>,
		'className' | 'onChange' | 'prefix' | 'onFocus' | 'onBlur' | 'onClick' | 'onKeyDown'
	>;
	isInteractive: boolean;
	isReadOnly: boolean;
	name?: string;
	required?: boolean;
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
			wrapperClassName,
			className,
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

		const {
			onKeyDown: triggerKeyDown,
			onClick: triggerClick,
			...restTriggerAttrs
		} = ctx.triggerAttrs;

		const activeDescendantId = highlightedIndex >= 0
			? getListboxOptionDomId(ctx.listboxId, highlightedIndex)
			: undefined;

		return (
			<div
				ref={ctx.triggerRef}
				{...wrapperProps}
				className={cn(
					styles.triggerWrap,
					width === 'full' && styles.fullWidth,
					wrapperClassName,
				)}
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
					className={className}
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
						<FieldBase.Icon>
							<CustomSelectChevron
								open={ctx.open}
								readOnly={isReadOnly}
							/>
						</FieldBase.Icon>
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
 * <SuggestField
 *   label="Город"
 *   options={cities}
 *   value={city}
 *   onChange={setCity}
 *   onClear={() => setCity('')}
 * />
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
	wrapperClassName = '',
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
	const noOptionsText = noOptionsTextProp ?? t('suggestField.noOptions');
	const generatedId = useId();
	const inputId = providedId ?? generatedId;

	const [internalValue, setInternalValue] = useState(defaultValue);
	const isControlled = controlledValue !== undefined;
	const currentValue = isControlled ? controlledValue : internalValue;

	const [isOpen, setIsOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [inputText, setInputText] = useState(() => getListboxDisplayValue(options, currentValue));
	const [highlightedIndex, setHighlightedIndex] = useState(-1);

	const isReadOnly = readOnly && !disabled;
	const isInteractive = !disabled && !isReadOnly;

	const filteredLen = useMemo(
		() => filterListboxLength(options, inputText, filterFn),
		[filterFn, inputText, options],
	);

	const syncInputFromValue = useCallback(() => {
		setInputText(getListboxDisplayValue(options, currentValue));
	}, [currentValue, options]);

	useEffect(() => {
		if (!isFocused) {
			syncInputFromValue();
		}
	}, [isFocused, syncInputFromValue]);

	useEffect(() => {
		if (!isOpen) {
			setHighlightedIndex(-1);
			return;
		}

		setHighlightedIndex((prev) => {
			if (filteredLen === 0) return -1;
			if (prev < 0) return 0;
			return Math.min(prev, filteredLen - 1);
		});
	}, [filteredLen, isOpen]);

	const commitValue = useCallback((nextValue: string, displayText?: string) => {
		if (!isControlled) {
			setInternalValue(nextValue);
		}
		onChange?.(nextValue);
		setInputText(displayText ?? getListboxDisplayValue(options, nextValue));
	}, [isControlled, onChange, options]);

	const handleClear = useCallback(() => {
		commitValue('');
		setIsOpen(false);
		onClear?.();
	}, [commitValue, onClear]);

	const handleValueChange = useCallback((next: string | string[]) => {
		const nextValue = typeof next === 'string' ? next : (next[0] ?? '');
		const option = options.find((item) => item.value === nextValue);
		commitValue(nextValue, option ? getListboxOptionText(option) : nextValue);
		setIsOpen(false);
	}, [commitValue, options]);

	const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		if (!isInteractive) return;

		const nextText = event.target.value;
		setInputText(nextText);
		setIsOpen(true);

		if (allowCustom) {
			if (!isControlled) {
				setInternalValue(nextText);
			}
			onChange?.(nextText);
		}
	}, [
		allowCustom,
		isControlled,
		isInteractive,
		onChange,
	]);

	const handleBlurCommit = useCallback(() => {
		if (allowCustom) {
			syncInputFromValue();
			return;
		}

		const matched = matchListboxOption(options, inputText);
		if (matched) {
			commitValue(matched.value);
			return;
		}

		syncInputFromValue();
	}, [
		allowCustom,
		commitValue,
		inputText,
		options,
		syncInputFromValue,
	]);

	const handleEnterCustom = useCallback(() => {
		if (allowCustom) {
			commitValue(inputText);
			setIsOpen(false);
			return;
		}

		const matched = matchListboxOption(options, inputText);
		if (matched) {
			commitValue(matched.value);
			setIsOpen(false);
		}
	}, [
		allowCustom,
		commitValue,
		inputText,
		options
	]);

	const renderTarget = useCallback((ctx: CustomSelectRenderTargetContext) => (
		<SuggestFieldTrigger
			ref={ref}
			ctx={ctx}
			inputId={inputId}
			inputText={inputText}
			highlightedIndex={highlightedIndex}
			label={label}
			size={size}
			width={width}
			labelPlacement={labelPlacement}
			placeholder={placeholder}
			prefix={prefix}
			wrapperClassName={wrapperClassName}
			className={className}
			wrapperProps={wrapperProps}
			disabled={disabled}
			error={error}
			helperText={helperText}
			isInteractive={isInteractive}
			isReadOnly={isReadOnly}
			name={name}
			required={required}
			onInputChange={handleInputChange}
			onBlurCommit={handleBlurCommit}
			onFocusOpen={() => {
				setIsFocused(true);
				setIsOpen(true);
			}}
			onBlurClose={() => setIsFocused(false)}
			onClearClick={handleClear}
			onEnterCustom={handleEnterCustom}
			onEscapeReset={syncInputFromValue}
			onClear={onClear}
			clearLabel={clearLabel}
			onFocus={onFocus}
			onBlur={onBlur}
			onClick={onClick}
			onKeyDown={onKeyDown}
		/>
	), [
		className,
		clearLabel,
		disabled,
		error,
		helperText,
		handleBlurCommit,
		handleClear,
		handleEnterCustom,
		handleInputChange,
		highlightedIndex,
		inputId,
		inputText,
		isInteractive,
		isReadOnly,
		label,
		labelPlacement,
		name,
		onClear,
		onFocus,
		onBlur,
		onClick,
		onKeyDown,
		placeholder,
		prefix,
		ref,
		required,
		size,
		syncInputFromValue,
		width,
		wrapperClassName,
		wrapperProps,
	]);

	return (
		<CustomSelect.Root
			options={options}
			selectionMode='single'
			value={currentValue}
			onChange={handleValueChange}
			open={isOpen}
			onOpenChange={setIsOpen}
			disabled={disabled}
			readOnly={readOnly}
			filterFn={filterFn}
			filterQuery={inputText}
			renderTarget={renderTarget}
			widthMode='trigger'
			align='auto'
			triggerMode='combobox'
			mobileTitle={label}
			closeOnSelect
		>
			<CustomSelect.List
				aria-label={label}
				navigation='highlight'
				highlightedIndex={highlightedIndex}
				onHighlightChange={setHighlightedIndex}
				preventOptionMouseDown
				noOptionsText={noOptionsText}
				showCheck={false}
			/>
		</CustomSelect.Root>
	);
});

function filterListboxLength(
	options: SuggestFieldOption[],
	query: string,
	filterFn: ListboxFilterFn<SuggestFieldOption>,
): number {
	if (!query.trim()) return options.length;
	return options.filter((option) => filterFn(option, query)).length;
}

SuggestField.displayName = 'SuggestField';
