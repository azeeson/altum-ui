/* eslint-disable react-hooks/set-state-in-effect -- Presence синхронизируется с open для exit-переходов. */
import {useEffect, useState} from 'react';
import {usePrefersReducedMotion} from './usePrefersReducedMotion';

/**
 * Монтирование с exit-задержкой: `shouldRender` остаётся true до конца анимации закрытия,
 * `presented` включает enter на следующем кадре.
 *
 * @param open - Целевая видимость.
 * @param durationMs - Длительность exit; `0` или reduced motion снимают слой сразу.
 * @returns `shouldRender` — оставлять в DOM; `presented` — enter-класс / `data-presented`.
 *
 * @example
 * const {shouldRender, presented} = usePresence(open, 200);
 * if (!shouldRender) return null;
 */
export function usePresence(open: boolean, durationMs: number): {
	shouldRender: boolean;
	presented: boolean;
} {
	const reduceMotion = usePrefersReducedMotion();
	const [shouldRender, setShouldRender] = useState(open);
	const [presented, setPresented] = useState(false);

	useEffect(() => {
		if (open) {
			setShouldRender(true);
			let innerFrame = 0;
			const outerFrame = requestAnimationFrame(() => {
				innerFrame = requestAnimationFrame(() => setPresented(true));
			});
			return () => {
				cancelAnimationFrame(outerFrame);
				cancelAnimationFrame(innerFrame);
			};
		}

		setPresented(false);
		if (reduceMotion || durationMs <= 0) {
			setShouldRender(false);
			return undefined;
		}

		const timer = window.setTimeout(() => setShouldRender(false), durationMs);
		return () => window.clearTimeout(timer);
	}, [open, durationMs, reduceMotion]);

	return {
		shouldRender,
		presented,
	};
}
