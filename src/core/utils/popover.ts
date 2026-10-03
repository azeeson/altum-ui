import type {AnchorAlign, AnchorSide} from '../../types';

declare module 'react' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars -- параметр нужен для слияния с React.HTMLAttributes
	interface HTMLAttributes<T> {
		popover?: 'auto' | 'manual' | 'hint' | '';
		/**
		 * Нижний регистр: React 18 не знает camelCase `popoverTarget`
		 * и не ставит его на DOM.
		 */
		popovertarget?: string;
		popovertargetaction?: 'hide' | 'show' | 'toggle';
	}

	interface CSSProperties {
		anchorName?: string;
	}
}

declare global {
	interface ShowPopoverOptions {
		source?: Element | null;
	}

	interface HTMLElement {
		showPopover(options?: ShowPopoverOptions): void;
	}
}

/**
 * `start`/`end` держат край панели на краю якоря.
 * `center` — само имя стороны (`top`, `bottom`, `left`, `right`).
 */
const POSITION_AREA = {
	top: {
		start: 'top span-right',
		end: 'top span-left',
	},
	bottom: {
		start: 'bottom span-right',
		end: 'bottom span-left',
	},
	left: {
		start: 'left span-bottom',
		end: 'left span-top',
	},
	right: {
		start: 'right span-bottom',
		end: 'right span-top',
	},
} as const;

/**
 * Готовая строка CSS `position-area` для стороны и выравнивания якоря.
 * Компонент только подставляет её в стиль, без расчёта координат.
 */
export function positionArea(side: AnchorSide, align: AnchorAlign): string {
	if (align === 'center') return side;
	return POSITION_AREA[side][align];
}

/** Стабильный id панели из `useId` — годится и как HTML id, и как хвост `anchor-name`. */
export function popoverDomId(reactId: string): string {
	return `altum-popover-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

/** Имя якоря CSS Anchor Positioning. Всегда dashed-ident. */
export function anchorNameFor(id: string): string {
	return `--${id}`;
}

function canPopover(node: HTMLElement | null): node is HTMLElement {
	return node != null && node.hasAttribute('popover');
}

/**
 * Открыть нативный popover. Повторный вызов на уже открытом — no-op.
 * `source` — опциональный invoker (`popovertarget`); без него панель тоже открывается.
 */
export function showPopover(node: HTMLElement | null, source?: Element | null) {
	if (!canPopover(node) || node.matches(':popover-open')) return;
	if (source instanceof Element) {
		try {
			node.showPopover({source});
			if (node.matches(':popover-open')) return;
		} catch {
			/* Safari / старые движки без ShowPopoverOptions.source */
		}
	}
	node.showPopover();
}

/** Закрыть нативный popover. Повторный вызов на закрытом — no-op. */
export function hidePopover(node: HTMLElement | null) {
	if (!canPopover(node) || !node.matches(':popover-open')) return;
	node.hidePopover();
}

/** Панель, на которую указывает `popovertarget` узла. */
export function popoverFromInvoker(node: EventTarget | null): HTMLElement | null {
	if (!(node instanceof HTMLElement)) return null;
	const id = node.getAttribute('popovertarget');
	if (!id) return null;
	const panel = document.getElementById(id);
	return panel instanceof HTMLElement ? panel : null;
}
