function pad(n: number): string {
	return String(n).padStart(5, '0');
}

/**
 * URL полноразмерного демо-фото из `.storybook/public/images`
 * (Storybook `staticDirs` отдаёт `/images/...`).
 * @param n - номер файла `img0000N.jpeg` (1–10).
 */
export function demoImage(n: number): string {
	return `/images/img${pad(n)}.jpeg`;
}

/**
 * URL миниатюры `img0000N_thumb.jpeg`.
 * @param n - номер файла (1–10).
 */
export function demoThumb(n: number): string {
	return `/images/img${pad(n)}_thumb.jpeg`;
}

/**
 * Элемент галереи: полноразмерное фото и миниатюра.
 * @param n - номер файла (1–10).
 * @param alt - подпись для `alt`.
 */
export function demoGalleryItem(n: number, alt: string) {
	return {
		src: demoImage(n),
		thumbnail: demoThumb(n),
		alt,
	};
}
