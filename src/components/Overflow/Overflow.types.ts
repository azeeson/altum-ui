import type {
	ButtonHTMLAttributes,
	ComponentPropsWithoutRef,
	ReactNode,
	Ref,
} from 'react';
import type {DropdownAlign} from '../Dropdown/Dropdown';
import type {ControlSize, GroupGap} from '../../types';

/**
 * Вид видимых (не в ⋯) действий.
 * - `icon` — только иконка (если иконки нет — лейбл);
 * - `icon-label` — иконка + лейбл (если иконки нет — только лейбл).
 * В выпадающем списке всегда иконка (если есть) + лейбл.
 */
export type OverflowDisplay = 'icon' | 'icon-label';

export type OverflowItemDomProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'children' | 'onClick' | 'type' | 'color'
>;

/**
 * Свойства `Overflow.Item`.
 * `data-*` / `aria-*` / `title` / `id` пробрасываются на видимую кнопку и пункт в меню ⋯.
 */
export type OverflowItemProps = {
	/** Стабильный id (для ActionList и DOM `id` видимой кнопки). Если не задан — генерируется. */
	id?: string;
	/** Иконка; необязательна — без неё всегда показывается лейбл. */
	icon?: ReactNode;
	/** Подпись действия. */
	label: ReactNode;
	/** Строка для фильтра/a11y, если `label` не текст. */
	textValue?: string;
	disabled?: boolean;
	onSelect?: () => void;
	className?: string;
} & Omit<OverflowItemDomProps, 'id' | 'disabled' | 'className'>;

export type OverflowGap = GroupGap;

/**
 * Как считать ширину корня.
 * - `content` — по видимым children (Measure);
 * - `container` — на всю ширину: Measure — fitCount+RO; Actions — equal-width CQ.
 */
export type OverflowFit = 'content' | 'container';

/**
 * Свойства `Overflow`.
 *
 * Дети `Overflow.Item` — панель действий (`visibleCount`, `display`).
 * Произвольные дети — измерение ширины (`fit`, `maxVisible`, `gap`).
 */
export interface OverflowProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children?: ReactNode;
	/**
	 * Сколько `Overflow.Item` показывать снаружи.
	 * `0` — все только в меню ⋯.
	 * Не задано / `Infinity` — показать все (⋯ не нужен),
	 * либо при `fit="container"` — equal-width CQ auto-hide.
	 */
	visibleCount?: number;
	/**
	 * Вид видимых `Overflow.Item`. На меню ⋯ не влияет.
	 * @default 'icon-label'
	 */
	display?: OverflowDisplay;
	/**
	 * Показать кнопку ⋯ (меню остаётся доступным через `longPress`, если скрыта).
	 * @default true
	 */
	showOverflowTrigger?: boolean;
	/**
	 * Long-press по хосту открывает меню ⋯.
	 * Не-Item дети рендерятся как контент строки (SwipeToAction, Item, …).
	 * @default false; при `true` кнопка ⋯ на touch+mobile скрыта, пока не задан `showOverflowTrigger`.
	 */
	longPress?: boolean;
	/** Задержка long-press, мс. @default 500 */
	longPressMs?: number;
	/**
	 * Порог смещения (px) для отмены long-press.
	 * @default 8
	 */
	moveThreshold?: number;
	/** Размер видимых кнопок и ⋯. @default 'sm' для Item, 'md' для измерения. */
	size?: ControlSize;
	/** Заголовок Sheet на мобильных. */
	mobileTitle?: ReactNode;
	/** Промежуток между измеряемыми children. @default 'md' */
	gap?: OverflowGap;
	/**
	 * Ширина корня: измерение children, либо Actions equal-width CQ (`container`).
	 * @default 'content'
	 */
	fit?: OverflowFit;
	/** Верхний предел видимых элементов поверх измерения ширины. */
	maxVisible?: number;
	/** Выравнивание панели `Dropdown` в режиме измерения. @default 'right' */
	align?: DropdownAlign;
	/** Подпись кнопки ⋯ в режиме измерения. */
	moreLabel?: string;
	/** Корень панели. При `longPress` — хост `ActionSheetTrigger`. */
	rootRef?: Ref<HTMLDivElement>;
}
