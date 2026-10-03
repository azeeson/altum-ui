import type {ComponentPropsWithoutRef, ReactNode, Ref} from 'react';

/**
 * Свойства `LiveRegion`.
 * Пустой `message` ничего не рендерит.
 */
export interface LiveRegionProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'role'> {
	/** Текст, который озвучит скринридер. */
	message?: ReactNode;
	/**
	 * `polite` ждёт паузу (`role="status"`). `assertive` перебивает (`role="alert"`).
	 * @default 'polite'
	 */
	politeness?: 'polite' | 'assertive';
	/** DOM-узел live-региона. */
	rootRef?: Ref<HTMLElement>;
}
