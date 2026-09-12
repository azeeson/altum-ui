import type React from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {type ButtonVariant, type ButtonStatus} from '../../base/ButtonBase';
import type {ControlSize} from '../../types';

/**
 * Режим группы.
 *
 * - `button` — независимые кнопки; выбранность только через `active` на Item
 * - `toggle` — один выбранный Item (`value: string`)
 * - `multi_toggle` — несколько выбранных (`value: string[]`)
 */
export type ButtonGroupMode = 'button' | 'toggle' | 'multi_toggle';

/**
 * Ширина пунктов при растянутой группе:
 * - `equal` — равные доли трека
 * - `content` — от контента, остаток делится поровну; суммарно 100% трека
 */
export type ButtonGroupItemFit = 'equal' | 'content';

/** Заливка трека: варианты кнопки плюс `plain` (как SegmentedControl). */
export type ButtonGroupVariant = ButtonVariant | 'plain';

/**
 * Свойства корня `ButtonGroup`.
 */
export interface ButtonGroupRootProps extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'children' | 'onChange' | 'defaultValue'
> {
	children: React.ReactNode;
	/**
	 * @default 'button'
	 */
	mode?: ButtonGroupMode;
	/** @default 'secondary' */
	variant?: ButtonGroupVariant;
	/** @default 'default' */
	status?: ButtonStatus;
	/** @default 'md' */
	size?: ControlSize;
	disabled?: boolean;
	readOnly?: boolean;
	/**
	 * Без рамки у трека (для `secondary` / `ghost` / `tinted` / `link`).
	 * @default false
	 */
	borderless?: boolean;
	/**
	 * Roving tabindex внутри группы (по умолчанию true).
	 * `false` — кнопки не в tab-порядке.
	 */
	focusable?: boolean;
	/**
	 * `auto` — intrinsic width; `full` — растянуть на колонку формы.
	 * @default 'auto'
	 */
	width?: 'auto' | 'full';
	/**
	 * Ширина пунктов. Имеет смысл при `width="full"` (и у SegmentedControl).
	 * @default 'equal'
	 */
	itemFit?: ButtonGroupItemFit;
	/**
	 * Выбранное значение: строка для `toggle`, массив для `multi_toggle`.
	 */
	value?: string | readonly string[];
	defaultValue?: string | readonly string[];
	onChange?: (value: string | string[]) => void;
	/**
	 * В `toggle` менять выбор при навигации стрелками (как SegmentedControl).
	 * @default true
	 */
	activateOnFocus?: boolean;
	'aria-label'?: string;
}

/**
 * Свойства `ButtonGroup.Item`.
 * Стили (`variant` / `status` / `size`) задаются на Root.
 * Для `toggle` / `multi_toggle` передайте `value`.
 */
export interface ButtonGroupItemProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'value'> {
	/** Идентификатор пункта. Обязателен в `toggle` / `multi_toggle`. */
	value?: string;
	/**
	 * Toggle-состояние в режиме `button`.
	 * В `toggle` / `multi_toggle` выводится из `value` группы.
	 */
	active?: boolean;
	/** Иконка слева от текста. */
	icon?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
}
