import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';
import type {ButtonIconProps} from '../ButtonIcon/ButtonIcon.types';

/**
 * Публичный тип `ImageGalleryItem`.
 */
export interface ImageGalleryItem {
	src: string;
	alt?: string;
	thumbnail?: string;
}

/**
 * Свойства `ImageGallery`.
 */
export interface ImageGalleryProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	images: ImageGalleryItem[] | string[];
	index?: number;
	defaultIndex?: number;
	onIndexChange?: (index: number) => void;
	enableKeyboard?: boolean;
	children?: React.ReactNode;
}

export type ImageGalleryViewportProps = ComponentPropsWithoutRef<'div'>;

export type ImageGalleryImageProps = Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'>;

export type ImageGalleryNavProps = ComponentPropsWithoutRef<'div'>;

export type ImageGalleryThumbnailsProps = ComponentPropsWithoutRef<'div'>;

export interface ImageGalleryThumbProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {index: number}

/** Свойства `ImageGallery.Prev` / `.Next` (слот `ButtonIcon` без `icon`). */
export type ImageGalleryPrevProps = Omit<ButtonIconProps, 'icon'>;

export type ImageGalleryNextProps = ImageGalleryPrevProps;
