import type {
	ComponentPropsWithoutRef,
	ReactNode,
	Ref,
} from 'react';
import type {ActionListGroup, ActionListItem} from '../ActionList/ActionList.types';

/**
 * Свойства `ActionSheetTrigger`.
 */
export interface ActionSheetTriggerProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/**
	 * Хром строки (`Item`, `SwipeToAction`, …).
	 * Без `items` — дети должны содержать `[data-overflow-trigger]` (обычно `Overflow`).
	 * С `items` — только хром; меню рисует сам хост.
	 */
	children: ReactNode;
	/**
	 * Пункты внутреннего `Menu` (`ActionList`).
	 * Если заданы — long-press открывает встроенный `Menu` через `Button[data-overflow-trigger]`.
	 */
	items?: ActionListItem[];
	/** Группы для `items` (`groupId`). */
	groups?: ActionListGroup[];
	/** Выбор пункта внутреннего меню. */
	onAction?: (item: ActionListItem) => void;
	/** Нативное открытие/закрытие внутреннего `Menu`. */
	onOpenChange?: (open: boolean) => void;
	/** Заголовок шторки меню на узком экране. */
	mobileTitle?: ReactNode;
	/**
	 * На touch + mobile показывать кнопку ⋯.
	 * `false` — ⋯ скрыт (меню открывается long-press).
	 * @default false
	 */
	showOverflowTrigger?: boolean;
	/** Задержка long-press, мс. @default 500 */
	longPressMs?: number;
	/**
	 * Порог смещения (px) для отмены long-press.
	 * Должен быть ≤ порога распознавания свайпа у `SwipeToAction`.
	 * @default 8
	 */
	moveThreshold?: number;
	disabled?: boolean;
	/**
	 * DOM-узел хоста (зона жеста).
	 * Без `items` меню открывает вложенный `[data-overflow-trigger]`.
	 */
	rootRef?: Ref<HTMLDivElement>;
}
