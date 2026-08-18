import type {
	ImageGalleryItem,
	ImageGalleryProps,
	ImageGalleryViewportProps,
	ImageGalleryImageProps,
	ImageGalleryNavProps,
	ImageGalleryThumbnailsProps,
	ImageGalleryThumbProps,
	ImageGalleryPrevProps,
	ImageGalleryNextProps,
} from './ImageGallery.types';
export type {
	ImageGalleryItem,
	ImageGalleryProps,
	ImageGalleryViewportProps,
	ImageGalleryImageProps,
	ImageGalleryNavProps,
	ImageGalleryThumbnailsProps,
	ImageGalleryThumbProps,
	ImageGalleryPrevProps,
	ImageGalleryNextProps,
} from './ImageGallery.types';

 
import React, {
	createContext,
	forwardRef,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ComponentPropsWithoutRef,
} from 'react';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconChevronLeft} from '../../icons/icons/IconChevronLeft';
import {IconChevronRight} from '../../icons/icons/IconChevronRight';
import {useDocumentKeyDown} from '../../hooks/useDocumentKeyDown';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {handleArrowPairKeyDown} from '../../utils/keyboard';
import styles from './ImageGallery.module.css';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useLocale} from '../LocaleProvider/LocaleProvider';

function normalizeImages(images: ImageGalleryItem[] | string[], imageN: (index: number) => string): ImageGalleryItem[] {
	return images.map((item, i) => (
		typeof item === 'string'
			? {
				src: item,
				alt: imageN(i + 1)
			}
			: item
	));
}

/**
 * Галерея изображений с миниатюрами, стрелками и клавиатурной навигацией.
 *
 * @component
 * @example
 * <ImageGallery images={photos} index={index} onIndexChange={setIndex} />
 */
interface ImageGalleryContextValue {
	images: ImageGalleryItem[];
	index: number;
	goTo: (index: number) => void;
	goPrev: () => void;
	goNext: () => void;
	canGoPrev: boolean;
	canGoNext: boolean;
	slideDirection: 'prev' | 'next';
}

const ImageGalleryContext = createContext<ImageGalleryContextValue | null>(null);

function useImageGalleryContext(component: string): ImageGalleryContextValue {
	const context = useContext(ImageGalleryContext);
	if (!context) throw new Error(`${component} должен использоваться внутри ImageGallery.Root`);
	return context;
}

