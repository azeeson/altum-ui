import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

import type {ControlSize} from '../../types';

/**
 * Свойства `Radio`.
 */
export interface RadioProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
	label: React.ReactNode;
	readOnly?: boolean;
	/** @default 'md' */
	size?: ControlSize;
}

/**
 * Свойства `Radio`.
 */
export interface RadioGroupProps extends Omit<ComponentPropsWithoutRef<'fieldset'>, 'children' | 'onChange'> {
	name: string;
	label?: string;
	options: {
		label: string;
		value: string
	}[];
	value: string;
	onChange: (value: string) => void;
	orientation?: 'vertical' | 'horizontal';
	className?: string;
	readOnly?: boolean;
	disabled?: boolean;
	/** @default 'md' */
	size?: ControlSize;
}
