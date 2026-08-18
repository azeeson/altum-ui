import type React from 'react';
import type {DialogCloseProps, DialogFooterAlign} from '../../base/DialogBase';

/** Выравнивание футера модалки (как у `DialogBase`). */
export type ModalFooterAlign = DialogFooterAlign;

/** Свойства корня `Modal`. */
export interface ModalRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
	open: boolean;
	onClose: () => void;
	onOpenChange?: (open: boolean) => void;
	children: React.ReactNode;
	className?: string;
	'aria-labelledby'?: string;
	'aria-label'?: string;
	'aria-describedby'?: string;
}

/** Свойства шапки `Modal.Header`. */
export interface ModalHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'className'> {
	children?: React.ReactNode;
	className?: string;
	showClose?: boolean;
}

/** Свойства заголовка `Modal.Title`. */
export interface ModalTitleProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'children' | 'className'> {
	children: React.ReactNode;
	className?: string;
	as?: 'h2' | 'h3' | 'h4';
}

/** Свойства кнопки закрытия `Modal.Close`. */
export type ModalCloseProps = DialogCloseProps;

/** Свойства тела `Modal.Body`. */
export interface ModalBodyProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'className'> {
	children?: React.ReactNode;
	className?: string;
}

/** Свойства футера `Modal.Footer`. */
export interface ModalFooterProps extends Omit<React.HTMLAttributes<HTMLElement>, 'align' | 'children' | 'className'> {
	children?: React.ReactNode;
	className?: string;
	align?: ModalFooterAlign;
}

/** Свойства футера формы `Modal.FormFooter`. */
export interface ModalFormFooterProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
	className?: string;
	message?: React.ReactNode;
	align?: ModalFooterAlign;
	children?: React.ReactNode;
}

/** Алиас свойств корня `Modal`. */
export type ModalProps = ModalRootProps;
