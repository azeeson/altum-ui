import type {NotificationItem, NotifyInput} from './Notification.types';

type StoreListener = () => void;

export interface ToastStore {
	subscribe: (listener: StoreListener) => () => void;
	/** Тот же массив, пока состав не менялся. Новый массив на каждый вызов зациклит `useSyncExternalStore`. */
	getItems: () => NotificationItem[];
	notify: (input: NotifyInput | string) => string;
	dismiss: (id: string) => void;
	dismissAll: () => void;
}

export function createToastStore(): ToastStore {
	let sequence = 0;
	let items: NotificationItem[] = [];
	const listeners = new Set<StoreListener>();

	const emit = () => {
		listeners.forEach((listener) => listener());
	};

	const subscribe = (listener: StoreListener): (() => void) => {
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	};

	const getItems = (): NotificationItem[] => items;

	const dismiss = (id: string): void => {
		if (!items.some((item) => item.id === id)) return;
		items = items.filter((item) => item.id !== id);
		emit();
	};

	const dismissAll = (): void => {
		if (items.length === 0) return;
		items = [];
		emit();
	};

	const notify = (input: NotifyInput | string): string => {
		const payload: NotifyInput = typeof input === 'string'
			? {title: input}
			: input;
		const id = payload.id ?? `toast-${Date.now()}-${sequence += 1}`;
		const item: NotificationItem = {
			duration: 10000,
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
		getItems,
		notify,
		dismiss,
		dismissAll,
	};
}

const providerStack: ToastStore[] = [];

export function registerProvider(store: ToastStore): () => void {
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

type NotifyShortcut = (
	title: string,
	description?: string,
	rest?: Omit<NotifyInput, 'title' | 'description'>,
) => string;

export interface NotifyFn {
	(input: NotifyInput | string): string;
	info: NotifyShortcut;
	success: NotifyShortcut;
	warning: NotifyShortcut;
	error: NotifyShortcut;
	dismiss: (id: string) => void;
	dismissAll: () => void;
}

function attachNotifyApi(
	notifyFn: (input: NotifyInput | string) => string,
	store: Pick<ToastStore, 'dismiss' | 'dismissAll'>,
): NotifyFn {
	const api = notifyFn as NotifyFn;
	api.info = (title, description, rest) => notifyFn({
		...rest,
		title,
		description,
		variant: 'info',
	});
	api.success = (title, description, rest) => notifyFn({
		...rest,
		title,
		description,
		variant: 'success',
	});
	api.warning = (title, description, rest) => notifyFn({
		...rest,
		title,
		description,
		variant: 'warning',
	});
	api.error = (title, description, rest) => notifyFn({
		...rest,
		title,
		description,
		variant: 'error',
	});
	api.dismiss = (id) => store.dismiss(id);
	api.dismissAll = () => store.dismissAll();
	return api;
}

export function createNotifyFromStore(store: ToastStore): NotifyFn {
	return attachNotifyApi((input) => store.notify(input), store);
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
export const notify: NotifyFn = attachNotifyApi(
	(input) => requireActiveStore().notify(input),
	{
		dismiss,
		dismissAll,
	},
);
