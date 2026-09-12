import type {
	AriaRole,
	ComponentPropsWithoutRef,
	ReactNode,
} from 'react';
import type {RenderChildrenFn} from '../../utils/renderChildren';
import type {AnchorAlign, AnchorSide} from '../../types';
import type {OverlayDismiss} from '../Overlay/Overlay.types';

/**
 * Способ открытия: клик, наведение/фокус или только контролируемый режим / `onOpenChange`.
 */
export type PopoverTriggerMode = 'click' | 'hover' | 'manual';

/**
 * Визуальный вариант контента.
 * - `panel` — диалог/карточка
 * - `tooltip` — внутренний chrome для `Tooltip`; публично используйте `Tooltip`.
 * - `plain` — без chrome (только позиционирование)
 */
export type PopoverContentVariant = 'panel' | 'tooltip' | 'plain';

/** Slot-пропсы триггера: `renderTrigger(props, ref)`. */
export type PopoverTriggerSlotProps = {
	className?: string;
	'aria-expanded'?: boolean;
	'aria-haspopup'?: 'dialog' | 'true';
	'aria-controls'?: string;
	'aria-describedby'?: string;
};

/**
 * Свойства `Popover` — панель через `children`, якорь через `renderTrigger`.
 */
export interface PopoverProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/** Содержимое панели. */
	children?: ReactNode;
	/**
	 * Якорь. Навесьте `props` и `ref` на хост (или на обёртку при `wrap`).
	 * @example
	 * renderTrigger={(props, ref) => <Button {...props} ref={ref}>Открыть</Button>}
	 */
	renderTrigger: RenderChildrenFn<PopoverTriggerSlotProps>;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/**
	 * `click` — переключение по клику; `hover` — задержки + фокус; `manual` — только контролируемый режим.
	 * @default 'click'
	 */
	trigger?: PopoverTriggerMode;
	disabled?: boolean;
	/**
	 * Обернуть якорь в span (для disabled-кнопок без pointer events).
	 * Slot-пропсы и ref уходят на span.
	 * @default false
	 */
	wrap?: boolean;
	/**
	 * Chrome панели: `panel` | `tooltip` | `plain`.
	 * @default 'panel'
	 */
	variant?: PopoverContentVariant;
	/** Стрелка к якорю. @default true */
	arrow?: boolean;
	/** className панели (не корня). */
	panelClassName?: string;
	/** ARIA role. @default `'dialog'` для panel, `'tooltip'` для tooltip. */
	role?: AriaRole;
	/** Предпочтительная сторона панели относительно триггера; при нехватке места — flip. @default 'bottom' */
	side?: AnchorSide;
	/** Выравнивание вдоль стороны. @default 'center' */
	align?: AnchorAlign;
	/** Задержка открытия при `trigger="hover"` (мс). @default 200 */
	openDelay?: number;
	/** Задержка закрытия при `trigger="hover"` (мс). @default 100 */
	closeDelay?: number;
	/**
	 * Закрытие: снаружи, Escape, оба или выкл.
	 * @default `'all'` для `click`, `'none'` для `hover` / `manual`
	 */
	dismiss?: OverlayDismiss;
}
