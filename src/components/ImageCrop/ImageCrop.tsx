import type {ImageCropProps} from './ImageCrop.types';
export type {
	ImageCropShape,
	ImageCropResult,
	ImageCropProps,
} from './ImageCrop.types';

import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type KeyboardEvent,
	type PointerEvent as ReactPointerEvent,
} from 'react';
import {Button} from '../Button/Button';
import {DialogLayout} from '../internal/DialogLayout/DialogLayout';
import {Overlay} from '../Overlay/Overlay';
import {Text} from '../Text/Text';
import {Title} from '../Title/Title';
import {cn} from '../../core/utils/cn';
import {
	clampOffset,
	exportCroppedImage,
	getDisplaySize,
	getMinCoverScale,
	loadImageFromSrc,
} from './ImageCrop.utils';
import styles from './ImageCrop.module.css';
import overlayScrim from '../../styles/overlayScrim.module.css';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_imageCrop} from '../../locales/slices/imageCrop.ru';

const localeFallback = {
	imageCrop: ru_imageCrop,
};

const TITLE_ID = 'image-crop-title';
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.1;
const HANDLES = [
	'nw',
	'ne',
	'se',
	'sw',
] as const;

interface CropTransform {
	x: number;
	y: number;
	zoom: number;
}

/**
 * Модальное окно обрезки изображения с pan/zoom и экспортом в файл.
 * Слой присутствия — `Overlay` (`variant="modal"`, нативный `<dialog>`).
 * Корень — `DialogLayout`, заголовок — `Title`.
 * Сдвиг и масштаб пишутся в DOM и не перерисовывают диалог на каждый пиксель.
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
export function ImageCrop({
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
	rootRef,
	...rest
}: ImageCropProps) {
	const {t} = useLocale(localeFallback);
	const stageRef = useRef<HTMLDivElement>(null);
	const imageLayerRef = useRef<HTMLDivElement>(null);
	const handleLayerRef = useRef<HTMLDivElement>(null);
	const imageElRef = useRef<HTMLImageElement | null>(null);
	const transformRef = useRef<CropTransform>({
		x: 0,
		y: 0,
		zoom: 1,
	});

	const [objectUrl, setObjectUrl] = useState<string | null>(null);
	const [natural, setNatural] = useState<{
		width: number;
		height: number;
	} | null>(null);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const imageSrc = objectUrl ?? src ?? null;
	const baseScale = natural ? getMinCoverScale(natural, cropSize) : 1;

	const close = () => onOpenChange(false);

	const paintTransform = useCallback(() => {
		const {x, y, zoom} = transformRef.current;
		const transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0)`;
		let width: string | undefined;
		let height: string | undefined;
		if (natural) {
			const display = getDisplaySize(natural, baseScale, zoom);
			width = `${display.width}px`;
			height = `${display.height}px`;
		}
		if (imageLayerRef.current) {
			if (width != null && height != null) {
				imageLayerRef.current.style.width = width;
				imageLayerRef.current.style.height = height;
			}
			imageLayerRef.current.style.transform = transform;
		}
		if (handleLayerRef.current) {
			if (width != null && height != null) {
				handleLayerRef.current.style.width = width;
				handleLayerRef.current.style.height = height;
			}
			handleLayerRef.current.style.transform = transform;
			const value = String(Number(zoom.toFixed(2)));
			handleLayerRef.current.querySelectorAll<HTMLElement>('[role="slider"]').forEach((node) => {
				node.setAttribute('aria-valuenow', value);
			});
		}
	}, [natural, baseScale]);

	const commitTransform = useCallback((x: number, y: number, zoom: number) => {
		const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
		if (!natural) {
			transformRef.current = {
				x,
				y,
				zoom: nextZoom,
			};
			return;
		}
		const size = getDisplaySize(natural, baseScale, nextZoom);
		const clamped = clampOffset(x, y, size.width, size.height, cropSize);
		transformRef.current = {
			x: clamped.offsetX,
			y: clamped.offsetY,
			zoom: nextZoom,
		};
		paintTransform();
	}, [
		natural,
		baseScale,
		cropSize,
		paintTransform,
	]);

	useEffect(() => {
		if (!open || !file) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- сброс blob URL вместе с файлом
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
			// eslint-disable-next-line react-hooks/set-state-in-effect -- кадр сбрасывается, когда источник закрыт
			setNatural(null);
			transformRef.current = {
				x: 0,
				y: 0,
				zoom: 1,
			};
			imageElRef.current = null;
			setError(null);
			return;
		}

		let cancelled = false;
		setError(null);
		loadImageFromSrc(imageSrc, {errorMessage: t('imageCrop.loadError')})
			.then((image) => {
				if (cancelled) return;
				imageElRef.current = image;
				transformRef.current = {
					x: 0,
					y: 0,
					zoom: 1,
				};
				setNatural({
					width: image.naturalWidth,
					height: image.naturalHeight,
				});
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

	useLayoutEffect(() => {
		if (!natural) return;
		const {x, y, zoom} = transformRef.current;
		commitTransform(x, y, zoom);
	}, [natural, commitTransform]);

	const startPanDrag = (event: ReactPointerEvent) => {
		if (event.button !== 0 || !natural) return;
		event.preventDefault();
		const target = event.currentTarget as HTMLElement;
		const startX = event.clientX;
		const startY = event.clientY;
		const {x: originX, y: originY, zoom} = transformRef.current;
		target.setPointerCapture(event.pointerId);
		const onPointerMove = (move: PointerEvent) => {
			commitTransform(
				originX + move.clientX - startX,
				originY + move.clientY - startY,
				zoom,
			);
		};
		const onPointerUp = (up: PointerEvent) => {
			if (target.hasPointerCapture(up.pointerId)) target.releasePointerCapture(up.pointerId);
			target.removeEventListener('pointermove', onPointerMove);
			target.removeEventListener('pointerup', onPointerUp);
			target.removeEventListener('pointercancel', onPointerUp);
		};
		target.addEventListener('pointermove', onPointerMove);
		target.addEventListener('pointerup', onPointerUp);
		target.addEventListener('pointercancel', onPointerUp);
	};

	const startScaleDrag = (event: ReactPointerEvent) => {
		event.stopPropagation();
		if (event.button !== 0 || !natural || !stageRef.current) return;
		const target = event.currentTarget as HTMLElement;
		const stage = stageRef.current.getBoundingClientRect();
		const {x: originX, y: originY, zoom: originZoom} = transformRef.current;
		const centerX = stage.left + stage.width / 2 + originX;
		const centerY = stage.top + stage.height / 2 + originY;
		const vectorX = event.clientX - centerX;
		const vectorY = event.clientY - centerY;
		target.setPointerCapture(event.pointerId);
		const onPointerMove = (move: PointerEvent) => {
			const nextX = move.clientX - (stage.left + stage.width / 2 + originX);
			const nextY = move.clientY - (stage.top + stage.height / 2 + originY);
			const ratio = Math.hypot(nextX, nextY) / (Math.hypot(vectorX, vectorY) || 1);
			commitTransform(originX, originY, originZoom * ratio);
		};
		const onPointerUp = (up: PointerEvent) => {
			if (target.hasPointerCapture(up.pointerId)) target.releasePointerCapture(up.pointerId);
			target.removeEventListener('pointermove', onPointerMove);
			target.removeEventListener('pointerup', onPointerUp);
			target.removeEventListener('pointercancel', onPointerUp);
		};
		target.addEventListener('pointermove', onPointerMove);
		target.addEventListener('pointerup', onPointerUp);
		target.addEventListener('pointercancel', onPointerUp);
	};

	const handleScaleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		const {x, y, zoom} = transformRef.current;
		let next = zoom;
		if (event.key === 'ArrowUp' || event.key === 'ArrowRight') next = zoom + ZOOM_STEP;
		else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') next = zoom - ZOOM_STEP;
		else if (event.key === 'Home') next = MIN_ZOOM;
		else if (event.key === 'End') next = MAX_ZOOM;
		else return;
		event.preventDefault();
		commitTransform(x, y, next);
	};

	const handleConfirm = async () => {
		if (!natural || !imageElRef.current || !onCrop) {
			close();
			return;
		}
		setBusy(true);
		try {
			const {x, y, zoom} = transformRef.current;
			const result = await exportCroppedImage({
				image: imageElRef.current,
				natural,
				baseScale,
				zoom,
				offsetX: x,
				offsetY: y,
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

	return (
		<Overlay
			variant='modal'
			open={open}
			onOpenChange={onOpenChange}
			hostClassName={overlayScrim.host}
			aria-labelledby={TITLE_ID}
		>
			<DialogLayout
				rootRef={rootRef}
				variant='floating'
				border={false}
				shadow='none'
				className={cn(styles.panel, className)}
				style={style}
				onClick={onClick}
				{...rest}
				onClose={close}
			>
				<div className={styles.container}>
					<header className={styles.header}>
						<Title level={3} id={TITLE_ID}>
							{title ?? t('imageCrop.title')}
						</Title>
						<Text
							as='p'
							size='sm'
							color='muted'
						>
							{t('imageCrop.hint')}
						</Text>
					</header>
					<main className={styles.content}>
						<div
							ref={stageRef}
							className={styles.stage}
							style={{
								['--altum-image-crop-size' as string]: `${cropSize}px`,
							}}
						>
							{error && (
								<div className={cn(styles.status, styles.error)} role='alert'>
									{error}
								</div>
							)}
							<div className={styles.viewport}>
								{ready && (
									<div
										ref={imageLayerRef}
										className={styles.imageLayer}
										onPointerDown={startPanDrag}
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
									<div className={styles.cropFrame} data-shape={shape} />
								)}
								{!imageSrc && !error && (
									<div className={styles.status}>
										{t('imageCrop.choose')}
									</div>
								)}
							</div>
							{ready && (
								<div
									ref={handleLayerRef}
									className={styles.handleLayer}
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
											onPointerDown={startScaleDrag}
											onKeyDown={handleScaleKeyDown}
										/>
									))}
								</div>
							)}
						</div>
					</main>
					<footer className={styles.footer}>
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
					</footer>
				</div>
			</DialogLayout>
		</Overlay>
	);
}
