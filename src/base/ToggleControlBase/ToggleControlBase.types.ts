import type {
	ComponentPropsWithoutRef,
	CSSProperties,
	ReactNode,
	Ref,
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
	/** Нативный `<input>`. */
	inputRef?: Ref<HTMLInputElement>;
	/** Атрибуты на `<label>` (data-*, tabIndex, aria-disabled для SelectionGroup). */
	labelProps?: Omit<
		ComponentPropsWithoutRef<'label'>,
		'htmlFor' | 'className' | 'style' | 'children'
	> & Record<`data-${string}`, string | number | boolean | undefined>;
}
