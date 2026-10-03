import type {ComponentPropsWithoutRef, Ref} from 'react';
import {type ImageCropShape} from './ImageCrop.utils';

export type {ImageCropShape};

/**
 * Публичный тип `ImageCropResult`.
 */
export interface ImageCropResult {
	blob: Blob;
	file: File;
	dataUrl: string;
}

/**
 * Свойства `ImageCrop`.
 */
export interface ImageCropProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'title'> {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Файл из UploadZone (или другой источник) */
	file?: File | null;
	/** Альтернатива file — готовый URL */
	src?: string | null;
	shape?: ImageCropShape;
	/** Размер crop-рамки на экране (px) */
	cropSize?: number;
	/** Размер выходного PNG/JPEG (px) */
	outputSize?: number;
	title?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	onCrop?: (result: ImageCropResult) => void;
	/** DOM-узел поверхности (`DialogLayout`). */
	rootRef?: Ref<HTMLElement>;
}
