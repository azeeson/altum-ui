import type {
	ButtonProps,
} from './Button.types';
export type {
	ButtonVariant,
	ButtonStatus,
	ButtonProps,
} from './Button.types';

import {forwardRef} from 'react';
import {formatAriaKeyShortcuts, formatKeyboardShortcut} from '../../utils/keyboardShortcut';
import {ButtonBase} from '../../base/ButtonBase';
import {Spinner} from '../Spinner/Spinner';
import styles from './Button.module.css';
import {cn} from '../../utils/cn';

/**
 * Кнопка действия с вариантами оформления, loading-состоянием и опциональным шорткатом.
 *
 * @component
 * @example
 * <Button variant="primary" status="danger" loading={saving} onClick={handleDelete}>
 *   Удалить
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{
		variant = 'primary',
		status = 'default',
		size = 'md',
		iconStart,
		iconEnd,
		children,
		className,
		disabled,
		loading = false,
		fullWidth,
		shortcut,
		title,
		active,
		asChild = false,
		...props
	},
	ref,
) {
	const isButtonDisabled = disabled || loading;
	const shortcutLabel = shortcut ? formatKeyboardShortcut(shortcut) : '';
	const ariaKeyshortcuts = shortcut ? formatAriaKeyShortcuts(shortcut) : undefined;
	const resolvedTitle = title
		?? (shortcutLabel ? shortcutLabel : undefined);

	if (asChild) {
		return (
			<ButtonBase
				ref={ref}
				asChild
				variant={variant}
				status={status}
				size={size}
				active={active}
				className={cn(styles.root, fullWidth ? styles.fullWidth : '', className)}
				disabled={isButtonDisabled}
				aria-keyshortcuts={ariaKeyshortcuts}
				title={resolvedTitle}
				{...props}
				aria-busy={loading || undefined}
			>
				{children}
			</ButtonBase>
		);
	}

	return (
		<ButtonBase
			ref={ref}
			variant={variant}
			status={status}
			size={size}
			active={active}
			className={cn(styles.root, fullWidth ? styles.fullWidth : '', className)}
			disabled={isButtonDisabled}
			aria-keyshortcuts={ariaKeyshortcuts}
			title={resolvedTitle}
			{...props}
			aria-busy={loading || undefined}
		>
			{loading && (
				<Spinner
					size='sm'
					aria-hidden
					className={styles.spinner}
				/>
			)}
			{!loading && iconStart && (
				<span className={styles.btnIcon}>
					{iconStart}
				</span>
			)}
			{children}
			{iconEnd && (
				<span className={styles.btnIcon}>
					{iconEnd}
				</span>
			)}
		</ButtonBase>
	);
});

Button.displayName = 'Button';
