import type {
	UploadZoneProps,
} from './UploadZone.types';
export type {
	UploadZoneProps,
} from './UploadZone.types';

import {forwardRef, useId, useRef, useState} from 'react';
import styles from './UploadZone.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../LocaleProvider/LocaleProvider';

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
		style,
		children,
		readOnly = false,
		disabled = false,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const generatedId = useId();
	const [dragOver, setDragOver] = useState(false);
	const [selectedText, setSelectedText] = useState<string>('');
	const fileInputRef = useRef<HTMLInputElement>(null);
	const dragCounter = useRef(0);
	const isReadOnly = readOnly && !disabled;
	const isInteractive = !disabled && !isReadOnly;

	const openFileDialog = () => {
		if (!isInteractive) return;
		fileInputRef.current?.click();
	};

	const handleDragEnter = (e: React.DragEvent) => {
		if (!isInteractive) return;
		e.preventDefault();
		dragCounter.current += 1;
		if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
			setDragOver(true);
		}
	};

	const handleDragLeave = (e: React.DragEvent) => {
		if (!isInteractive) return;
		e.preventDefault();
		dragCounter.current -= 1;
		if (dragCounter.current === 0) {
			setDragOver(false);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		if (!isInteractive) return;
		e.preventDefault();
	};

	const processFiles = (files: FileList) => {
		if (!isInteractive) return;
		if (files.length) {
			setSelectedText(t('upload.selectedCount', {count: files.length}));
			onChange?.(files);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		if (!isInteractive) return;
		e.preventDefault();
		setDragOver(false);
		dragCounter.current = 0;
		processFiles(e.dataTransfer.files);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			processFiles(e.target.files);
		}
	};

	const inputId = rest.id ? `${rest.id}-file` : generatedId;
	const isCustom = children != null;
	const rootClassName = cn(
		styles.container,
		isCustom ? styles.containerCustom : styles.containerDefault,
		isReadOnly ? styles.readOnly : '',
		disabled ? styles.disabled : '',
		className,
	);
	const content = (
		<>
			<input
				id={inputId}
				type='file'
				multiple={multiple}
				disabled={disabled || isReadOnly}
				className={styles.hiddenInput}
				ref={fileInputRef}
				onChange={handleInputChange}
			/>
			{isCustom
				? (typeof children === 'function' ? children(openFileDialog) : children)
				: (
					<label
						htmlFor={inputId}
						className={cn(styles.uploadLabel, isReadOnly && styles.uploadLabelReadOnly)}
					>
						<span className={styles.uploadIcon} aria-hidden>
							↑
						</span>
						<span className={styles.uploadText}>
							{selectedText ? (
								selectedText
							) : (
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
			{dragOver && (
				<div className={styles.overlay}>
					<div className={styles.overlayContent}>
						<span className={styles.uploadIcon} aria-hidden>
							↓
						</span>
						<span>
							{t('upload.release')}
						</span>
					</div>
				</div>
			)}
		</>
	);
	const sharedProps = {
		className: rootClassName,
		style,
		'aria-readonly': isReadOnly || undefined,
		'aria-disabled': disabled || undefined,
		onDragEnter: handleDragEnter,
		onDragOver: handleDragOver,
		onDragLeave: handleDragLeave,
		onDrop: handleDrop,
		...rest,
	} as const;

	return (
		<div ref={ref} {...sharedProps}>
			{content}
		</div>
	);
});

UploadZone.displayName = 'UploadZone';
