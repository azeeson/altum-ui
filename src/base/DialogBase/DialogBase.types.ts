import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';
import type {BoxProps} from '../../components/Box/Box.types';

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
	/** Класс внутренней обёртки контента (раскладка chrome в `Sheet.Header`). */
	contentClassName?: string;
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

/** Оболочка диалога: поверхность + контекст Header/Title/Close. */
export interface DialogSurfaceProps extends BoxProps {
	onClose: () => void;
	titleId: string;
	onDragHandlePointerDown?: (event: React.PointerEvent) => void;
}
