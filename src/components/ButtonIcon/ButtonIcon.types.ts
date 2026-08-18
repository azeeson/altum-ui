import type React from 'react';
import {type ButtonBaseProps, type ButtonVariant, type ButtonStatus} from '../../base/ButtonBase';

export type {ButtonVariant, ButtonStatus};

/**
 * Свойства `ButtonIcon`.
 */
export interface ButtonIconProps extends Omit<ButtonBaseProps, 'contentClassName' | 'children'> {
	/** @default 'square' */
	shape?: 'circle' | 'square';
	/**
	 * `diskClose` — круглая кнопка закрытия overlay (Modal / Sheet).
	 * @default 'default'
	 */
	appearance?: 'default' | 'diskClose';
	icon?: React.ReactNode;
	children?: React.ReactNode;
}
