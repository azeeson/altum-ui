import {useEffect, useState} from 'react';

/**
 * Media query для «мобильной» ширины (breakpoint 768px).
 * Используйте с `useMediaQuery(MOBILE_MEDIA_QUERY)`.
 */
export const MOBILE_MEDIA_QUERY = '(max-width: 768px)';

const readMediaQuery = (query: string) =>
	typeof window !== 'undefined' && window.matchMedia(query).matches;

/**
 * Подписка на CSS media query через `matchMedia`.
 * На SSR / первом кадре может быть `false`, пока нет `window`.
 *
 * @param query - Строка media query (например `(min-width: 1024px)`).
 * @returns `true`, если query сейчас совпадает.
 *
 * @example
 * const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
 * if (isMobile) return <Sheet />;
 */
export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(() => readMediaQuery(query));

	useEffect(() => {
		const mediaQuery = window.matchMedia(query);
		const handleChange = () => setMatches(mediaQuery.matches);
		handleChange();
		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [query]);

	return matches;
}
