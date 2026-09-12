import type {
	ButtonBaseAs,
	ButtonBaseProps,
	ButtonBaseRef,
} from './ButtonBase.types';
export type {
	ButtonVariant,
	ButtonStatus,
	ButtonBaseAs,
	ButtonBaseRef,
	ButtonBaseProps,
} from './ButtonBase.types';

import {createElement, forwardRef} from 'react';
import type {ReactElement, Ref} from 'react';
import styles from './ButtonBase.module.css';
import textLink from '../../styles/textLink.module.css';
import {cn} from '../../utils/cn';

type ButtonBaseComponent = (<T extends ButtonBaseAs = 'button'>(
	props: ButtonBaseProps<T> & {ref?: Ref<ButtonBaseRef<T>>},
) => ReactElement | null) & {
	displayName?: string;
};

/**
 * Базовый layout кнопки: размеры, `variant` × `status`, опциональный toggle (`active`).
 * На нём строятся `Button` и `ButtonIcon`.
 *
 * @component
 * @example
 * <ButtonBase variant="secondary" status="danger" size="sm">
 *   Удалить
 * </ButtonBase>
 */
export const ButtonBase = forwardRef(function ButtonBase<T extends ButtonBaseAs = 'button'>(
	{
		variant = 'primary',
		status = 'default',
		size = 'md',
		active,
		className,
		children,
		type = 'button',
		disabled,
		as,
		...props
	}: ButtonBaseProps<T>,
	ref: Ref<ButtonBaseRef<T>>,
) {
	const isAnchor = as === 'a';
	const isToggle = active !== undefined;

	const classNames = cn(
		styles.btn,
		styles[variant],
		styles[size],
		variant === 'link' ? textLink.link : '',
		status === 'danger' ? styles.statusDanger : '',
		isToggle ? styles.isToggle : '',
		isToggle && active ? styles.isActive : '',
		className,
	);

	if (isAnchor) {
		return createElement(
			'a',
			{
				ref,
				className: classNames,
				...(disabled
					? {
						'aria-disabled': true as const,
						tabIndex: -1,
					}
					: {}),
				...props,
				'aria-pressed': isToggle ? active : undefined,
			},
			children,
		);
	}

	return createElement(
		'button',
		{
			ref,
			className: classNames,
			type,
			disabled,
			...props,
			'aria-pressed': isToggle ? active : undefined,
		},
		children,
	);
}) as ButtonBaseComponent;

ButtonBase.displayName = 'ButtonBase';
