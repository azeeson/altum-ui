import type {ComponentPropsWithoutRef, ReactNode} from 'react';

/**
 * Подпись пункта списка действий. Кнопку, фокус и выбор делает список.
 */
export interface ActionItemProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
	label: ReactNode;
	description?: ReactNode;
	icon?: ReactNode;
	shortcut?: ReactNode;
}
