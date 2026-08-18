export type ImageCropShape = 'circle' | 'square';

export interface ImageNaturalSize {
	width: number;
	height: number;
}

/** Минимальный scale, при котором crop всё ещё полностью покрыт изображением */
export function getMinCoverScale(
	natural: ImageNaturalSize,
	cropSize: number,
): number {
	if (natural.width <= 0 || natural.height <= 0 || cropSize <= 0) return 1;
	return Math.max(cropSize / natural.width, cropSize / natural.height);
}

export function getDisplaySize(
	natural: ImageNaturalSize,
	baseScale: number,
	zoom: number,
): {
	width: number;
	height: number
} {
	return {
		width: natural.width * baseScale * zoom,
		height: natural.height * baseScale * zoom,
	};
}

/**
 * Ограничивает offset так, чтобы crop-рамка не выходила за пределы изображения.
 */
export function clampOffset(
	offsetX: number,
	offsetY: number,
	displayWidth: number,
	displayHeight: number,
	cropSize: number,
): {
	offsetX: number;
	offsetY: number
} {
	const maxX = Math.max(0, (displayWidth - cropSize) / 2);
	const maxY = Math.max(0, (displayHeight - cropSize) / 2);
	return {
		offsetX: Math.min(maxX, Math.max(-maxX, offsetX)),
		offsetY: Math.min(maxY, Math.max(-maxY, offsetY)),
	};
}

interface LoadImageFromSrcOptions {
	/** Сообщение об ошибке загрузки (`t('imageCrop.loadError')`). */
	errorMessage: string;
}

export async function loadImageFromSrc(
	src: string,
	{errorMessage}: LoadImageFromSrcOptions,
): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = () => reject(new Error(errorMessage));
		image.src = src;
	});
}

interface ExportCroppedImageParams {
	image: HTMLImageElement;
	natural: ImageNaturalSize;
	baseScale: number;
	zoom: number;
	offsetX: number;
	offsetY: number;
	cropSize: number;
	outputSize: number;
	shape: ImageCropShape;
	fileName?: string;
	mimeType?: string;
	quality?: number;
	/** Сообщение об ошибке экспорта (`t('imageCrop.exportError')`). */
	exportErrorMessage: string;
}

export async function exportCroppedImage({
	image,
	natural,
	baseScale,
	zoom,
	offsetX,
	offsetY,
	cropSize,
	outputSize,
	shape,
	fileName = 'cropped.png',
	mimeType = 'image/png',
	quality = 0.92,
	exportErrorMessage,
}: ExportCroppedImageParams): Promise<{
	blob: Blob;
	file: File;
	dataUrl: string
}> {
	const display = getDisplaySize(natural, baseScale, zoom);
	const scaleToNatural = natural.width / display.width;

	// Центр crop в системе координат display-изображения
	const cropCenterX = display.width / 2 - offsetX;
	const cropCenterY = display.height / 2 - offsetY;
	const cropLeft = cropCenterX - cropSize / 2;
	const cropTop = cropCenterY - cropSize / 2;

	const sx = cropLeft * scaleToNatural;
	const sy = cropTop * scaleToNatural;
	const sSize = cropSize * scaleToNatural;

	const canvas = document.createElement('canvas');
	canvas.width = outputSize;
	canvas.height = outputSize;
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		throw new Error(exportErrorMessage);
	}

	if (shape === 'circle') {
		ctx.beginPath();
		ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
		ctx.closePath();
		ctx.clip();
	}

	ctx.drawImage(image, sx, sy, sSize, sSize, 0, 0, outputSize, outputSize);

	const blob = await new Promise<Blob>((resolve, reject) => {
		canvas.toBlob(
			(result) => {
				if (result) resolve(result);
				else reject(new Error(exportErrorMessage));
			},
			mimeType,
			quality,
		);
	});

	const dataUrl = canvas.toDataURL(mimeType, quality);
	const file = new File([blob], fileName, {type: mimeType});

	return {
		blob,
		file,
		dataUrl
	};
}
