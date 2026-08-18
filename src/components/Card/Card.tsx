import type {
	CardProps,
	CardSectionProps,
} from './Card.types';
export type {
	CardVariant,
	CardProps,
	CardSectionProps,
} from './Card.types';

import React, {forwardRef} from 'react';
import {Spinner} from '../Spinner/Spinner';
import {Box, type BoxAs} from '../Box/Box';
import styles from './Card.module.css';
import {cn} from '../../utils/cn';

const CardRoot = forwardRef<HTMLDivElement, CardProps>(function CardRoot(
	{
		children,
		hoverable = false,
		variant = 'outlined',
		loading = false,
		className,
		tabIndex,
		style,
		as,
		onClick,
		role,
		...rest
	},
	ref,
) {
	const childArray = React.Children.toArray(children);
	const hasCompound = childArray.some(
		(child) => React.isValidElement(child)
			&& typeof child.type === 'function'
			&& (child.type as {displayName?: string}).displayName?.startsWith('Card.'),
	);

	const resolvedAs: BoxAs = as
		?? (onClick != null && role == null ? 'button' : 'div');

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
			className={cn(
				styles.card,
				variant === 'ghost' ? styles.ghost : '',
				hoverable ? styles.cardHoverable : '',
				loading ? styles.loading : '',
				className,
			)}
			style={style}
			tabIndex={tabIndex}
			aria-busy={loading || undefined}
			{...rest}
			onClick={onClick}
			role={role}
		>
			{hasCompound ? children : (children != null && (
				<div className={styles.cardBody}>
					{children}
				</div>
			))}
			{loading && (
				<div className={styles.loadingOverlay} aria-hidden>
					<Spinner />
				</div>
			)}
		</Box>
	);
});

const CardHeader = forwardRef<HTMLDivElement, CardSectionProps>(function CardHeader(
	{children, className, style, ...rest},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.cardHeader, className)}
			style={style}
			{...rest}
		>
			{children}
		</div>
	);
});

const CardMedia = forwardRef<HTMLDivElement, CardSectionProps>(function CardMedia(
	{children, className, style, ...rest},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.cardMedia, className)}
			style={style}
			{...rest}
		>
			{children}
		</div>
	);
});

const CardBody = forwardRef<HTMLDivElement, CardSectionProps>(function CardBody(
	{children, className, style, ...rest},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.cardBody, className)}
			style={style}
			{...rest}
		>
			{children}
		</div>
	);
});

const CardActions = forwardRef<HTMLDivElement, CardSectionProps>(function CardActions(
	{children, className, style, ...rest},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.cardFooter, className)}
			style={style}
			{...rest}
		>
			{children}
		</div>
	);
});

CardRoot.displayName = 'Card';
CardHeader.displayName = 'Card.Header';
CardMedia.displayName = 'Card.Media';
CardBody.displayName = 'Card.Body';
CardActions.displayName = 'Card.Actions';

/**
 * Карточка на базе `Box`: `variant`, составные `Header` / `Media` / `Body` / `Actions`, `loading`.
 * При `onClick` без `as` корень — `<button type="button">`.
 *
 * @component
 * @example
 * <Card variant="elevated" loading={isLoading}>
 *   <Card.Header>Заголовок</Card.Header>
 *   <Card.Body>Контент</Card.Body>
 * </Card>
 */
export const Card = Object.assign(CardRoot, {
	Header: CardHeader,
	Media: CardMedia,
	Body: CardBody,
	Actions: CardActions,
});
