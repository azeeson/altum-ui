import type {
	UploadZoneProps,
} from './UploadZone.types';
export type {
	UploadZoneProps,
} from './UploadZone.types';

import {useRef, useState} from 'react';
import styles from './UploadZone.module.css';
import visuallyHidden from '../../styles/visuallyHidden.module.css';
import {cn} from '../../core/utils/cn';
import {useFallbackId} from '../../hooks/useFallbackId';
import {useFileDrop} from '../../hooks/useFileDrop';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_upload} from '../../locales/slices/upload.ru';

const localeFallback = {
	upload: ru_upload,
};



/**
 * Зона загрузки файлов drag-and-drop с скрытым input и render-prop для кастомного триггера.
 *
 * @component
 * @example
 * <UploadZone onChange={(files) => upload(files)}>
 *   Перетащите файл или нажмите для выбора
 * </UploadZone>
 */
export const UploadZone = ({
	onChange,
	multiple = true,
	className,
	children,
	readOnly = false,
	disabled = false,
	id,
	rootRef,
	...rest
}: UploadZoneProps) => {
	const {t} = useLocale(localeFallback);
	const inputId = useFallbackId(id ? `${id}-file` : undefined);
	const [selectedText, setSelectedText] = useState('');
	const fileInputRef = useRef<HTMLInputElement>(null);
	const isInteractive = !disabled && !readOnly;

	const processFiles = (files: FileList) => {
		if (!files.length) return;
		setSelectedText(t('upload.selectedCount', {count: files.length}));
		onChange?.(files);
	};

	const {over, ...drop} = useFileDrop(isInteractive ? processFiles : undefined);
	const isCustom = children != null;

	return (
		<div
			ref={rootRef}
			id={id}
			className={cn(styles.container, className)}
			data-custom={isCustom ? '' : undefined}
			data-readonly={readOnly && !disabled ? '' : undefined}
			data-disabled={disabled ? '' : undefined}
			data-over={over ? '' : undefined}
			aria-readonly={readOnly && !disabled || undefined}
			aria-disabled={disabled || undefined}
			{...drop}
			{...rest}
		>
			<input
				id={inputId}
				type='file'
				multiple={multiple}
				disabled={!isInteractive}
				className={visuallyHidden.root}
				ref={fileInputRef}
				onChange={(e) => {
					if (e.target.files) processFiles(e.target.files);
				}}
			/>
			{isCustom
				? (typeof children === 'function' ? children(() => fileInputRef.current?.click()) : children)
				: (
					<label htmlFor={inputId} className={styles.uploadLabel}>
						<span className={styles.uploadIcon} aria-hidden>
							↑
						</span>
						<span className={styles.uploadText}>
							{selectedText || (
								<>
									{t('upload.dropHint')}
									{' '}
									<span className={styles.accentText}>
										{t('upload.choose')}
									</span>
								</>
							)}
						</span>
					</label>
				)}
			{over && (
				<div className={styles.overlay}>
					<span className={styles.uploadIcon} aria-hidden>
						↓
					</span>
					{t('upload.release')}
				</div>
			)}
		</div>
	);
};
