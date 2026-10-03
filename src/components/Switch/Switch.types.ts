import type {
	ComponentPropsWithoutRef,
	Ref,
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
	/**
	 * Алиас `onChange(checked)` — тот же контракт, что у `Checkbox.onCheckedChange`.
	 */
	onCheckedChange?: (checked: boolean) => void;
	className?: string;
	readOnly?: boolean;
	/** @default 'md' */
	size?: ControlSize;
	/** @default 'end' */
	labelSide?: SwitchLabelSide;
	/** Нативный input переключателя. */
	inputRef?: Ref<HTMLInputElement>;
}
