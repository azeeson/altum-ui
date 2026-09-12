import type {
	ComponentPropsWithoutRef,
	CSSProperties,
	ReactNode,
} from 'react';
import type {ControlSize, LabelSide} from '../../types';

/** Выравнивание бокса относительно многострочного лейбла. */
export type ToggleControlAlign = 'start' | 'center';

/**
 * Внутренняя база Checkbox / Radio / Switch: label + hidden input + box.
 * Chrome бокса навешивает продукт (`boxClassName` / `inputClassName`).
 */
export interface ToggleControlBaseProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'className' | 'style'> {
	className?: string;
	style?: CSSProperties;
	/** @default 'md' */
	size?: ControlSize;
	/** @default 'center' */
	align?: ToggleControlAlign;
	labelSide?: LabelSide;
	readOnly?: boolean;
	label?: ReactNode;
	/** Скрыть текстовый лейбл визуально (место не занимает). */
	labelHidden?: boolean;
	boxContent?: ReactNode;
	boxClassName?: string;
	inputClassName?: string;
	labelClassName?: string;
}
