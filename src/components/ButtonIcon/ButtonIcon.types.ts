import type React from 'react';
import {type ButtonBaseProps, type ButtonVariant, type ButtonStatus} from '../../base/ButtonBase';

export type {ButtonVariant, ButtonStatus};

/**
 * Свойства `ButtonIcon`.
 */
export interface ButtonIconProps extends Omit<ButtonBaseProps, 'children'> {
	/** @default 'square' */
	shape?: 'circle' | 'square';
	/**
	 * `diskClose` — кнопка закрытия overlay: `overlayClose` chrome, без дефолтной иконки. Передайте `icon` (обычно **`IconCross`** 16px).
	 * @default 'default'
	 */
	appearance?: 'default' | 'diskClose';
	icon?: React.ReactNode;
	children?: React.ReactNode;
}
