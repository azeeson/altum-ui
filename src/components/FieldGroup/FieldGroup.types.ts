import type {ComponentPropsWithoutRef, Ref} from 'react';

/**
 * Ширина ряда.
 * `auto` — по содержимому, поля не шире `--altum-field-width-default`.
 * `full` — на ширину родителя, поля делят место, кнопки остаются по контенту.
 */
export type FieldGroupWidth = 'auto' | 'full';

/**
 * Свойства `FieldGroup`.
 */
export interface FieldGroupProps extends ComponentPropsWithoutRef<'div'> {
	/**
	 * @default 'auto'
	 */
	width?: FieldGroupWidth;
	/** DOM-узел ряда. */
	rootRef?: Ref<HTMLDivElement>;
}
