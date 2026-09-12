import type {
	RelativeTimeProps,
} from './RelativeTime.types';
export type {
	RelativeTimeProps,
} from './RelativeTime.types';

import {forwardRef} from 'react';
import {useLocale} from '../../locales/localeContext';
import {useNow} from '../../hooks/useNow';

const UNITS = [
	[60, 1, 'second'],
	[3600, 60, 'minute'],
	[86400, 3600, 'hour'],
	[86400 * 30, 86400, 'day'],
	[86400 * 365, 86400 * 30, 'month'],
] as const;

function toDate(input: Date | string | number): Date | null {
	const date = input instanceof Date ? input : new Date(input);
	return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Форматирует относительное время («2 ч назад», «только что»).
 * @param date - Дата.
 * @param locale - Локаль.
 * @param now - Текущий момент.
 */
export function formatRelativeTime(
	date: Date,
	locale = 'ru-RU',
	now: Date = new Date(),
): string {
	const diffSec = Math.round((date.getTime() - now.getTime()) / 1000);
	const abs = Math.abs(diffSec);
	const rtf = new Intl.RelativeTimeFormat(locale, {numeric: 'auto'});
	for (const [limit, div, unit] of UNITS) {
		if (abs < limit) return rtf.format(Math.round(diffSec / div), unit);
	}
	return rtf.format(Math.round(diffSec / (86400 * 365)), 'year');
}

/**
 * Относительное время для лент и таблиц («2 ч назад»).
 *
 * @component
 * @example
 * <RelativeTime date={row.updatedAt} />
 */
export const RelativeTime = forwardRef<HTMLTimeElement, RelativeTimeProps>(function RelativeTime(
	{
		date,
		locale,
		updateInterval = 30_000,
		showAbsoluteTitle = true,
		className,
		title,
		...rest
	},
	ref,
) {
	const {locale: localeCode} = useLocale();
	const resolvedLocale = locale ?? (localeCode === 'en' ? 'en-US' : 'ru-RU');
	const resolved = toDate(date);
	const now = useNow(resolved ? updateInterval : 0);
	const label = resolved ? formatRelativeTime(resolved, resolvedLocale, now) : '—';

	return (
		<time
			ref={ref}
			className={className}
			dateTime={resolved?.toISOString()}
			title={resolved && showAbsoluteTitle ? resolved.toLocaleString(resolvedLocale) : title}
			{...rest}
		>
			{label}
		</time>
	);
});

RelativeTime.displayName = 'RelativeTime';
