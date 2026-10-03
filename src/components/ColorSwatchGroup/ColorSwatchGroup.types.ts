import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';

/**
 * Свойства `ColorSwatchGroup`.
 */
export interface ColorSwatchGroupProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onChange' | 'defaultValue'> {
	colors: string[];
	value?: string;
	onChange: (color: string) => void;
	size?: 'sm' | 'md';
	label?: string;
	readOnly?: boolean;
	disabled?: boolean;
	/** DOM-узел группы. */
	rootRef?: Ref<HTMLDivElement>;
}
