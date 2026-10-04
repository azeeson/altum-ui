import type {ComponentPropsWithoutRef, Ref} from 'react';

/** Свойства корня `Header`. Корень — `div`, его можно вложить в `Layout.Header`. */
export interface HeaderProps extends ComponentPropsWithoutRef<'div'> {
	/** DOM-узел шапки. */
	rootRef?: Ref<HTMLDivElement>;
}
