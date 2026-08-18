import type React from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {type CustomSelectOption, type CustomSelectRootProps, type CustomSelectSelectionMode} from '../CustomSelect/CustomSelect';
import type {FieldBaseProps} from '../../base/FieldBase';
import type {DropdownProps} from '../Dropdown/Dropdown';

export type SelectOption = CustomSelectOption;

export interface SelectRootProps extends Omit<CustomSelectRootProps, 'renderTarget' | 'children' | 'selectionMode'> {
	children: React.ReactNode;
	selectionMode?: CustomSelectSelectionMode;
}

export interface SelectTriggerProps extends FieldBaseProps, Omit<
	ComponentPropsWithoutRef<'div'>,
	'className' | 'onChange' | 'prefix' | keyof FieldBaseProps
> {
	children?: React.ReactNode;
	placeholder?: string;
	className?: string;
	wrapperClassName?: string;
	loading?: boolean;
	widthMode?: DropdownProps['widthMode'];
	/** Разделитель подписей для `selectionMode="path"`. @default ' / ' */
	separator?: string;
	/** `aria-haspopup` на trigger. @default 'listbox' */
	popupRole?: 'listbox' | 'tree' | 'dialog' | 'menu';
}

export interface SelectPanelProps extends ComponentPropsWithoutRef<'div'> {
	children: React.ReactNode;
}

export interface SelectChipsProps extends ComponentPropsWithoutRef<'span'> {
	children?: React.ReactNode;
}

export interface SelectChipProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
	value: string;
	children?: React.ReactNode;
}
