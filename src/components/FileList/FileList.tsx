import type {FileListItemProps, FileListRootProps} from './FileList.types';
export type {FileListItemStatus, FileListItemProps, FileListRootProps} from './FileList.types';

import type {MouseEvent} from 'react';
import {Attachment} from '../Attachment/Attachment';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Progress} from '../Progress/Progress';
import {IconDocument} from '../../icons/icons/IconDocument';
import {IconCross} from '../../icons/icons/IconCross';
import {IconTimeReverse} from '../../icons/icons/IconTimeReverse';
import styles from './FileList.module.css';
import {cn} from '../../core/utils/cn';
import {formatBytes} from '../../core/utils/form';
import {uRef} from '../../core/utils/bundle';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_fileList} from '../../locales/slices/fileList.ru';

const localeFallback = {
	fileList: ru_fileList,
};

type FileItemActions = {
	id: string;
	onRemove?: (id: string) => void;
	onRetry?: (id: string) => void;
};

const fileItemActions = new WeakMap<HTMLLIElement, FileItemActions>();

export function FileListItem({
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
	itemRef,
	...rest
}: FileListItemProps) {
	const {t} = useLocale(localeFallback);
	const status = providedStatus ?? (progress != null && progress < 100 ? 'uploading' : 'idle');
	const formattedSize = typeof size === 'string' ? size : size != null ? formatBytes(size) : undefined;
	const progressPercent = status === 'uploading' && progress != null ? `${Math.round(progress)}%` : undefined;
	const retry = status === 'error' && onRetry;
	const showMeta = Boolean(formattedSize || progressPercent || (status === 'error' && error));

	return (
		<li
			ref={uRef(itemRef, (node) => {
				if (node) fileItemActions.set(node, {
					id,
					onRemove,
					onRetry
				});
			})}
			{...rest}
			className={cn(styles.item, className)}
			data-status={status}
			data-file-id={id}
		>
			<Attachment
				size={attachmentSize}
				status={status}
				className={styles.attachment}
				media={previewUrl ? <img src={previewUrl} alt='' /> : (
					<IconDocument
						size={attachmentSize === 'xs'
							? 'var(--altum-control-icon-size-sm)'
							: 'var(--altum-control-icon-size-md)'}
						aria-hidden
					/>
				)}
				title={name}
				description={showMeta ? (
					<span className={styles.metaContainer}>
						{formattedSize ? <span>
							{formattedSize}
						</span> : null}
						{progressPercent ? <span>
							{progressPercent}
						</span> : null}
						{status === 'error' && error ? <span>
							{error}
						</span> : null}
					</span>
				) : undefined}
				actions={(onRemove || retry) ? (
					<>
						{retry ? (
							<ButtonIcon
								size='sm'
								variant='ghost'
								aria-label={retryLabel ?? t('fileList.retry')}
								icon={<IconTimeReverse size='var(--altum-control-icon-size-sm)' aria-hidden />}
								data-file-action='retry'
							/>
						) : null}
						{onRemove ? (
							<ButtonIcon
								size='sm'
								variant='ghost'
								aria-label={removeLabel ?? t('fileList.remove')}
								icon={<IconCross size='var(--altum-control-icon-size-sm)' aria-hidden />}
								data-file-action='remove'
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
}

/**
 * Список файлов на базе **Attachment**: статус загрузки, retry и удаление.
 * Плоский `items` и compound `FileList.Item` можно смешивать.
 *
 * @component
 * @example
 * <FileList
 *   items={[{id: '1', name: 'report.pdf', status: 'done'}]}
 *   onRemove={(id) => remove(id)}
 * />
 */
function FileListRoot({
	children,
	items,
	onRemove,
	onRetry,
	className,
	style,
	rootRef,
	...rest
}: FileListRootProps) {
	const handleClick = (event: MouseEvent<HTMLUListElement>) => {
		const action = (event.target as HTMLElement).closest<HTMLElement>('[data-file-action]');
		if (!action || !event.currentTarget.contains(action)) return;
		const item = action.closest('li');
		if (!item || !event.currentTarget.contains(item)) return;
		const entry = fileItemActions.get(item);
		if (!entry) return;
		const kind = action.getAttribute('data-file-action');
		if (kind === 'retry') entry.onRetry?.(entry.id);
		else if (kind === 'remove') entry.onRemove?.(entry.id);
	};

	return (
		<ul
			ref={rootRef}
			{...rest}
			className={cn(styles.list, className)}
			style={style}
			onClick={handleClick}
		>
			{items?.map((item) => (
				<FileListItem
					key={item.id}
					{...item}
					onRemove={item.onRemove ?? onRemove}
					onRetry={item.onRetry ?? onRetry}
				/>
			))}
			{children}
		</ul>
	);
}

export const FileList = Object.assign(FileListRoot, {
	Root: FileListRoot,
	Item: FileListItem,
});
