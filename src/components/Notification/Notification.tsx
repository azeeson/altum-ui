import type {NotificationItem, NotificationPosition, NotificationViewportProps, NotificationRootProps, NotificationTitleProps, NotificationDescriptionProps, NotificationActionsProps, NotificationCloseProps} from './Notification.types';
export type {
	NotificationAction,
	NotificationItem,
	NotificationPosition,
	NotificationViewportProps,
	NotificationRootProps,
	NotificationTitleProps,
	NotificationDescriptionProps,
	NotificationActionsProps,
	NotificationCloseProps,
} from './Notification.types';

/* eslint-disable react-hooks/set-state-in-effect -- Эффекты синхронизируют состояние со сбросами пропов и обновлениями ResizeObserver. */
/* eslint-disable react-hooks/refs -- Callback-ref намеренно синхронизируется во время render для тайминга анимации. */
import React, {createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {IconCross} from '../../icons/icons/IconCross';
import {MediaRowBase} from '../../base/MediaRowBase';
import styles from './Notification.module.css';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import type {NotificationProviderProps} from './toast';
import {createLibraryPortal} from '../../utils/portal';
import {useDocumentKeyDown} from '../../hooks/useDocumentKeyDown';
import {formatKeyboardShortcut, matchesKeyboardShortcut} from '../../utils/keyboardShortcut';

const POSITION_CLASS: Record<NotificationPosition, string> = {
	'top-left': styles.posTopLeft,
	'top-right': styles.posTopRight,
	'top-center': styles.posTopCenter,
	'bottom-left': styles.posBottomLeft,
	'bottom-right': styles.posBottomRight,
	'bottom-center': styles.posBottomCenter,
};

const ENTER_CLASS: Record<NotificationPosition, string> = {
	'top-left': styles.enterLeft,
	'top-right': styles.enterRight,
	'top-center': styles.enterTop,
	'bottom-left': styles.enterLeft,
	'bottom-right': styles.enterRight,
	'bottom-center': styles.enterBottom,
};

const EXIT_CLASS: Record<NotificationPosition, string> = {
	'top-left': styles.exitLeft,
	'top-right': styles.exitRight,
	'top-center': styles.exitTop,
	'bottom-left': styles.exitLeft,
	'bottom-right': styles.exitRight,
	'bottom-center': styles.exitBottom,
};

function isTopPosition(position: NotificationPosition): boolean {
	return position.startsWith('top-');
}

interface NotificationViewportContextValue {
	position: NotificationPosition;
}

const NotificationViewportContext = createContext<NotificationViewportContextValue>({
	position: 'bottom-right',
});

/** Портальный контейнер для declarative toast-уведомлений. */
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
		const topAnchor = isTopPosition(position);
		const viewportValue = useMemo(() => ({position}), [position]);

		return createLibraryPortal(
			<NotificationViewportContext.Provider value={viewportValue}>
				<div
					ref={ref}
					className={cn(
						styles.notificationsContainer,
						POSITION_CLASS[position],
						topAnchor ? styles.anchorTop : styles.anchorBottom,
						className,
					)}
					data-position={position}
					{...rest}
				>
					<NotificationStack
						stacked={stacked}
						stackDepth={stackDepth}
						fromTop={topAnchor}
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
	fromTop: boolean;
}

const NotificationStack: React.FC<NotificationStackProps> = ({
	children,
	stacked,
	stackDepth,
	fromTop,
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
				fromTop ? styles.stackFromTop : styles.stackFromBottom,
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
						index >= visibleDepth ? styles.stackItemHidden : '',
					)}
					style={{['--altum-stack-i' as string]: String(index)}}
				>
					{child}
				</div>
			))}
		</div>
	);
};

