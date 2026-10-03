import type {
	ComponentPropsWithoutRef,
	ReactElement,
	ReactNode,
	Ref,
} from 'react';
import type {ActionListEntry, ActionListGroup, ActionListItem} from '../ActionList/ActionList.types';
import type {DropdownAlign, DropdownPopup, DropdownWidthMode} from '../Dropdown/Dropdown';

/** Режим открытия: клик по `trigger` или ПКМ / Shift+F10 по `children`. */
export type MenuTrigger = ReactElement | 'context';

/**
 * Свойства `Menu`.
 * Клик — `trigger={<ButtonIcon variant='ghost' …/>}`; контекст — `trigger="context"` и область в `children`.
 */
export interface MenuProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/**
	 * Элемент-триггер (клик) или `"context"` (ПКМ / клавиша ContextMenu / Shift+F10).
	 */
	trigger: MenuTrigger;
	/** Область контекстного меню. Нужна при `trigger="context"`. */
	children?: ReactNode;
	/**
	 * Пункты и разделители. `{ type: 'separator' }` — линия, как в `Listbox`.
	 * С `groups` линия остаётся в группе по `groupId`; без `groupId` — в хвосте без заголовка.
	 */
	items: ActionListEntry[];
	groups?: ActionListGroup[];
	/** Нативное открытие и закрытие. Не держит видимость. */
	onOpenChange?: (open: boolean) => void;
	/** Программный показ. Тот же объект, что зовёт `show` у контекстного меню. */
	popupRef?: Ref<DropdownPopup | null>;
	align?: DropdownAlign;
	widthMode?: DropdownWidthMode;
	mobileTitle?: ReactNode;
	emptyText?: string;
	onAction?: (item: ActionListItem) => void;
	/** Корень: триггер-обёртка или область контекстного меню. */
	rootRef?: Ref<HTMLDivElement>;
}
