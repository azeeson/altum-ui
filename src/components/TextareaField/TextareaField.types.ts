import type {
	ComponentPropsWithoutRef,
} from 'react';
import type {FieldBaseProps} from '../../base/FieldBase';

/**
 * Свойства `TextareaField`.
 * База поля — общий контракт `FieldBaseProps`.
 */
export interface TextareaFieldProps
	extends FieldBaseProps,
	Omit<
		ComponentPropsWithoutRef<'textarea'>,
		'size' | 'width' | 'prefix' | keyof FieldBaseProps
	> {
	/** className оболочки `FieldBase`. */
	wrapperClassName?: string;
	/** Минимум видимых строк. По умолчанию 1 — та же визуальная высота, что у TextField. */
	minRows?: number;
	/** Максимальная высота до появления вертикальной прокрутки. Не задавайте — рост без ограничения. */
	maxHeight?: number | string;
	/** Автоматически подгонять высоту под содержимое. По умолчанию `true`. */
	autoResize?: boolean;
}
