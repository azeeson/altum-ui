import {useRequiredContext} from '../../hooks/useRequiredContext';
import React, {createContext, useEffect, useMemo, useState} from 'react';
import {Notification, NotificationContainer} from './Notification';
import type {NotificationProviderProps} from './Notification.types';
import {
	createNotifyFromStore,
	createToastStore,
	registerProvider,
	type NotifyFn,
} from './toast.utils';

export type {NotifyInput, NotificationProviderProps} from './Notification.types';
export {dismiss, dismissAll, notify} from './toast.utils';
export type {NotifyFn} from './toast.utils';

interface ToastContextValue {
	notify: NotifyFn;
	dismiss: (id: string) => void;
	dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Провайдер императивных toast: монтирует портал и обслуживает `notify()`.
 * Список тостов лежит в сторе вне React: его смена не перерисовывает `children`.
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
	position = 'top-right',
}) => {
	// Ленивый init useState: стабильное хранилище на провайдер (ref во время render запрещён react-hooks/refs).
	const [store] = useState(() => createToastStore());

	useEffect(() => registerProvider(store), [store]);

	const value = useMemo<ToastContextValue>(() => ({
		notify: createNotifyFromStore(store),
		dismiss: (id) => store.dismiss(id),
		dismissAll: () => store.dismissAll(),
	}), [store]);

	return (
		<ToastContext.Provider value={value}>
			{children}
			<NotificationContainer
				store={store}
				maxVisible={maxVisible}
				stacked={stacked}
				stackDepth={stackDepth}
				position={position}
			/>
		</ToastContext.Provider>
	);
};

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
	return useRequiredContext(
		ToastContext,
		'useNotify должен вызываться внутри NotificationProvider',
	);
}

export type {NotificationAction, NotificationItem, NotificationPosition} from './Notification';
