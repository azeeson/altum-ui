import type {
	ButtonHTMLAttributes,
	ComponentPropsWithoutRef,
	ReactNode,
} from 'react';

/**
 * Вид видимых (не в ⋯) действий.
 * - `icon` — только иконка (если иконки нет — лейбл);
 * - `icon-label` — иконка + лейбл (если иконки нет — только лейбл).
 * В выпадающем списке всегда иконка (если есть) + лейбл.
 */
export type OverflowActionsDisplay = 'icon' | 'icon-label';

export type OverflowActionsItemDomProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'children' | 'onClick' | 'type' | 'color'
>;

/**
 * Свойства `OverflowActions.Item`.
 * `data-*` / `aria-*` / `title` / `id` и др. пробрасываются на **видимую** кнопку
 * и на пункт в меню overflow (через ActionList / Listbox).
 */
export type OverflowActionsItemProps = {
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
} & Omit<OverflowActionsItemDomProps, 'id' | 'disabled' | 'className'>;

/**
 * Свойства корня `OverflowActions`.
 */
export interface OverflowActionsProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children?: ReactNode;
	/**
	 * Сколько действий показывать снаружи.
	 * `0` — все только в меню ⋯.
	 * Не задано / `Infinity` — показать все (⋯ не нужен).
	 */
	visibleCount?: number;
	/**
	 * Вид видимых действий. На меню ⋯ не влияет.
	 * @default 'icon-label'
	 */
	display?: OverflowActionsDisplay;
	/**
	 * Показать кнопку ⋯ (меню остаётся доступным через `ActionSheetTrigger`, если скрыта).
	 * Если не задано — наследует от `ActionSheetTrigger` на touch+mobile, иначе `true`.
	 * @default true
	 */
	showOverflowTrigger?: boolean;
	/** Размер видимых кнопок и ⋯. @default 'sm' */
	size?: 'sm' | 'md';
	/** Заголовок Sheet на мобильных. @default 'Действия' */
	mobileTitle?: ReactNode;
}
