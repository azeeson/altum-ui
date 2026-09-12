import type {
	FileListItemProps,
	FileListRootProps,
} from './FileList.types';
export type {
	FileListItemStatus,
	FileListItemProps,
	FileListRootProps,
} from './FileList.types';

import {forwardRef, type ComponentPropsWithoutRef, type ReactNode} from 'react';
import {Item} from '../Item/Item';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Progress} from '../Progress/Progress';
import {Stack} from '../Layout/Stack';
import {IconDocument} from '../../icons/icons/IconDocument';
import {IconCross} from '../../icons/icons/IconCross';
import {IconTimeReverse} from '../../icons/icons/IconTimeReverse';
import styles from './FileList.module.css';
import {cn} from '../../utils/cn';
import {formatBytes} from '../../utils/formatBytes';
import {useLocale} from '../../locales/localeContext';

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
	const meta = [typeof size === 'string' ? size : size != null ? formatBytes(size) : undefined, status === 'uploading' && progress != null ? `${Math.round(progress)}%` : undefined, status === 'error' ? error : undefined,].filter(Boolean) as ReactNode[];
	const retry = status === 'error' && onRetry;

	return (
		<li
			ref={ref}
			className={cn(styles.item, className)}
			data-status={status}
			{...rest}
		>
			<Item
				size={attachmentSize === 'xs' ? 'sm' : attachmentSize}
				variant='ghost'
				media={previewUrl ? <img src={previewUrl} alt='' /> : (
					<IconDocument size={attachmentSize === 'xs' ? 14 : 18} aria-hidden />
				)}
				title={name}
				description={meta.length > 0
					? meta.flatMap((part, index) => (index > 0 ? [' · ', part] : [part]))
					: undefined}
				actions={(onRemove || retry) ? (
					<>
						{retry ? (
							<ButtonIcon
								size='sm'
								aria-label={retryLabel ?? t('fileList.retry')}
								icon={<IconTimeReverse size={14} aria-hidden />}
								onClick={() => onRetry(id)}
							/>
						) : null}
						{onRemove ? (
							<ButtonIcon
								size='sm'
								aria-label={removeLabel ?? t('fileList.remove')}
								icon={<IconCross size={14} aria-hidden />}
								onClick={() => onRemove(id)}
							/>
						) : null}
					</>
				) : undefined}
			/>
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
 * Список файлов на базе **Item**: статус загрузки, retry и удаление.
 *
 * @component
 * @example
 * <FileList>
 *   <FileList.Item id="1" name="report.pdf" status="done" />
 * </FileList>
 */
const FileListRoot = forwardRef<HTMLUListElement, FileListRootProps>(function FileListRoot(
	{children, className, ...rest},
	ref,
) {
	return (
		<Stack
			ref={ref as never}
			as='ul'
			gap='sm'
			className={cn(styles.list, className)}
			{...rest as ComponentPropsWithoutRef<'div'>}
		>
			{children}
		</Stack>
	);
});

FileListRoot.displayName = 'FileList.Root';

export const FileList = Object.assign(FileListRoot, {
	Root: FileListRoot,
	Item: FileListItem,
});
