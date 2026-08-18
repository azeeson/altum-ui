import type {
	AriaRole,
	ComponentPropsWithoutRef,
	HTMLAttributes,
	ReactNode,
} from 'react';
import type {WithEnrichedChildren} from '../../utils/renderChildren';
import type {AnchorAlign, AnchorSide} from '../../types';

/**
 * Способ открытия: клик, наведение/фокус или только контролируемый режим / `onOpenChange`.
 */
export type PopoverTriggerMode = 'click' | 'hover' | 'manual';

/**
 * Визуальный вариант контента.
 * - `panel` — диалог/карточка
 * - `tooltip` — компактная тёмная подсказка
 * - `plain` — без chrome (только позиционирование)
 */
export type PopoverContentVariant = 'panel' | 'tooltip' | 'plain';

/**
 * Slot-пропсы триггера Popover (через `renderChildren` / `WithEnrichedChildren`).
 */
export type PopoverTriggerSlotProps = {
	className?: string;
	'aria-expanded'?: boolean;
	'aria-haspopup'?: 'dialog' | 'true';
	'aria-controls'?: string;
	'aria-describedby'?: string;
};

/**
 * Свойства корня `Popover`.
 */
export interface PopoverProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children: ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Предпочтительная сторона панели относительно триггера; при нехватке места — flip. @default 'bottom' */
	side?: AnchorSide;
	/** Выравнивание вдоль стороны. @default 'center' */
	align?: AnchorAlign;
	/**
	 * `click` — переключение по клику; `hover` — задержки + фокус; `manual` — только контролируемый режим.
	 * @default 'click'
	 */
	trigger?: PopoverTriggerMode;
	/** Задержка открытия при `trigger="hover"` (мс). @default 200 */
	openDelay?: number;
	/** Задержка закрытия при `trigger="hover"` (мс). @default 100 */
	closeDelay?: number;
	disabled?: boolean;
	/**
	 * Закрытие по клику снаружи.
	 * По умолчанию `true` для `click`, `false` для `hover` / `manual`.
	 */
	closeOnOutsideClick?: boolean;
	/**
	 * Закрытие по Escape.
	 * По умолчанию `true` для `click`, `false` для `hover` / `manual`.
	 */
	closeOnEscape?: boolean;
}

type PopoverTriggerBaseProps = {
	/**
	 * Обернуть триггер в span (для disabled-кнопок без pointer events).
	 * @default auto — true, если единственный child disabled
	 */
	wrap?: boolean;
	className?: string;
};

/**
 * Свойства `Popover.Trigger` — триггер через `WithEnrichedChildren`.
 */
export type PopoverTriggerProps = WithEnrichedChildren<PopoverTriggerBaseProps, PopoverTriggerSlotProps>;

/**
 * Свойства `Popover.Content`.
 */
export interface PopoverContentProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
	children: ReactNode;
	/**
	 * Chrome панели: `panel` | `tooltip` | `plain`.
	 * @default 'panel'
	 */
	variant?: PopoverContentVariant;
	/** Показать стрелку к триггеру. @default false */
	arrow?: boolean;
	className?: string;
	/** ARIA role. @default 'dialog' для panel, 'tooltip' для tooltip */
	role?: AriaRole;
	/** Для `role="dialog"` панель ставит `aria-modal`. Подпишите панель через `aria-label` / `aria-labelledby`. */
}