interface NotificationContextValue {
	close: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

function useNotificationContext(component: string): NotificationContextValue {
	const context = useContext(NotificationContext);
	if (!context) throw new Error(`${component} должен использоваться внутри Notification.Root`);
	return context;
}

interface NotificationProgressProps {
	duration: number;
	paused: boolean;
	onComplete?: () => void;
}

/** Изолированный прогресс: тики rAF не перерисовывают детей Notification.Provider. */
const NotificationProgress: React.FC<NotificationProgressProps> = ({
	duration,
	paused,
	onComplete,
}) => {
	const [remainingMs, setRemainingMs] = useState(duration);
	const remainingRef = useRef(duration);
	const lastTickRef = useRef<number | null>(null);
	const onCompleteRef = useRef(onComplete);
	onCompleteRef.current = onComplete;

	useEffect(() => {
		remainingRef.current = duration;
		setRemainingMs(duration);
		lastTickRef.current = null;
	}, [duration]);

	useEffect(() => {
		if (duration <= 0) return undefined;

		let frame = 0;
		const tick = (now: number) => {
			if (lastTickRef.current == null) {
				lastTickRef.current = now;
			}

			if (!paused) {
				const delta = now - lastTickRef.current;
				remainingRef.current = Math.max(0, remainingRef.current - delta);
				setRemainingMs(remainingRef.current);
				if (remainingRef.current <= 0) {
					onCompleteRef.current?.();
					return;
				}
			}

			lastTickRef.current = now;
			frame = requestAnimationFrame(tick);
		};

		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [duration, paused]);

	const progressRatio = duration > 0 ? remainingMs / duration : 0;
	return (
		<div className={styles.progressTrack} aria-hidden>
			<div
				className={styles.progressBar}
				style={{transform: `scaleX(${progressRatio})`}}
			/>
		</div>
	);
};

/**
 * Тост / баннер уведомления: variant, автозакрытие, пауза по hover.
 *
 * @component
 * @example
 * <NotificationProvider>
 *   <Button onClick={() => notify({title: 'Сохранено', variant: 'success'})}>Тост</Button>
 * </NotificationProvider>
 */
const NotificationRoot = forwardRef<HTMLDivElement, NotificationRootProps>(function NotificationRoot(
	{
		variant = 'info',
		duration = 3000,
		progress = duration > 0,
		pauseOnHover = true,
		onClose,
		children,
		className,
		onMouseEnter,
		onMouseLeave,
		...rest
	},
	ref,
) {
	const {position} = useContext(NotificationViewportContext);
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

	const contextValue = useMemo<NotificationContextValue>(() => ({close}), [close]);
	const showProgress = progress && duration > 0 && !exiting;

	return (
		<NotificationContext.Provider value={contextValue}>
			<MediaRowBase
				ref={ref}
				className={cn(
					styles.notification,
					styles[variant],
					exiting ? EXIT_CLASS[position] : ENTER_CLASS[position],
					className,
				)}
				data-variant={variant}
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
				{children}

				{showProgress && (
					<NotificationProgress
						duration={duration}
						paused={paused}
						onComplete={close}
					/>
				)}
			</MediaRowBase>
		</NotificationContext.Provider>
	);
});
const NotificationTitle = forwardRef<HTMLDivElement, NotificationTitleProps>(
	function NotificationTitle({className, ...rest}, ref) {
		return (
			<MediaRowBase.Title
				ref={ref}
				className={cn(styles.title, className)}
				{...rest}
			/>
		);
	},
);
const NotificationDescription = forwardRef<HTMLDivElement, NotificationDescriptionProps>(
	function NotificationDescription({className, ...rest}, ref) {
		return (
			<MediaRowBase.Description
				ref={ref}
				className={cn(styles.description, className)}
				{...rest}
			/>
		);
	},
);
const NotificationActions = forwardRef<HTMLDivElement, NotificationActionsProps>(
	function NotificationActions({className, ...rest}, ref) {
		return (
			<MediaRowBase.Actions
				ref={ref}
				className={cn(styles.actions, className)}
				{...rest}
			/>
		);
	},
);
const NotificationClose = forwardRef<HTMLButtonElement, NotificationCloseProps>(
	function NotificationClose({className, onClick, 'aria-label': ariaLabel, ...rest}, ref) {
		const {close} = useNotificationContext('Notification.Close');
		const {t} = useLocale();
		return (
			<button
				ref={ref}
				type='button'
				className={cn(styles.close, className)}
				{...rest}
				aria-label={ariaLabel ?? t('common.close')}
				onClick={composeEventHandlers(onClick, () => {
					close();
				})}
			>
				<IconCross size={16} />
			</button>
		);
	},
);

NotificationRoot.displayName = 'Notification';
NotificationViewport.displayName = 'Notification.Viewport';
NotificationTitle.displayName = 'Notification.Title';
NotificationDescription.displayName = 'Notification.Description';
NotificationActions.displayName = 'Notification.Actions';
NotificationClose.displayName = 'Notification.Close';

export const Notification = Object.assign(NotificationRoot, {
	Root: NotificationRoot,
	Viewport: NotificationViewport,
	Title: NotificationTitle,
	Description: NotificationDescription,
	Actions: NotificationActions,
	Close: NotificationClose,
}) as React.ForwardRefExoticComponent<
	NotificationRootProps & React.RefAttributes<HTMLDivElement>
> & {
	Root: typeof NotificationRoot;
	Provider: React.FC<NotificationProviderProps>;
	Viewport: typeof NotificationViewport;
	Title: typeof NotificationTitle;
	Description: typeof NotificationDescription;
	Actions: typeof NotificationActions;
	Close: typeof NotificationClose;
};

interface NotificationContainerProps extends Omit<NotificationViewportProps, 'children'> {
	notifications: NotificationItem[];
	onClose: (id: string) => void;
}

interface NotificationItemRendererProps {
	item: NotificationItem;
	onClose: (id: string) => void;
}

/** Рендерит данные императивного уведомления через составной API. */
export const NotificationItemRenderer: React.FC<NotificationItemRendererProps> = ({item, onClose}) => {
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
		<NotificationRoot
			variant={item.variant}
			duration={item.duration}
			progress={item.progress}
			pauseOnHover={item.pauseOnHover}
			onClose={close}
		>
			<NotificationTitle>
				{item.title}
			</NotificationTitle>
			{item.description && (
				<NotificationDescription>
					{item.description}
				</NotificationDescription>
			)}
			<NotificationClose />
			{item.actions?.length ? (
				<NotificationActions>
					{item.actions.map((action, index) => (
						<button
							key={`${action.label}-${index}`}
							type='button'
							className={cn(
								styles.actionBtn,
								action.variant === 'secondary' && styles.actionBtnSecondary,
							)}
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
						</button>
					))}
				</NotificationActions>
			) : null}
		</NotificationRoot>
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
