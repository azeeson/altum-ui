import type {ReactNode} from 'react';
import {Button, type ButtonProps} from '../Button/Button';

export type ButtonIconProps = ButtonProps & {icon?: ReactNode};

/**
 * Кнопка только с иконкой: прокси над **`Button`** с `data-icon-only`.
 * Иконка — `icon` или `children` (мапится в `prefix`).
 *
 * @component
 * @example
 * <ButtonIcon variant="ghost" icon={<IconMenu />} aria-label="Меню" />
 */
export const ButtonIcon = ({
	icon,
	children,
	...props
}: ButtonIconProps) => (
	<Button
		{...props}
		data-icon-only=''
		prefix={icon ?? children}
	/>
);
