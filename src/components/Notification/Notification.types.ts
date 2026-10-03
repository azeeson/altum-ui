import type React from 'react';
import type {ComponentPropsWithoutRef, Ref} from 'react';

/** Действие в toast. */
export interface NotificationAction {
	label: string;
	onClick: () => void;
	variant?: 'primary' | 'secondary';
	/**
	 * Глобальный шорткат, пока toast виден.
	 * Примеры: `mod+z`, `ctrl+shift+k`, `escape`, `alt+s`.
	 * `mod` = ⌘ на Apple / Ctrl на остальных.
	 */
	shortcut?: string;
	/** Подпись шортката в UI; по умолчанию из `formatKeyboardShortcut` */
	shortcutLabel?: React.ReactNode;
}

/** Модель toast для `notify()` / `NotificationProvider`. */
export interface NotificationItem {
	id: string;
	title: string;
	description?: string;
	variant?: 'info' | 'success' | 'warning' | 'error';
	/** мс; по умолчанию 10000. `0` — без автозакрытия */
	duration?: number;
	actions?: NotificationAction[];
	/** Круговой отсчёт на месте крестика; по умолчанию при `duration > 0` */
	progress?: boolean;
	/**
	 * Пауза auto-dismiss при hover / focus-within.
	 * В стопке (`NotificationProvider` / `NotificationContainer`) hover любого toast
	 * ставит на паузу таймеры всех уведомлений с `pauseOnHover`.
	 * @default true
	 */
	pauseOnHover?: boolean;
}

/**
 * Угол / край экрана для контейнера toast.
 */
export type NotificationPosition =
	| 'top-left'
	| 'top-right'
	| 'top-center'
	| 'bottom-left'
	| 'bottom-right'
	| 'bottom-center';

/** Свойства контейнера стопки toast. */
export interface NotificationViewportProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children?: React.ReactNode;
	/**
	 * Несколько toast — стопкой (новое сверху); hover / focus раскрывает список.
	 * @default true
	 */
	stacked?: boolean;
	/** Сколько «рёбер» видно в свёрнутой стопке. @default 3 */
	stackDepth?: number;
	/**
	 * Позиция контейнера на экране.
	 * @default 'top-right'
	 */
	position?: NotificationPosition;
	/** Корень портала. */
	rootRef?: Ref<HTMLDivElement>;
}

/** Свойства карточки toast. */
export interface NotificationProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
	title: React.ReactNode;
	description?: React.ReactNode;
	actions?: NotificationAction[];
	variant?: NotificationItem['variant'];
	duration?: number;
	progress?: boolean;
	/**
	 * Пауза auto-dismiss при hover / focus-within.
	 * В стопке hover любого toast паузит все с `pauseOnHover`.
	 * @default true
	 */
	pauseOnHover?: boolean;
	onClose?: (id?: string) => void;
	/** Корень карточки. */
	rootRef?: Ref<HTMLDivElement>;
}

/** Вход `notify()`: `id` опционален, генерируется, если не передан. */
export type NotifyInput = Omit<NotificationItem, 'id'> & {
	id?: string;
};

/** Свойства `NotificationProvider`. */
export interface NotificationProviderProps {
	children?: React.ReactNode;
	/** Максимум одновременных toast; старые снимаются. @default 5 */
	maxVisible?: number;
	/**
	 * Стопка при нескольких toast (новое сверху, hover раскрывает).
	 * @default true
	 */
	stacked?: boolean;
	/** Сколько «рёбер» видно в свёрнутой стопке. @default 3 */
	stackDepth?: number;
	/**
	 * Позиция контейнера на экране.
	 * @default 'top-right'
	 */
	position?: NotificationPosition;
}
