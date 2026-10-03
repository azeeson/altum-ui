import type {
	FieldBaseButtonProps,
	FieldBaseIconProps,
	TextFieldAs,
	TextFieldProps,
} from './TextField.types';
export type {
	ControlSize,
	FieldWidth,
	FieldBaseProps,
	FieldBaseButtonProps,
	FieldBaseIconProps,
	TextFieldAs,
	TextFieldRef,
	TextFieldProps,
} from './TextField.types';

import {
	type ChangeEvent,
	type ComponentPropsWithoutRef,
	type MouseEvent,
	type ReactNode,
	type Ref,
} from 'react';
import styles from './TextField.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import {cn} from '../../core/utils/cn';
import {IconCross} from '../../icons/icons/IconCross';
import {useLocale} from '../../locales/localeContext';
import {useControlledState} from '../../hooks/useControlledState';
import {FormMessage} from '../FormMessage/FormMessage';
import {getFormControlState} from '../../core/utils/form';
import {useFallbackId} from '../../hooks/useFallbackId';
import {ariaIds, uEv} from '../../core/utils/bundle';
import {resolveFieldMessages} from '../../core/utils/fieldMessage';
import {ruSlice as ru_common} from '../../locales/slices/common.ru';

const localeFallback = {
	common: ru_common,
};

type TextFieldRenderProps = Omit<TextFieldProps<'input'>, 'as' | 'inputRef' | 'children'> & {
	as?: TextFieldAs;
	inputRef?: Ref<HTMLElement | null>;
	rows?: number;
	children?: ReactNode;
};

function hostProps<E extends 'input' | 'textarea' | 'button' | 'div'>(props: object) {
	return props as ComponentPropsWithoutRef<E>;
}

/** Абсолютный слой поверх control (маска). */
export function fieldOverlayClassName(): string {
	return styles.controlOverlay;
}

/**
 * Affix-кнопка внутри prefix/postfix поля.
 *
 * @component
 * @example
 * <TextField postfix={<FieldBaseButton aria-label="Время" icon={<IconClock />} />} />
 */
export function FieldBaseButton({
	className,
	icon,
	children,
	type = 'button',
	rootRef,
	...props
}: FieldBaseButtonProps) {
	return (
		<button
			ref={rootRef}
			type={type}
			className={cn(unstyled.control, styles.affixButton, className)}
			{...props}
		>
			{icon ?? children}
		</button>
	);
}

/**
 * Декоративная иконка affix поля.
 *
 * @component
 * @example
 * <TextField prefix={<FieldBaseIcon><IconSearch /></FieldBaseIcon>} />
 */
export function FieldBaseIcon({
	className,
	children,
	rootRef,
	...props
}: FieldBaseIconProps) {
	return (
		<span
			ref={rootRef}
			className={cn(styles.affixIcon, className)}
			{...props}
		>
			{children}
		</span>
	);
}

/**
 * Текстовое поле с floating-лейблом (внутри chrome), prefix/postfix,
 * очисткой и состояниями ошибки.
 * `as` меняет control: `input` (по умолчанию), `textarea`, либо хост `button` / `div`.
 *
 * @component
 * @example
 * <TextField
 *   label="Эл. почта"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   onClear={() => setEmail('')}
 *   width="full"
 * />
 */
