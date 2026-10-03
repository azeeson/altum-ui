import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';

/**
 * Свойства `Rating`.
 */
export interface RatingProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onChange' | 'defaultValue'> {
	value?: number;
	defaultValue?: number;
	onChange?: (value: number) => void;
	/** Максимум звёзд. @default 5 */
	max?: number;
	readOnly?: boolean;
	disabled?: boolean;
	size?: 'sm' | 'md' | 'lg';
	/** Разрешить сброс повторным кликом по тому же значению. @default true */
	allowClear?: boolean;
	/** Корень группы. */
	rootRef?: Ref<HTMLDivElement>;
}
