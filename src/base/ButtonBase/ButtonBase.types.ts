import type React from 'react';
import type {
	ComponentPropsWithRef,
} from 'react';
import type {ControlSize} from '../../types';

/**
 * Визуальный variant кнопки.
 */
export type ButtonVariant = 'primary' | 'tinted' | 'secondary' | 'ghost' | 'link';

/**
 * Семантический статус (нейтральный / опасное действие).
 */
export type ButtonStatus = 'default' | 'danger';

/** Корень `ButtonBase`. */
export type ButtonBaseAs = 'button' | 'a';

export type ButtonBaseRef<T extends ButtonBaseAs> = T extends 'a'
	? HTMLAnchorElement
	: HTMLButtonElement;

type ButtonBaseOwnProps = {
	/** @default 'primary' */
	variant?: ButtonVariant;
	/** @default 'default' */
	status?: ButtonStatus;
	/** @default 'md' */
	size?: ControlSize;
	/**
	 * Toggle-состояние. Если задано — `aria-pressed` и приглушённый вид до активации.
	 */
	active?: boolean;
	/**
	 * На `<button>` — HTML `disabled`. На `as="a"` — `aria-disabled`, `tabIndex={-1}`
	 * и `pointer-events: none` (у якоря нет `disabled`).
	 */
	disabled?: boolean;
	/** Только для `as="button"`. @default `'button'` */
	type?: 'button' | 'submit' | 'reset';
	children?: React.ReactNode;
};

/**
 * Свойства примитива `ButtonBase`.
 * `as="a"` даёт якорь-атрибуты и `Ref<HTMLAnchorElement>`; `disabled` не ставится на DOM.
 */
export type ButtonBaseProps<T extends ButtonBaseAs = 'button'> =
	ButtonBaseOwnProps
	& Omit<ComponentPropsWithRef<T>, keyof ButtonBaseOwnProps | 'as'>
	& {
		/** Корень. На `<a>` не ставится `type`. @default `'button'` */
		as?: T;
	};
