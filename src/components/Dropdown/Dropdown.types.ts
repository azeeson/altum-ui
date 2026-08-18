import type React from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {Box} from '../Box/Box';
import {type DropdownAlign, type DropdownPanelScroll, type DropdownWidthMode} from '../Overlay/Overlay';
import {type WithEnrichedChildren} from '../../utils/renderChildren';

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

/** Slot-пропсы триггера Dropdown (через `renderChildren` / `WithEnrichedChildren`). */
export type DropdownTriggerSlotProps = DropdownTriggerAttrs;

/**
 * Свойства корня `Dropdown`.
 */
export interface DropdownProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children: React.ReactNode;
	open?: boolean;
	onClose?: () => void;
	onOpenChange?: (open: boolean) => void;
	align?: DropdownAlign;
	widthMode?: DropdownWidthMode;
	/**
	 * Роль панели. `'none'` — без `role` на панели (роль у внутреннего Listbox/ActionList);
	 * триггер получает `aria-haspopup="listbox"` (не `"menu"`).
	 */
	popupRole?: DropdownPopupRole;
	/** combobox: фокус остаётся на input-триггере, панель открывается не перехватывая его */
	triggerMode?: DropdownTriggerMode;
	/** Заголовок Sheet на мобильных экранах */
	mobileTitle?: React.ReactNode;
	mobileLeftControls?: React.ReactNode;
	mobileRightControls?: React.ReactNode;
	/** Внутренний скролл контента (пикеры) — панель не обрезает дочерние scroll-области */
	panelScroll?: DropdownPanelScroll;
}

/**
 * Свойства `Dropdown.Trigger` — триггер через `WithEnrichedChildren`.
 */
export type DropdownTriggerProps = WithEnrichedChildren<
	{className?: string},
	DropdownTriggerSlotProps
>;

/**
 * Свойства `Dropdown.Content`.
 */
export interface DropdownContentProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children: React.ReactNode;
	boxProps?: React.ComponentProps<typeof Box>;
}

export interface DropdownMobileSheetProps {
	sheetRef: React.Ref<HTMLDivElement>;
	open: boolean;
	onClose: () => void;
	zIndex?: string | number;
	mobileTitle?: React.ReactNode;
	mobileLeftControls?: React.ReactNode;
	mobileRightControls?: React.ReactNode;
	children: React.ReactNode;
}
