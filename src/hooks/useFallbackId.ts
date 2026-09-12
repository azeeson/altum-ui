import {useId} from 'react';

/**
 * Стабильный id: явный проп или `useId()`.
 *
 * @param id - Внешний id; если нет — генерируется.
 * @returns Непустой id.
 *
 * @example
 * const id = useFallbackId(providedId);
 */
export function useFallbackId(id?: string): string {
	const generated = useId();
	return id ?? generated;
}
