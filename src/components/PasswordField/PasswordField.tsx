import type {
	PasswordStrength,
	PasswordFieldProps,
} from './PasswordField.types';
export type {
	PasswordStrength,
	PasswordFieldProps,
} from './PasswordField.types';

import React, {forwardRef, useId, useState} from 'react';
import {TextField} from '../TextField/TextField';
import {FieldBase} from '../../base/FieldBase';
import {IconPreview} from '../../icons/icons/IconPreview';
import {IconPreviewOff} from '../../icons/icons/IconPreviewOff';
import {FormMessage} from '../FormMessage/FormMessage';
import styles from './PasswordField.module.css';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useLocale} from '../LocaleProvider/LocaleProvider';

/**
 * Оценивает сложность пароля по длине и разнообразию символов.
 * @param password - Строка пароля.
 * @returns Уровень `PasswordStrength`.
 */
export function getPasswordStrength(password: string): PasswordStrength {
	if (!password) return 'empty';

	let score = 0;
	if (password.length >= 8) score += 1;
	if (password.length >= 12) score += 1;
	if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
	if (/\d/.test(password)) score += 1;
	if (/[^A-Za-z0-9]/.test(password)) score += 1;

	if (score <= 1) return 'weak';
	if (score === 2) return 'fair';
	if (score === 3) return 'good';
	return 'strong';
}

/**
 * Поле пароля на базе TextField: показать/скрыть и опциональный strength-meter.
 *
 * @component
 * @example
 * <PasswordField
 *   label="Пароль"
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   onClear={() => setPassword('')}
 *   showStrength
 * />
 */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
	{
		defaultVisible = false,
		visible: controlledVisible,
		onVisibleChange,
		showPasswordLabel,
		hidePasswordLabel,
		showStrength = false,
		strengthLabels,
		value,
		defaultValue,
		onChange,
		wrapperClassName = '',
		'aria-describedby': ariaDescribedBy,
		...props
	},
	ref,
) {
	const {t} = useLocale();
	const strengthId = useId();
	const [uncontrolledVisible, setUncontrolledVisible] = useState(defaultVisible);
	const [uncontrolledValue, setUncontrolledValue] = useState(
		defaultValue !== undefined ? String(defaultValue) : '',
	);

	const isVisibleControlled = controlledVisible !== undefined;
	const visible = isVisibleControlled ? controlledVisible : uncontrolledVisible;

	const isValueControlled = value !== undefined;
	const currentValue = isValueControlled ? String(value ?? '') : uncontrolledValue;
	const strength = getPasswordStrength(currentValue);
	const labels = {
		weak: t('password.strength.weak'),
		fair: t('password.strength.fair'),
		good: t('password.strength.good'),
		strong: t('password.strength.strong'),
		...strengthLabels,
	};

	const setVisible = (next: boolean) => {
		if (!isVisibleControlled) {
			setUncontrolledVisible(next);
		}
		onVisibleChange?.(next);
	};

	const describedBy = [ariaDescribedBy, showStrength && strength !== 'empty' ? strengthId : undefined]
		.filter(Boolean)
		.join(' ') || undefined;

	const toggleButton = (
		<FieldBase.Button
			type='button'
			aria-label={visible ? hidePasswordLabel ?? t('password.hide') : showPasswordLabel ?? t('password.reveal')}
			aria-pressed={visible}
			onClick={(event) => {
				event.preventDefault();
				event.stopPropagation();
				setVisible(!visible);
			}}
			icon={visible ? <IconPreviewOff size={16} /> : <IconPreview size={16} />}
		/>
	);

	return (
		<div className={styles.root}>
			<TextField
				ref={ref}
				{...props}
				type={visible ? 'text' : 'password'}
				value={value}
				defaultValue={defaultValue}
				wrapperClassName={wrapperClassName}
				autoComplete={props.autoComplete ?? 'current-password'}
				postfix={toggleButton}
				aria-describedby={describedBy}
				onChange={composeEventHandlers(onChange, (event) => {
					if (!isValueControlled) {
						setUncontrolledValue(event.target.value);
					}
				})}
			/>
			{showStrength && strength !== 'empty' && (
				<div
					id={strengthId}
					className={styles.strength}
					data-strength={strength}
					role='meter'
					aria-valuemin={1}
					aria-valuemax={4}
					aria-valuenow={
						strength === 'weak' ? 1
							: strength === 'fair' ? 2
								: strength === 'good' ? 3
									: 4
					}
					aria-label={labels[strength]}
				>
					<div className={styles.strengthTrack} aria-hidden>
						<span className={styles.strengthBar} data-level='1' />
						<span className={styles.strengthBar} data-level='2' />
						<span className={styles.strengthBar} data-level='3' />
						<span className={styles.strengthBar} data-level='4' />
					</div>
					<FormMessage
						variant={strength === 'weak' ? 'error' : strength === 'strong' ? 'success' : 'hint'}
						className={styles.strengthLabel}
					>
						{labels[strength]}
					</FormMessage>
				</div>
			)}
		</div>
	);
});

PasswordField.displayName = 'PasswordField';
