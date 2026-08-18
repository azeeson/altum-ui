import {type TextFieldProps} from '../TextField/TextField';

/**
 * Оценка сложности пароля (`PasswordStrength`).
 */
export type PasswordStrength = 'empty' | 'weak' | 'fair' | 'good' | 'strong';

/**
 * Свойства `PasswordField`.
 */
export interface PasswordFieldProps extends Omit<TextFieldProps, 'type' | 'postfix'> {
	/** Начальная видимость (неконтролируемая). @default false */
	defaultVisible?: boolean;
	/** Контролируемая видимость */
	visible?: boolean;
	onVisibleChange?: (visible: boolean) => void;
	/** `aria-label` для «показать пароль». @default 'Показать пароль' */
	showPasswordLabel?: string;
	/** `aria-label` для «скрыть пароль». @default 'Скрыть пароль' */
	hidePasswordLabel?: string;
	/** Показать индикатор сложности. @default false */
	showStrength?: boolean;
	/** Подписи уровней сложности */
	strengthLabels?: Partial<Record<Exclude<PasswordStrength, 'empty'>, string>>;
}
