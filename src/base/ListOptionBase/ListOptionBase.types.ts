import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Базовая строка option для listbox.
 * Состояния selected/highlighted — через props; кастомные модификаторы — через `className`.
 *
 * Внутренний примитив — не публичный API.
 */
export interface ListOptionBaseProps extends ComponentPropsWithoutRef<'button'> {
	/** Выбранная опция (Listbox-стиль). */
	selected?: boolean;
	/** Подсветка клавиатурой / hover (Listbox-стиль). */
	highlighted?: boolean;
	/** Многострочный label (иконка + описание). */
	multiline?: boolean;
}

export interface ListOptionBaseLabelProps extends ComponentPropsWithoutRef<'span'> {
	multiline?: boolean;
}
