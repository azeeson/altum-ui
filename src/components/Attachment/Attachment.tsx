import type {
	AttachmentProps,
	AttachmentMediaProps,
	AttachmentContentProps,
	AttachmentTitleProps,
	AttachmentDescriptionProps,
	AttachmentActionsProps,
	AttachmentActionProps,
} from './Attachment.types';
export type {
	AttachmentSize,
	AttachmentStatus,
	AttachmentProps,
	AttachmentMediaProps,
	AttachmentContentProps,
	AttachmentTitleProps,
	AttachmentDescriptionProps,
	AttachmentActionsProps,
	AttachmentActionProps,
} from './Attachment.types';

import {forwardRef} from 'react';
import {Spinner} from '../Spinner/Spinner';
import {Box} from '../Box/Box';
import {MediaRowBase} from '../../base/MediaRowBase';
import styles from './Attachment.module.css';
import {cn} from '../../utils/cn';

const AttachmentRoot = forwardRef<HTMLDivElement, AttachmentProps>(function AttachmentRoot(
	{
		children,
		size = 'md',
		status = 'idle',
		className,
		style,
		...rest
	},
	ref,
) {
	return (
		<MediaRowBase
			ref={ref}
			as={Box}
			{...rest}
			variant='outlined'
			border
			shadow='none'
			padding='sm'
			radius='md'
			className={cn(
				styles.attachment,
				size !== 'md' ? styles[size] : '',
				status === 'error' ? styles.error : '',
				status === 'uploading' ? styles.uploading : '',
				className,
			)}
			style={style}
			data-size={size}
			data-status={status}
		>
			{children}
		</MediaRowBase>
	);
});

const AttachmentMedia = forwardRef<HTMLDivElement, AttachmentMediaProps>(function AttachmentMedia(
	{children, className, style, ...rest},
	ref,
) {
	return (
		<MediaRowBase.Media
			ref={ref}
			className={cn(styles.media, className)}
			style={style}
			{...rest}
		>
			{children}
			<span className={styles.uploadOverlay} aria-hidden>
				<Spinner size={16} />
			</span>
		</MediaRowBase.Media>
	);
});

const AttachmentContent = forwardRef<HTMLDivElement, AttachmentContentProps>(function AttachmentContent(
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

const AttachmentTitle = forwardRef<HTMLDivElement, AttachmentTitleProps>(function AttachmentTitle(
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

const AttachmentDescription = forwardRef<HTMLDivElement, AttachmentDescriptionProps>(
	function AttachmentDescription(
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
	},
);

const AttachmentActions = forwardRef<HTMLDivElement, AttachmentActionsProps>(function AttachmentActions(
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

const AttachmentAction = forwardRef<HTMLButtonElement, AttachmentActionProps>(function AttachmentAction(
	{children, className, style, type = 'button', ...rest},
	ref,
) {
	return (
		<button
			ref={ref}
			type={type}
			className={cn(styles.action, className)}
			style={style}
			{...rest}
		>
			{children}
		</button>
	);
});

AttachmentRoot.displayName = 'Attachment';
AttachmentMedia.displayName = 'Attachment.Media';
AttachmentContent.displayName = 'Attachment.Content';
AttachmentTitle.displayName = 'Attachment.Title';
AttachmentDescription.displayName = 'Attachment.Description';
AttachmentActions.displayName = 'Attachment.Actions';
AttachmentAction.displayName = 'Attachment.Action';

/**
 * Карточка файла или изображения: media, метаданные, статус загрузки и действия.
 *
 * @component
 * @example
 * <Attachment size="sm" status="uploading">
 *   <Attachment.Media><IconDocument /></Attachment.Media>
 *   <Attachment.Content>
 *     <Attachment.Title>report.pdf</Attachment.Title>
 *   </Attachment.Content>
 * </Attachment>
 */
export const Attachment = Object.assign(AttachmentRoot, {
	Media: AttachmentMedia,
	Content: AttachmentContent,
	Title: AttachmentTitle,
	Description: AttachmentDescription,
	Actions: AttachmentActions,
	Action: AttachmentAction,
});
