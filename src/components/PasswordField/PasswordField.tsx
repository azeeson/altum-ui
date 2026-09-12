import type {
	PasswordStrength,
	PasswordFieldProps,
} from './PasswordField.types';
export type {
	PasswordStrength,
	PasswordFieldProps,
} from './PasswordField.types';

import {forwardRef, useId, useState} from 'react';
import {TextField} from '../TextField/TextField';
import {FieldBaseButton} from '../../base/FieldBase';
import {IconPreview} from '../../icons/icons/IconPreview';
import {IconPreviewOff} from '../../icons/icons/IconPreviewOff';
import {Text} from '../Text/Text';
import fieldMessage from '../../styles/fieldMessage.module.css';
import styles from './PasswordField.module.css';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {useLocale} from '../../locales/localeContext';

const STRENGTH_NOW = {
	weak: 1,
	fair: 2,
	good: 3,
	strong: 4,
} as const;

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
 * <PasswordField label="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} showStrength />
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
		'aria-describedby': ariaDescribedBy,
		...props
	},
	ref,
) {
	const {t} = useLocale();
	const strengthId = useId();
	const [visible, setVisible] = useControlledStateWithCallback(
		controlledVisible,
		defaultVisible,
		onVisibleChange,
	);
	const [uncontrolled, setUncontrolled] = useState(
		() => String(defaultValue ?? ''),
	);
	const password = value !== undefined ? String(value) : uncontrolled;
	const strength = getPasswordStrength(password);
	const labels = {
		weak: t('password.strength.weak'),
		fair: t('password.strength.fair'),
		good: t('password.strength.good'),
		strong: t('password.strength.strong'),
		...strengthLabels,
	};
	const describedBy = [ariaDescribedBy, showStrength && strength !== 'empty' ? strengthId : undefined]
		.filter(Boolean)
		.join(' ') || undefined;

	return (
		<TextField
			ref={ref}
			{...props}
			type={visible ? 'text' : 'password'}
			value={value}
			defaultValue={defaultValue}
			autoComplete={props.autoComplete ?? 'current-password'}
			aria-describedby={describedBy}
			onChange={composeEventHandlers(onChange, (event) => {
				if (value === undefined) setUncontrolled(event.target.value);
			})}
			postfix={(
				<FieldBaseButton
					aria-label={visible ? hidePasswordLabel ?? t('password.hide') : showPasswordLabel ?? t('password.reveal')}
					aria-pressed={visible}
					onClick={() => setVisible(!visible)}
					icon={visible ? <IconPreviewOff size={16} /> : <IconPreview size={16} />}
				/>
			)}
			footer={showStrength && strength !== 'empty' ? (
				<div
					id={strengthId}
					className={cn(fieldMessage.message, styles.strength)}
					data-strength={strength}
					role='meter'
					aria-valuemin={1}
					aria-valuemax={4}
					aria-valuenow={STRENGTH_NOW[strength]}
					aria-label={labels[strength]}
				>
					<div className={styles.strengthTrack} aria-hidden />
					<Text
						as='span'
						size='xs'
						color={strength === 'weak' ? 'error' : strength === 'strong' ? 'success' : 'muted'}
						className={styles.strengthLabel}
					>
						{labels[strength]}
					</Text>
				</div>
			) : undefined}
		/>
	);
});

PasswordField.displayName = 'PasswordField';
