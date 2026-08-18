import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Свойства базового `Skeleton`.
 */
export interface SkeletonProps extends ComponentPropsWithoutRef<'div'> {
	width?: string | number;
	height?: string | number;
	circle?: boolean;
}

/**
 * Свойства `Skeleton.Text`.
 */
export interface SkeletonTextProps extends ComponentPropsWithoutRef<'div'> {
	/** Число строк. @default 3 */
	lines?: number;
	width?: string | number;
	lastWidth?: string | number;
}

/**
 * Свойства `Skeleton.Avatar`.
 */
export interface SkeletonAvatarProps extends ComponentPropsWithoutRef<'div'> {
	/** Диаметр. @default 40 */
	size?: number;
}

/**
 * Свойства `Skeleton.Card`.
 */
export interface SkeletonCardProps extends ComponentPropsWithoutRef<'div'> {
	/** Показать avatar. @default true */
	avatar?: boolean;
	/** Число текстовых строк. @default 2 */
	lines?: number;
}

/**
 * Свойства `Skeleton.Table`.
 */
export interface SkeletonTableProps extends ComponentPropsWithoutRef<'div'> {
	/** Число строк. @default 5 */
	rows?: number;
	/** Число колонок. @default 4 */
	columns?: number;
}
