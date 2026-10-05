import type {BoxProps} from '../../Box/Box.types';

/**
 * Поверхность диалога: `Box` и кнопка закрытия поверх содержимого.
 */
export interface DialogLayoutProps extends BoxProps {
	/**
	 * Закрытие по крестику. Без колбэка кнопка не рисуется.
	 */
	onClose?: () => void;
	/**
	 * Крестик в правом верхнем углу, поверх контента.
	 * @default true
	 */
	showClose?: boolean;
	/** Подпись крестика. По умолчанию — «Закрыть» из локали. */
	closeLabel?: string;
}
