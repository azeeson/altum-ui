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
import type {MouseEvent, MouseEventHandler, ReactElement, Ref} from 'react';
import styles from './ButtonBase.module.css';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {Slot} from '../../utils/slot';

type ButtonBaseComponent = (<T extends ButtonBaseAs = 'button'>(
	props: ButtonBaseProps<T> & {ref?: Ref<ButtonBaseRef<T>>},
) => ReactElement | null) & {
	displayName?: string;
};

/**
 * Базовый layout кнопки: размеры, `variant` × `status`, опциональный toggle (`active`).
 * На нём строятся `Button`, `ButtonIcon` и `ButtonGroup.Item`.
 * Secondary / tinted / ghost читают `--altum-color-button-*` element-токены (Box может их переопределить).
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
		contentClassName,
		children,
		type = 'button',
		disabled,
		style,
		asChild = false,
		as,
		onClick,
		...props
	}: ButtonBaseProps<T>,
	ref: Ref<ButtonBaseRef<T>>,
) {
	const Component = (as ?? 'button') as T;
	const isAnchor = Component === 'a';
	const isToggle = active !== undefined;
	const classNames = cn(
		styles.btn,
		styles[variant],
		styles[size],
		status === 'danger' ? styles.statusDanger : '',
		isToggle ? styles.isToggle : '',
		isToggle && active ? styles.isActive : '',
		className,
	);

	const sharedProps = {
		className: classNames,
		style,
		...(isAnchor ? {} : {disabled}),
		'data-variant': variant,
		'data-status': status,
		'data-size': size,
		'data-active': isToggle ? String(active) : undefined,
		...props,
		onClick: isAnchor && disabled
			? composeEventHandlers(
				onClick as MouseEventHandler<HTMLAnchorElement> | undefined,
				(event: MouseEvent<HTMLAnchorElement>) => {
					event.preventDefault();
				},
			)
			: onClick,
		...(isAnchor && disabled
			? {
				'aria-disabled': true as const,
				tabIndex: -1,
			}
			: {}),
		'aria-pressed': isToggle ? active : undefined,
	};

	if (asChild) {
		return (
			<Slot
				ref={ref}
				type={type}
				{...sharedProps}
			>
				{children}
			</Slot>
		);
	}

	if (isAnchor) {
		return createElement(
			'a',
			{
				ref,
				...sharedProps,
			},
			children,
		);
	}

	return createElement(
		'button',
		{
			ref,
			type,
			...sharedProps,
		},
		createElement(
			'span',
			{
				className: cn(styles.btnContent, contentClassName),
			},
			children,
		),
	);
}) as ButtonBaseComponent;

ButtonBase.displayName = 'ButtonBase';
