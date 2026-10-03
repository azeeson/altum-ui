import type {ComponentPropsWithoutRef, Ref} from 'react';
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
	/** DOM-узел сцены. */
	rootRef?: Ref<HTMLDivElement>;
}
