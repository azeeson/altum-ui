import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

import type {ControlSize} from '../../types';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export type AlertLayout = 'block' | 'inline';

/** Свойства корня `Alert`. */
export interface AlertRootProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
	variant?: AlertVariant;
	size?: ControlSize;
	layout?: AlertLayout;
	role?: React.AriaRole;
}

export interface AlertIconProps extends ComponentPropsWithoutRef<'div'> {
	children?: React.ReactNode | null;
	/** Подставляет `Alert.Root` через cloneElement. */
	variant?: AlertVariant;
}

export interface AlertBodyProps extends ComponentPropsWithoutRef<'div'> {
	children?: React.ReactNode;
}

export interface AlertTitleProps extends ComponentPropsWithoutRef<'div'> {
	children?: React.ReactNode;
}

export interface AlertContentProps extends ComponentPropsWithoutRef<'div'> {
	children?: React.ReactNode;
}

export interface AlertActionsProps extends ComponentPropsWithoutRef<'div'> {
	children?: React.ReactNode;
}

export interface AlertCloseProps extends ComponentPropsWithoutRef<'button'> {
	onClose: () => void;
	closeLabel?: string;
}

export type AlertProps = AlertRootProps;
