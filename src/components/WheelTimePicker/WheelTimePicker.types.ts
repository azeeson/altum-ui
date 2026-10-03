import type {ComponentPropsWithoutRef, Ref} from 'react';

/**
 * Разобранное время для попапов выбора.
 */
export type TimeValue = {
	hours: number;
	minutes: number;
};

/**
 * Контракт попапа времени: значение снаружи, изменения только через `onChange`.
 */
export type TimePopupProps = {
	/** `null`, если черновик поля пустой или невалидный */
	value: TimeValue | null;
	onChange: (next: TimeValue) => void;
};

/**
 * Свойства `WheelTimePicker`.
 */
export interface WheelTimePickerProps extends TimePopupProps,
	Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
	/** Панель открыта — программный скролл к `value` без smooth */
	active?: boolean;
	/** DOM-узел барабанов. */
	rootRef?: Ref<HTMLDivElement>;
}
