import type {ImageGalleryProps} from './ImageGallery.types';
export type {ImageGalleryItem, ImageGalleryProps} from './ImageGallery.types';

import {
	useRef,
	useState,
	type KeyboardEvent,
	type MouseEvent,
} from 'react';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconChevronLeft} from '../../icons/icons/IconChevronLeft';
import {IconChevronRight} from '../../icons/icons/IconChevronRight';
import {handleArrowPairKeyDown} from '../../core/utils/keyboard';
import {uRef} from '../../core/utils/bundle';
import styles from './ImageGallery.module.css';
import scroll from '../../styles/scrollable.module.css';
import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_imageGallery} from '../../locales/slices/imageGallery.ru';

const localeFallback = {
	imageGallery: ru_imageGallery,
};

function isTypingTarget(target: EventTarget | null): boolean {
	return target instanceof Element
		&& target.closest('input, textarea, select, [contenteditable="true"]') != null;
}

/**
 * Галерея изображений с миниатюрами, стрелками поверх кадра и клавиатурной навигацией.
 * Стрелки слушает корень галереи, не документ.
 *
 * @component
 * @example
 * <ImageGallery images={photos} index={index} onIndexChange={setIndex} />
 * @example
 * <ImageGallery images={photos} chrome="none" />
 */
export function ImageGallery({
	images,
	index: controlledIndex,
	defaultIndex = 0,
	onIndexChange,
	chrome = 'default',
	showNav,
	showThumbnails,
	showCounter,
	enableKeyboard,
	className,
	rootRef,
	...rest
}: ImageGalleryProps) {
	const {t} = useLocale(localeFallback);
	const localRef = useRef<HTMLDivElement | null>(null);
	const [localIndex, setLocalIndex] = useState(defaultIndex);
	const isControlled = controlledIndex !== undefined;
	const currentIndex = isControlled ? controlledIndex : localIndex;
	const last = images.length - 1;
	const shown = (flag?: boolean) => (flag ?? chrome === 'default') && images.length > 1;

	const go = (nextIndex: number) => {
		if (nextIndex < 0 || nextIndex > last || nextIndex === currentIndex) return;
		if (!isControlled) setLocalIndex(nextIndex);
		onIndexChange?.(nextIndex);
		if (shown(showThumbnails) && localRef.current) {
			const thumb = localRef.current.querySelector(`[data-index="${nextIndex}"]`);
			if (thumb instanceof HTMLElement) {
				thumb.scrollIntoView({
					block: 'nearest',
					inline: 'center',
					behavior: 'smooth',
				});
			}
		}
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (!shown(enableKeyboard)) return;
		if (isTypingTarget(event.target)) return;
		const handled = handleArrowPairKeyDown(
			event,
			() => go(currentIndex - 1),
			() => go(currentIndex + 1),
		);
		if (handled) event.stopPropagation();
	};

	const handleClick = (event: MouseEvent<HTMLDivElement>) => {
		const target = event.target as HTMLElement;
		const nav = target.closest<HTMLElement>('[data-nav]');
		if (nav && event.currentTarget.contains(nav) && !nav.hasAttribute('disabled')) {
			go(nav.getAttribute('data-nav') === 'next' ? currentIndex + 1 : currentIndex - 1);
			return;
		}
		const thumb = target.closest<HTMLElement>('[data-index]');
		if (!thumb || !event.currentTarget.contains(thumb)) return;
		const nextIndex = Number(thumb.getAttribute('data-index'));
		if (Number.isInteger(nextIndex)) go(nextIndex);
	};

	const image = images[currentIndex];
	const src = typeof image === 'string' ? image : image?.src;
	const alt = typeof image === 'string'
		? t('imageGallery.imageN', {index: currentIndex + 1})
		: (image?.alt ?? t('imageGallery.imageN', {index: currentIndex + 1}));

	return (
		<div
			ref={uRef(localRef, rootRef)}
			{...rest}
			className={cn(styles.gallery, className)}
			onKeyDown={handleKeyDown}
			onClick={handleClick}
			data-empty={!images.length ? '' : undefined}
			tabIndex={shown(enableKeyboard) ? 0 : -1}
		>
			{src ? (
				<>
					<div className={styles.mainArea}>
						{shown(showNav) ? ([0, 1] as const).map((next) => (
							<ButtonIcon
								key={next}
								className={cn(styles.navBtn, next ? styles.navNext : styles.navPrev)}
								variant='ghost'
								size='md'
								data-shape='circle'
								icon={next ? <IconChevronRight /> : <IconChevronLeft />}
								aria-label={next ? t('imageGallery.next') : t('imageGallery.prev')}
								data-nav={next ? 'next' : 'prev'}
								disabled={next ? currentIndex >= last : currentIndex <= 0}
							/>
						)) : null}
						<img
							key={currentIndex}
							src={src}
							alt={alt}
							className={styles.mainImage}
							draggable={false}
						/>
					</div>
					{shown(showThumbnails) ? (
						<div
							className={cn(scroll.area, styles.thumbnails)}
							role='listbox'
							aria-label={t('imageGallery.thumbnails')}
						>
							{images.map((thumb, thumbIndex) => {
								const thumbSrc = typeof thumb === 'string' ? thumb : (thumb.thumbnail ?? thumb.src);
								const thumbAlt = typeof thumb === 'string' ? '' : (thumb.alt ?? '');
								const isActive = thumbIndex === currentIndex;
								return (
									<button
										key={`${thumbSrc}-${thumbIndex}`}
										type='button'
										role='option'
										className={styles.thumbnailBtn}
										aria-label={thumbAlt}
										aria-selected={isActive}
										data-active={isActive ? '' : undefined}
										data-index={thumbIndex}
									>
										<img
											src={thumbSrc}
											alt=''
											className={styles.thumbnailImage}
											draggable={false}
										/>
									</button>
								);
							})}
						</div>
					) : null}
					{shown(showCounter) ? (
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
}
