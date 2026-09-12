import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

import type {ControlSize} from '../../types';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export type AlertLayout = 'block' | 'inline';

/**
 * Свойства `Alert`.
 */
export interface AlertProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
	variant?: AlertVariant;
	size?: ControlSize;
	layout?: AlertLayout;
	role?: React.AriaRole;
	/** Заголовок. */
	title?: React.ReactNode;
	/**
	 * Иконка слева. По умолчанию — иконка варианта.
	 * `null` скрывает слот.
	 */
	icon?: React.ReactNode | null;
	/** Кнопки под текстом. */
	actions?: React.ReactNode;
	onClose?: () => void;
	closeLabel?: string;
}
