import type {ButtonGroupRootProps, ButtonGroupItemProps} from './ButtonGroup.types';
export type {
	ButtonGroupRootProps,
	ButtonGroupItemProps,
} from './ButtonGroup.types';

import React, {createContext, forwardRef, useCallback, useContext, useId, useMemo, useState} from 'react';
import styles from './ButtonGroup.module.css';
import {handleRovingFocusKeyDown} from '../../utils/keyboard';
import {focusElement} from '../../utils/a11y';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {ButtonBase, type ButtonVariant, type ButtonStatus} from '../../base/ButtonBase';
import {controlTrackClassName} from '../../utils/controlTrack';
import type {ControlSize} from '../../types';

const ITEM_ATTR = 'data-button-group-item';

interface ButtonGroupContextValue {
	size: ControlSize;
	variant: ButtonVariant;
	status: ButtonStatus;
	disabled: boolean;
	focusable: boolean;
	focusedId: string | null;
	setFocusedId: (id: string) => void;
	registerItem: (id: string, enabled: boolean) => void;
	unregisterItem: (id: string) => void;
	getEnabledIds: () => string[];
}

const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

function useButtonGroupContext(component: string): ButtonGroupContextValue {
	const context = useContext(ButtonGroupContext);
	if (!context) {
		throw new Error(`${component} должен использоваться внутри ButtonGroup`);
	}
	return context;
}

const ButtonGroupRoot = forwardRef<HTMLDivElement, ButtonGroupRootProps>(function ButtonGroupRoot(
	{
		children,
		variant = 'secondary',
		status = 'default',
		size = 'md',
		disabled = false,
		borderless = false,
		focusable = true,
		width = 'auto',
		'aria-label': ariaLabel,
		className,
		onKeyDown,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const [focusedId, setFocusedIdState] = useState<string | null>(null);
	const itemsRef = React.useRef<Map<string, boolean>>(new Map());

	const registerItem = useCallback((id: string, enabled: boolean) => {
		itemsRef.current.set(id, enabled);
	}, []);

	const unregisterItem = useCallback((id: string) => {
		itemsRef.current.delete(id);
	}, []);

	const getEnabledIds = useCallback(() => {
		return Array.from(itemsRef.current.entries())
			.filter(([, enabled]) => enabled)
			.map(([id]) => id);
	}, []);

	const setFocusedId = useCallback((id: string) => {
		setFocusedIdState(id);
	}, []);

	const contextValue = useMemo<ButtonGroupContextValue>(() => ({
		size,
		variant,
		status,
		disabled,
		focusable,
		focusedId,
		setFocusedId,
		registerItem,
		unregisterItem,
		getEnabledIds,
	}), [
		disabled,
		focusable,
		focusedId,
		getEnabledIds,
		registerItem,
		setFocusedId,
		size,
		status,
		unregisterItem,
		variant,
	]);

	const handleRovingKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (!focusable || disabled) return;

		const enabledIds = getEnabledIds();
		if (enabledIds.length === 0) return;

		const currentId = focusedId && enabledIds.includes(focusedId)
			? focusedId
			: enabledIds[0];
		const currentIndex = enabledIds.indexOf(currentId);

		handleRovingFocusKeyDown(event, {
			currentIndex: currentIndex === -1 ? 0 : currentIndex,
			length: enabledIds.length,
			orientation: 'horizontal',
			onMove: (nextIndex) => {
				const nextId = enabledIds[nextIndex];
				setFocusedId(nextId);
				const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>(
					`button[${ITEM_ATTR}]:not(:disabled)`,
				);
				focusElement(buttons[nextIndex]);
			},
		});
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		composeEventHandlers(onKeyDown, handleRovingKeyDown)(event);
	};

	const rootClasses = cn(
		styles.group,
		controlTrackClassName(variant),
		styles[variant],
		styles[size],
		status === 'danger' ? styles.statusDanger : '',
		borderless ? styles.borderless : '',
		disabled ? styles.disabled : '',
		width === 'full' ? styles.widthFull : '',
		className,
	);

	return (
		<ButtonGroupContext.Provider value={contextValue}>
			<div
				ref={ref}
				className={rootClasses}
				{...rest}
				role='group'
				aria-label={ariaLabel ?? t('buttonGroup.ariaLabel')}
				onKeyDown={handleKeyDown}
			>
				{children}
			</div>
		</ButtonGroupContext.Provider>
	);
});

