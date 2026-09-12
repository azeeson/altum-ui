import type {ComponentPropsWithoutRef} from 'react';

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
	/**
	 * `default` — стрелки, миниатюры и счётчик.
	 * `none` — только кадр (пустое состояние, если нет фото).
	 * @default 'default'
	 */
	chrome?: 'default' | 'none';
	/** Стрелки поверх кадра. @default `chrome === 'default'` */
	showNav?: boolean;
	/** Полоса миниатюр. @default `chrome === 'default'` */
	showThumbnails?: boolean;
	/** Счётчик «n / N». @default `chrome === 'default'` */
	showCounter?: boolean;
	enableKeyboard?: boolean;
}
