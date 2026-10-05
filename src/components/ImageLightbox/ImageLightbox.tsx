import type {ImageLightboxProps} from './ImageLightbox.types';
export type {ImageLightboxProps} from './ImageLightbox.types';

import type {KeyboardEvent} from 'react';
import {Overlay} from '../Overlay/Overlay';
import {ImageGallery} from '../ImageGallery/ImageGallery';
import {CloseControl} from '../internal/CloseControl/CloseControl';
import {cn} from '../../core/utils/cn';
import styles from './ImageLightbox.module.css';
import overlayScrim from '../../styles/overlayScrim.module.css';
import utilities from '../../styles/utilities.module.css';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_imageLightbox} from '../../locales/slices/imageLightbox.ru';

const localeFallback = {
	imageLightbox: ru_imageLightbox,
};

/**
 * Полноэкранный просмотр галереи поверх затемнённого backdrop.
 * Фото без рамки, с тенью. На `Overlay` (`variant="modal"`, нативный `<dialog>`).
 * Стрелки с кнопки закрытия листают кадр через кнопки галереи.
 *
 * @component
 * @example
 * <ImageLightbox
 *   open={open}
 *   images={photos}
 *   index={index}
 *   onIndexChange={setIndex}
 *   onOpenChange={setOpen}
 * />
 */
export function ImageLightbox({
	open,
	onOpenChange,
	images,
	index,
	defaultIndex,
	onIndexChange,
	className,
	rootRef,
	...rest
}: ImageLightboxProps) {
	const {t} = useLocale(localeFallback);

	const onStageKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
		const gallery = event.currentTarget.querySelector(`.${styles.gallery}`);
		if (gallery?.contains(event.target as Node)) return;
		const nav = event.key === 'ArrowLeft' ? 'prev' : 'next';
		const button = event.currentTarget.querySelector<HTMLButtonElement>(`[data-nav="${nav}"]`);
		if (button == null || button.disabled) return;
		event.preventDefault();
		button.click();
	};

	return (
		<Overlay
			variant='modal'
			open={open}
			onOpenChange={onOpenChange}
			hostClassName={overlayScrim.host}
			aria-label={t('imageLightbox.ariaLabel')}
		>
			<div
				ref={rootRef}
				{...rest}
				className={cn(utilities.fCenter, styles.stage, className)}
				onKeyDown={onStageKeyDown}
			>
				<CloseControl
					className={styles.close}
					aria-label={t('imageLightbox.close')}
					onClick={() => onOpenChange(false)}
				/>
				<ImageGallery
					images={images}
					index={index}
					defaultIndex={defaultIndex}
					onIndexChange={onIndexChange}
					showThumbnails={false}
					className={styles.gallery}
				/>
			</div>
		</Overlay>
	);
}
