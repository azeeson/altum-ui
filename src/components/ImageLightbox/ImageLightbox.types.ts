import type {ComponentPropsWithoutRef} from 'react';
import {ImageGalleryItem} from '../ImageGallery/ImageGallery';

/**
 * Свойства `ImageLightbox`.
 */
export interface ImageLightboxProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	images: ImageGalleryItem[] | string[];
	index?: number;
	defaultIndex?: number;
	onIndexChange?: (index: number) => void;
}
