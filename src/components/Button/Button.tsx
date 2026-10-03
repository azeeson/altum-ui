import type {
	ButtonProps,
} from './Button.types';
export type {
	ButtonVariant,
	ButtonAs,
	ButtonProps,
} from './Button.types';

import type {ReactNode} from 'react';
import {Typography} from '../../base/Typography';
import textLink from '../../styles/textLink.module.css';
import styles from './Button.module.css';
import {cn} from '../../core/utils/cn';

type Chrome = {
	variant?: ButtonProps['variant'];
	size?: ButtonProps['size'];
	active?: boolean;
	disabled?: boolean;
	loading?: boolean;
	fullWidth?: boolean;
	className?: string;
	prefix?: ReactNode;
	postfix?: ReactNode;
	children?: ReactNode;
};

function buttonChrome({
	variant = 'primary',
	size = 'md',
	active,
	disabled,
	loading = false,
	fullWidth,
	className,
	prefix,
	postfix,
	children,
}: Chrome) {
	const isDisabled = Boolean(disabled || loading);
	return {
		active,
		loading,
		isDisabled,
		className: cn(
			styles.btn,
			variant === 'link' && textLink.link,
			className,
		),
		data: {
			'data-variant': variant !== 'primary' ? variant : undefined,
			'data-size': size !== 'md' ? size : undefined,
			'data-disabled': disabled && !loading ? '' as const : undefined,
			'data-full-width': fullWidth ? '' as const : undefined,
			'data-loading': loading ? '' as const : undefined,
		},
		content: (
			<>
				{!loading && prefix}
				{children}
				{postfix}
			</>
		),
	};
}

/**
 * Кнопка действия с вариантами оформления и loading-состоянием.
 * Хост — {@link Typography} (`button` | `a`).
 *
 * @component
 * @example
 * <Button variant="danger" loading={saving} onClick={handleDelete}>
 *   Удалить
 * </Button>
 */
export const Button = (props: ButtonProps) => {
	const view = buttonChrome(props);
	const isAnchor = props.as === 'a';

	const {
		as: _as,
		rootRef,
		variant: _variant,
		size: _size,
		active: _active,
		disabled: _disabled,
		loading: _loading,
		fullWidth: _fullWidth,
		className: _className,
		prefix: _prefix,
		postfix: _postfix,
		children: _children,
		type = 'button',
		...rest
	} = props;

	if (isAnchor) {
		return (
			<Typography
				as='a'
				rootRef={rootRef}
				className={view.className}
				{...view.data}
				aria-disabled={view.isDisabled ? true : undefined}
				tabIndex={view.isDisabled ? -1 : undefined}
				{...rest}
				aria-pressed={view.active}
				aria-busy={view.loading || undefined}
			>
				{view.content}
			</Typography>
		);
	}

	return (
		<Typography
			as='button'
			rootRef={rootRef}
			className={view.className}
			{...view.data}
			type={type}
			disabled={view.isDisabled}
			{...rest}
			aria-pressed={view.active}
			aria-busy={view.loading || undefined}
		>
			{view.content}
		</Typography>
	);
};
