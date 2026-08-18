import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import {
	Notification,
	type NotificationItem,
	type NotificationAction,
	type NotificationPosition,
	NotificationItemRenderer,
} from './Notification';
import type {NotifyInput, NotificationProviderProps} from './Notification.types';

export type {NotifyInput, NotificationProviderProps} from './Notification.types';

type Listener = (items: NotificationItem[]) => void;

interface ToastStore {
	subscribe: (listener: Listener) => () => void;
	notify: (input: NotifyInput | string) => string;
	dismiss: (id: string) => void;
	dismissAll: () => void;
}

function createToastStore(): ToastStore {
	let sequence = 0;
	let items: NotificationItem[] = [];
	const listeners = new Set<Listener>();

	const emit = () => {
		listeners.forEach((listener) => listener(items));
	};

	const subscribe = (listener: Listener): (() => void) => {
		listeners.add(listener);
		listener(items);
		return () => {
			listeners.delete(listener);
		};
	};

	const dismiss = (id: string): void => {
		items = items.filter((item) => item.id !== id);
		emit();
	};

	const dismissAll = (): void => {
		items = [];
		emit();
	};

	const notify = (input: NotifyInput | string): string => {
		const payload: NotifyInput = typeof input === 'string'
			? {title: input}
			: input;
		const id = payload.id ?? `toast-${Date.now()}-${sequence += 1}`;
		const item: NotificationItem = {
			duration: 3000,
			variant: 'info',
			...payload,
			id,
		};
		items = [...items, item];
		emit();
		return id;
	};

	return {
		subscribe,
		notify,
		dismiss,
		dismissAll
	};
}

const providerStack: ToastStore[] = [];

function registerProvider(store: ToastStore): () => void {
	providerStack.push(store);
	return () => {
		const index = providerStack.indexOf(store);
		if (index >= 0) providerStack.splice(index, 1);
	};
}

function getActiveStore(): ToastStore | null {
	return providerStack.length > 0 ? providerStack[providerStack.length - 1] : null;
}

const NO_PROVIDER_ERROR =
	'notify() требует NotificationProvider в дереве компонентов. Оберните приложение в <NotificationProvider>.';

function createNotifyFromStore(store: ToastStore): typeof notify {
	const contextNotify = ((input: NotifyInput | string) => store.notify(input)) as typeof notify;

	contextNotify.info = (title, description, rest) => contextNotify({
		...rest,
		title,
		description,
		variant: 'info',
	});

	contextNotify.success = (title, description, rest) => contextNotify({
		...rest,
		title,
		description,
		variant: 'success',
	});

	contextNotify.warning = (title, description, rest) => contextNotify({
		...rest,
		title,
		description,
		variant: 'warning',
	});

	contextNotify.error = (title, description, rest) => contextNotify({
		...rest,
		title,
		description,
		variant: 'error',
	});

	contextNotify.dismiss = (id) => store.dismiss(id);
	contextNotify.dismissAll = () => store.dismissAll();

	return contextNotify;
}

function requireActiveStore(): ToastStore {
	const store = getActiveStore();
	if (!store) {
		throw new Error(NO_PROVIDER_ERROR);
	}
	return store;
}

/**
 * Закрыть toast по id.
 * @param id - Идентификатор уведомления.
 * @throws Error, если `NotificationProvider` не смонтирован.
 */
export function dismiss(id: string): void {
	requireActiveStore().dismiss(id);
}

/**
 * Закрыть все toast.
 * @throws Error, если `NotificationProvider` не смонтирован.
 */
export function dismissAll(): void {
	requireActiveStore().dismissAll();
}

/**
 * Императивно показать toast. **Требует** `NotificationProvider` в дереве.
 *
 * @param input - Заголовок/описание/тип либо полный `NotifyInput`.
 * @returns id созданного уведомления.
 * @throws Error, если `NotificationProvider` не смонтирован.
 *
 * @example
 * notify({ title: 'Сохранено', variant: 'success' });
 * notify.success('Готово');
 * notify.error('Ошибка', 'Не удалось сохранить');
 */
export function notify(input: NotifyInput | string): string {
	return requireActiveStore().notify(input);
}

notify.info = (title: string, description?: string, rest?: Omit<NotifyInput, 'title' | 'description' | 'type'>) =>
	notify({
		...rest,
		title,
		description,
		variant: 'info',
	});

notify.success = (title: string, description?: string, rest?: Omit<NotifyInput, 'title' | 'description' | 'type'>) =>
	notify({
		...rest,
		title,
		description,
		variant: 'success',
	});

notify.warning = (title: string, description?: string, rest?: Omit<NotifyInput, 'title' | 'description' | 'type'>) =>
	notify({
		...rest,
		title,
		description,
		variant: 'warning',
	});

notify.error = (title: string, description?: string, rest?: Omit<NotifyInput, 'title' | 'description' | 'type'>) =>
	notify({
		...rest,
		title,
		description,
		variant: 'error',
	});

notify.dismiss = dismiss;
notify.dismissAll = dismissAll;

interface ToastContextValue {
	notify: typeof notify;
	dismiss: typeof dismiss;
	dismissAll: typeof dismissAll;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Провайдер императивных toast: монтирует `Notification.Viewport` и обслуживает `notify()`.
 * Каждый экземпляр имеет свой store; вложенные провайдеры — `notify()` идёт в ближайший (последний смонтированный).
 *
 * @component
 * @example
 * <NotificationProvider>
 *   <App />
 * </NotificationProvider>
 * // где-то в коде:
 * notify.success('Сохранено');
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
	children,
	maxVisible = 5,
	stacked = true,
	stackDepth = 3,
	position = 'bottom-right',
}) => {
	// Ленивый init useState: стабильное хранилище на провайдер (ref во время render запрещён react-hooks/refs).
	const [store] = useState(() => createToastStore());

	const [notifications, setNotifications] = useState<NotificationItem[]>([]);

	useEffect(() => registerProvider(store), [store]);

	useEffect(() => store.subscribe(setNotifications), [store]);

	const visible = useMemo(
		() => notifications.slice(-Math.max(1, maxVisible)),
		[maxVisible, notifications],
	);

	const value = useMemo<ToastContextValue>(() => ({
		notify: createNotifyFromStore(store),
		dismiss: (id) => store.dismiss(id),
		dismissAll: () => store.dismissAll(),
	}), [store]);

	const handleClose = useCallback((id: string) => {
		store.dismiss(id);
	}, [store]);

	return (
		<ToastContext.Provider value={value}>
			{children}
			<Notification.Viewport
				stacked={stacked}
				stackDepth={stackDepth}
				position={position}
			>
				{visible.slice().reverse().map((item) => (
					<NotificationItemRenderer
						key={item.id}
						item={item}
						onClose={handleClose}
					/>
				))}
			</Notification.Viewport>
		</ToastContext.Provider>
	);
};

NotificationProvider.displayName = 'Notification.Provider';

Object.assign(Notification, {Provider: NotificationProvider});

/**
 * Хук доступа к `notify` / `dismiss` внутри провайдера.
 *
 * @returns `{ notify, dismiss, dismissAll }`.
 * @throws Error, если провайдер не найден в дереве компонентов.
 *
 * @example
 * const { notify } = useNotify();
 * notify.success('Ок');
 */
export function useNotify(): ToastContextValue {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useNotify должен вызываться внутри NotificationProvider');
	}
	return context;
}

export type {NotificationAction, NotificationItem, NotificationPosition};
