import type {
	ComponentPropsWithoutRef,
	ReactElement,
	ReactNode,
} from 'react';
import type {ControlSize, LabelSide} from '../../types';

/** Визуальный тип тоггла. */
export type ToggleControlType = 'checkbox' | 'task' | 'radio' | 'switch';

/** Выравнивание бокса относительно многострочного лейбла. */
export type ToggleControlAlign = 'start' | 'center';

/**
 * Внутренняя база Checkbox / Radio / Switch: label + hidden input + box.
 * Chrome (`.root` / `.input` / `.box`) навешивает сама база.
 */
export interface ToggleControlBaseProps extends Omit<ComponentPropsWithoutRef<'label'>, 'children' | 'htmlFor'> {
	id: string;
	/** @default 'checkbox' */
	controlType?: ToggleControlType;
	/** @default 'md' */
	size?: ControlSize;
	/** @default 'center' */
	align?: ToggleControlAlign;
	labelSide?: LabelSide;
	readOnly?: boolean;
	disabled?: boolean;
	/** Для `controlType="task"` — приглушает бокс в checked. */
	checked?: boolean;
	label?: ReactNode;
	/** Скрыть текстовый лейбл визуально (место не занимает). */
	labelHidden?: boolean;
	input: ReactElement;
	boxContent?: ReactNode;
	boxClassName?: string;
	labelClassName?: string;
}
