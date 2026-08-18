import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Status / цвет бейджа (`BadgeVariant`) — как у Tag.
 */
export type BadgeVariant =
	| 'error'
	| 'success'
	| 'info'
	| 'warning'
	| 'primary'
	| 'secondary';

export type BadgeSize = 'sm' | 'md';

export type BadgePosition = 'overlay' | 'standalone';

/**
 * Свойства `Badge`.
 */
export interface BadgeProps extends ComponentPropsWithoutRef<'div'> {
	/** Текст / число бейджа. `children` — якорь overlay. */
	label?: React.ReactNode;
	/** Компактный индикатор без числа — только точка */
	dot?: boolean;
	/**
	 * Цвет. @default 'error'
	 */
	variant?: BadgeVariant;
	/** @default 'md' */
	size?: BadgeSize;
	/**
	 * `standalone` — inline-бейдж без children / без absolute.
	 * @default overlay если есть children, иначе standalone
	 */
	position?: BadgePosition;
	/**
	 * Ограничивает числовой `label`: при превышении показывает `{max}+`.
	 * `false` — не ограничивать. По умолчанию `9`, если `label` — число.
	 */
	max?: number | false;
}

export interface BadgeCounterProps extends Omit<BadgeProps, 'label' | 'dot'> {
	counter: number;
	children?: React.ReactNode;
}
