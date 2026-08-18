import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Размер (`AttachmentSize`).
 */
export type AttachmentSize = 'md' | 'sm' | 'xs';

/**
 * Статус загрузки (`AttachmentStatus`).
 */
export type AttachmentStatus = 'idle' | 'uploading' | 'error' | 'done';

/**
 * Свойства `Attachment`.
 */
export interface AttachmentProps extends ComponentPropsWithoutRef<'div'> {
	children: React.ReactNode;
	/** Размер карточки вложения. @default 'md' */
	size?: AttachmentSize;
	/**
	 * Состояние загрузки / ошибки.
	 * @default 'idle'
	 */
	status?: AttachmentStatus;
}

/**
 * Свойства `Attachment.Media`.
 */
export interface AttachmentMediaProps extends ComponentPropsWithoutRef<'div'> {
	children: React.ReactNode;
}

/**
 * Свойства `Attachment.Content`.
 */
export interface AttachmentContentProps extends ComponentPropsWithoutRef<'div'> {
	children: React.ReactNode;
}

/**
 * Свойства `Attachment.Title`.
 */
export interface AttachmentTitleProps extends ComponentPropsWithoutRef<'div'> {
	children: React.ReactNode;
}

/**
 * Свойства `Attachment.Description`.
 */
export interface AttachmentDescriptionProps extends ComponentPropsWithoutRef<'div'> {
	children: React.ReactNode;
}

/**
 * Свойства `Attachment.Actions`.
 */
export interface AttachmentActionsProps extends ComponentPropsWithoutRef<'div'> {
	children: React.ReactNode;
}

/**
 * Свойства `Attachment.Action`.
 */
export interface AttachmentActionProps extends ComponentPropsWithoutRef<'button'> {
	children: React.ReactNode;
}
