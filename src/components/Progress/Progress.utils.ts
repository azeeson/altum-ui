import type {ReactNode} from 'react';
import type {ProgressVariant} from './Progress.types';

/**
 * Процент, подпись и ARIA для линейного и кругового индикатора.
 * Тон `auto` становится `success` на 100%.
 */
export function progressModel(
	percentage: number,
	indeterminate: boolean,
	variant: ProgressVariant,
	label: ReactNode,
	valueText: ReactNode,
) {
	const n = Math.min(100, Math.max(0, percentage));
	const text = valueText ?? (indeterminate ? undefined : `${Math.round(n)}%`);
	return {
		n,
		text,
		tone: variant === 'auto'
			? (!indeterminate && n >= 100 ? 'success' : 'primary')
			: variant,
		aria: {
			role: 'progressbar' as const,
			'aria-valuemin': indeterminate ? undefined : 0,
			'aria-valuemax': indeterminate ? undefined : 100,
			'aria-valuenow': indeterminate ? undefined : n,
			'aria-valuetext': typeof text === 'string' || typeof text === 'number'
				? String(text)
				: undefined,
			'aria-label': typeof label === 'string' ? label : undefined,
		},
	};
}
