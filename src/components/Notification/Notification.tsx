import type {
	NotificationItem,
	NotificationPosition,
	NotificationViewportProps,
	NotificationProps,
} from './Notification.types';
export type {
	NotificationAction,
	NotificationItem,
	NotificationPosition,
	NotificationViewportProps,
	NotificationProps,
	NotificationRootProps,
} from './Notification.types';

/* eslint-disable react-hooks/set-state-in-effect -- Эффекты синхронизируют состояние со сбросами пропов и обновлениями ResizeObserver. */
import React, {createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {IconCross} from '../../icons/icons/IconCross';
import {Button} from '../Button/Button';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import overlayClose from '../../styles/overlayClose.module.css';
import styles from './Notification.module.css';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useLocale} from '../../locales/localeContext';
import type {NotificationProviderProps} from './toast';
import {createLibraryPortal} from '../../utils/portal';
import {useDocumentKeyDown} from '../../hooks/useDocumentKeyDown';
import {formatKeyboardShortcut} from '../../utils/keyboardShortcut';
import {matchesKeyboardShortcut} from '../../utils/keyboardShortcut.match';

const NotificationViewportContext = createContext<{position: NotificationPosition}>({
	position: 'bottom-right',
});

/** Портальный контейнер для toast-уведомлений. */
const NotificationViewport = forwardRef<HTMLDivElement, NotificationViewportProps>(
	function NotificationViewport(
		{
			children,
			stacked = true,
			stackDepth = 3,
			position = 'bottom-right',
			className,
			...rest
		},
		ref,
	) {
		const viewportValue = useMemo(() => ({position}), [position]);

		return createLibraryPortal(
			<NotificationViewportContext.Provider value={viewportValue}>
				<div
					ref={ref}
					className={cn(styles.notificationsContainer, className)}
					data-position={position}
					{...rest}
				>
					<NotificationStack
						stacked={stacked}
						stackDepth={stackDepth}
					>
						{children}
					</NotificationStack>
				</div>
			</NotificationViewportContext.Provider>,
		);
	}
);

interface NotificationStackProps {
	children?: React.ReactNode;
	stacked: boolean;
	stackDepth: number;
}

const NotificationStack: React.FC<NotificationStackProps> = ({
	children,
	stacked,
	stackDepth,
}) => {
	const [expanded, setExpanded] = useState(!stacked);
	const frontRef = useRef<HTMLDivElement>(null);
	const [frontHeight, setFrontHeight] = useState(64);
	const items = React.Children.toArray(children);
	const visibleDepth = Math.max(1, stackDepth);

	useEffect(() => {
		setExpanded(!stacked);
	}, [stacked]);

	useEffect(() => {
		const element = frontRef.current;
		if (!element) return undefined;

		const updateHeight = () => setFrontHeight(element.getBoundingClientRect().height);
		updateHeight();
		const observer = new ResizeObserver(updateHeight);
		observer.observe(element);
		return () => observer.disconnect();
	}, [items.length]);

	return (
		<div
			className={cn(
				styles.stack,
				expanded ? styles.stackExpanded : styles.stackCollapsed,
			)}
			style={{
				['--altum-stack-depth' as string]: String(visibleDepth),
				['--altum-stack-front-h' as string]: `${frontHeight}px`,
			}}
			onMouseEnter={() => {
				if (stacked) setExpanded(true);
			}}
			onMouseLeave={() => {
				if (stacked) setExpanded(false);
			}}
			onFocusCapture={() => {
				if (stacked) setExpanded(true);
			}}
			onBlurCapture={(event) => {
				if (stacked && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
					setExpanded(false);
				}
			}}
		>
			{items.map((child, index) => (
				<div
					key={React.isValidElement(child) ? (child.key ?? index) : index}
					ref={index === 0 ? frontRef : undefined}
					className={cn(
						styles.stackItem,
						index >= visibleDepth && styles.stackItemHidden,
					)}
					style={{['--altum-stack-i' as string]: String(index)}}
				>
					{child}
				</div>
			))}
		</div>
	);
};

/**
 * Тост / баннер: `title`, `description`, `actions`. Императивно — `notify()` + `NotificationProvider`.
 *
 * @component
 * @example
 * <NotificationProvider>
 *   <Button onClick={() => notify({title: 'Сохранено', variant: 'success'})}>Тост</Button>
 * </NotificationProvider>
 */
