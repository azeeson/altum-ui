import type {
	UploadZoneProps,
} from './UploadZone.types';
export type {
	UploadZoneProps,
} from './UploadZone.types';

import {forwardRef, useRef, useState} from 'react';
import styles from './UploadZone.module.css';
import srOnly from '../../styles/srOnly.module.css';
import {cn} from '../../utils/cn';
import {useFallbackId} from '../../hooks/useFallbackId';
import {useFileDrop} from '../../hooks/useFileDrop';
import {useLocale} from '../../locales/localeContext';

/**
 * Зона загрузки файлов drag-and-drop с скрытым input и render-prop для кастомного триггера.
 *
 * @component
 * @example
 * <UploadZone onChange={(files) => upload(files)}>
 *   Перетащите файл или нажмите для выбора
 * </UploadZone>
 */
export const UploadZone = forwardRef<HTMLDivElement, UploadZoneProps>(function UploadZone(
	{
		onChange,
		multiple = true,
		className,
		children,
		readOnly = false,
		disabled = false,
		id,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
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

	const openFileDialog = () => {
		if (!isInteractive) return;
		fileInputRef.current?.click();
	};

	const isCustom = children != null;

	return (
		<div
			ref={ref}
			id={id}
			className={cn(
				styles.container,
				isCustom ? styles.custom : styles.default,
				readOnly && !disabled && styles.readOnly,
				disabled && styles.disabled,
				className,
			)}
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
				className={srOnly.srOnly}
				ref={fileInputRef}
				onChange={(e) => {
					if (e.target.files) processFiles(e.target.files);
				}}
			/>
			{isCustom
				? (typeof children === 'function' ? children(openFileDialog) : children)
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
});

UploadZone.displayName = 'UploadZone';
