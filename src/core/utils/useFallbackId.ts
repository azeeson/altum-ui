import {useId} from 'react';

/**
 * Стабильный id: явный проп или `useId()`.
 * Опциональный `suffix` для связанных a11y-id.
 */
export function useFallbackId(id?: string, suffix?: string): string {
	const generated = useId();
	const base = id || generated;
	return suffix ? `${base}-${suffix}` : base;
}
