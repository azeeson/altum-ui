import type {
	RelativeTimeProps,
} from './RelativeTime.types';
export type {
	RelativeTimeProps,
} from './RelativeTime.types';

import {forwardRef, useEffect, useMemo, useState} from 'react';
import {cn} from '../../utils/cn';
import {useLocale} from '../LocaleProvider/LocaleProvider';

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

	if (abs < 60) return rtf.format(Math.round(diffSec), 'second');
	if (abs < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
	if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour');
	if (abs < 86400 * 30) return rtf.format(Math.round(diffSec / 86400), 'day');
	if (abs < 86400 * 365) return rtf.format(Math.round(diffSec / (86400 * 30)), 'month');
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
	const resolved = useMemo(() => toDate(date), [date]);
	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		if (!updateInterval || !resolved) return undefined;
		const id = window.setInterval(() => setNow(new Date()), updateInterval);
		return () => window.clearInterval(id);
	}, [resolved, updateInterval]);

	if (!resolved) {
		return (
			<time
				ref={ref}
				className={cn(className)}
				{...rest}
			>
				—
			</time>
		);
	}

	const label = formatRelativeTime(resolved, resolvedLocale, now);
	const absolute = resolved.toLocaleString(resolvedLocale);

	return (
		<time
			ref={ref}
			className={cn(className)}
			dateTime={resolved.toISOString()}
			title={showAbsoluteTitle ? absolute : title}
			{...rest}
		>
			{label}
		</time>
	);
});

RelativeTime.displayName = 'RelativeTime';
