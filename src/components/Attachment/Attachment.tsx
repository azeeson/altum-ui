import type {AttachmentProps} from './Attachment.types';
export type {
	AttachmentSize,
	AttachmentStatus,
	AttachmentProps,
} from './Attachment.types';

import {forwardRef} from 'react';
import {Spinner} from '../Spinner/Spinner';
import {Item} from '../Item/Item';
import styles from './Attachment.module.css';
import {cn} from '../../utils/cn';

/**
 * Карточка файла: `Item` + статус загрузки (`idle` / `uploading` / `error` / `done`).
 *
 * @component
 * @example
 * <Attachment
 *   size="sm"
 *   status="uploading"
 *   media={<IconDocument />}
 *   title="report.pdf"
 * />
 */
export const Attachment = forwardRef<HTMLDivElement, AttachmentProps>(function Attachment(
	{
		size = 'md',
		status = 'idle',
		media,
		className,
		...rest
	},
	ref,
) {
	return (
		<Item
			ref={ref}
			{...rest}
			size={size === 'xs' ? 'sm' : size}
			variant='outlined'
			mediaClassName={styles.media}
			titleClassName={styles.title}
			descriptionClassName={styles.description}
			actionsClassName={styles.actions}
			media={status === 'uploading' && media != null ? (
				<>
					{media}
					<span className={styles.uploadOverlay} aria-hidden>
						<Spinner size={16} />
					</span>
				</>
			) : media}
			className={cn(
				styles.attachment,
				size !== 'md' ? styles[size] : '',
				status === 'error' ? styles.error : '',
				className,
			)}
			data-status={status}
		/>
	);
});

Attachment.displayName = 'Attachment';
