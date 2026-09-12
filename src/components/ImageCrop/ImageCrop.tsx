import type {
	ImageCropProps,
} from './ImageCrop.types';
export type {
	ImageCropShape,
	ImageCropResult,
	ImageCropProps,
} from './ImageCrop.types';

import React, {
	forwardRef,
	useEffect,
	useId,
	useRef,
	useState,
} from 'react';
import {Button} from '../Button/Button';
import {DialogBase} from '../../base/DialogBase';
import {Overlay, type OverlayContentProps} from '../Overlay/Overlay';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {
	type ImageNaturalSize,
	clampOffset,
	exportCroppedImage,
	getDisplaySize,
	getMinCoverScale,
	loadImageFromSrc,
} from './ImageCrop.utils';
import styles from './ImageCrop.module.css';
import {useLocale} from '../../locales/localeContext';

type DragMode =
	| {
		type: 'pan';
		startX: number;
		startY: number;
		ox: number;
		oy: number;
	}
	| {
		type: 'scale';
		originZoom: number;
		ox: number;
		oy: number;
		vx: number;
		vy: number;
	};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.1;
const HANDLES = [
	'nw',
	'ne',
	'se',
	'sw'
] as const;

/**
 * Модальное окно обрезки изображения с pan/zoom и экспортом в файл.
 * Слой присутствия — `Overlay` (`variant="modal"`, `purpose="lightbox"`) + `DialogBase`.
 *
 * @component
 * @example
 * <ImageCrop
 *   open={open}
 *   file={selectedFile}
 *   shape="circle"
 *   onCrop={handleCrop}
 *   onOpenChange={setOpen}
 * />
 */
