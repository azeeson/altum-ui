import type {
	ComponentPropsWithoutRef,
	ReactNode,
} from 'react';
import type {FieldLabelPlacement} from '../../base/FieldBase';
import type {FieldBaseProps} from '../../base/FieldBase';

export type {FieldLabelPlacement};

/**
 * Свойства `TextField`.
 * База поля (`label`, `size`, `width`, …) — общий контракт **`FieldBaseProps`**.
 */
export interface TextFieldProps
	extends FieldBaseProps,
	Omit<
		ComponentPropsWithoutRef<'input'>,
		'prefix' | 'size' | 'width' | keyof FieldBaseProps
	> {
	/** className оболочки `FieldBase` (у control — обычный `className`). */
	wrapperClassName?: string;
	/** Визуальный focus, пока привязанный popup (календарь, список времени) открыт */
	active?: boolean;
	/** Слой поверх control внутри `FieldBase.Control` (маска и т.п.). */
	controlOverlay?: ReactNode;
}
