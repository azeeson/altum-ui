import type {
	ComponentPropsWithoutRef,
	ReactNode,
} from 'react';
import type {ButtonBaseProps} from '../ButtonBase';
import type {ControlSize, FieldWidth} from '../../types';

export type {ControlSize, FieldWidth};

/** Расположение лейбла относительно поля ввода. */
export type FieldLabelPlacement = 'inline' | 'outside' | 'none';

/**
 * Свойства `FieldBase` — общая оболочка TextField / Select / Textarea / CustomSelect.
 */
export interface FieldBaseRootProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children: ReactNode;
	size?: ControlSize;
	/** @default 'full' */
	width?: FieldWidth;
	/**
	 * Расположение лейбла:
	 * - `inline` — floating label внутри поля (по умолчанию);
	 * - `outside` — лейбл над полем;
	 * - `none` — без лейбла (бывший `compact`).
	 * @default 'inline'
	 */
	labelPlacement?: FieldLabelPlacement;
	error?: boolean | string;
	helperText?: string;
	disabled?: boolean;
	readOnly?: boolean;
	hasValue?: boolean;
	open?: boolean;
	focused?: boolean;
}

export interface FieldBaseLabelProps extends ComponentPropsWithoutRef<'label'> {
	/** Расположение конкретного label; по умолчанию — `labelPlacement` Root. */
	placement?: Exclude<FieldLabelPlacement, 'none'>;
}

export interface FieldBaseControlProps extends ComponentPropsWithoutRef<'div'> {
	children: ReactNode;
}

export interface FieldBasePrefixProps extends ComponentPropsWithoutRef<'span'> {
	children: ReactNode;
}

export interface FieldBasePostfixProps extends ComponentPropsWithoutRef<'span'> {
	children: ReactNode;
}

/**
 * Affix-кнопка поля (`FieldBase.Button`). `icon` — содержимое; размер берётся из Root.
 */
export interface FieldBaseButtonProps extends Omit<
	ButtonBaseProps,
	'as' | 'asChild' | 'contentClassName' | 'children'
> {
	icon?: ReactNode;
	children?: ReactNode;
}

export interface FieldBaseIconProps extends ComponentPropsWithoutRef<'span'> {
	children: ReactNode;
}

export interface FieldBaseClearProps extends Omit<FieldBaseButtonProps, 'icon'> {
	/** Показывать кнопку; по умолчанию зависит от состояния Root. */
	visible?: boolean;
}

export interface FieldBaseErrorProps extends Omit<ComponentPropsWithoutRef<'p'>, 'children'> {
	error?: boolean | string;
	className?: string;
	id?: string;
}

export interface FieldBaseHelperProps extends ComponentPropsWithoutRef<'span'> {
	children?: ReactNode;
	helperText?: string;
}

/**
 * Публичный контракт chrome поля (`label`, `size`, `width`, …)
 * для TextField / Select / и других продуктов на {@link FieldBase}.
 */
export interface FieldBaseProps extends Pick<
	FieldBaseRootProps,
	'labelPlacement' | 'size' | 'width' | 'error' | 'helperText' | 'disabled' | 'readOnly'
> {
	label: string;
	prefix?: ReactNode;
	postfix?: ReactNode;
	onClear?: () => void;
	clearLabel?: string;
}
