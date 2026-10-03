import type React from 'react';
import type {ComponentPropsWithoutRef, Ref} from 'react';
import type {AnchorAlign} from '../../types';
import type {BoxProps} from '../Box/Box.types';
import type {PopoverTriggerSlotProps} from '../Popover/Popover.types';
import type {RenderChildrenFn} from '../../core/utils/renderChildren';

/** Императивное открытие панели: `showPopover` / `hidePopover`. */
export type DropdownPopup = {
	show: () => void;
	hide: () => void;
};

export type DropdownPopupRole = 'menu' | 'listbox' | 'none' | 'dialog';

export type DropdownTriggerMode = 'toggle' | 'combobox';

/**
 * Выравнивание панели относительно триггера.
 * `start` / `center` / `end` — вдоль стороны; `auto` — старт с flip.
 * `left` / `right` — алиасы `start` / `end`.
 */
export type DropdownAlign = AnchorAlign | 'auto' | 'left' | 'right';
/** Ширина панели относительно триггера. */
export type DropdownWidthMode = 'trigger' | 'content' | 'trigger-fit';
/** Кто скроллит панель: оболочка или контент. */
export type DropdownPanelScroll = 'overlay' | 'content';

export type DropdownTriggerAttrs = Pick<
	React.HTMLAttributes<HTMLElement>,
	'onKeyDown' | 'onClick'
> & {
	'aria-haspopup'?: 'true' | 'listbox' | 'menu' | 'dialog';
	/** Ставит браузер вместе с `popovertarget`. */
	'aria-expanded'?: boolean;
	'aria-controls'?: string;
	tabIndex?: number;
	className?: string;
	/** На `<button>` — чтобы не сабмитить форму. @default `'button'` */
	type?: 'button';
};

/** Slot-пропсы, которые `renderChildren` вешает на `trigger`. */
export type DropdownTriggerSlotProps = DropdownTriggerAttrs & PopoverTriggerSlotProps;

/** Состояние панели для render-prop `children`. */
export type DropdownPanelState = {
	open: boolean;
};

/**
 * Свойства `Dropdown` — панель через `children`, якорь через `trigger`.
 */
export interface DropdownProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/**
	 * Содержимое панели.
	 * Функция получает `{open}` — активность поповера без отдельного стейта у вызывающего кода.
	 */
	children?: React.ReactNode | ((state: DropdownPanelState) => React.ReactNode);
	/**
	 * Якорь: элемент или `(props, ref) => …`. Слот навешивает `renderChildren`.
	 * @example
	 * <Dropdown trigger={<Button>Меню</Button>}>Пункты</Dropdown>
	 */
	trigger: React.ReactElement | RenderChildrenFn<DropdownTriggerSlotProps>;
	/** Показать панель после монтирования. */
	defaultOpen?: boolean;
	/** Нативное `toggle`. Не источник видимости. */
	onOpenChange?: (open: boolean) => void;
	/** `show` / `hide` без React-стейта. */
	popupRef?: Ref<DropdownPopup | null>;
	/** Корень. */
	rootRef?: Ref<HTMLDivElement>;
	/**
	 * Роль панели. `'none'` — без `role` на панели (роль у внутреннего Listbox/ActionList);
	 * триггер получает `aria-haspopup="listbox"` (не `"menu"`).
	 */
	popupRole?: DropdownPopupRole;
	/** combobox: фокус остаётся на input-триггере, панель открывается не перехватывая его */
	triggerMode?: DropdownTriggerMode;
	boxProps?: BoxProps;
	/** @default 'auto' */
	align?: DropdownAlign;
	/** @default 'content' */
	widthMode?: DropdownWidthMode;
	/** Заголовок панели на узком экране. На десктопе шапка скрыта. */
	mobileTitle?: React.ReactNode;
	mobileLeftControls?: React.ReactNode;
	mobileRightControls?: React.ReactNode;
	/** Внутренний скролл контента (пикеры) — панель не обрезает дочерние scroll-области */
	panelScroll?: DropdownPanelScroll;
	/** className панели (не корня). */
	panelClassName?: string;
}
