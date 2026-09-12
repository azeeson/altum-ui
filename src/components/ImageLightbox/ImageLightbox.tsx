import type {
	ImageLightboxProps,
} from './ImageLightbox.types';
export type {
	ImageLightboxProps,
} from './ImageLightbox.types';

import {forwardRef} from 'react';
import {Overlay, type OverlayContentProps} from '../Overlay/Overlay';
import {ImageGallery} from '../ImageGallery/ImageGallery';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconCross} from '../../icons/icons/IconCross';
import overlayClose from '../../styles/overlayClose.module.css';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import styles from './ImageLightbox.module.css';
import {useLocale} from '../../locales/localeContext';

/**
 * Полноэкранный просмотр галереи поверх затемнённого backdrop.
 * Фото без рамки, с тенью. На `Overlay` (`variant="modal"`, `purpose="lightbox"`).
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
export const ImageLightbox = forwardRef<HTMLElement, ImageLightboxProps>(function ImageLightbox(
	{
		open,
		onOpenChange,
		images,
		index,
		defaultIndex = 0,
		onIndexChange,
		className,
		onClick,
		...rest
	},
	ref,
) {
	const {t} = useLocale();

	return (
		<Overlay
			ref={ref}
			variant='modal'
			purpose='lightbox'
			open={open}
			onOpenChange={onOpenChange}
			aria-label={t('imageLightbox.ariaLabel')}
		>
			{(slotProps: OverlayContentProps, contentRef) => (
				<div
					{...slotProps}
					{...rest}
					ref={contentRef}
					className={cn(styles.stage, slotProps.className, className)}
					style={slotProps.style}
					onClick={composeEventHandlers(onClick, slotProps.onClick)}
				>
					<ButtonIcon
						className={styles.close}
						appearance='diskClose'
						aria-label={t('imageLightbox.close')}
						icon={(
							<IconCross
								className={overlayClose.icon}
								size={16}
								aria-hidden
							/>
						)}
						onClick={() => onOpenChange(false)}
					/>
					<ImageGallery
						images={images}
						index={index}
						defaultIndex={defaultIndex}
						onIndexChange={onIndexChange}
						enableKeyboard
						showThumbnails={false}
						className={styles.gallery}
					/>
				</div>
			)}
		</Overlay>
	);
});

ImageLightbox.displayName = 'ImageLightbox';
