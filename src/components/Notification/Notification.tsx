import type {
	NotificationItem,
	NotificationProviderProps,
	NotificationViewportProps,
	NotificationProps,
} from './Notification.types';
export type {
	NotificationAction,
	NotificationItem,
	NotificationPosition,
	NotificationViewportProps,
	NotificationProps,
} from './Notification.types';

import {
	useCallback,
	useEffect,
	useRef,
	useSyncExternalStore,
	type AnimationEvent,
	type MouseEvent,
	type MutableRefObject,
	type ReactNode,
} from 'react';
import {Button} from '../Button/Button';
import {CloseControl} from '../internal/CloseControl/CloseControl';
import {ProgressCircle} from '../Progress/Progress';
import styles from './Notification.module.css';
import {cn} from '../../core/utils/cn';
import {uRef} from '../../core/utils/bundle';
import {useDocumentKeyDown} from '../../hooks/useDocumentKeyDown';
import {formatKeyboardShortcut} from '../../core/utils/keyboardShortcut';
import {matchesKeyboardShortcut} from '../../core/utils/keyboardShortcut';
import type {ToastStore} from './toast.utils';

const EMPTY_TOASTS: NotificationItem[] = [];

const subscribeNothing = (): (() => void) => () => {};

const getEmptyToasts = (): NotificationItem[] => EMPTY_TOASTS;

const closeCard = (node: HTMLElement): void => {
	const card = node.closest<HTMLElement>(`.${styles.notification}`);
	if (!card || card.hasAttribute('data-closing')) return;
	card.setAttribute('data-closing', '');
};

/** Top-layer контейнер тостов: `popover="manual"`. */
function NotificationViewport({
	children,
	stacked = true,
	stackDepth: _stackDepth = 3,
	position = 'top-right',
	className,
	rootRef,
	...rest
}: NotificationViewportProps) {
	const localRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const node = localRef.current;
		if (!node) return;
		if (!node.matches(':popover-open')) node.showPopover();
	}, []);

	return (
		<div
			ref={uRef(rootRef, localRef)}
			popover='manual'
			className={cn(styles.notificationsContainer, className)}
			data-position={position}
			{...rest}
		>
			<div className={cn(styles.stack, stacked && styles.stackCollapsed)}>
				{children}
			</div>
		</div>
	);
}

/**
 * Тост / баннер: `title`, `description`, `actions`. Императивно — `notify()` + `NotificationProvider`.
 *
 * @component
 * @example
 * <NotificationProvider>
 *   <Button onClick={() => notify({title: 'Сохранено', variant: 'success'})}>Тост</Button>
 * </NotificationProvider>
 */
function NotificationCard({
	variant = 'info',
	duration = 10000,
	progress = duration > 0,
	pauseOnHover = true,
	onClose,
	title,
	description,
	actions,
	className,
	style,
	rootRef,
	onAnimationEnd,
	...rest
}: NotificationProps) {
	const alive = duration > 0;
	const showTimer = Boolean(progress && alive);
	const actionsRef = useRef(actions);
	actionsRef.current = actions;

	const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
		onAnimationEnd?.(event);
		if (event.target !== event.currentTarget) return;
		if (event.animationName !== 'altum-notification-leave') return;
		if (event.currentTarget.hasAttribute('data-dismissed')) return;
		event.currentTarget.setAttribute('data-dismissed', '');
		const toastId = event.currentTarget.getAttribute('data-toast-id') ?? undefined;
		onClose?.(toastId);
	};

	const handleClick = (event: MouseEvent<HTMLDivElement>) => {
		const target = event.target as HTMLElement;
		if (target.closest('[data-notification-close]')) {
			closeCard(event.currentTarget);
			return;
		}
		const button = target.closest<HTMLElement>('[data-action-index]');
		if (!button || !event.currentTarget.contains(button)) return;
		const index = Number(button.getAttribute('data-action-index'));
		const action = actionsRef.current?.[index];
		if (!action) return;
		action.onClick();
		closeCard(event.currentTarget);
	};

	return (
		<div
			ref={rootRef}
			className={cn(styles.notification, className)}
			style={{
				...(alive ? {['--altum-toast-life' as string]: `${duration}ms`} : null),
				...style,
			}}
			{...rest}
			data-variant={variant}
			data-life={alive ? '' : undefined}
			data-pause={pauseOnHover ? '' : undefined}
			role={variant === 'error' ? 'alert' : 'status'}
			aria-live={variant === 'error' || variant === 'warning' ? 'assertive' : 'polite'}
			onAnimationEnd={handleAnimationEnd}
			onClick={handleClick}
		>
			<div className={styles.title}>
				{title}
			</div>
			{description != null && description !== '' ? (
				<div className={styles.description}>
					{description}
				</div>
			) : null}
			<div className={styles.dismiss}>
				{showTimer ? (
					<ProgressCircle
						className={styles.timer}
						percentage={100}
						showValueText={false}
						diameter={28}
						variant={variant ?? 'info'}
						aria-hidden
					/>
				) : null}
				<CloseControl
					className={cn(styles.close, showTimer && styles.closePending)}
					data-notification-close=''
				/>
			</div>
			{actions?.length ? (
				<div className={styles.actions}>
					{actions.map((action, index) => (
						<Button
							key={`${action.label}-${index}`}
							size='sm'
							variant={action.variant === 'secondary' ? 'secondary' : 'primary'}
							data-action-index={index}
							data-action-shortcut={action.shortcut || undefined}
						>
							{action.label}
							{(action.shortcutLabel ?? action.shortcut) && (
								<span className={styles.actionShortcut}>
									{action.shortcutLabel ?? formatKeyboardShortcut(action.shortcut!)}
								</span>
							)}
						</Button>
					))}
				</div>
			) : null}
		</div>
	);
}

