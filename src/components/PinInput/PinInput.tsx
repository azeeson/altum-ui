import type {PinInputProps} from './PinInput.types';
export type {PinInputProps} from './PinInput.types';

import {forwardRef, useId, type ClipboardEvent, type KeyboardEvent, type MutableRefObject} from 'react';
import styles from './PinInput.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../../locales/localeContext';
import {FieldBase, fieldChromeClassName, useFieldControlAttrs} from '../../base/FieldBase';
import {useOtpInputs} from '../../hooks/useOtpInputs';

function PinGroup({
	chars,
	value,
	name,
	numeric,
	masked,
	disabled,
	autoFocus,
	error,
	ariaLabel,
	groupId,
	inputsRef,
	onChange,
	onKeyDown,
	onPaste,
}: {
	chars: string[];
	value: string;
	name?: string;
	numeric: boolean;
	masked: boolean;
	disabled: boolean;
	autoFocus: boolean;
	error?: boolean | string;
	ariaLabel: string;
	groupId: string;
	inputsRef: MutableRefObject<Array<HTMLInputElement | null>>;
	onChange: (index: number, raw: string) => void;
	onKeyDown: (index: number, event: KeyboardEvent<HTMLInputElement>) => void;
	onPaste: (index: number, event: ClipboardEvent<HTMLInputElement>) => void;
}) {
	const {id: _ignoredId, ...a11y} = useFieldControlAttrs({'aria-label': ariaLabel});
	void _ignoredId;
	const hasError = !!error;
	const {t} = useLocale();
	return (
		<div
			className={cn(styles.group, hasError ? styles.groupError : '')}
			role='group'
			id={groupId}
			{...a11y}
		>
			{name ? (
				<input
					type='hidden'
					name={name}
					value={value}
				/>
			) : null}
			{chars.map((char, index) => (
				<input
					key={index}
					id={index === 0 ? `${groupId}-0` : undefined}
					ref={(node) => {
						inputsRef.current[index] = node;
					}}
					className={cn(fieldChromeClassName(), styles.cell)}
					type={masked ? 'password' : 'text'}
					inputMode={numeric ? 'numeric' : 'text'}
					autoComplete={index === 0 ? 'one-time-code' : 'off'}
					maxLength={chars.length}
					value={char}
					disabled={disabled}
					aria-invalid={hasError || undefined}
					aria-label={t('pinInput.digit', {index: index + 1})}
					autoFocus={autoFocus && index === 0}
					onChange={(event) => onChange(index, event.target.value)}
					onKeyDown={(event) => onKeyDown(index, event)}
					onPaste={(event) => onPaste(index, event)}
					onFocus={(event) => event.currentTarget.select()}
				/>
			))}
		</div>
	);
}

/**
 * Поле ввода PIN / OTP (2FA, код из SMS).
 *
 * @component
 * @example
 * <PinInput length={6} value={code} onChange={setCode} onComplete={verify} />
 */
export const PinInput = forwardRef<HTMLDivElement, PinInputProps>(function PinInput(
	{
		length = 6,
		size = 'md',
		value: controlledValue,
		defaultValue = '',
		onChange,
		onComplete,
		numeric = true,
		disabled = false,
		masked = false,
		autoFocus = false,
		'aria-label': ariaLabel,
		className,
		style,
		error,
		label,
		helperText,
		name,
		labelPlacement = 'none',
		width = 'full',
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const groupId = useId();
	const otp = useOtpInputs({
		length,
		numeric,
		value: controlledValue,
		defaultValue,
		disabled,
		onChange,
		onComplete,
	});

	return (
		<FieldBase
			ref={ref}
			label={label ?? ''}
			size={size}
			width={width}
			labelPlacement={labelPlacement}
			error={error}
			helperText={helperText}
			disabled={disabled}
			hasValue={otp.value.length > 0}
			chrome={false}
			className={cn(styles.root, className)}
			id={`${groupId}-0`}
			style={style}
			{...rest}
		>
			<PinGroup
				chars={otp.chars}
				value={otp.value}
				name={name}
				numeric={numeric}
				masked={masked}
				disabled={disabled}
				autoFocus={autoFocus}
				error={error}
				ariaLabel={ariaLabel ?? label ?? t('pinInput.ariaLabel')}
				groupId={groupId}
				inputsRef={otp.inputsRef}
				onChange={otp.handleChange}
				onKeyDown={otp.handleKeyDown}
				onPaste={otp.handlePaste}
			/>
		</FieldBase>
	);
});

PinInput.displayName = 'PinInput';
