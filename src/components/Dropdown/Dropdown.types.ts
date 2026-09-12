import type React from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {Box} from '../Box/Box';
import {type DropdownAlign, type DropdownPanelScroll, type DropdownWidthMode} from '../Overlay/Overlay';
import type {RenderChildrenFn} from '../../utils/renderChildren';

export type DropdownPopupRole = 'menu' | 'listbox' | 'none' | 'dialog';

export type DropdownTriggerMode = 'toggle' | 'combobox';

export type {DropdownAlign, DropdownWidthMode, DropdownPanelScroll};

export type DropdownTriggerAttrs = Pick<
	React.HTMLAttributes<HTMLElement>,
	'onKeyDown' | 'onClick'
> & {
	'aria-haspopup'?: 'true' | 'listbox' | 'menu' | 'dialog';
	'aria-expanded': boolean;
	'aria-controls'?: string;
	tabIndex?: number;
	className?: string;
	/** На `<button>` — чтобы не сабмитить форму. @default `'button'` */
	type?: 'button';
};

/** Slot-пропсы триггера: `renderTrigger(props, ref)`. */
export type DropdownTriggerSlotProps = DropdownTriggerAttrs;

/**
 * Свойства `Dropdown` — панель через `children`, якорь через `renderTrigger`.
 */
export interface DropdownProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/** Содержимое панели. */
	children?: React.ReactNode;
	/**
	 * Якорь. Навесьте `props` и `ref` на фокусируемый хост.
	 * @example
	 * renderTrigger={(props, ref) => <Button {...props} ref={ref}>Меню</Button>}
	 */
	renderTrigger: RenderChildrenFn<DropdownTriggerSlotProps>;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	/**
	 * Роль панели. `'none'` — без `role` на панели (роль у внутреннего Listbox/ActionList);
	 * триггер получает `aria-haspopup="listbox"` (не `"menu"`).
	 */
	popupRole?: DropdownPopupRole;
	/** combobox: фокус остаётся на input-триггере, панель открывается не перехватывая его */
	triggerMode?: DropdownTriggerMode;
	boxProps?: React.ComponentProps<typeof Box>;
	/** @default 'auto' */
	align?: DropdownAlign;
	/** @default 'content' */
	widthMode?: DropdownWidthMode;
	/** Заголовок Sheet на мобильных экранах */
	mobileTitle?: React.ReactNode;
	mobileLeftControls?: React.ReactNode;
	mobileRightControls?: React.ReactNode;
	/** Внутренний скролл контента (пикеры) — панель не обрезает дочерние scroll-области */
	panelScroll?: DropdownPanelScroll;
	/** className панели (не корня). */
	panelClassName?: string;
}

export interface DropdownMobileSheetProps {
	sheetRef: React.Ref<HTMLDivElement>;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	zIndex?: string | number;
	mobileTitle?: React.ReactNode;
	mobileLeftControls?: React.ReactNode;
	mobileRightControls?: React.ReactNode;
	children: React.ReactNode;
}
