import type {
	ReactNode,
} from 'react';
import type {
	ButtonBaseProps,
	ButtonVariant,
	ButtonStatus,
} from '../../base/ButtonBase';

export type {ButtonVariant, ButtonStatus};

/**
 * Свойства `Button`.
 */
export interface ButtonProps extends Omit<ButtonBaseProps, 'contentClassName'> {
	iconStart?: ReactNode;
	iconEnd?: ReactNode;
	/** Состояние загрузки: спиннер, клики блокируются. */
	loading?: boolean;
	fullWidth?: boolean;
	/**
	 * Подпись шортката (`mod+z`): `aria-keyshortcuts` и `title`, если `title` не задан.
	 */
	shortcut?: string;
}
