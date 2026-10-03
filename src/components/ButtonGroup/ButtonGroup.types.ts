import type {ComponentPropsWithoutRef, ReactNode, Ref} from 'react';
import {type ButtonVariant} from '../Button/Button.types';
import type {ControlSize} from '../../types';

/**
 * Ось группы: `horizontal` — ряд, `vertical` — колонка.
 */
export type ButtonGroupOrientation = 'horizontal' | 'vertical';

/**
 * Ширина пунктов при растянутой группе:
 * - `equal` — равные доли трека
 * - `content` — от контента, остаток делится поровну; суммарно 100% трека
 */
export type ButtonGroupItemFit = 'equal' | 'content';

/** Заливка трека: те же варианты, что у `Button`, кроме `link`; `pill` — алиас скруглённого `secondary`. */
export type ButtonGroupVariant = Exclude<ButtonVariant, 'link'> | 'pill';

/**
 * Свойства корня `ButtonGroup`.
 * Группа только склеивает независимые кнопки: выбор — у `SelectionGroup`.
 */
export interface ButtonGroupRootProps extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'children'
> {
	children: ReactNode;
	/** @default 'secondary' */
	variant?: ButtonGroupVariant;
	/** @default 'md' */
	size?: ControlSize;
	disabled?: boolean;
	/**
	 * Roving tabindex внутри группы (по умолчанию true).
	 * `false` — кнопки не в tab-порядке; так делает `SegmentedControl`, у него свой roving.
	 */
	focusable?: boolean;
	/**
	 * `auto` — intrinsic width; `full` — растянуть на колонку формы.
	 * @default 'auto'
	 */
	width?: 'auto' | 'full';
	/**
	 * Ширина пунктов. Имеет смысл при `width="full"`.
	 * @default 'equal'
	 */
	itemFit?: ButtonGroupItemFit;
	/**
	 * Ряд или колонка.
	 * @default 'horizontal'
	 */
	orientation?: ButtonGroupOrientation;
	'aria-label'?: string;
	/** Корень группы. */
	rootRef?: Ref<HTMLDivElement>;
}
