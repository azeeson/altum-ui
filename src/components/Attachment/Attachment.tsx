import type {AttachmentProps} from './Attachment.types';
export type {
	AttachmentSize,
	AttachmentStatus,
	AttachmentProps,
} from './Attachment.types';

import {Spinner} from '../Spinner/Spinner';
import {Item} from '../Item/Item';
import styles from './Attachment.module.css';
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';

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
export function Attachment({
	size = 'md',
	status = 'idle',
	media,
	className,
	rootRef,
	...rest
}: AttachmentProps) {
	const isUploading = status === 'uploading';

	return (
		<Item
			rootRef={rootRef}
			{...rest}
			size={size === 'xs' ? 'sm' : size}
			variant='outlined'
			mediaClassName={styles.media}
			titleClassName={styles.title}
			descriptionClassName={styles.description}
			media={isUploading && media != null ? (
				<>
					{media}
					<span className={cn(utilities.fCenter, styles.uploadOverlay)} aria-hidden>
						<Spinner size={16} aria-hidden />
					</span>
				</>
			) : media}
			className={cn(styles.attachment, className)}
			data-status={status}
			data-size={size !== 'md' ? size : undefined}
			aria-busy={isUploading || undefined}
			aria-invalid={status === 'error' || undefined}
		/>
	);
}
