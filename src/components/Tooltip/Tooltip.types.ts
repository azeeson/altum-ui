import type {
	ReactNode,
} from 'react';
import type {AnchorSide} from '../../types';
import type {WithEnrichedChildren} from '../../utils/renderChildren';

/**
 * Сторона подсказки относительно триггера (`TooltipSide`).
 */
export type TooltipSide = AnchorSide;

/**
 * @deprecated Используйте {@link TooltipSide}.
 */
export type TooltipPosition = TooltipSide;

/**
 * Slot-пропсы триггера Tooltip (через `renderChildren`).
 */
export type TooltipTriggerProps = {
	className?: string;
	'aria-describedby'?: string;
};

type TooltipBaseProps = {
	content: ReactNode;
	/** Сторона панели. @default `'top'` */
	side?: TooltipSide;
	/**
	 * @deprecated Используйте `side`.
	 */
	position?: TooltipSide;
	className?: string;
	/** Контролируемая видимость. */
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Задержка открытия при hover (мс). @default 200 */
	openDelay?: number;
	/** Задержка закрытия (мс). @default 100 */
	closeDelay?: number;
	/** Не показывать подсказку */
	disabled?: boolean;
	/**
	 * Обернуть триггер в span (нужно для disabled-кнопок без pointer events).
	 * Для элемент-child оборачивает children в `span` перед slot-merge.
	 * @default auto — true, если единственный child disabled
	 */
	wrap?: boolean;
	/** Стрелка к триггеру. @default true */
	arrow?: boolean;
};

/**
 * Свойства `Tooltip` — тонкая обёртка над `Popover` (`trigger="hover"`, `variant="tooltip"`).
 *
 * Триггер: элемент-child (slot) или render-prop.
 */
export type TooltipProps = WithEnrichedChildren<TooltipBaseProps, TooltipTriggerProps>;
