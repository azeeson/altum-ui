import {useEffect, useState} from 'react';

/**
 * Текущий момент с опциональным автообновлением.
 * Интервал `0` — без тика, значение захватывается на маунте.
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
		const id = window.setInterval(() => setNow(new Date()), intervalMs);
		return () => window.clearInterval(id);
	}, [intervalMs]);

	return now;
}
