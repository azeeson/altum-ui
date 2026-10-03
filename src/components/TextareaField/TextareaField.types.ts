import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';
import type {FieldBaseProps} from '../TextField/TextField.types';

/**
 * Свойства `TextareaField`.
 * База поля — общий контракт `FieldBaseProps`; control — `TextField as="textarea"`.
 */
export interface TextareaFieldProps
	extends FieldBaseProps,
	Omit<
		ComponentPropsWithoutRef<'textarea'>,
		'size' | 'width' | 'prefix' | keyof FieldBaseProps
	> {
	/** className оболочки `TextField`. */
	wrapperClassName?: string;
	/** Минимум видимых строк. @default 1 */
	minRows?: number;
	/** Максимальная высота до появления вертикальной прокрутки. Не задавайте — рост без ограничения. */
	maxHeight?: number | string;
	/**
	 * Автоматически подгонять высоту под содержимое.
	 * При включении `style.height` не применяется: высоту держит авто-рост.
	 * @default true
	 */
	autoResize?: boolean;
	/** Узел `<textarea>`. */
	inputRef?: Ref<HTMLTextAreaElement>;
}
