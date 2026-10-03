import type {
	ComponentPropsWithoutRef,
	ReactNode,
	Ref,
} from 'react';
import {type ControlSize} from '../../types';
import {type FieldWidth} from '../TextField/TextField.types';

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
	/**
	 * Скрыть символы точкой. Тип ячейки остаётся `text`, чтобы не глушить подстановку кода.
	 * @default false
	 */
	masked?: boolean;
	/** Автофокус первой ячейки. @default false */
	autoFocus?: boolean;
	error?: boolean | string;
	/** Снаружи ячеек, через `FieldLabel`. */
	label?: string;
	/** Снаружи ячеек, через `FormMessage` (строка) или слот (узел). */
	description?: ReactNode;
	name?: string;
	width?: FieldWidth;
	/** Корень поля. */
	rootRef?: Ref<HTMLDivElement>;
}
