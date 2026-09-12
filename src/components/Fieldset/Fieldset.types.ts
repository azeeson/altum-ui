import type React from 'react';
import type {ComponentPropsWithoutRef} from 'react';

export type FieldsetVariant = 'default' | 'card' | 'plain';

/**
 * Свойства `Fieldset` — chrome через пропсы, поля через `children`.
 */
export interface FieldsetProps extends ComponentPropsWithoutRef<'div'> {
	/** @default `'default'` */
	variant?: FieldsetVariant;
	/** Native `disabled` на `<fieldset>` (футер снаружи — кнопки остаются кликабельными). */
	disabled?: boolean;
	children?: React.ReactNode;
	legend?: React.ReactNode;
	description?: React.ReactNode;
	hint?: React.ReactNode;
	footer?: React.ReactNode;
	/** Gap между полями. @default `'var(--altum-g-space-4)'` */
	gap?: number | string;
}
