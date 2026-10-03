import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';

import type {ControlSize, LabelSide} from '../../types';
import type {ToggleControlBaseProps} from '../../base/ToggleControlBase';

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
	/** Нативный `<input type="radio">`. */
	inputRef?: Ref<HTMLInputElement>;
	/** Атрибуты на `<label>` (SelectionGroup data-* / tabIndex). */
	labelProps?: ToggleControlBaseProps['labelProps'];
}

/**
 * Свойства `RadioGroup`.
 */
export interface RadioGroupProps extends Omit<ComponentPropsWithoutRef<'fieldset'>, 'children' | 'onChange' | 'defaultValue'> {
	name: string;
	label?: string;
	options: {
		label: string;
		value: string;
		disabled?: boolean;
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
	/** Корень группы (`SelectionGroup` / `<fieldset>`). */
	rootRef?: Ref<HTMLFieldSetElement>;
}
