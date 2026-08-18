import type {
	FileListItemProps,
	FileListRootProps,
} from './FileList.types';
export type {
	FileListItemStatus,
	FileListItemProps,
	FileListRootProps,
} from './FileList.types';

import React, {forwardRef} from 'react';
import {Attachment} from '../Attachment/Attachment';
import {Progress} from '../Progress/Progress';
import {IconDocument} from '../../icons/icons/IconDocument';
import {IconCross} from '../../icons/icons/IconCross';
import {IconTimeReverse} from '../../icons/icons/IconTimeReverse';
import styles from './FileList.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../LocaleProvider/LocaleProvider';

function formatSize(size: number | string | undefined): string | undefined {
	if (size == null) return undefined;
	if (typeof size === 'string') return size;
	if (size < 1024) return `${size} B`;
	if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
	return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export const FileListItem = forwardRef<HTMLLIElement, FileListItemProps>(function FileListItem(
	{
		id,
		name,
		size,
		progress,
		status: providedStatus,
		error,
		previewUrl,
		onRemove,
		onRetry,
		removeLabel,
		retryLabel,
		attachmentSize = 'sm',
		className,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const status = providedStatus ?? (progress != null && progress < 100 ? 'uploading' : 'idle');
	const description = [formatSize(size), status === 'uploading' && progress != null ? `${Math.round(progress)}%` : undefined, status === 'error' ? error : undefined,].filter(Boolean);

	return (
		<li
			ref={ref}
			className={cn(styles.item, className)}
			data-status={status}
			{...rest}
		>
			<Attachment
				size={attachmentSize}
				status={status}
				className={styles.attachment}
			>
				<Attachment.Media>
					{previewUrl ? <img src={previewUrl} alt='' /> : (
						<IconDocument size={attachmentSize === 'xs' ? 14 : 18} aria-hidden />
					)}
				</Attachment.Media>
				<Attachment.Content>
					<Attachment.Title>
						{name}
					</Attachment.Title>
					{description.length > 0 && (
						<Attachment.Description>
							{description.map((value, index) => (
								<React.Fragment key={index}>
									{index > 0 && ' · '}
									{value}
								</React.Fragment>
							))}
						</Attachment.Description>
					)}
				</Attachment.Content>
				{(onRemove || (status === 'error' && onRetry)) && (
					<Attachment.Actions>
						{status === 'error' && onRetry && (
							<Attachment.Action
								aria-label={retryLabel ?? t('fileList.retry')}
								onClick={() => onRetry(id)}
							>
								<IconTimeReverse size={14} aria-hidden />
							</Attachment.Action>
						)}
						{onRemove && (
							<Attachment.Action
								aria-label={removeLabel ?? t('fileList.remove')}
								onClick={() => onRemove(id)}
							>
								<IconCross size={14} aria-hidden />
							</Attachment.Action>
						)}
					</Attachment.Actions>
				)}
			</Attachment>
			{status === 'uploading' && (
				<Progress
					percentage={progress ?? 0}
					indeterminate={progress == null}
					showValueText={false}
					className={styles.progress}
				/>
			)}
		</li>
	);
});

FileListItem.displayName = 'FileList.Item';

/**
 * Список файлов на базе **Attachment**: статус загрузки, retry и удаление.
 *
 * @component
 * @example
 * <FileList>
 *   <FileList.Item id="1" name="report.pdf" status="done" />
 * </FileList>
 */
const FileListRoot = forwardRef<HTMLUListElement, FileListRootProps>(function FileListRoot(
	{children, className, style, ...rest},
	ref,
) {
	return (
		<ul
			ref={ref}
			className={cn(styles.list, className)}
			style={style}
			{...rest}
		>
			{children}
		</ul>
	);
});

FileListRoot.displayName = 'FileList.Root';

export const FileList = Object.assign(FileListRoot, {
	Root: FileListRoot,
	Item: FileListItem,
});
