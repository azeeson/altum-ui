import type React from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {type ButtonVariant, type ButtonStatus} from '../../base/ButtonBase';
import type {ControlSize} from '../../types';

/**
 * Свойства корня `ButtonGroup`.
 */
export interface ButtonGroupRootProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children: React.ReactNode;
	/** @default 'secondary' */
	variant?: ButtonVariant;
	/** @default 'default' */
	status?: ButtonStatus;
	/** @default 'md' */
	size?: ControlSize;
	disabled?: boolean;
	/**
	 * Без рамки у трека (для `secondary` / `ghost` / `tinted` / `link`).
	 * @default false
	 */
	borderless?: boolean;
	/**
	 * Roving tabindex внутри группы (по умолчанию true).
	 * `false` — кнопки не в tab-порядке (удобно для спиннеров NumberField).
	 */
	focusable?: boolean;
	/**
	 * `auto` — intrinsic width; `full` — растянуть на колонку формы.
	 * @default 'auto'
	 */
	width?: 'auto' | 'full';
	'aria-label'?: string;
}

/**
 * Свойства `ButtonGroup.Item`.
 * Стили (`variant` / `status` / `size`) задаются на Root.
 */
export interface ButtonGroupItemProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
	/** Toggle-состояние (включена / выключена). */
	active?: boolean;
	/** Иконка слева от текста. */
	icon?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
}
