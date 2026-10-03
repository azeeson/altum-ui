import type {
	ComponentPropsWithoutRef,
	ReactNode,
	Ref,
} from 'react';
import type {ControlSize} from '../../types';

/** Выравнивание действий в `Modal.Footer`. */
export type ModalFooterAlign = 'start' | 'center' | 'end' | 'space-between';

/** Свойства корня `Modal`. */
export interface ModalRootProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title' | 'children'> {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: ReactNode;
	/**
	 * Ширина диалога: `sm` 400px, `md` 500px, `lg` 600px.
	 * Не шире окна браузера: 16px отступа с каждой стороны.
	 * @default 'md'
	 */
	size?: ControlSize;
	className?: string;
	/**
	 * Крестик в правом верхнем углу.
	 * @default true
	 */
	showClose?: boolean;
	'aria-labelledby'?: string;
	'aria-label'?: string;
	'aria-describedby'?: string;
	/** Поверхность диалога (`DialogLayout`). */
	rootRef?: Ref<HTMLElement>;
}

/** Свойства шапки `Modal.Header`. */
export interface ModalHeaderProps extends Omit<ComponentPropsWithoutRef<'header'>, 'children'> {
	children?: ReactNode;
	/** Узел шапки. */
	rootRef?: Ref<HTMLElement>;
}

/** Свойства тела `Modal.Body`. */
export interface ModalBodyProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children?: ReactNode;
	/** Узел тела. */
	rootRef?: Ref<HTMLElement>;
}

/** Свойства футера `Modal.Footer`. */
export interface ModalFooterProps extends Omit<ComponentPropsWithoutRef<'footer'>, 'align' | 'children'> {
	children?: ReactNode;
	align?: ModalFooterAlign;
	/** Узел футера. */
	rootRef?: Ref<HTMLElement>;
}

/** Алиас свойств корня `Modal`. */
export type ModalProps = ModalRootProps;
