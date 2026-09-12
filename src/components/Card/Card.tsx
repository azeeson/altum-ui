import type {CardProps} from './Card.types';
export type {
	CardVariant,
	CardProps,
} from './Card.types';

import {forwardRef} from 'react';
import {Box} from '../Box/Box';
import styles from './Card.module.css';
import {cn} from '../../utils/cn';
import {implicitAs} from '../../utils/implicitAs';

/**
 * Карточка на базе `Box`: `variant`, `header` / `media` / `children` / `actions`, `loading`.
 * Радиус по умолчанию — `lg` (поверхность, не контрол).
 * При `onClick` без `as` корень — `<button type="button">`.
 *
 * @component
 * @example
 * <Card variant="elevated" header="Заголовок" loading={isLoading}>
 *   Контент
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
	{
		children,
		header,
		media,
		actions,
		hoverable = false,
		variant = 'outlined',
		loading = false,
		className,
		as,
		onClick,
		role,
		radius = 'lg',
		...rest
	},
	ref,
) {
	const resolvedAs = implicitAs(as, onClick, role);

	if (
		process.env.NODE_ENV !== 'production'
		&& onClick != null
		&& resolvedAs !== 'button'
		&& resolvedAs !== 'a'
		&& role !== 'button'
	) {
		console.warn(
			'Card: onClick на корне, который не является кнопкой. '
			+ 'Передайте as="button" или вложите Button вместо onClick на div.',
		);
	}

	return (
		<Box
			ref={ref}
			as={resolvedAs}
			variant={variant}
			radius={radius}
			className={cn(
				styles.card,
				variant === 'ghost' && styles.ghost,
				hoverable && styles.hoverable,
				loading && styles.loading,
				className,
			)}
			aria-busy={loading || undefined}
			{...rest}
			onClick={onClick}
			role={role}
		>
			{header != null && (
				<div className={styles.header}>
					{header}
				</div>
			)}
			{media != null && (
				<div className={styles.media}>
					{media}
				</div>
			)}
			{children != null && (
				<div className={styles.body}>
					{children}
				</div>
			)}
			{actions != null && (
				<div className={styles.footer}>
					{actions}
				</div>
			)}
			{loading && (
				<div className={styles.loadingOverlay} aria-hidden />
			)}
		</Box>
	);
});

Card.displayName = 'Card';
