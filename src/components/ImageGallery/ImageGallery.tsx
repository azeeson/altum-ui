import type {ImageGalleryItem, ImageGalleryProps} from './ImageGallery.types';
export type {ImageGalleryItem, ImageGalleryProps} from './ImageGallery.types';

import {
	forwardRef,
	useCallback,
} from 'react';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconChevronLeft} from '../../icons/icons/IconChevronLeft';
import {IconChevronRight} from '../../icons/icons/IconChevronRight';
import {useDocumentKeyDown} from '../../hooks/useDocumentKeyDown';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {handleArrowPairKeyDown} from '../../utils/keyboard';
import styles from './ImageGallery.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../../locales/localeContext';

function normalizeImages(
	images: ImageGalleryItem[] | string[],
	imageN: (index: number) => string,
): ImageGalleryItem[] {
	return images.map((item, i) => (
		typeof item === 'string' ? {
			src: item,
			alt: imageN(i + 1)
		} : item
	));
}

/**
 * Галерея изображений с миниатюрами, стрелками поверх кадра и клавиатурной навигацией.
 *
 * @component
 * @example
 * <ImageGallery images={photos} index={index} onIndexChange={setIndex} />
 * @example
 * <ImageGallery images={photos} chrome="none" />
 */
export const ImageGallery = forwardRef<HTMLDivElement, ImageGalleryProps>(function ImageGallery(
	{
		images: imagesProp,
		index: controlledIndex,
		defaultIndex = 0,
		onIndexChange,
		chrome = 'default',
		showNav,
		showThumbnails,
		showCounter,
		enableKeyboard,
		className,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const imageN = (index: number) => t('imageGallery.imageN', {index});
	const images = normalizeImages(imagesProp, imageN);
	const hasMultiple = images.length > 1;
	const useChrome = chrome === 'default';
	const navVisible = (showNav ?? useChrome) && hasMultiple;
	const thumbsVisible = (showThumbnails ?? useChrome) && hasMultiple;
	const counterVisible = (showCounter ?? useChrome) && hasMultiple;
	const shouldEnableKeyboard = (enableKeyboard ?? useChrome) && hasMultiple;
	const last = images.length - 1;

	const [currentIndex, setCurrentIndex] = useControlledStateWithCallback(
		controlledIndex,
		defaultIndex,
		onIndexChange,
	);

	const goTo = useCallback((nextIndex: number) => {
		if (nextIndex < 0 || nextIndex > last || nextIndex === currentIndex) return;
		setCurrentIndex(nextIndex);
	}, [currentIndex, last, setCurrentIndex]);

	const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);
	const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);

	useDocumentKeyDown((event) => {
		handleArrowPairKeyDown(event, goPrev, goNext);
	}, {
		enabled: shouldEnableKeyboard,
		target: 'window'
	});

	const image = images[currentIndex];

	return (
		<div
			ref={ref}
			className={cn(styles.gallery, !images.length && styles.empty, className)}
			{...rest}
		>
			{image ? (
				<>
					<div className={styles.mainArea}>
						{navVisible ? ([0, 1] as const).map((next) => (
							<ButtonIcon
								key={next}
								className={cn(styles.navBtn, next ? styles.navNext : styles.navPrev)}
								variant='ghost'
								shape='circle'
								size='md'
								icon={next ? <IconChevronRight size={22} /> : <IconChevronLeft size={22} />}
								aria-label={next ? t('imageGallery.next') : t('imageGallery.prev')}
								disabled={next ? currentIndex >= last : currentIndex <= 0}
								onClick={next ? goNext : goPrev}
							/>
						)) : null}
						<img
							key={currentIndex}
							src={image.src}
							alt={image.alt ?? imageN(currentIndex + 1)}
							className={styles.mainImage}
							draggable={false}
						/>
					</div>
					{thumbsVisible ? (
						<div className={styles.thumbnails}>
							{images.map((thumb, thumbIndex) => (
								<button
									key={thumb.src}
									type='button'
									className={cn(
										styles.thumbnailBtn,
										thumbIndex === currentIndex && styles.active,
									)}
									aria-label={thumb.alt ?? imageN(thumbIndex + 1)}
									aria-current={thumbIndex === currentIndex ? 'true' : undefined}
									onClick={() => goTo(thumbIndex)}
								>
									<img
										src={thumb.thumbnail ?? thumb.src}
										alt=''
										className={styles.thumbnailImage}
										draggable={false}
									/>
								</button>
							))}
						</div>
					) : null}
					{counterVisible ? (
						<div className={styles.counter} aria-live='polite'>
							{currentIndex + 1}
							{' / '}
							{images.length}
						</div>
					) : null}
				</>
			) : (
				<span className={styles.emptyText}>
					{t('imageGallery.empty')}
				</span>
			)}
		</div>
	);
});

ImageGallery.displayName = 'ImageGallery';
