import {useEffect, useState} from 'react';

/** Media query для «мобильной» ширины (breakpoint 768px). */
export const MOBILE_MEDIA_QUERY = '(max-width: 768px)';

/** Ширина, на которой сайдбар считается большим. */
export const SIDEBAR_LARGE_MEDIA_QUERY = '(min-width: 1280px)';

/** Ширина, на которой сайдбар считается средним. */
export const SIDEBAR_MEDIUM_MEDIA_QUERY = '(min-width: 1024px) and (max-width: 1279px)';

const readMediaQuery = (query: string): boolean =>
	typeof window !== 'undefined' && window.matchMedia(query).matches;

/**
 * Подписка на CSS media query через `matchMedia`.
 * На SSR и до появления `window` возвращает `false`.
 *
 * @param query - Строка media query (например `(min-width: 1024px)`).
 * @returns `true`, если query сейчас совпадает.
 *
 * @example
 * const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
 */
export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(() => readMediaQuery(query));

	useEffect(() => {
		const media = window.matchMedia(query);
		const onChange = () => {
			setMatches(media.matches);
		};
		onChange();
		media.addEventListener('change', onChange);
		return () => media.removeEventListener('change', onChange);
	}, [query]);

	return matches;
}

/** `true` на ширине до 768px включительно. */
export function useIsMobile(): boolean {
	return useMediaQuery(MOBILE_MEDIA_QUERY);
}

/** `true` на ширине от 1280px. */
export function useIsSidebarLarge(): boolean {
	return useMediaQuery(SIDEBAR_LARGE_MEDIA_QUERY);
}

/** `true` на ширине от 1024px до 1279px. */
export function useIsSidebarMedium(): boolean {
	return useMediaQuery(SIDEBAR_MEDIUM_MEDIA_QUERY);
}
