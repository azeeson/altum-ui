import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

export interface DialogBaseContextValue {
	onClose: () => void;
	titleId: string;
	onDragHandlePointerDown?: (event: React.PointerEvent) => void;
}

export interface DialogBaseProviderProps {
	onClose: () => void;
	titleId: string;
	onDragHandlePointerDown?: (event: React.PointerEvent) => void;
	children: React.ReactNode;
}

export interface DialogHeaderProps extends Omit<ComponentPropsWithoutRef<'header'>, 'children'> {
	children?: React.ReactNode;
	showClose?: boolean;
}

export interface DialogTitleProps extends Omit<ComponentPropsWithoutRef<'h3'>, 'children'> {
	children: React.ReactNode;
	as?: 'h2' | 'h3' | 'h4';
}

export interface DialogCloseProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
	'aria-label'?: string;
	'data-drag-ignore'?: string;
}

export interface DialogBodyProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children?: React.ReactNode;
}

/** Выравнивание действий в подвале диалога. */
export type DialogFooterAlign = 'start' | 'center' | 'end' | 'space-between';

export interface DialogFooterProps extends Omit<ComponentPropsWithoutRef<'footer'>, 'align' | 'children'> {
	children?: React.ReactNode;
	align?: DialogFooterAlign;
}
