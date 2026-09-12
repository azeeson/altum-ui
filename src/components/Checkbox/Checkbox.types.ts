import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';
import type {ControlSize, LabelSide} from '../../types';

export type {LabelSide};

/**
 * Режим оформления: обычный квадратный или круглый для списков задач.
 */
export type CheckboxMode = 'default' | 'task';

/**
 * Свойства `Checkbox`.
 */
export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
	/**
	 * Лейбл рядом с контролом.
	 * В `mode="task"` можно опустить (подпись снаружи) — задайте `aria-label`.
	 */
	label?: React.ReactNode;
	/**
	 * `hidden` — без видимого текста и без места под лейбл; обязателен `aria-label` или `aria-labelledby`.
	 * @default 'visible'
	 */
	labelVisibility?: 'visible' | 'hidden';
	readOnly?: boolean;
	/** @default 'md' */
	size?: ControlSize;
	/** Сторона лейбла. @default 'end' */
	labelSide?: LabelSide;
	/** Неопределённое состояние (частичный выбор) */
	indeterminate?: boolean;
	/**
	 * `task` — круглый чекбокс для списков задач.
	 * @default 'default'
	 */
	mode?: CheckboxMode;
	/**
	 * Вертикальное выравнивание бокса относительно лейбла / соседей.
	 * Для `mode="task"` по умолчанию `start` (первая строка multi-line).
	 * @default mode=task → 'start', иначе 'center'
	 */
	align?: 'start' | 'center';
	/**
	 * Значение, без native event — как `Switch.onChange`.
	 * Native `onChange` сохраняется.
	 */
	onCheckedChange?: (checked: boolean) => void;
}

/**
 * Свойства `CheckboxGroup`.
 */
export interface CheckboxGroupProps extends Omit<ComponentPropsWithoutRef<'fieldset'>, 'children' | 'onChange'> {
	label?: string;
	options: {
		label: string;
		value: string
	}[];
	value: string[];
	onChange: (value: string[]) => void;
	orientation?: 'vertical' | 'horizontal';
	className?: string;
	readOnly?: boolean;
	disabled?: boolean;
	size?: ControlSize;
	labelSide?: LabelSide;
}
