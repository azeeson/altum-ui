import {useEffect, useState} from 'react';

/**
 * Текущий момент с опциональным автообновлением.
 * Интервал `0` — без тика. При скрытой вкладке тик ставится на паузу.
 *
 * @param intervalMs - Период пересчёта в мс. `0` отключает интервал.
 * @returns Актуальный `Date`.
 *
 * @example
 * const now = useNow(30_000);
 */
export function useNow(intervalMs: number): Date {
	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		if (!intervalMs) return undefined;

		let id = 0;
		const tick = () => setNow(new Date());
		const start = () => {
			if (id || document.hidden) return;
			id = window.setInterval(tick, intervalMs);
		};
		const stop = () => {
			if (!id) return;
			window.clearInterval(id);
			id = 0;
		};
		const onVisibility = () => {
			if (document.hidden) stop();
			else {
				tick();
				start();
			}
		};

		start();
		document.addEventListener('visibilitychange', onVisibility);
		return () => {
			stop();
			document.removeEventListener('visibilitychange', onVisibility);
		};
	}, [intervalMs]);

	return now;
}