const NotificationCard = forwardRef<HTMLDivElement, NotificationProps>(function Notification(
	{
		variant = 'info',
		duration = 3000,
		progress = duration > 0,
		pauseOnHover = true,
		onClose,
		title,
		description,
		actions,
		className,
		onMouseEnter,
		onMouseLeave,
		...rest
	},
	ref,
) {
	const {position} = useContext(NotificationViewportContext);
	const {t} = useLocale();
	const [paused, setPaused] = useState(false);
	const [exiting, setExiting] = useState(false);
	const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const close = useCallback(() => {
		if (exiting) return;
		setExiting(true);
		if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
		exitTimerRef.current = setTimeout(() => {
			onClose?.();
		}, 200);
	}, [exiting, onClose]);

	useEffect(() => () => {
		if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
	}, []);

	return (
		<div
			ref={ref}
			className={cn(
				styles.notification,
				styles[variant],
				exiting && styles.exit,
				className,
			)}
			data-variant={variant}
			data-position={position}
			onMouseEnter={composeEventHandlers(onMouseEnter, () => {
				if (pauseOnHover) setPaused(true);
			})}
			onMouseLeave={composeEventHandlers(onMouseLeave, () => {
				if (pauseOnHover) setPaused(false);
			})}
			{...rest}
			role={variant === 'error' ? 'alert' : 'status'}
			aria-live={variant === 'error' || variant === 'warning' ? 'assertive' : 'polite'}
		>
			<div className={styles.title}>
				{title}
			</div>
			{description != null && description !== '' ? (
				<div className={styles.description}>
					{description}
				</div>
			) : null}
			<ButtonIcon
				appearance='diskClose'
				className={styles.close}
				aria-label={t('common.close')}
				icon={(
					<IconCross
						className={overlayClose.icon}
						size={16}
						aria-hidden
					/>
				)}
				onClick={close}
			/>
			{actions?.length ? (
				<div className={styles.actions}>
					{actions.map((action, index) => (
						<Button
							key={`${action.label}-${index}`}
							size='sm'
							variant={action.variant === 'secondary' ? 'secondary' : 'primary'}
							onClick={() => {
								action.onClick();
								close();
							}}
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

			{progress && duration > 0 && !exiting && (
				<div className={styles.progressTrack} aria-hidden>
					<div
						className={styles.progressBar}
						style={{
							animationDuration: `${duration}ms`,
							animationPlayState: paused ? 'paused' : 'running',
						}}
						onAnimationEnd={close}
					/>
				</div>
			)}
		</div>
	);
});

NotificationCard.displayName = 'Notification';
NotificationViewport.displayName = 'Notification.Viewport';

export const Notification = Object.assign(NotificationCard, {
	Viewport: NotificationViewport,
}) as React.ForwardRefExoticComponent<
	NotificationProps & React.RefAttributes<HTMLDivElement>
> & {
	Provider: React.FC<NotificationProviderProps>;
	Viewport: typeof NotificationViewport;
};

interface NotificationContainerProps extends Omit<NotificationViewportProps, 'children'> {
	notifications: NotificationItem[];
	onClose: (id: string) => void;
}

/** Рендерит данные императивного уведомления. */
export const NotificationItemRenderer: React.FC<{
	item: NotificationItem;
	onClose: (id: string) => void;
}> = ({item, onClose}) => {
	const close = useCallback(() => onClose(item.id), [item.id, onClose]);

	useDocumentKeyDown((event) => {
		if (event.defaultPrevented) return;

		for (const action of item.actions ?? []) {
			if (!action.shortcut || !matchesKeyboardShortcut(event, action.shortcut)) continue;
			event.preventDefault();
			action.onClick();
			close();
			return;
		}
	});

	return (
		<Notification
			variant={item.variant}
			duration={item.duration}
			progress={item.progress}
			pauseOnHover={item.pauseOnHover}
			onClose={close}
			title={item.title}
			description={item.description}
			actions={item.actions}
		/>
	);
};

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
	notifications,
	onClose,
	...viewportProps
}) => (
	<NotificationViewport {...viewportProps}>
		{notifications.slice().reverse().map((item) => (
			<NotificationItemRenderer
				key={item.id}
				item={item}
				onClose={onClose}
			/>
		))}
	</NotificationViewport>
);
