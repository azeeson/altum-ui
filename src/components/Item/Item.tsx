import type {
	ItemProps,
	ItemMediaProps,
	ItemContentProps,
	ItemTitleProps,
	ItemDescriptionProps,
	ItemActionsProps,
} from './Item.types';
export type {
	ItemSize,
	ItemMediaVariant,
	ItemVariant,
	ItemProps,
	ItemMediaProps,
	ItemContentProps,
	ItemTitleProps,
	ItemDescriptionProps,
	ItemActionsProps,
} from './Item.types';

import {forwardRef, type ButtonHTMLAttributes} from 'react';
import {Box, type BoxAs, type BoxProps} from '../Box/Box';
import {MediaRowBase} from '../../base/MediaRowBase';
import styles from './Item.module.css';
import {cn} from '../../utils/cn';

const ItemSurface = forwardRef<HTMLElement, Omit<BoxProps, 'as'> & {itemAs?: BoxAs}>(
	function ItemSurface({itemAs = 'div', ...props}, ref) {
		const type = itemAs === 'button'
			? (props as ButtonHTMLAttributes<HTMLButtonElement>).type ?? 'button'
			: undefined;
		return (
			<Box
				ref={ref}
				as={itemAs}
				{...props}
				{...(type != null ? {type} : {})}
			/>
		);
	},
);
ItemSurface.displayName = 'Item.Surface';

const ItemRoot = forwardRef<HTMLDivElement, ItemProps>(function ItemRoot(
	{
		children,
		size = 'md',
		variant = 'ghost',
		interactive = false,
		as,
		className,
		style,
		onClick,
		role,
		...rest
	},
	ref,
) {
	const resolvedAs: BoxAs = as
		?? (interactive && onClick != null && role == null ? 'button' : 'div');

	if (
		process.env.NODE_ENV !== 'production'
		&& interactive
		&& onClick != null
		&& resolvedAs !== 'button'
		&& resolvedAs !== 'a'
		&& role !== 'button'
	) {
		console.warn(
			'Item: interactive + onClick на корне, который не является кнопкой. '
			+ 'Передайте as="button" или вложите Button вместо onClick на div.',
		);
	}

	return (
		<MediaRowBase
			ref={ref}
			as={ItemSurface}
			itemAs={resolvedAs}
			variant={variant}
			padding='none'
			className={cn(
				styles.item,
				styles[size],
				interactive ? styles.interactive : '',
				className,
			)}
			style={style}
			data-size={size}
			{...rest}
			role={role}
			onClick={onClick}
		>
			{children}
		</MediaRowBase>
	);
});

const ItemMedia = forwardRef<HTMLDivElement, ItemMediaProps>(function ItemMedia(
	{
		children,
		variant = 'icon',
		className,
		style,
		...rest
	},
	ref,
) {
	return (
		<MediaRowBase.Media
			ref={ref}
			className={cn(
				styles.media,
				styles[`media_${variant}`],
				className,
			)}
			style={style}
			data-variant={variant}
			{...rest}
		>
			{children}
		</MediaRowBase.Media>
	);
});

const ItemContent = forwardRef<HTMLDivElement, ItemContentProps>(function ItemContent(
	{children, className, style, ...rest},
	ref,
) {
	return (
		<MediaRowBase.Content
			ref={ref}
			className={className}
			style={style}
			{...rest}
		>
			{children}
		</MediaRowBase.Content>
	);
});

const ItemTitle = forwardRef<HTMLDivElement, ItemTitleProps>(function ItemTitle(
	{children, className, style, ...rest},
	ref,
) {
	return (
		<MediaRowBase.Title
			ref={ref}
			className={cn(styles.title, className)}
			style={style}
			{...rest}
		>
			{children}
		</MediaRowBase.Title>
	);
});

const ItemDescription = forwardRef<HTMLDivElement, ItemDescriptionProps>(function ItemDescription(
	{children, className, style, ...rest},
	ref,
) {
	return (
		<MediaRowBase.Description
			ref={ref}
			className={cn(styles.description, className)}
			style={style}
			{...rest}
		>
			{children}
		</MediaRowBase.Description>
	);
});

const ItemActions = forwardRef<HTMLDivElement, ItemActionsProps>(function ItemActions(
	{children, className, style, ...rest},
	ref,
) {
	return (
		<MediaRowBase.Actions
			ref={ref}
			className={cn(styles.actions, className)}
			style={style}
			{...rest}
		>
			{children}
		</MediaRowBase.Actions>
	);
});

ItemRoot.displayName = 'Item';
ItemMedia.displayName = 'Item.Media';
ItemContent.displayName = 'Item.Content';
ItemTitle.displayName = 'Item.Title';
ItemDescription.displayName = 'Item.Description';
ItemActions.displayName = 'Item.Actions';

/**
 * Составная строка списка: Media / Content / Title / Description / Actions.
 *
 * @component
 * @example
 * <Item size="sm" interactive onClick={() => {}}>
 *   <Item.Media variant="icon">📁</Item.Media>
 *   <Item.Content>
 *     <Item.Title>Документы</Item.Title>
 *   </Item.Content>
 * </Item>
 */
export const Item = Object.assign(ItemRoot, {
	Media: ItemMedia,
	Content: ItemContent,
	Title: ItemTitle,
	Description: ItemDescription,
	Actions: ItemActions,
});
