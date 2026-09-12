import type React from 'react';

/**
 * Свойства корневого контейнера Sidebar.
 */
export interface SidebarProps extends Omit<React.ComponentPropsWithoutRef<'aside'>, 'children' | 'onChange'> {
	children: React.ReactNode;
	value?: string;
	defaultValue?: string;
	onChange?: (id: string) => void;
	collapsed?: boolean;
	defaultCollapsed?: boolean;
	onCollapsedChange?: (collapsed: boolean) => void;
	mobileDrawer?: boolean;
	mobileOpen?: boolean;
	onMobileOpenChange?: (open: boolean) => void;
}

/** Свойства слота `Sidebar.Header`. */
export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLElement> {
	children?: React.ReactNode;
}

/** Свойства слота `Sidebar.Title`. */
export interface SidebarTitleProps extends React.HTMLAttributes<HTMLSpanElement> {
	children: React.ReactNode;
}

/** Свойства кнопки сворачивания `Sidebar.Collapse`. */
export type SidebarCollapseProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

/** Свойства слота `Sidebar.Content`. */
export interface SidebarContentProps extends React.HTMLAttributes<HTMLElement> {
	children: React.ReactNode;
}

/** Свойства слота `Sidebar.Group`. */
export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

/** Свойства слота `Sidebar.GroupLabel`. */
export interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

/** Свойства пункта навигации `Sidebar.Item`. */
export interface SidebarItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type'> {
	value: string;
	/** SVG из набора (`currentColor`). Не emoji — ломает вес и цвет ряда. */
	icon?: React.ReactNode;
	badge?: React.ReactNode;
	badgeDot?: boolean;
	children: React.ReactNode;
}

/** Свойства слота `Sidebar.Footer`. */
export interface SidebarFooterProps extends React.HTMLAttributes<HTMLElement> {
	children: React.ReactNode;
}

/** Свойства кнопки, открывающей drawer на мобиле. */
export interface SidebarMobileTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
	label?: string;
}
