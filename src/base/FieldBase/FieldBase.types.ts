import type {
	ComponentPropsWithoutRef,
	ReactNode,
} from 'react';
import type {ControlSize, FieldWidth} from '../../types';

export type {ControlSize, FieldWidth};

/** Расположение лейбла относительно поля ввода. */
export type FieldLabelPlacement = 'inline' | 'outside' | 'none';

/**
 * Публичный контракт chrome поля (`label`, `size`, `width`, …)
 * для TextField / Select / и других продуктов на {@link FieldBase}.
 */
export interface FieldBaseProps {
	label: string;
	/** @default `'inline'` */
	labelPlacement?: FieldLabelPlacement;
	size?: ControlSize;
	/**
	 * Ширина оболочки: `md` — до 320px, `full` — на всю ширину родителя.
	 * @default `'md'`
	 */
	width?: FieldWidth;
	error?: boolean | string;
	helperText?: string;
	disabled?: boolean;
	readOnly?: boolean;
	prefix?: ReactNode;
	postfix?: ReactNode;
	onClear?: () => void;
	clearLabel?: string;
	/** Слот под chrome (strength-meter и т.п.). */
	footer?: ReactNode;
}

/**
 * Свойства оболочки `FieldBase`: chrome — пропсы, control — `children`.
 */
export interface FieldBaseHostProps extends FieldBaseProps, Omit<
	ComponentPropsWithoutRef<'div'>,
	'children' | 'prefix'
> {
	id: string;
	hasValue?: boolean;
	focused?: boolean;
	open?: boolean;
	/** Нативный control (`input`, `textarea`, trigger-кнопка). */
	children: ReactNode;
	/** Абсолютный слой поверх control (маска MaskedField). */
	controlOverlay?: ReactNode;
	labelId?: string;
	/**
	 * Рамка и flex-chrome вокруг control. Выключите для группы ячеек (`PinInput`).
	 * @default true
	 */
	chrome?: boolean;
}

/**
 * Affix-кнопка поля. `icon` — содержимое.
 */
export interface FieldBaseButtonProps extends ComponentPropsWithoutRef<'button'> {
	icon?: ReactNode;
}

export interface FieldBaseIconProps extends ComponentPropsWithoutRef<'span'> {
	children: ReactNode;
}
