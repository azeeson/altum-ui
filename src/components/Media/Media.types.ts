import {type AspectRatioProps} from '../AspectRatio/AspectRatio';

/**
 * Свойства `Media`.
 */
export interface MediaProps extends Omit<AspectRatioProps, 'children'> {
	/** URL изображения или видео */
	src: string;
	alt?: string;
	/** @default 'img' */
	as?: 'img' | 'video';
	/** Poster для video */
	poster?: string;
	/** Вписывание (`object-fit`). @default 'cover' */
	fit?: 'cover' | 'contain';
	rounded?: boolean;
}