const ButtonGroupItem = React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
	function ButtonGroupItem(
		{
			active,
			icon,
			children,
			disabled: itemDisabled = false,
			className = '',
			onClick,
			onFocus,
			'aria-label': ariaLabel,
			...props
		},
		forwardedRef,
	) {
		const itemId = useId();
		const {
			size,
			variant,
			status,
			disabled: groupDisabled,
			focusable,
			focusedId,
			setFocusedId,
			registerItem,
			unregisterItem,
			getEnabledIds,
		} = useButtonGroupContext('ButtonGroup.Item');

		const isDisabled = groupDisabled || itemDisabled;
		const isEnabled = !isDisabled;

		React.useEffect(() => {
			registerItem(itemId, isEnabled);
			return () => unregisterItem(itemId);
		}, [
			isEnabled,
			itemId,
			registerItem,
			unregisterItem
		]);

		React.useEffect(() => {
			if (!focusable || !isEnabled || focusedId !== null) return;
			const enabledIds = getEnabledIds();
			if (enabledIds.length > 0 && enabledIds[0] === itemId) {
				setFocusedId(itemId);
			}
		}, [
			focusable,
			focusedId,
			getEnabledIds,
			isEnabled,
			itemId,
			setFocusedId
		]);

		const isTabStop = focusable && isEnabled && (focusedId === itemId || (
			focusedId === null && getEnabledIds()[0] === itemId
		));

		const accessibleName = ariaLabel
			?? (typeof children === 'string' ? children : undefined);

		return (
			<ButtonBase
				ref={forwardedRef}
				{...props}
				variant={variant}
				status={status}
				size={size}
				active={active}
				{...{[ITEM_ATTR]: ''}}
				data-item-id={itemId}
				className={cn(
					styles.item,
					active ? styles.itemActive : '',
					className,
				)}
				contentClassName={styles.itemContent}
				aria-label={accessibleName}
				disabled={isDisabled}
				tabIndex={focusable ? (isTabStop ? 0 : -1) : -1}
				onFocus={composeEventHandlers(onFocus, () => {
					if (focusable && isEnabled) {
						setFocusedId(itemId);
					}
				})}
				onClick={composeEventHandlers(onClick, () => {
					if (isDisabled) return;
				})}
			>
				{icon && (
					<span className={styles.icon} aria-hidden={children ? true : undefined}>
						{icon}
					</span>
				)}
				{children != null && (
					<span className={styles.label}>
						{children}
					</span>
				)}
			</ButtonBase>
		);
	},
);

/**
 * Составная группа связанных кнопок с roving focus, вариантами заливки и toggle-состоянием `active`.
 * Стили группы (`variant` / `status` / `size`) задаются на Root; у Item — `active`.
 *
 * @component
 * @example
 * <ButtonGroup aria-label="Форматирование" variant="secondary">
 *   <ButtonGroup.Item active={bold} onClick={() => setBold((v) => !v)} aria-label="Жирный">
 *     Ж
 *   </ButtonGroup.Item>
 *   <ButtonGroup.Item active={italic} onClick={() => setItalic((v) => !v)} aria-label="Курсив">
 *     К
 *   </ButtonGroup.Item>
 * </ButtonGroup>
 */
ButtonGroupRoot.displayName = 'ButtonGroup';
ButtonGroupItem.displayName = 'ButtonGroup.Item';

type ButtonGroupComponent = React.ForwardRefExoticComponent<
	ButtonGroupRootProps & React.RefAttributes<HTMLDivElement>
> & {
	Root: typeof ButtonGroupRoot;
	Item: typeof ButtonGroupItem;
};

export const ButtonGroup = Object.assign(ButtonGroupRoot, {
	Root: ButtonGroupRoot,
	Item: ButtonGroupItem,
}) as ButtonGroupComponent;
