import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';
import {ControlSize} from '../../types';

/** Раскладка лейбла относительно контрола. */
export type FieldLabelLayout = 'vertical' | 'horizontal';

export type FieldLabelAlign = 'start' | 'center' | 'baseline';

export type FieldLabelJustify = 'start' | 'between';

export interface FieldLabelProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	label: React.ReactNode;
	children: React.ReactNode;
	layout?: FieldLabelLayout;
	size?: ControlSize;
	htmlFor?: string;
	labelWidth?: number | string;
	align?: FieldLabelAlign;
	justify?: FieldLabelJustify;
	labelClassName?: string;
	contentClassName?: string;
	id?: string;
}
