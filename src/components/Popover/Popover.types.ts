import type {
	AriaRole,
	CSSProperties,
	MouseEvent,
	ReactElement,
	ReactNode,
	Ref,
} from 'react';
import type {RenderChildrenFn} from '../../core/utils/renderChildren';
import type {AnchorAlign, AnchorSide} from '../../types';

/**
 * Визуальный вариант контента.
 * - `panel` — диалог/карточка
 * - `plain` — без chrome (только позиционирование). Подсказка — `Tooltip`.
 */
export type PopoverContentVariant = 'panel' | 'plain';

/** Как клик по инвокеру действует на панель. Комбобокс — `show`. */
export type PopoverTargetAction = 'toggle' | 'show' | 'hide';

/** Slot-пропсы, которые `renderChildren` вешает на `trigger`. */
export type PopoverTriggerSlotProps = {
	/** HTML `popovertarget`. Нижний регистр — иначе React 18 не ставит атрибут на DOM. */
	popovertarget?: string;
	popovertargetaction?: PopoverTargetAction;
	onClick?: (event: MouseEvent<HTMLElement>) => void;
	style?: CSSProperties;
};

/**
 * Свойства `Popover` — панель через `children`, якорь через `trigger`.
 * Хост панели — `Overlay variant="floating"`; открытие и light dismiss —
 * нативный `popover="auto"` и `popovertarget`.
 */
export interface PopoverProps {
	/** Содержимое панели. */
	children?: ReactNode;
	/**
	 * Якорь: элемент или `(props, ref) => …`. Слот навешивает `renderChildren`.
	 * На кнопку слот ставит `popovertarget`. Ref получает `anchor-name`.
	 * @example
	 * <Popover trigger={<Button>Открыть</Button>}>Панель</Popover>
	 */
	trigger: ReactElement | RenderChildrenFn<PopoverTriggerSlotProps>;
	/** id панели. Без пропа — стабильный id из `useId`. */
	id?: string;
	disabled?: boolean;
	/**
	 * Chrome панели: `panel` | `plain`.
	 * @default 'panel'
	 */
	variant?: PopoverContentVariant;
	/** className панели. */
	className?: string;
	/** ARIA role. @default `'dialog'` */
	role?: AriaRole;
	/** Предпочтительная сторона панели относительно триггера; при нехватке места — flip. @default 'bottom' */
	side?: AnchorSide;
	/** Выравнивание вдоль стороны. @default 'center' */
	align?: AnchorAlign;
	/**
	 * Ширина панели относительно якоря.
	 * `trigger` — как якорь, `content` — по контенту, `trigger-fit` — не уже якоря.
	 * Без пропа ширина по контенту.
	 */
	widthMode?: 'trigger' | 'content' | 'trigger-fit';
	/**
	 * `toggle` — клик открывает и закрывает. `show` — клик только открывает (комбобокс).
	 * @default 'toggle'
	 */
	popoverTargetAction?: PopoverTargetAction;
	/** Показать панель после монтирования через `showPopover()`. */
	defaultOpen?: boolean;
	/**
	 * Нативное событие `toggle`. Не зеркало видимости: панель не читает React-стейт.
	 */
	onToggle?: (open: boolean) => void;
	/** Узел панели (`showPopover` / `hidePopover`). */
	panelRef?: Ref<HTMLElement | null>;
}
