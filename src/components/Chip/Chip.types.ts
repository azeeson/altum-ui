import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';
import type {ControlSize, GroupGap} from '../../types';

/**
 * Вариант оформления (`ChipVariant`).
 */
export type ChipVariant =
	| 'primary'
	| 'tinted'
	| 'secondary'
	| 'success'
	| 'info'
	| 'warning'
	| 'error';

/**
 * Режим отображения: интерактивный чип или статичный тег.
 */
export type ChipMode = 'chip' | 'tag';

/**
 * Свойства `Chip`.
 */
export interface ChipProps extends Omit<ComponentPropsWithoutRef<'span'>, 'onClick'> {
	variant?: ChipVariant;
	/** Размер. @default 'md' */
	size?: ControlSize;
	/**
	 * `tag` — pill-метка; с `onClick` кликабельна (hover как у chip).
	 * `chip` — небольшое скругление углов (`--altum-g-radius-sm`).
	 * @default 'chip'
	 */
	mode?: ChipMode;
	/**
	 * Выбранное / активное состояние (фильтр, toggle).
	 * Только в `mode="chip"`; при `onClick` выставляется `aria-pressed`.
	 */
	active?: boolean;
	children: React.ReactNode;
	onRemove?: () => void;
	onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLSpanElement>;
	/** Неактивное состояние: без клика/remove. */
	disabled?: boolean;
	icon?: React.ReactNode;
	className?: string;
	removeLabel?: string;
}

/**
 * Шаг промежутка (`ChipGroupGap`) — алиас `GroupGap`.
 */
export type ChipGroupGap = GroupGap;

/**
 * Раскладка группы чипов.
 * - `wrap` — перенос строк (по умолчанию)
 * - `scrollX` — одна строка с горизонтальным скроллом
 */
export type ChipGroupLayout = 'wrap' | 'scrollX';

/** Визуальная подсказка, что ряд чипов можно прокрутить. */
export type ChipGroupOverflowAffordance = 'fade' | 'none';

/**
 * Свойства `ChipGroup`.
 */
export interface ChipGroupProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children: React.ReactNode;
	/** Подпись группы для screen readers */
	'aria-label'?: string;
	/**
	 * Промежуток между чипами.
	 * Для плотных multi-select наборов предпочтителен `sm`.
	 * @default 'md'
	 */
	gap?: ChipGroupGap;
	/**
	 * `wrap` — flex-wrap; `scrollX` — одна строка + overflow-x.
	 * @default 'wrap'
	 */
	layout?: ChipGroupLayout;
	/**
	 * Edge fade при `layout="scrollX"`.
	 * @default 'fade' для scrollX, иначе игнорируется
	 */
	overflowAffordance?: ChipGroupOverflowAffordance;
	/**
	 * `tag` — группа статичных меток (дефолтный `aria-label` «Теги»).
	 * @default 'chip'
	 */
	mode?: ChipMode;
	className?: string;
}
