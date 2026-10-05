import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	Ref,
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
 * Свойства `Chip`.
 */
export interface ChipProps extends Omit<ComponentPropsWithoutRef<'span'>, 'onClick'> {
	/** @default 'secondary' */
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
	children: React.ReactNode;
	onRemove?: () => void;
	onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLSpanElement>;
	/** Неактивное состояние: без клика/remove. */
	disabled?: boolean;
	icon?: React.ReactNode;
	className?: string;
	removeLabel?: string;
	/** Корень: `<button>`, если чип только кликабельный, иначе `<span>`. */
	rootRef?: Ref<HTMLButtonElement | HTMLSpanElement>;
	/** Значение для делегирования клика с группы (`data-value`). */
	value?: string;
}

/**
 * Шаг промежутка (`ChipGroupGap`) — алиас `GroupGap`.
 */
export type ChipGroupGap = GroupGap;

/**
 * Свойства `ChipGroup`.
 */
export interface ChipGroupProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onSelect'> {
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
	 * `tag` — группа статичных меток (дефолтный `aria-label` «Теги»).
	 * @default 'chip'
	 */
	mode?: Exclude<ChipMode, 'toggle'>;
	/**
	 * Делегированный выбор: клик по чипу с `value` / `data-value`.
	 * Per-chip `onClick` по-прежнему работает.
	 */
	onSelect?: (value: string) => void;
	className?: string;
	rootRef?: Ref<HTMLDivElement>;
}
