import type {
	ComponentPropsWithoutRef,
} from 'react';

export type SkeletonVariant = 'block' | 'text' | 'avatar' | 'card' | 'table';

/**
 * Свойства `Skeleton`.
 * Пресеты задаются `variant`: `text` / `avatar` / `card` / `table` (без variant — блок).
 */
export interface SkeletonProps extends ComponentPropsWithoutRef<'div'> {
	variant?: SkeletonVariant;
	width?: string | number;
	height?: string | number;
	circle?: boolean;
	/** Число строк для `text` / `card`. */
	lines?: number;
	lastWidth?: string | number;
	/** Диаметр для `avatar`. @default 40 */
	size?: number;
	/** Показать avatar в пресете `card`. @default true */
	avatar?: boolean;
	/** Число строк таблицы. @default 5 */
	rows?: number;
	/** Число колонок таблицы. @default 4 */
	columns?: number;
}