export function TextField<T extends TextFieldAs = 'input'>(props: TextFieldProps<T>) {
	const {
		as = 'input',
		label,
		size = 'md',
		width = 'full',
		prefix,
		postfix,
		wrapperClassName,
		rootRef,
		wrapperProps,
		className,
		id: providedId,
		placeholder,
		type,
		disabled,
		readOnly,
		error,
		description,
		active,
		value,
		defaultValue,
		onChange,
		onFocus,
		onBlur,
		onClear,
		clearLabel,
		keepPlaceholder = false,
		controlOverlay,
		style,
		hasValue,
		children,
		inputRef,
		'aria-describedby': ariaDescribedBy,
		'aria-label': ariaLabelProp,
		...restProps
	} = props as TextFieldRenderProps;
	const {t} = useLocale(localeFallback);
	const isTextControl = as === 'input' || as === 'textarea';
	const hasLabel = Boolean(label);
	const id = useFallbackId(providedId);
	const [currentValue, setUncontrolled, isControlled] = useControlledState(
		isTextControl && value !== undefined ? String(value) : undefined,
		isTextControl && defaultValue !== undefined ? String(defaultValue) : '',
	);
	const {isReadOnly} = getFormControlState({
		disabled,
		readOnly,
	});
	/* Пробел — для `:placeholder-shown` (clear) и маски, когда placeholder не задан. */
	const resolvedPlaceholder = placeholder?.trim() ? placeholder : ' ';
	const {
		className: wrapperPropsClassName,
		...wrapperRest
	} = wrapperProps ?? {};
	const {
		hasError,
		isDescriptionText,
		errorId,
		descriptionId,
		describedBy,
	} = resolveFieldMessages(id, {
		error,
		description,
	});
	const filled = hasValue || (isTextControl && Boolean(isControlled ? value : currentValue));
	const controlClassName = cn(styles.controlSurface, className);
	const clearField = () => {
		if (!isControlled) setUncontrolled('');
		onClear?.();
	};
	const keepChromeEvent = (event: MouseEvent<HTMLDivElement>) => {
		if (event.target !== event.currentTarget) return;
		event.stopPropagation();
	};
	const focusControl = (event: MouseEvent<HTMLDivElement>) => {
		if (event.target !== event.currentTarget) return;
		const control = event.currentTarget.querySelector<HTMLElement>('[data-field-control]');
		if (!control || control.hasAttribute('disabled')) return;
		control.focus();
		control.click();
	};
	const controlProps = {
		id,
		style,
		'aria-invalid': hasError || undefined,
		'aria-describedby': ariaIds(describedBy, ariaDescribedBy),
		'data-keep-placeholder': keepPlaceholder ? '' as const : undefined,
		'aria-label': hasLabel ? undefined : ariaLabelProp,
		'aria-readonly': isReadOnly || undefined,
		className: controlClassName,
		onFocus,
		onBlur,
		'data-field-control': '' as const,
	};
	const handleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		(onChange as ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) | undefined)?.(event);
		if (!isControlled) setUncontrolled(event.target.value);
	};

	return (
		<div
			ref={rootRef as Ref<HTMLDivElement>}
			className={cn(styles.root, wrapperClassName, wrapperPropsClassName)}
			{...wrapperRest}
			data-field=''
			data-field-label={hasLabel ? '' : undefined}
			data-size={size !== 'md' ? size : undefined}
			data-width={width !== 'full' ? width : undefined}
			data-error={hasError ? '' : undefined}
			data-disabled={disabled ? '' : undefined}
			data-readonly={isReadOnly ? '' : undefined}
			data-has-value={filled ? '' : undefined}
			data-active={active ? '' : undefined}
		>
			<div
				className={styles.chrome}
				data-field-chrome=''
				onMouseDown={keepChromeEvent}
				onClick={focusControl}
			>
				{prefix ? (
					<span className={styles.prefix}>
						{prefix}
					</span>
				) : null}
				<div className={styles.controlSlot}>
					{hasLabel ? (
						<label
							className={styles.label}
							htmlFor={id}
						>
							{label}
						</label>
					) : null}
					{as === 'input' ? (
						<input
							{...hostProps<'input'>({
								...restProps,
								...controlProps,
								ref: inputRef,
								disabled,
								readOnly: isReadOnly,
								value: isControlled ? value : currentValue,
								placeholder: resolvedPlaceholder,
								type: type ?? 'text',
								onChange: handleTextChange,
							})}
						/>
					) : null}
					{as === 'textarea' ? (
						<textarea
							{...hostProps<'textarea'>({
								...restProps,
								...controlProps,
								ref: inputRef,
								disabled,
								readOnly: isReadOnly,
								value: isControlled ? value : currentValue,
								placeholder: resolvedPlaceholder,
								onChange: handleTextChange,
							})}
						/>
					) : null}
					{as === 'button' ? (
						<button
							{...hostProps<'button'>({
								...restProps,
								...controlProps,
								ref: inputRef,
								disabled,
								type: (type as 'button' | 'submit' | 'reset' | undefined) ?? 'button',
								children,
							})}
						/>
					) : null}
					{as === 'div' ? (
						<div
							{...hostProps<'div'>({
								...restProps,
								...controlProps,
								ref: inputRef,
								children,
							})}
						/>
					) : null}
					{controlOverlay}
				</div>
				{(onClear || postfix) ? (
					<span className={styles.postfix}>
						{onClear ? (
							<FieldBaseButton
								className={styles.clearButton}
								aria-label={clearLabel ?? t('common.clear')}
								icon={<IconCross size={12} aria-hidden />}
								onClick={uEv(clearField, true)}
								onMouseDown={uEv(undefined, false, true)}
							/>
						) : null}
						{postfix}
					</span>
				) : null}
			</div>
			{isDescriptionText && !hasError ? (
				<FormMessage id={descriptionId}>
					{description}
				</FormMessage>
			) : null}
			{typeof error === 'string' ? (
				<FormMessage variant='error' id={errorId}>
					{error}
				</FormMessage>
			) : null}
			{!isDescriptionText ? description : null}
		</div>
	);
}
