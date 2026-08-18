import type {
	ReactNode,
} from 'react';
import type {WithEnrichedChildren} from '../../utils/renderChildren';

/**
 * Позиция подсказки (`TooltipPosition`).
 */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Slot-пропсы триггера Tooltip (через `renderChildren`).
 */
export type TooltipTriggerProps = {
	className?: string;
	'aria-describedby'?: string;
};

type TooltipBaseProps = {
	content: ReactNode;
	position?: TooltipPosition;
	className?: string;
	/**
	 * Контролируемая видимость.
	 * Без `onOpenChange` и `open={true}` — принудительно открыт (Storybook).
	 */
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
	 * При `asChild` оборачивает children в `span` перед `cloneElement`.
	 * @default auto — true, если единственный child disabled
	 */
	wrap?: boolean;
	/** Показать стрелку. @default false */
	arrow?: boolean;
};

/**
 * Свойства `Tooltip` — тонкая обёртка над `Popover` (`trigger="hover"`, `Content variant="tooltip"`).
 *
 * Триггер: `WithEnrichedChildren` — `asChild` + `children` (элемент или render-prop).
 */
export type TooltipProps = WithEnrichedChildren<TooltipBaseProps, TooltipTriggerProps>;
