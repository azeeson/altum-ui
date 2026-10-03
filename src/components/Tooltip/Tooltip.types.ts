import type {ReactNode, Ref} from 'react';
import type {AnchorSide} from '../../types';
import type {WithEnrichedChildren} from '../../core/utils/renderChildren';

/**
 * Сторона подсказки относительно триггера (`TooltipSide`).
 */
export type TooltipSide = AnchorSide;

/**
 * Slot-пропсы триггера Tooltip.
 * Вешаются на единственный элемент или приходят первым аргументом render-prop.
 */
export type TooltipTriggerProps = {
	className?: string;
	'aria-describedby'?: string;
};

type TooltipBaseProps = {
	content: ReactNode;
	/** Сторона панели. @default `'top'` */
	side?: TooltipSide;
	className?: string;
	/**
	 * Принудительно показать подсказку (визуальные тесты).
	 * Это атрибут, не стейт открытия: ховер по-прежнему считает CSS.
	 */
	open?: boolean;
	/** То же, что `open`: подсказка видна без наведения. */
	defaultOpen?: boolean;
	/** Задержка появления при hover (мс). Пишется в CSS, без таймера. @default 200 */
	openDelay?: number;
	/** Задержка скрытия (мс). Пишется в CSS, без таймера. @default 100 */
	closeDelay?: number;
	/** Не показывать подсказку */
	disabled?: boolean;
	/** Хост подсказки. Если подсказка скрыта — узел триггера. */
	rootRef?: Ref<HTMLElement>;
	/**
	 * Оставлен для совместимости: хост и так оборачивает триггер,
	 * поэтому disabled-кнопка получает hover.
	 */
	wrap?: boolean;
};

/**
 * Свойства `Tooltip`.
 * Ховер и фокус — CSS (`:hover`, `:focus-within`) и CSS Anchor Positioning.
 * Триггер: элемент-child (slot) или render-prop.
 */
export type TooltipProps = WithEnrichedChildren<TooltipBaseProps, TooltipTriggerProps>;
