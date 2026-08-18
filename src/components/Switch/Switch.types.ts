import type {
	ComponentPropsWithoutRef,
} from 'react';
import type {ControlSize, LabelSide} from '../../types';

/** Алиас `LabelSide`. */
export type SwitchLabelSide = LabelSide;

/**
 * Свойства `Switch`.
 */
export interface SwitchProps extends Omit<ComponentPropsWithoutRef<'input'>, 'onChange' | 'size'> {
	label?: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	className?: string;
	readOnly?: boolean;
	/** @default 'md' */
	size?: ControlSize;
	/** @default 'end' */
	labelSide?: SwitchLabelSide;
}
