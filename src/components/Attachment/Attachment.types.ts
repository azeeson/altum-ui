import type {ItemProps} from '../Item/Item.types';

/**
 * Размер (`AttachmentSize`).
 */
export type AttachmentSize = 'md' | 'sm' | 'xs';

/**
 * Статус загрузки (`AttachmentStatus`).
 */
export type AttachmentStatus = 'idle' | 'uploading' | 'error' | 'done';

/**
 * Свойства `Attachment` — `Item` + статус загрузки.
 */
export interface AttachmentProps extends Omit<ItemProps, 'size' | 'variant'> {
	/** Размер карточки вложения. @default 'md' */
	size?: AttachmentSize;
	/**
	 * Состояние загрузки / ошибки.
	 * @default 'idle'
	 */
	status?: AttachmentStatus;
}
