import type {
	ImageLightboxProps,
} from './ImageLightbox.types';
export type {
	ImageLightboxProps,
} from './ImageLightbox.types';

import React, {forwardRef} from 'react';
import {Overlay, type OverlayContentProps} from '../Overlay/Overlay';
import {Box} from '../Box/Box';
import {ImageGallery} from '../ImageGallery/ImageGallery';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconCross} from '../../icons/icons/IconCross';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import styles from './ImageLightbox.module.css';
import {useLocale} from '../LocaleProvider/LocaleProvider';

/**
 * Полноэкранный просмотр галереи поверх затемнённого backdrop.
 * Реализован на `Overlay` (`variant="modal"`, `purpose="lightbox"`).
 *
 * @component
 * @example
 * <ImageLightbox
 *   open={open}
 *   images={photos}
 *   index={index}
 *   onIndexChange={setIndex}
 *   onClose={() => setOpen(false)}
 * />
 */
export const ImageLightbox = forwardRef<HTMLElement, ImageLightboxProps>(function ImageLightbox(
	{
		open,
		onClose,
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
	const ariaLabel = t('imageLightbox.ariaLabel');
	const handleClose = () => {
		onClose();
		onOpenChange?.(false);
	};

	return (
		<Overlay
			ref={ref}
			variant='modal'
			purpose='lightbox'
			open={open}
			onClose={handleClose}
			backdropVariant='strong'
			backdropBlur='md'
			aria-label={ariaLabel}
			asChild={false}
		>
			{(slotProps: OverlayContentProps, contentRef) => (
				<div
					ref={contentRef}
					className={cn(styles.lightboxStage, slotProps.className, className)}
					style={slotProps.style}
					{...rest}
					role={slotProps.role}
					aria-modal={slotProps['aria-modal']}
					aria-label={slotProps['aria-label']}
					onClick={composeEventHandlers(onClick, slotProps.onClick)}
				>
					<ButtonIcon
						className={styles.closeBtn}
						variant='ghost'
						shape='circle'
						size='md'
						aria-label={t('imageLightbox.close')}
						onClick={handleClose}
						icon={<IconCross size={20} />}
					/>
					<Box
						variant='overlay'
						padding='md'
						className={styles.lightboxContent}
					>
						<ImageGallery
							images={images}
							index={index}
							defaultIndex={defaultIndex}
							onIndexChange={onIndexChange}
							enableKeyboard
							className={styles.gallery}
						>
							<ImageGallery.Viewport>
								<ImageGallery.Prev />
								<ImageGallery.Image />
								<ImageGallery.Next />
							</ImageGallery.Viewport>
							<ImageGallery.Counter />
						</ImageGallery>
					</Box>
				</div>
			)}
		</Overlay>
	);
});

ImageLightbox.displayName = 'ImageLightbox';
