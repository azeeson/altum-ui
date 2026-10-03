import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';
import {type AttachmentSize} from '../Attachment/Attachment';

/** Статус строки `FileList.Item`. */
export type FileListItemStatus = 'idle' | 'uploading' | 'done' | 'error';

/** Свойства `FileList.Item`. */
export interface FileListItemProps extends Omit<ComponentPropsWithoutRef<'li'>, 'id' | 'itemRef'> {
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
	/** Строка списка. */
	itemRef?: Ref<HTMLLIElement>;
}

/** Свойства корня `FileList`. */
export interface FileListRootProps extends Omit<ComponentPropsWithoutRef<'ul'>, 'children'> {
	/** Compound-строки (`FileList.Item`); можно смешивать с `items`. */
	children?: React.ReactNode;
	/** Плоский список строк → `FileList.Item`. */
	items?: FileListItemProps[];
	/** Общий remove для `items`; у строки свой `onRemove` приоритетнее. */
	onRemove?: (id: string) => void;
	/** Общий retry для `items`; у строки свой `onRetry` приоритетнее. */
	onRetry?: (id: string) => void;
	/** Корень списка. */
	rootRef?: Ref<HTMLUListElement>;
}