export const ImageCrop = forwardRef<HTMLElement, ImageCropProps>(function ImageCrop(
	{
		open,
		onOpenChange,
		file = null,
		src = null,
		shape = 'circle',
		cropSize = 280,
		outputSize = 512,
		title,
		confirmLabel,
		cancelLabel,
		className,
		style,
		onCrop,
		onClick,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const titleId = useId();
	const stageRef = useRef<HTMLDivElement>(null);
	const imageElRef = useRef<HTMLImageElement | null>(null);
	const dragRef = useRef<DragMode | null>(null);

	const [objectUrl, setObjectUrl] = useState<string | null>(null);
	const [natural, setNatural] = useState<ImageNaturalSize | null>(null);
	const [offsetX, setOffsetX] = useState(0);
	const [offsetY, setOffsetY] = useState(0);
	const [zoom, setZoom] = useState(1);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const imageSrc = objectUrl ?? src ?? null;
	const baseScale = natural ? getMinCoverScale(natural, cropSize) : 1;
	const display = natural ? getDisplaySize(natural, baseScale, zoom) : {
		width: 0,
		height: 0
	};

	const close = () => onOpenChange(false);

	useEffect(() => {
		if (!open || !file) {
			setObjectUrl((prev) => {
				if (prev) URL.revokeObjectURL(prev);
				return null;
			});
			return;
		}
		const url = URL.createObjectURL(file);
		setObjectUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [file, open]);

	useEffect(() => {
		if (!open || !imageSrc) {
			setNatural(null);
			setZoom(1);
			setOffsetX(0);
			setOffsetY(0);
			setError(null);
			imageElRef.current = null;
			return;
		}

		let cancelled = false;
		setError(null);
		loadImageFromSrc(imageSrc, {errorMessage: t('imageCrop.loadError')})
			.then((image) => {
				if (cancelled) return;
				imageElRef.current = image;
				setNatural({
					width: image.naturalWidth,
					height: image.naturalHeight,
				});
				setZoom(1);
				setOffsetX(0);
				setOffsetY(0);
			})
			.catch((err: unknown) => {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : t('imageCrop.loadError'));
				}
			});

		return () => {
			cancelled = true;
		};
	}, [imageSrc, open, t]);

	const applyZoom = (nextZoom: number, x: number, y: number) => {
		const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
		if (!natural) {
			setZoom(z);
			return;
		}
		const size = getDisplaySize(natural, baseScale, z);
		const clamped = clampOffset(x, y, size.width, size.height, cropSize);
		setZoom(z);
		setOffsetX(clamped.offsetX);
		setOffsetY(clamped.offsetY);
	};

	const onPointerMove = (event: React.PointerEvent) => {
		const drag = dragRef.current;
		if (!drag || !natural) return;

		if (drag.type === 'pan') {
			const size = getDisplaySize(natural, baseScale, zoom);
			const clamped = clampOffset(
				drag.ox + event.clientX - drag.startX,
				drag.oy + event.clientY - drag.startY,
				size.width,
				size.height,
				cropSize,
			);
			setOffsetX(clamped.offsetX);
			setOffsetY(clamped.offsetY);
			return;
		}

		const stage = stageRef.current?.getBoundingClientRect();
		if (!stage) return;
		const vecX = event.clientX - (stage.left + stage.width / 2 + drag.ox);
		const vecY = event.clientY - (stage.top + stage.height / 2 + drag.oy);
		const ratio = Math.hypot(vecX, vecY) / (Math.hypot(drag.vx, drag.vy) || 1);
		applyZoom(drag.originZoom * ratio, drag.ox, drag.oy);
	};

	const onPointerUp = () => {
		dragRef.current = null;
	};

	const capture = (event: React.PointerEvent, mode: DragMode) => {
		if (event.button !== 0 || !natural) return;
		event.preventDefault();
		(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
		dragRef.current = mode;
	};

	const handlePanStart = (event: React.PointerEvent) => {
		capture(event, {
			type: 'pan',
			startX: event.clientX,
			startY: event.clientY,
			ox: offsetX,
			oy: offsetY,
		});
	};

	const handleScaleStart = (event: React.PointerEvent) => {
		event.stopPropagation();
		const stage = stageRef.current?.getBoundingClientRect();
		if (!stage) return;
		const cx = stage.left + stage.width / 2 + offsetX;
		const cy = stage.top + stage.height / 2 + offsetY;
		capture(event, {
			type: 'scale',
			originZoom: zoom,
			ox: offsetX,
			oy: offsetY,
			vx: event.clientX - cx,
			vy: event.clientY - cy,
		});
	};

	const handleScaleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		let next = zoom;
		if (event.key === 'ArrowUp' || event.key === 'ArrowRight') next = zoom + ZOOM_STEP;
		else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') next = zoom - ZOOM_STEP;
		else if (event.key === 'Home') next = MIN_ZOOM;
		else if (event.key === 'End') next = MAX_ZOOM;
		else return;
		event.preventDefault();
		applyZoom(next, offsetX, offsetY);
	};

	const handleConfirm = async () => {
		if (!natural || !imageElRef.current || !onCrop) {
			close();
			return;
		}
		setBusy(true);
		try {
			const result = await exportCroppedImage({
				image: imageElRef.current,
				natural,
				baseScale,
				zoom,
				offsetX,
				offsetY,
				cropSize,
				outputSize,
				shape,
				exportErrorMessage: t('imageCrop.exportError'),
				fileName: (() => {
					const base = file?.name?.replace(/\.\w+$/, '');
					return base ? `${base}-cropped.png` : 'cropped.png';
				})(),
			});
			onCrop(result);
			close();
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : t('imageCrop.cropError'));
		} finally {
			setBusy(false);
		}
	};

	const ready = Boolean(imageSrc && natural);
	const imageTransform =
		`translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;

	return (
		<Overlay
			ref={ref}
			variant='modal'
			purpose='lightbox'
			open={open}
			onOpenChange={onOpenChange}
			aria-labelledby={titleId}
		>
			{(slotProps: OverlayContentProps, contentRef) => (
				<div
					{...slotProps}
					{...rest}
					ref={contentRef}
					role={slotProps.role}
					aria-modal={slotProps['aria-modal']}
					aria-labelledby={slotProps['aria-labelledby']}
					className={cn(styles.panel, slotProps.className, className)}
					style={{
						...slotProps.style,
						...style,
					}}
					onClick={composeEventHandlers(onClick, slotProps.onClick)}
				>
					<DialogBase.Provider onClose={close} titleId={titleId}>
						<DialogBase.Header>
							<DialogBase.Title as='h2'>
								{title ?? t('imageCrop.title')}
							</DialogBase.Title>
							<p className={styles.hint}>
								{t('imageCrop.hint')}
							</p>
						</DialogBase.Header>
						<DialogBase.Body>
							<div
								ref={stageRef}
								className={styles.stage}
								style={{
									['--altum-image-crop-size' as string]: `${cropSize}px`,
								}}
								onPointerMove={onPointerMove}
								onPointerUp={onPointerUp}
								onPointerCancel={onPointerUp}
							>
								{error && (
									<div className={cn(styles.status, styles.error)} role='alert'>
										{error}
									</div>
								)}

								<div className={styles.viewport}>
									{ready && (
										<div
											className={styles.imageLayer}
											style={{
												width: display.width,
												height: display.height,
												transform: imageTransform,
											}}
											onPointerDown={handlePanStart}
										>
											<img
												src={imageSrc!}
												alt=''
												draggable={false}
												className={styles.image}
											/>
										</div>
									)}

									{ready && (
										<div
											className={styles.cropFrame}
											data-shape={shape}
										/>
									)}

									{!imageSrc && !error && (
										<div className={styles.status}>
											{t('imageCrop.choose')}
										</div>
									)}
								</div>

								{ready && (
									<div
										className={styles.handleLayer}
										style={{
											width: display.width,
											height: display.height,
											transform: imageTransform,
										}}
									>
										{HANDLES.map((corner) => (
											<div
												key={corner}
												role='slider'
												tabIndex={0}
												data-corner={corner}
												className={styles.handle}
												aria-label={t('imageCrop.scaleHandle', {corner})}
												aria-valuemin={MIN_ZOOM}
												aria-valuemax={MAX_ZOOM}
												aria-valuenow={Number(zoom.toFixed(2))}
												onPointerDown={handleScaleStart}
												onKeyDown={handleScaleKeyDown}
											/>
										))}
									</div>
								)}
							</div>
						</DialogBase.Body>
						<DialogBase.Footer>
							<Button
								variant='secondary'
								size='sm'
								onClick={close}
								disabled={busy}
							>
								{cancelLabel ?? t('imageCrop.cancel')}
							</Button>
							<Button
								variant='primary'
								size='sm'
								onClick={handleConfirm}
								disabled={busy || !natural}
								loading={busy}
							>
								{confirmLabel ?? t('imageCrop.confirm')}
							</Button>
						</DialogBase.Footer>
					</DialogBase.Provider>
				</div>
			)}
		</Overlay>
	);
});

ImageCrop.displayName = 'ImageCrop';
