import type {PasswordFieldProps, PasswordStrength} from './PasswordField.types';
export type {PasswordStrength, PasswordFieldProps} from './PasswordField.types';

import {useState} from 'react';
import {TextField, FieldBaseButton} from '../TextField/TextField';
import {IconPreview} from '../../icons/icons/IconPreview';
import {IconPreviewOff} from '../../icons/icons/IconPreviewOff';
import {Text} from '../Text/Text';
import {FormMessage} from '../FormMessage/FormMessage';
import fieldMessage from '../../styles/fieldMessage.module.css';
import styles from './PasswordField.module.css';
import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';
import {useFallbackId} from '../../hooks/useFallbackId';
import {ruSlice as ru_password} from '../../locales/slices/password.ru';

const localeFallback = {
	password: ru_password,
};

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
export function PasswordField({
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
	description,
	'aria-describedby': ariaDescribedBy,
	id: providedId,
	inputRef,
	...props
}: PasswordFieldProps) {
	const {t} = useLocale(localeFallback);
	const id = useFallbackId(providedId);
	const strengthId = `${id}-strength`;
	const [localVisible, setLocalVisible] = useState(defaultVisible);
	const isControlledVisible = controlledVisible !== undefined;
	const visible = isControlledVisible ? controlledVisible : localVisible;
	const password = String(value ?? defaultValue ?? '');
	const strength = getPasswordStrength(password);
	const labels = {
		weak: t('password.strength.weak'),
		fair: t('password.strength.fair'),
		good: t('password.strength.good'),
		strong: t('password.strength.strong'),
		...strengthLabels,
	};

	const toggleVisible = () => {
		const next = !visible;
		if (!isControlledVisible) setLocalVisible(next);
		onVisibleChange?.(next);
	};

	const strengthMeter = showStrength && strength !== 'empty' ? (
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
			<div className={styles.strengthTrack} aria-hidden>
				{Array.from({length: 4}, (_, i) => (
					<span key={i} className={styles.strengthSeg} />
				))}
			</div>
			<Text
				as='span'
				size='xs'
				color={strength === 'weak' ? 'error' : strength === 'strong' ? 'success' : 'muted'}
				className={styles.strengthLabel}
			>
				{labels[strength]}
			</Text>
		</div>
	) : null;
	const describedBy = [ariaDescribedBy, strengthMeter ? strengthId : undefined]
		.filter(Boolean)
		.join(' ') || undefined;

	return (
		<TextField
			inputRef={inputRef}
			id={id}
			{...props}
			type={visible ? 'text' : 'password'}
			value={value}
			defaultValue={defaultValue}
			autoComplete={props.autoComplete ?? 'current-password'}
			aria-describedby={describedBy}
			description={(
				<>
					{description ? (
						<FormMessage>
							{description}
						</FormMessage>
					) : null}
					{strengthMeter}
				</>
			)}
			onChange={onChange}
			postfix={(
				<FieldBaseButton
					aria-label={visible
						? hidePasswordLabel ?? t('password.hide')
						: showPasswordLabel ?? t('password.reveal')}
					aria-pressed={visible}
					onClick={toggleVisible}
					icon={visible ? <IconPreviewOff size={16} /> : <IconPreview size={16} />}
				/>
			)}
		/>
	);
}
