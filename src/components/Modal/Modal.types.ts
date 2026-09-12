import type React from 'react';
import type {
	DialogBodyProps,
	DialogCloseProps,
	DialogFooterAlign,
	DialogFooterProps,
	DialogHeaderProps,
	DialogTitleProps,
} from '../../base/DialogBase';

/** Выравнивание футера модалки (как у `DialogBase`). */
export type ModalFooterAlign = DialogFooterAlign;

/** Свойства корня `Modal`. */
export interface ModalRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: React.ReactNode;
	className?: string;
	'aria-labelledby'?: string;
	'aria-label'?: string;
	'aria-describedby'?: string;
}

/** Свойства шапки `Modal.Header`. */
export type ModalHeaderProps = DialogHeaderProps;

/** Свойства заголовка `Modal.Title`. */
export type ModalTitleProps = DialogTitleProps;

/** Свойства кнопки закрытия `Modal.Close`. */
export type ModalCloseProps = DialogCloseProps;

/** Свойства тела `Modal.Body`. */
export type ModalBodyProps = DialogBodyProps;

/** Свойства футера `Modal.Footer`. */
export type ModalFooterProps = DialogFooterProps;

/** Свойства футера формы `Modal.FormFooter`. */
export interface ModalFormFooterProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
	className?: string;
	message?: React.ReactNode;
	align?: ModalFooterAlign;
	children?: React.ReactNode;
}

/** Алиас свойств корня `Modal`. */
export type ModalProps = ModalRootProps;
