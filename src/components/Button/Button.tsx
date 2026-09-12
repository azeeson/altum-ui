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
import {ButtonBase, buttonBaseStyles as styles} from '../../base/ButtonBase';
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
		iconStart,
		iconEnd,
		children,
		className,
		disabled,
		loading = false,
		fullWidth,
		shortcut,
		title,
		...props
	},
	ref,
) {
	const shortcutLabel = shortcut ? formatKeyboardShortcut(shortcut) : '';

	return (
		<ButtonBase
			ref={ref}
			className={cn(fullWidth && styles.fullWidth, className)}
			disabled={disabled || loading}
			aria-keyshortcuts={shortcut ? formatAriaKeyShortcuts(shortcut) : undefined}
			title={title ?? (shortcutLabel || undefined)}
			{...props}
			aria-busy={loading || undefined}
		>
			{loading ? <span className={styles.spin} aria-hidden /> : iconStart}
			{children}
			{iconEnd}
		</ButtonBase>
	);
});

Button.displayName = 'Button';
