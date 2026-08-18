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
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from 'react';
import {Box} from '../Box/Box';
import {Button} from '../Button/Button';
import {DialogBase} from '../../base/DialogBase';
import {Layout} from '../Layout/Layout';
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
import {useLocale} from '../LocaleProvider/LocaleProvider';

type DragMode =
	| {
		type: 'pan';
		startX: number;
		startY: number;
		originOffsetX: number;
		originOffsetY: number
	}
	| {
		type: 'scale';
		startX: number;
		startY: number;
		originZoom: number;
		originOffsetX: number;
		originOffsetY: number;
		/** Вектор от центра к ручке в начале жеста (экранные px) */
		startVecX: number;
		startVecY: number;
	};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.1;

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
 *   onClose={() => setOpen(false)}
 * />
 */
export const ImageCrop = forwardRef<HTMLElement, ImageCropProps>(function ImageCrop(
	{
		open,
		onClose,
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
	const isOpen = open;
	const handleClose = () => {
		onClose();
		onOpenChange?.(false);
	};
	const {t} = useLocale();
	const titleId = useId();
	const resolvedTitle = title ?? t('imageCrop.title');
	const resolvedConfirmLabel = confirmLabel ?? t('imageCrop.confirm');
	const resolvedCancelLabel = cancelLabel ?? t('imageCrop.cancel');
	const stageRef = useRef<HTMLDivElement>(null);
	const imageElRef = useRef<HTMLImageElement | null>(null);
	const dragRef = useRef<DragMode | null>(null);

	const [stageSize, setStageSize] = useState({
		width: 400,
		height: 400
	});
	const [objectUrl, setObjectUrl] = useState<string | null>(null);
	const [natural, setNatural] = useState<ImageNaturalSize | null>(null);
	const [offsetX, setOffsetX] = useState(0);
	const [offsetY, setOffsetY] = useState(0);
	const [zoom, setZoom] = useState(1);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const imageSrc = objectUrl ?? src ?? null;

	useEffect(() => {
		if (!isOpen || !stageRef.current) return;

		const element = stageRef.current;
		const update = () => {
			const rect = element.getBoundingClientRect();
			setStageSize({
				width: rect.width,
				height: rect.height
			});
		};
		update();

		const observer = new ResizeObserver(update);
		observer.observe(element);
		return () => observer.disconnect();
	}, [isOpen, imageSrc]);

	useEffect(() => {
		if (!isOpen || !file) {
			setObjectUrl((prev) => {
				if (prev) URL.revokeObjectURL(prev);
				return null;
			});
			return;
		}

		const url = URL.createObjectURL(file);
		 
		setObjectUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [file, isOpen]);

	useEffect(() => {
		if (!isOpen || !imageSrc) {
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
					height: image.naturalHeight
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
	}, [imageSrc, isOpen, t]);

	const baseScale = useMemo(() => {
		if (!natural) return 1;
		return getMinCoverScale(natural, cropSize);
	}, [cropSize, natural]);

	const display = useMemo(() => {
		if (!natural) return {
			width: 0,
			height: 0
		};
		return getDisplaySize(natural, baseScale, zoom);
	}, [baseScale, natural, zoom]);

	const dragContextRef = useRef({
		natural,
		baseScale,
		cropSize,
	});
	const zoomRef = useRef(zoom);

	useEffect(() => {
		dragContextRef.current = {
			natural,
			baseScale,
			cropSize,
		};
		zoomRef.current = zoom;
	});

	const endDrag = useCallback(() => {
		dragRef.current = null;
	}, []);

	const onPointerMove = useCallback((event: PointerEvent) => {
		const drag = dragRef.current;
		const ctx = dragContextRef.current;
		if (!drag || !ctx.natural) return;

		if (drag.type === 'pan') {
			const dx = event.clientX - drag.startX;
			const dy = event.clientY - drag.startY;
			const displaySize = getDisplaySize(ctx.natural, ctx.baseScale, zoomRef.current);
			const clamped = clampOffset(
				drag.originOffsetX + dx,
				drag.originOffsetY + dy,
				displaySize.width,
				displaySize.height,
				ctx.cropSize,
			);
			setOffsetX(clamped.offsetX);
			setOffsetY(clamped.offsetY);
			return;
		}

		const stage = stageRef.current?.getBoundingClientRect();
		if (!stage) return;

		const centerX = stage.left + stage.width / 2 + drag.originOffsetX;
		const centerY = stage.top + stage.height / 2 + drag.originOffsetY;
		const vecX = event.clientX - centerX;
		const vecY = event.clientY - centerY;
		const startLen = Math.hypot(drag.startVecX, drag.startVecY) || 1;
		const nextLen = Math.hypot(vecX, vecY);
		const ratio = nextLen / startLen;
		const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, drag.originZoom * ratio));
		const displaySize = getDisplaySize(ctx.natural, ctx.baseScale, nextZoom);
		const clamped = clampOffset(
			drag.originOffsetX,
			drag.originOffsetY,
			displaySize.width,
			displaySize.height,
			ctx.cropSize,
		);

		setZoom(nextZoom);
		setOffsetX(clamped.offsetX);
		setOffsetY(clamped.offsetY);
		zoomRef.current = nextZoom;
	}, []);

	const onPointerUp = useCallback(() => {
		endDrag();
		window.removeEventListener('pointermove', onPointerMove);
		window.removeEventListener('pointerup', onPointerUp);
		window.removeEventListener('pointercancel', onPointerUp);
	}, [endDrag, onPointerMove]);

	const beginDrag = useCallback((mode: DragMode) => {
		dragRef.current = mode;
		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', onPointerUp);
		window.addEventListener('pointercancel', onPointerUp);
	}, [onPointerMove, onPointerUp]);

	useEffect(() => () => {
		window.removeEventListener('pointermove', onPointerMove);
		window.removeEventListener('pointerup', onPointerUp);
		window.removeEventListener('pointercancel', onPointerUp);
	}, [onPointerMove, onPointerUp]);

	const handlePanStart = (event: React.PointerEvent) => {
		if (event.button !== 0 || !natural) return;
		event.preventDefault();
		(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
		beginDrag({
			type: 'pan',
			startX: event.clientX,
			startY: event.clientY,
			originOffsetX: offsetX,
			originOffsetY: offsetY,
		});
	};

	const handleScaleStart = (event: React.PointerEvent) => {
		if (event.button !== 0 || !natural) return;
		event.preventDefault();
		event.stopPropagation();
		(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);

		const stage = stageRef.current?.getBoundingClientRect();
		if (!stage) return;

		const centerX = stage.left + stage.width / 2 + offsetX;
		const centerY = stage.top + stage.height / 2 + offsetY;

		beginDrag({
			type: 'scale',
			startX: event.clientX,
			startY: event.clientY,
			originZoom: zoom,
			originOffsetX: offsetX,
			originOffsetY: offsetY,
			// Вектор от центра изображения до фактического указателя — ratio стартует с 1
			startVecX: event.clientX - centerX,
			startVecY: event.clientY - centerY,
		});
	};

	const handleConfirm = async () => {
		if (!natural || !imageElRef.current || !onCrop) {
			handleClose();
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
			handleClose();
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : t('imageCrop.cropError'));
		} finally {
			setBusy(false);
		}
	};

	const handleScaleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		let next = zoom;
		if (event.key === 'ArrowUp' || event.key === 'ArrowRight') next = zoom + ZOOM_STEP;
		else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') next = zoom - ZOOM_STEP;
		else if (event.key === 'Home') next = MIN_ZOOM;
		else if (event.key === 'End') next = MAX_ZOOM;
		else return;
		event.preventDefault();
		const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
		if (!natural) {
			setZoom(nextZoom);
			zoomRef.current = nextZoom;
			return;
		}
		const displaySize = getDisplaySize(natural, baseScale, nextZoom);
		const clamped = clampOffset(
			offsetX,
			offsetY,
			displaySize.width,
			displaySize.height,
			cropSize,
		);
		setZoom(nextZoom);
		setOffsetX(clamped.offsetX);
		setOffsetY(clamped.offsetY);
		zoomRef.current = nextZoom;
	};

	const halfW = display.width / 2;
	const halfH = display.height / 2;
	const stageHalfW = Math.max(24, stageSize.width / 2 - 10);
	const stageHalfH = Math.max(24, stageSize.height / 2 - 10);

	const corners = (
		[
			{
				key: 'nw',
				x: offsetX - halfW,
				y: offsetY - halfH,
				cursor: 'nwse-resize'
			},
			{
				key: 'ne',
				x: offsetX + halfW,
				y: offsetY - halfH,
				cursor: 'nesw-resize'
			},
			{
				key: 'se',
				x: offsetX + halfW,
				y: offsetY + halfH,
				cursor: 'nwse-resize'
			},
			{
				key: 'sw',
				x: offsetX - halfW,
				y: offsetY + halfH,
				cursor: 'nesw-resize'
			},
		] as const
	).map((corner) => ({
		...corner,
		viewX: Math.min(stageHalfW, Math.max(-stageHalfW, corner.x)),
		viewY: Math.min(stageHalfH, Math.max(-stageHalfH, corner.y)),
	}));

	return (
		<Overlay
			ref={ref}
			variant='modal'
			purpose='lightbox'
			open={isOpen}
			onClose={handleClose}
			backdropVariant='strong'
			backdropBlur='md'
			aria-labelledby={titleId}
			asChild={false}
		>
			{(slotProps: OverlayContentProps, contentRef) => (
				<Box
					as='div'
					variant='floating'
					padding='none'
					ref={contentRef}
					{...rest}
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
					<DialogBase.Provider onClose={handleClose} titleId={titleId}>
						<Layout>
							<DialogBase.Header>
								<DialogBase.Title as='h2'>
									{resolvedTitle}
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
								>
									{error && (
										<div className={styles.error} role='alert'>
											{error}
										</div>
									)}

									<Box
										variant='overlay'
										padding='none'
										className={styles.viewport}
									>
										{imageSrc && natural && (
											<>
												<div
													className={styles.imageLayer}
													style={{
														width: display.width,
														height: display.height,
														transform:
															`translate(calc(-50% + ${offsetX}px), `
															+ `calc(-50% + ${offsetY}px))`,
													}}
													onPointerDown={handlePanStart}
												>
													<img
														src={imageSrc}
														alt=''
														draggable={false}
														className={styles.image}
													/>
												</div>

												<div
													className={cn(
														styles.cropFrame,
														shape === 'circle' ? styles.cropCircle : styles.cropSquare,
													)}
													aria-hidden
												/>
											</>
										)}

										{!imageSrc && !error && (
											<div className={styles.placeholder}>
												{t('imageCrop.choose')}
											</div>
										)}
									</Box>

									{imageSrc && natural && (
										<div className={styles.handlesLayer}>
											{corners.map((corner) => (
												<div
													key={corner.key}
													role='slider'
													tabIndex={0}
													className={styles.handle}
													style={{
														transform:
															'translate(-50%, -50%) '
															+ `translate(${corner.viewX}px, ${corner.viewY}px)`,
														cursor: corner.cursor,
													}}
													aria-label={t('imageCrop.scaleHandle', {corner: corner.key})}
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
							<DialogBase.Footer className={styles.footer}>
								<Button
									variant='secondary'
									size='sm'
									onClick={handleClose}
									disabled={busy}
								>
									{resolvedCancelLabel}
								</Button>
								<Button
									variant='primary'
									size='sm'
									onClick={handleConfirm}
									disabled={busy || !natural}
									loading={busy}
								>
									{resolvedConfirmLabel}
								</Button>
							</DialogBase.Footer>
						</Layout>
					</DialogBase.Provider>
				</Box>
			)}
		</Overlay>
	);
});

ImageCrop.displayName = 'ImageCrop';
