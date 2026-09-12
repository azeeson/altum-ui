import type {
	ComponentPropsWithoutRef,
	ElementType,
} from 'react';

export type TypeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type TypeWeight = 'normal' | 'medium' | 'semibold' | 'bold';

/**
 * Свойства внутреннего текстового примитива `Type`.
 */
export interface TypeProps extends ComponentPropsWithoutRef<'span'> {
	size?: TypeSize;
	weight?: TypeWeight;
	as?: ElementType;
}
