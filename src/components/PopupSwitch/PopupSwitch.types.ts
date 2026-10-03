import type {ReactNode, Ref} from 'react';
import type {ControlSize} from '../../types';

/**
 * Пункт `PopupSwitch`.
 *
 * @template T - Тип значения: строка или число.
 */
export interface PopupSwitchOption<T extends string | number = string> {
	value: T;
	label: string;
	icon?: ReactNode;
}

/** Визуальный вариант кнопки-триггера. */
export type PopupSwitchVariant = 'secondary' | 'tinted' | 'ghost';

/**
 * Ширина кнопки.
 * `auto` — по выбранной подписи, `options` — по самой длинной подписи в списке.
 */
export type PopupSwitchWidth = 'auto' | 'options';

/**
 * Горизонтальное выравнивание панели относительно кнопки.
 * `start` — левый край, `center` — центр, `end` — правый край.
 */
export type PopupSwitchAlign = 'start' | 'center' | 'end';

/**
 * Свойства `PopupSwitch`.
 * Контролируемый выбор одного значения: кнопка показывает текущий пункт,
 * список открывается под кнопкой силами CSS Anchor Positioning.
 *
 * @template T - Тип значения опций.
 */
export interface PopupSwitchProps<T extends string | number = string> {
	value: T;
	options: Array<PopupSwitchOption<T>>;
	onChange: (value: T) => void;
	disabled?: boolean;
	/** Кнопка-триггер. */
	rootRef?: Ref<HTMLButtonElement>;
	/** Класс кнопки-триггера. */
	className?: string;
	/** Текст кнопки, если `value` нет среди опций. */
	placeholder?: string;
	/** @default 'md' */
	size?: ControlSize;
	/** @default 'secondary' */
	variant?: PopupSwitchVariant;
	/**
	 * `options` держит ширину по самой длинной подписи, чтобы кнопка не прыгала.
	 * @default 'auto'
	 */
	width?: PopupSwitchWidth;
	/**
	 * Горизонталь панели относительно кнопки.
	 * @default 'start'
	 */
	align?: PopupSwitchAlign;
	'aria-label'?: string;
}
