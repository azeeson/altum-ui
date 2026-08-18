import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';
import {type DropdownAlign} from '../Dropdown/Dropdown';
import type {ControlSize, GroupGap} from '../../types';

export type OverflowGroupGap = GroupGap;

/**
 * Как считать ширину корня.
 * - `content` — по видимым children (`max-content`, не шире родителя);
 * - `container` — на всю ширину родителя, ⋯ справа (тулбар / `ButtonGroup`).
 */
export type OverflowGroupFit = 'content' | 'container';

/**
 * Свойства `OverflowGroup`.
 */
export interface OverflowGroupProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children?: React.ReactNode;
	/**
	 * Промежуток между элементами.
	 * @default 'md'
	 */
	gap?: OverflowGroupGap;
	/**
	 * Размер кнопки ⋯.
	 * @default 'md'
	 */
	size?: ControlSize;
	/**
	 * Ширина корня: по контенту или на весь родитель.
	 * @default 'content'
	 */
	fit?: OverflowGroupFit;
	/**
	 * Верхний предел видимых элементов (поверх измерения ширины).
	 * Если задан и меньше общего числа children — остальное всегда в ⋯.
	 */
	maxVisible?: number;
	/** Выравнивание панели `Dropdown`. @default 'right' */
	align?: DropdownAlign;
	/** Подпись кнопки ⋯. */
	moreLabel?: string;
	/** Заголовок Sheet на мобильных. */
	mobileTitle?: React.ReactNode;
}
