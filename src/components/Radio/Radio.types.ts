import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

import type {ControlSize, LabelSide} from '../../types';

/**
 * Свойства `Radio`.
 */
export interface RadioProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
	label: React.ReactNode;
	readOnly?: boolean;
	/** @default 'md' */
	size?: ControlSize;
	/** Сторона лейбла. @default 'end' */
	labelSide?: LabelSide;
	/**
	 * Значение, без native event — как `Switch.onChange`.
	 */
	onCheckedChange?: (checked: boolean) => void;
}

/**
 * Свойства `RadioGroup`.
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
	/** Сторона лейбла у каждого `Radio`. @default 'end' */
	labelSide?: LabelSide;
}
