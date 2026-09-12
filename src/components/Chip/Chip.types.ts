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
 * Роль чипа: метка, тег или toggle-фильтр.
 */
export type ChipMode = 'chip' | 'tag' | 'toggle';

/**
 * @deprecated Используйте {@link ChipMode}.
 */
export type ChipAs = ChipMode;

/**
 * Свойства `Chip`.
 */
export interface ChipProps extends Omit<ComponentPropsWithoutRef<'span'>, 'onClick' | 'as'> {
	variant?: ChipVariant;
	/** Размер. @default 'md' */
	size?: ControlSize;
	/**
	 * `chip` — небольшое скругление.
	 * `tag` — pill-метка.
	 * `toggle` — выбранный фильтр (`aria-pressed`).
	 * @default 'chip'
	 */
	mode?: ChipMode;
	/**
	 * @deprecated Используйте `mode`.
	 */
	as?: ChipMode;
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
	mode?: Exclude<ChipMode, 'toggle'>;
	/**
	 * @deprecated Используйте `mode`.
	 */
	as?: Exclude<ChipMode, 'toggle'>;
	className?: string;
}