type NotificationComponent = typeof NotificationCard & {
	Provider: (props: NotificationProviderProps) => ReactNode;
	Viewport: typeof NotificationViewport;
};

export const Notification = Object.assign(NotificationCard, {
	Viewport: NotificationViewport,
}) as NotificationComponent;

interface NotificationContainerProps extends Omit<NotificationViewportProps, 'children'> {
	notifications?: NotificationItem[];
	store?: ToastStore;
	/** Срез стора. Для переданного `notifications` не применяется. @default 5 */
	maxVisible?: number;
	onClose?: (id: string) => void;
}

export function NotificationContainer({
	notifications,
	store,
	onClose,
	maxVisible = 5,
	stackDepth = 3,
	rootRef: rootRefProp,
	...viewportProps
}: NotificationContainerProps) {
	const viewportRef = useRef<HTMLDivElement | null>(null);
	const rootRefPropRef = useRef(rootRefProp);
	rootRefPropRef.current = rootRefProp;
	const setViewportRef = useCallback((node: HTMLDivElement | null) => {
		viewportRef.current = node;
		const external = rootRefPropRef.current;
		if (typeof external === 'function') external(node);
		else if (external) (external as MutableRefObject<HTMLDivElement | null>).current = node;
	}, []);
	const live = useSyncExternalStore(
		store ? store.subscribe : subscribeNothing,
		store ? store.getItems : getEmptyToasts,
		store ? store.getItems : getEmptyToasts,
	);
	const shown = notifications ?? live.slice(-Math.max(1, maxVisible));
	const ordered = shown.slice().reverse();
	const visibleDepth = Math.max(1, stackDepth);

	const closeItem = useCallback((id?: string) => {
		if (!id) return;
		if (notifications) onClose?.(id);
		else store?.dismiss(id);
	}, [notifications, onClose, store]);

	useDocumentKeyDown((event) => {
		if (event.defaultPrevented) return;
		const root = viewportRef.current;
		if (!root) return;
		const buttons = root.querySelectorAll<HTMLElement>('[data-action-shortcut]');
		for (const button of buttons) {
			const shortcut = button.getAttribute('data-action-shortcut');
			if (!shortcut || !matchesKeyboardShortcut(event, shortcut)) continue;
			event.preventDefault();
			button.click();
			return;
		}
	});

	return (
		<NotificationViewport
			{...viewportProps}
			stackDepth={stackDepth}
			rootRef={setViewportRef}
		>
			{ordered.map((item, index) => (
				<div
					key={item.id}
					className={cn(
						styles.stackItem,
						index >= visibleDepth && styles.stackItemHidden,
					)}
					style={{['--altum-stack-i' as string]: String(index)}}
				>
					<Notification
						data-toast-id={item.id}
						variant={item.variant}
						duration={item.duration}
						progress={item.progress}
						pauseOnHover={item.pauseOnHover}
						onClose={closeItem}
						title={item.title}
						description={item.description}
						actions={item.actions}
					/>
				</div>
			))}
		</NotificationViewport>
	);
}
