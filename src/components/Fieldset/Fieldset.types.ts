import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

export type FieldsetVariant = 'default' | 'card' | 'plain';

/** Свойства корня `Fieldset`. */
export interface FieldsetRootProps extends ComponentPropsWithoutRef<'div'> {
	variant?: FieldsetVariant;
	disabled?: boolean;
	id?: string;
	children?: React.ReactNode;
}

/** Семантический `<fieldset>`. */
export interface FieldsetInnerProps extends ComponentPropsWithoutRef<'fieldset'> {
	children?: React.ReactNode;
}

/** Контейнер полей с gap. */
export interface FieldsetContentProps extends ComponentPropsWithoutRef<'div'> {
	gap?: number | string;
	children?: React.ReactNode;
}

export interface FieldsetLegendProps extends ComponentPropsWithoutRef<'legend'> {
	children?: React.ReactNode;
}

export interface FieldsetDescriptionProps extends ComponentPropsWithoutRef<'p'> {
	children?: React.ReactNode;
}

export interface FieldsetHintProps extends ComponentPropsWithoutRef<'p'> {
	children?: React.ReactNode;
}

export interface FieldsetFooterProps extends ComponentPropsWithoutRef<'div'> {
	children?: React.ReactNode;
}

export type FieldsetProps = FieldsetRootProps;
