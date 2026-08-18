import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';
import {type AttachmentSize} from '../Attachment/Attachment';

/** Статус строки `FileList.Item`. */
export type FileListItemStatus = 'idle' | 'uploading' | 'done' | 'error';

/** Свойства `FileList.Item`. */
export interface FileListItemProps extends Omit<ComponentPropsWithoutRef<'li'>, 'id'> {
	id: string;
	name: string;
	size?: number | string;
	progress?: number;
	status?: FileListItemStatus;
	error?: React.ReactNode;
	previewUrl?: string;
	onRemove?: (id: string) => void;
	onRetry?: (id: string) => void;
	removeLabel?: string;
	retryLabel?: string;
	attachmentSize?: AttachmentSize;
}

/** Свойства корня `FileList`. */
export interface FileListRootProps extends Omit<ComponentPropsWithoutRef<'ul'>, 'children'> {
	children: React.ReactNode;
}
