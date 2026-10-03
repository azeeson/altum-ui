import type {FileUploaderProps} from './FileUploader.types';
export type {
	FileUploaderFile,
	FileUploaderProps,
} from './FileUploader.types';

import {UploadZone} from '../UploadZone/UploadZone';
import {FileList} from '../FileList/FileList';
import styles from './FileUploader.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Зона загрузки + опциональный список файлов со статусом и Progress.
 * Собирает `UploadZone` и `FileList` без собственного chrome.
 *
 * @component
 * @example
 * <FileUploader
 *   files={[{id: '1', name: 'report.pdf', status: 'uploading', progress: 40}]}
 *   onFiles={(list) => addFiles(list)}
 * />
 */
export function FileUploader({
	files,
	onFiles,
	children,
	multiple = true,
	disabled = false,
	readOnly = false,
	onRemove,
	onRetry,
	className,
	rootRef,
	...rest
}: FileUploaderProps) {
	const showList = files != null && files.length > 0;

	return (
		<div
			ref={rootRef}
			className={cn(styles.root, className)}
			{...rest}
		>
			<UploadZone
				multiple={multiple}
				disabled={disabled}
				readOnly={readOnly}
				onChange={onFiles}
			>
				{children}
			</UploadZone>
			{showList ? (
				<FileList
					items={files}
					onRemove={onRemove}
					onRetry={onRetry}
				/>
			) : null}
		</div>
	);
}
