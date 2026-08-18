import type {
	MediaRowBaseRootProps,
} from './MediaRowBase.types';
export type {
	MediaRowBaseRootProps,
} from './MediaRowBase.types';

import {forwardRef, type ComponentPropsWithoutRef, type ElementType} from 'react';
import {cn} from '../../utils/cn';
import styles from './MediaRowBase.module.css';

type MediaRowBaseSlotProps = ComponentPropsWithoutRef<'div'>;

const MediaRowBaseRoot = forwardRef<HTMLElement, MediaRowBaseRootProps>(function MediaRowBaseRoot(
	{
		as: Comp = 'div',
		children,
		className,
		style,
		...rest
	},
	ref,
) {
	const Element = Comp as ElementType;

	return (
		<Element
			ref={ref as never}
			className={cn(styles.row, className)}
			style={style}
			{...rest}
		>
			{children}
		</Element>
	);
});

const MediaRowBaseMedia = forwardRef<HTMLDivElement, MediaRowBaseSlotProps>(function MediaRowBaseMedia(
	{children, className, style, ...rest},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.media, className)}
			style={style}
			{...rest}
		>
			{children}
		</div>
	);
});

const MediaRowBaseContent = forwardRef<HTMLDivElement, MediaRowBaseSlotProps>(function MediaRowBaseContent(
	{children, className, style, ...rest},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.content, className)}
			style={style}
			{...rest}
		>
			{children}
		</div>
	);
});

const MediaRowBaseTitle = forwardRef<HTMLDivElement, MediaRowBaseSlotProps>(function MediaRowBaseTitle(
	{children, className, style, ...rest},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.title, className)}
			style={style}
			{...rest}
		>
			{children}
		</div>
	);
});

const MediaRowBaseDescription = forwardRef<HTMLDivElement, MediaRowBaseSlotProps>(function MediaRowBaseDescription(
	{children, className, style, ...rest},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.description, className)}
			style={style}
			{...rest}
		>
			{children}
		</div>
	);
});

const MediaRowBaseActions = forwardRef<HTMLDivElement, MediaRowBaseSlotProps>(function MediaRowBaseActions(
	{children, className, style, ...rest},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.actions, className)}
			style={style}
			{...rest}
		>
			{children}
		</div>
	);
});

MediaRowBaseRoot.displayName = 'MediaRowBase';
MediaRowBaseMedia.displayName = 'MediaRowBase.Media';
MediaRowBaseContent.displayName = 'MediaRowBase.Content';
MediaRowBaseTitle.displayName = 'MediaRowBase.Title';
MediaRowBaseDescription.displayName = 'MediaRowBase.Description';
MediaRowBaseActions.displayName = 'MediaRowBase.Actions';

/**
 * Внутренний flex-shell строки: Media / Content / Title / Description / Actions.
 * Продуктовый chrome (варианты, статус, оверлеи) остаётся у потребителя.
 */
export const MediaRowBase = Object.assign(MediaRowBaseRoot, {
	Media: MediaRowBaseMedia,
	Content: MediaRowBaseContent,
	Title: MediaRowBaseTitle,
	Description: MediaRowBaseDescription,
	Actions: MediaRowBaseActions,
});
