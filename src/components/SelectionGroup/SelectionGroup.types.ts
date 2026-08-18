import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

export type SelectionGroupOrientation = 'horizontal' | 'vertical';

export interface SelectionGroupRootProps extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'children' | 'defaultValue' | 'onChange'
> {
	children: React.ReactNode;
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	orientation?: SelectionGroupOrientation;
	disabled?: boolean;
	readOnly?: boolean;
	/**
	 * Менять value при навигации стрелками (как Tabs / SegmentedControl).
	 * @default true
	 */
	activateOnFocus?: boolean;
}

export interface SelectionGroupListProps extends ComponentPropsWithoutRef<'div'> {
	children?: React.ReactNode;
}

export interface SelectionGroupItemProps
	extends Omit<ComponentPropsWithoutRef<'button'>, 'value'> {
	value: string;
	children?: React.ReactNode;
}

export interface SelectionGroupPanelProps extends ComponentPropsWithoutRef<'div'> {
	value: string;
	children?: React.ReactNode;
	/** Рендерить панель даже если она не активна (скрыта через `hidden`) */
	forceMount?: boolean;
}
