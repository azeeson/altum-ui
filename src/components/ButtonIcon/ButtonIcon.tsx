import type {ButtonIconProps} from './ButtonIcon.types';
export type {
	ButtonVariant,
	ButtonStatus,
	ButtonIconProps,
} from './ButtonIcon.types';

import {forwardRef} from 'react';
import {ButtonBase, buttonBaseStyles as styles} from '../../base/ButtonBase';
import overlayClose from '../../styles/overlayClose.module.css';
import {cn} from '../../utils/cn';

/**
 * Компактная кнопка только с иконкой — для панелей инструментов и вторичных действий.
 *
 * @component
 * @example
 * <ButtonIcon icon={<IconPlus />} aria-label="Добавить" variant="tinted" />
 */
export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(
	function ButtonIcon(
		{
			variant = 'ghost',
			shape = 'square',
			appearance = 'default',
			icon,
			children,
			className,
			...props
		},
		ref,
	) {
		const isDiskClose = appearance === 'diskClose';

		return (
			<ButtonBase
				ref={ref}
				variant={isDiskClose ? 'ghost' : variant}
				className={cn(
					isDiskClose ? overlayClose.close : (variant === 'link' ? '' : styles.icon),
					!isDiskClose && shape === 'circle' && styles.circle,
					className,
				)}
				{...props}
			>
				{icon ?? children}
			</ButtonBase>
		);
	},
);

ButtonIcon.displayName = 'ButtonIcon';