const ImageGalleryRoot = forwardRef<HTMLDivElement, ImageGalleryProps>(function ImageGalleryRoot(
	{
		images: imagesProp,
		index: controlledIndex,
		defaultIndex = 0,
		onIndexChange,
		className,
		enableKeyboard = false,
		children,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const imageN = (index: number) => t('imageGallery.imageN', {index});
	const images = normalizeImages(imagesProp, imageN);
	const hasMultipleImages = images.length > 1;
	const shouldEnableKeyboard = enableKeyboard && hasMultipleImages;
	const [currentIndex, setCurrentIndex] = useControlledStateWithCallback(
		controlledIndex,
		defaultIndex,
		onIndexChange,
	);
	const [slideDirection, setSlideDirection] = useState<'prev' | 'next'>('next');

	const goTo = useCallback((nextIndex: number) => {
		if (nextIndex < 0 || nextIndex >= images.length || nextIndex === currentIndex) {
			return;
		}

		setSlideDirection(nextIndex > currentIndex ? 'next' : 'prev');
		setCurrentIndex(nextIndex);
	}, [currentIndex, images.length, setCurrentIndex,]);

	const goPrev = useCallback(() => {
		goTo(currentIndex - 1);
	}, [currentIndex, goTo]);

	const goNext = useCallback(() => {
		goTo(currentIndex + 1);
	}, [currentIndex, goTo]);

	useDocumentKeyDown((event) => {
		handleArrowPairKeyDown(event, goPrev, goNext);
	}, {
		enabled: shouldEnableKeyboard,
		target: 'window'
	});

	const contextValue = useMemo(() => ({
		images,
		index: currentIndex,
		goTo,
		goPrev,
		goNext,
		canGoPrev: currentIndex > 0,
		canGoNext: currentIndex < images.length - 1,
		slideDirection,
	}), [
		images,
		currentIndex,
		goTo,
		goPrev,
		goNext,
		slideDirection
	]);

	return (
		<ImageGalleryContext.Provider value={contextValue}>
			<div
				ref={ref}
				className={cn(styles.gallery, !images.length && styles.empty, className)}
				{...rest}
			>
				{children}
			</div>
		</ImageGalleryContext.Provider>
	);
});
const ImageGalleryViewport = forwardRef<HTMLDivElement, ImageGalleryViewportProps>(
	function ImageGalleryViewport({className, ...rest}, ref) {
		return (
			<div
				ref={ref}
				className={cn(styles.mainArea, className)}
				{...rest}
			/>
		);
	},
);
const ImageGalleryImage = forwardRef<HTMLImageElement, ImageGalleryImageProps>(
	function ImageGalleryImage({className, ...rest}, ref) {
		const {images, index, slideDirection} = useImageGalleryContext('ImageGallery.Image');
		const {t} = useLocale();
		const image = images[index];
		if (!image) return null;
		return (
			<img
				ref={ref}
				src={image.src}
				alt={image.alt ?? t('imageGallery.imageN', {index: index + 1})}
				className={cn(styles.mainImage, styles[`slide_${slideDirection}`], className)}
				draggable={false}
				{...rest}
			/>
		);
	},
);
const ImageGalleryNav = forwardRef<HTMLDivElement, ImageGalleryNavProps>(
	function ImageGalleryNav({className, ...rest}, ref) {
		return (
			<div
				ref={ref}
				className={cn(styles.viewport, className)}
				{...rest}
			/>
		);
	},
);

const ImageGalleryPrev = forwardRef<HTMLButtonElement, ImageGalleryPrevProps>(function ImageGalleryPrev(
	{className, onClick, disabled, 'aria-label': ariaLabel, ...rest},
	ref,
) {
	const {goPrev, canGoPrev} = useImageGalleryContext('ImageGallery.Prev');
	const {t} = useLocale();
	return (
		<ButtonIcon
			ref={ref}
			className={cn(styles.navBtn, className)}
			variant='ghost'
			shape='circle'
			size='md'
			icon={<IconChevronLeft size={22} />}
			{...rest}
			aria-label={ariaLabel ?? t('imageGallery.prev')}
			disabled={!canGoPrev || disabled}
			onClick={composeEventHandlers(onClick, () => {
				goPrev();
			})}
		/>
	);
});
const ImageGalleryNext = forwardRef<HTMLButtonElement, ImageGalleryNextProps>(function ImageGalleryNext(
	{className, onClick, disabled, 'aria-label': ariaLabel, ...rest},
	ref,
) {
	const {goNext, canGoNext} = useImageGalleryContext('ImageGallery.Next');
	const {t} = useLocale();
	return (
		<ButtonIcon
			ref={ref}
			className={cn(styles.navBtn, className)}
			variant='ghost'
			shape='circle'
			size='md'
			icon={<IconChevronRight size={22} />}
			{...rest}
			aria-label={ariaLabel ?? t('imageGallery.next')}
			disabled={!canGoNext || disabled}
			onClick={composeEventHandlers(onClick, () => {
				goNext();
			})}
		/>
	);
});
const ImageGalleryThumbnails = forwardRef<HTMLDivElement, ImageGalleryThumbnailsProps>(
	function ImageGalleryThumbnails({className, ...rest}, ref) {
		return (
			<div
				ref={ref}
				className={cn(styles.thumbnails, className)}
				{...rest}
			/>
		);
	},
);
const ImageGalleryThumb = forwardRef<HTMLButtonElement, ImageGalleryThumbProps>(
	function ImageGalleryThumb({index, className, onClick, ...rest}, ref) {
		const {images, index: currentIndex, goTo} = useImageGalleryContext('ImageGallery.Thumb');
		const {t} = useLocale();
		const image = images[index];
		if (!image) return null;
		return (
			<button
				ref={ref}
				type='button'
				className={cn(styles.thumbnailBtn, index === currentIndex && styles.active, className)}
				aria-label={image.alt ?? t('imageGallery.imageN', {index: index + 1})}
				aria-current={index === currentIndex ? 'true' : undefined}
				onClick={composeEventHandlers(onClick, () => {
					goTo(index);
				})}
				{...rest}
			>
				<img
					src={image.thumbnail ?? image.src}
					alt=''
					className={styles.thumbnailImage}
					draggable={false}
				/>
			</button>
		);
	},
);
const ImageGalleryCounter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
	function ImageGalleryCounter({className, ...rest}, ref) {
		const {images, index} = useImageGalleryContext('ImageGallery.Counter');
		if (images.length < 2) return null;
		return (
			<div
				ref={ref}
				className={cn(styles.counter, className)}
				aria-live='polite'
				{...rest}
			>
				{index + 1}
				{' '}
				/
				{' '}
				{images.length}
			</div>
		);
	},
);
const ImageGalleryEmpty = forwardRef<HTMLSpanElement, ComponentPropsWithoutRef<'span'>>(
	function ImageGalleryEmpty({className, children, ...rest}, ref) {
		const {images} = useImageGalleryContext('ImageGallery.Empty');
		const {t} = useLocale();
		if (images.length) return null;
		return (
			<span
				ref={ref}
				className={cn(styles.emptyText, className)}
				{...rest}
			>
				{children ?? t('imageGallery.empty')}
			</span>
		);
	},
);

ImageGalleryRoot.displayName = 'ImageGallery';
ImageGalleryViewport.displayName = 'ImageGallery.Viewport';
ImageGalleryImage.displayName = 'ImageGallery.Image';
ImageGalleryNav.displayName = 'ImageGallery.Nav';
ImageGalleryPrev.displayName = 'ImageGallery.Prev';
ImageGalleryNext.displayName = 'ImageGallery.Next';
ImageGalleryThumbnails.displayName = 'ImageGallery.Thumbnails';
ImageGalleryThumb.displayName = 'ImageGallery.Thumb';
ImageGalleryCounter.displayName = 'ImageGallery.Counter';
ImageGalleryEmpty.displayName = 'ImageGallery.Empty';

type ImageGalleryComponent = React.ForwardRefExoticComponent<
	ImageGalleryProps & React.RefAttributes<HTMLDivElement>
> & {
	Root: typeof ImageGalleryRoot;
	Viewport: typeof ImageGalleryViewport;
	Image: typeof ImageGalleryImage;
	Nav: typeof ImageGalleryNav;
	Prev: typeof ImageGalleryPrev;
	Next: typeof ImageGalleryNext;
	Thumbnails: typeof ImageGalleryThumbnails;
	Thumb: typeof ImageGalleryThumb;
	Counter: typeof ImageGalleryCounter;
	Empty: typeof ImageGalleryEmpty;
};

export const ImageGallery = Object.assign(ImageGalleryRoot, {
	Root: ImageGalleryRoot,
	Viewport: ImageGalleryViewport,
	Image: ImageGalleryImage,
	Nav: ImageGalleryNav,
	Prev: ImageGalleryPrev,
	Next: ImageGalleryNext,
	Thumbnails: ImageGalleryThumbnails,
	Thumb: ImageGalleryThumb,
	Counter: ImageGalleryCounter,
	Empty: ImageGalleryEmpty,
}) as ImageGalleryComponent;
