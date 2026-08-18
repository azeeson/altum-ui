import type {
	ComponentPropsWithoutRef,
} from 'react';
import {type ControlSize} from '../../types';
import {type FieldLabelPlacement, type FieldWidth} from '../../base/FieldBase';

/**
 * Свойства `PinInput` (OTP / код подтверждения).
 */
export interface PinInputProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onChange' | 'defaultValue'> {
	/** Число ячеек. @default 6 */
	length?: number;
	/** @default 'md' */
	size?: ControlSize;
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	onComplete?: (value: string) => void;
	/** Только цифры. @default true */
	numeric?: boolean;
	disabled?: boolean;
	/** Скрыть ввод (пароль). @default false */
	masked?: boolean;
	/** Автофокус первой ячейки. @default false */
	autoFocus?: boolean;
	error?: boolean | string;
	label?: string;
	helperText?: string;
	name?: string;
	labelPlacement?: FieldLabelPlacement;
	width?: FieldWidth;
}
