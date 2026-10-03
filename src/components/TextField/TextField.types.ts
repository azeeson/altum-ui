import type {
	ComponentPropsWithoutRef,
	ReactNode,
	Ref,
} from 'react';
import type {ControlSize, FieldWidth} from '../../types';

export type {ControlSize, FieldWidth};

/**
 * Публичный контракт chrome поля (`label`, `size`, `width`, …)
 * для TextField / Select / и других продуктов на {@link TextField}.
 */
export interface FieldBaseProps {
	/**
	 * Floating-лейбл внутри chrome (по центру, пока пусто и без фокуса; иначе вверх).
	 * Без `label` — подпись через `aria-label` / `aria-labelledby` или внешний `FieldLabel`.
	 */
	label?: string;
	size?: ControlSize;
	/**
	 * Ширина оболочки: `md` — до 320px, `full` — на всю ширину родителя.
	 * @default `'full'` у `TextField`; продукты вроде `Select` задают своё.
	 */
	width?: FieldWidth;
	error?: boolean | string;
	/**
	 * Под полем: строка — подсказка (`FormMessage`); узел — слот
	 * (индикатор сложности и т.п.). Строка скрывается, если задан `error`.
	 */
	description?: ReactNode;
	disabled?: boolean;
	readOnly?: boolean;
	prefix?: ReactNode;
	postfix?: ReactNode;
	onClear?: () => void;
	clearLabel?: string;
}

/**
 * Affix-кнопка поля. `icon` — содержимое.
 */
export interface FieldBaseButtonProps extends ComponentPropsWithoutRef<'button'> {
	icon?: ReactNode;
	/** Узел кнопки. */
	rootRef?: Ref<HTMLButtonElement>;
}

export interface FieldBaseIconProps extends ComponentPropsWithoutRef<'span'> {
	children: ReactNode;
	/** Узел иконки. */
	rootRef?: Ref<HTMLSpanElement>;
}

/** Корень control внутри `TextField`. */
export type TextFieldAs = 'input' | 'textarea' | 'button' | 'div';

/**
 * DOM-узел control `TextField`.
 * @template T - тег `as`.
 */
export type TextFieldRef<T extends TextFieldAs> = T extends 'textarea'
	? HTMLTextAreaElement
	: T extends 'button'
		? HTMLButtonElement
		: T extends 'div'
			? HTMLDivElement
			: HTMLInputElement;

type TextFieldOwnProps = FieldBaseProps & {
	/** className оболочки (у control — обычный `className`). */
	wrapperClassName?: string;
	/** Корень-`div` (якорь, измерение). Узел control — `inputRef`. */
	rootRef?: Ref<HTMLElement>;
	/** HTML-атрибуты оболочки. */
	wrapperProps?: Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'prefix'>;
	/**
	 * Визуальный focus-chrome, пока привязанный popup открыт
	 * (календарь, список). Кольцо на chrome, даже если фокус уже в панели.
	 */
	active?: boolean;
	/**
	 * Не скрывать placeholder при фокусе пустого поля.
	 * Нужен поиску в оверлее (`Select`, `ActionList`, `CommandPalette`).
	 */
	keepPlaceholder?: boolean;
	/** Слой поверх control (маска MaskedField). */
	controlOverlay?: ReactNode;
	/** Для `as="button" | "div"`: есть выбранное значение (clear / `data-has-value`). */
	hasValue?: boolean;
};

/**
 * Свойства `TextField`.
 * `as="textarea"` даёт атрибуты textarea; `as="button" | "div"` — хост (дети в слоте control).
 * @template T - тег control.
 */
export type TextFieldProps<T extends TextFieldAs = 'input'> =
	TextFieldOwnProps
	& Omit<ComponentPropsWithoutRef<T>, keyof TextFieldOwnProps | 'as' | 'prefix' | 'size' | 'width'>
	& {
		/** Control. @default `'input'` */
		as?: T;
		/** Узел control (`input`, `textarea`, `button` или `div`). */
		inputRef?: Ref<TextFieldRef<T>>;
	};
