import type {
	AnchorHTMLAttributes,
	ButtonHTMLAttributes,
	ReactNode,
	Ref,
} from 'react';
import type {ControlSize} from '../../types';

/**
 * Визуальный variant кнопки.
 */
export type ButtonVariant =
	| 'primary'
	| 'tinted'
	| 'secondary'
	| 'danger'
	| 'danger_tinted'
	| 'ghost'
	| 'link';

/** Корень `Button`. */
export type ButtonAs = 'button' | 'a';

type ButtonChrome = {
	/** @default 'primary' */
	variant?: ButtonVariant;
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
	children?: ReactNode;
	prefix?: ReactNode;
	postfix?: ReactNode;
	/** Состояние загрузки: спиннер, клики блокируются, заливка как у enabled. */
	loading?: boolean;
	fullWidth?: boolean;
	className?: string;
	/** Корень. На `<a>` не ставится `type`. @default `'button'` */
	as?: ButtonAs;
	/** Только для `as="button"`. @default `'button'` */
	type?: 'button' | 'submit' | 'reset';
	/** `<button>` или `<a>`. */
	rootRef?: Ref<HTMLButtonElement | HTMLAnchorElement>;
	href?: string;
	target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
	rel?: string;
	download?: AnchorHTMLAttributes<HTMLAnchorElement>['download'];
};

/**
 * Свойства `Button`.
 * `as="a"` даёт якорь; `disabled` на якорь не ставится.
 */
export type ButtonProps = ButtonChrome & Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	keyof ButtonChrome
>;
