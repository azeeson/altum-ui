import type {
	ButtonGroupRootProps,
	ButtonGroupItemProps,
	ButtonGroupMode,
} from './ButtonGroup.types';
export type {
	ButtonGroupMode,
	ButtonGroupItemFit,
	ButtonGroupVariant,
	ButtonGroupRootProps,
	ButtonGroupItemProps,
} from './ButtonGroup.types';

import React, {
	createContext,
	forwardRef,
	useCallback,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import unstyled from '../../styles/unstyledControl.module.css';
import styles from './ButtonGroup.module.css';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {composeRefs} from '../../utils/composeRefs';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {useLocale} from '../../locales/localeContext';
import {useRequiredContext} from '../../hooks/useRequiredContext';
import {ROVING_ITEM_ATTR, useRovingList} from '../../hooks/useRovingList';
import {useTrackThumb} from '../../hooks/useTrackThumb';
import {controlTrackClassName} from '../../utils/controlTrack';

const VALUE_ATTR = 'data-button-group-value';

interface ButtonGroupContextValue {
	mode: ButtonGroupMode;
	disabled: boolean;
	readOnly: boolean;
	focusable: boolean;
	selected: string | readonly string[];
	selectItem: (itemValue: string) => void;
	focusedId: string | null;
	setFocusedId: (id: string) => void;
}

const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

function isItemSelected(
	mode: ButtonGroupMode,
	selected: string | readonly string[],
	itemValue: string | undefined,
	activeProp: boolean | undefined,
): boolean {
	if (mode === 'button' || itemValue == null) return Boolean(activeProp);
	if (mode === 'toggle') return selected === itemValue;
	return Array.isArray(selected) && selected.includes(itemValue);
}

/**
 * Составная группа кнопок: `button` (независимые), `toggle` (один выбранный),
 * `multi_toggle` (несколько). Roving focus, `itemFit`, варианты заливки.
 *
 * @component
 * @example
 * <ButtonGroup aria-label="Форматирование" mode="multi_toggle" value={marks} onChange={setMarks}>
 *   <ButtonGroup.Item value="bold">Ж</ButtonGroup.Item>
 *   <ButtonGroup.Item value="italic">К</ButtonGroup.Item>
 * </ButtonGroup>
 */
const ButtonGroupRoot = forwardRef<HTMLDivElement, ButtonGroupRootProps>(function ButtonGroupRoot(
	{
		children,
		mode = 'button',
		variant = 'secondary',
		status = 'default',
		size = 'md',
		disabled = false,
		readOnly = false,
		borderless = false,
		focusable = true,
		width = 'auto',
		itemFit = 'equal',
		value: valueProp,
		defaultValue,
		onChange,
		activateOnFocus = true,
		'aria-label': ariaLabel,
		className,
		onKeyDown,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const containerRef = useRef<HTMLDivElement>(null);
	const [focusedId, setFocusedId] = useState<string | null>(null);
	const isReadOnly = readOnly && !disabled;
	const fallbackValue: string | string[] = mode === 'multi_toggle' ? [] : '';
	const [selected, setSelected] = useControlledStateWithCallback<string | string[]>(
		valueProp as string | string[] | undefined,
		(defaultValue as string | string[] | undefined) ?? fallbackValue,
		onChange,
	);

	const selectItem = useCallback((itemValue: string) => {
		if (disabled || isReadOnly || mode === 'button') return;
		if (mode === 'toggle') {
			setSelected(itemValue);
			return;
		}
		const current = Array.isArray(selected) ? selected : [];
		setSelected(
			current.includes(itemValue)
				? current.filter((entry) => entry !== itemValue)
				: [...current, itemValue],
		);
	}, [
		disabled,
		isReadOnly,
		mode,
		selected,
		setSelected
	]);

	const contextValue = useMemo<ButtonGroupContextValue>(() => ({
		mode,
		disabled,
		readOnly: isReadOnly,
		focusable,
		selected,
		selectItem,
		focusedId,
		setFocusedId,
	}), [
		disabled,
		focusable,
		focusedId,
		isReadOnly,
		mode,
		selectItem,
		selected
	]);

	const showSlider = mode === 'toggle';
	const thumb = useTrackThumb(
		containerRef,
		showSlider ? `.${styles.itemActive}` : '',
		selected,
	);

	const roving = useRovingList('horizontal', (el) => {
		setFocusedId(el.dataset.itemId ?? '');
		if (mode === 'toggle' && activateOnFocus) {
			const nextValue = el.getAttribute(VALUE_ATTR);
			if (nextValue) selectItem(nextValue);
		}
	});

	useLayoutEffect(() => {
		if (!focusable || disabled || isReadOnly) return;
		const container = containerRef.current;
		if (!container) return;
		const items = Array.from(
			container.querySelectorAll<HTMLElement>(`[${ROVING_ITEM_ATTR}]:not([disabled])`),
		);
		if (items.length === 0) return;
		setFocusedId((current) => {
			if (current && items.some((el) => el.dataset.itemId === current)) return current;
			return items[0].dataset.itemId ?? current;
		});
	}, [
		children,
		disabled,
		focusable,
		isReadOnly
	]);

	return (
		<ButtonGroupContext.Provider value={contextValue}>
			<div
				ref={composeRefs(ref, containerRef)}
				className={cn(
					styles.group,
					controlTrackClassName(variant, {readOnly: isReadOnly}),
					styles[variant] ?? '',
					size !== 'md' && styles[size],
					showSlider && styles.modeToggle,
					status === 'danger' && styles.statusDanger,
					borderless && styles.borderless,
					disabled && styles.disabled,
					width === 'full' && styles.widthFull,
					itemFit === 'content' && styles.fitContent,
					className,
				)}
				{...rest}
				role={mode === 'toggle' ? 'radiogroup' : 'group'}
				aria-label={ariaLabel ?? t('buttonGroup.ariaLabel')}
				aria-readonly={isReadOnly || undefined}
				aria-disabled={disabled || undefined}
				onKeyDown={composeEventHandlers(
					onKeyDown,
					focusable && !disabled && !isReadOnly ? roving : undefined,
				)}
			>
				{showSlider && (
					<div
						className={cn(styles.slider, thumb.ready && styles.sliderReady)}
						style={thumb.style}
						aria-hidden='true'
					/>
				)}
				{children}
			</div>
		</ButtonGroupContext.Provider>
	);
});

const ButtonGroupItem = React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
	function ButtonGroupItem(
		{
			value: itemValue,
			active: activeProp,
			icon,
			children,
			disabled: itemDisabled = false,
			className,
			onClick,
			onFocus,
			'aria-label': ariaLabel,
			...props
		},
		forwardedRef,
	) {
		const itemId = useId();
		const {
			mode,
			disabled: groupDisabled,
			readOnly,
			focusable,
			selected,
			selectItem,
			focusedId,
			setFocusedId,
		} = useRequiredContext(ButtonGroupContext, 'ButtonGroup.Item должен использоваться внутри ButtonGroup');

		const isDisabled = groupDisabled || itemDisabled;
		const isActive = isItemSelected(mode, selected, itemValue, activeProp);
		const isTabStop = (() => {
			if (!focusable || isDisabled || readOnly) return false;
			if (mode === 'toggle') return isActive || (selected === '' && focusedId === itemId);
			return focusedId === itemId;
		})();

		return (
			<button
				ref={forwardedRef}
				type='button'
				{...props}
				{...{[ROVING_ITEM_ATTR]: ''}}
				{...(itemValue != null ? {[VALUE_ATTR]: itemValue} : {})}
				data-item-id={itemId}
				className={cn(
					unstyled.control,
					styles.item,
					isActive && styles.itemActive,
					readOnly && styles.itemReadOnly,
					className,
				)}
				aria-label={ariaLabel ?? (typeof children === 'string' ? children : undefined)}
				disabled={isDisabled}
				aria-disabled={readOnly || undefined}
				tabIndex={isTabStop ? 0 : -1}
				{...(mode === 'toggle'
					? {
						role: 'radio' as const,
						'aria-checked': isActive,
					}
					: {
						'aria-pressed': isActive || undefined,
					})}
				onFocus={composeEventHandlers(onFocus, () => {
					if (focusable && !isDisabled && !readOnly) setFocusedId(itemId);
				})}
				onClick={composeEventHandlers(onClick, () => {
					if (isDisabled || readOnly || itemValue == null) return;
					selectItem(itemValue);
				})}
			>
				{icon}
				{children}
			</button>
		);
	},
);

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
