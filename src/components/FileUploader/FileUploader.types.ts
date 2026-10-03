import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';
import type {FileListItemStatus} from '../FileList';

/** Элемент списка загрузок в `FileUploader`. */
export interface FileUploaderFile {
	id: string;
	name: string;
	progress?: number;
	status?: FileListItemStatus;
}

/**
 * Свойства `FileUploader`.
 * Тонкая композиция: `UploadZone` + опциональный `FileList` (Progress внутри строк).
 */
export interface FileUploaderProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onChange'> {
	/** Файлы для списка под зоной; без массива список не рендерится. */
	files?: FileUploaderFile[];
	/** Выбор / drop из `UploadZone` (native `FileList`). */
	onFiles?: (files: FileList) => void;
	/** Контент зоны: как у `UploadZone` (children или render-prop `openFileDialog`). */
	children?: React.ReactNode | ((openFileDialog: () => void) => React.ReactNode);
	multiple?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	onRemove?: (id: string) => void;
	onRetry?: (id: string) => void;
	/** Корень виджета. */
	rootRef?: Ref<HTMLDivElement>;
}
