import {useMediaQuery} from './useMediaQuery';

/** CSS media query для `prefers-reduced-motion: reduce`. */
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Отслеживает системную настройку «уменьшить движение».
 * Подписывается на `matchMedia` через `useMediaQuery`.
 *
 * @returns `true`, если пользователь просит уменьшить анимации.
 *
 * @example
 * const reduceMotion = usePrefersReducedMotion();
 * <motion.div animate={reduceMotion ? false : {opacity: 1}} />
 */
export function usePrefersReducedMotion(): boolean {
	return useMediaQuery(REDUCED_MOTION_QUERY);
}
