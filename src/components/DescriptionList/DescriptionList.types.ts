import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Пара ключ–значение.
 */
export interface DescriptionListItem {
	id?: string;
	label: React.ReactNode;
	value: React.ReactNode;
}

/**
 * Свойства `DescriptionList`.
 */
export interface DescriptionListProps extends Omit<ComponentPropsWithoutRef<'dl'>, 'children'> {
	items: DescriptionListItem[];
	/**
	 * `stacked` — label над value;
	 * `inline` — label | value в ряд.
	 * @default 'stacked'
	 */
	layout?: 'stacked' | 'inline';
	/** Число колонок (CSS columns) для stacked. @default 1 */
	columns?: 1 | 2 | 3;
}
