import type {
	ComponentPropsWithoutRef,
	ReactNode,
} from 'react';
import type {FieldBaseProps} from '../FieldBase';

type TextControlAs = 'input' | 'textarea';

/**
 * Внутренний полиморфный текстовый control (`input` / `textarea`) на {@link FieldBase}.
 */
export interface TextControlProps extends FieldBaseProps, Omit<
	ComponentPropsWithoutRef<'input'>,
	'prefix' | 'size' | 'width' | 'value' | 'defaultValue' | keyof FieldBaseProps
> {
	as?: TextControlAs;
	value?: string | number | readonly string[];
	defaultValue?: string | number | readonly string[];
	/** className оболочки `FieldBase` (у control — обычный `className`). */
	wrapperClassName?: string;
	/** Визуальный focus, пока привязанный popup открыт */
	active?: boolean;
	keepPlaceholder?: boolean;
	controlOverlay?: ReactNode;
	minRows?: number;
	maxHeight?: number | string;
	autoResize?: boolean;
	rows?: number;
}
