import type {SelectionGroupOrientation, SelectionGroupRootProps, SelectionGroupListProps, SelectionGroupItemProps, SelectionGroupPanelProps} from './SelectionGroup.types';
export type {
	SelectionGroupOrientation,
	SelectionGroupRootProps,
	SelectionGroupListProps,
	SelectionGroupItemProps,
	SelectionGroupPanelProps,
} from './SelectionGroup.types';

import React, {createContext, forwardRef, useCallback, useContext, useMemo} from 'react';
import {focusElement} from '../../utils/a11y';
import {handleRovingFocusKeyDown} from '../../utils/keyboard';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import styles from './SelectionGroup.module.css';

const ITEM_ATTR = 'data-selection-item';
const VALUE_ATTR = 'data-selection-value';

interface SelectionGroupContextValue {
	value: string;
	setValue: (value: string) => void;
	orientation: SelectionGroupOrientation;
	disabled: boolean;
	readOnly: boolean;
	interactive: boolean;
	activateOnFocus: boolean;
}

const SelectionGroupContext = createContext<SelectionGroupContextValue | null>(null);

function useSelectionGroupContext(component: string): SelectionGroupContextValue {
	const context = useContext(SelectionGroupContext);
	if (!context) {
		throw new Error(`${component} должен использоваться внутри SelectionGroup.Root`);
	}
	return context;
}

export {useSelectionGroupContext};

const SelectionGroupRoot = forwardRef<HTMLDivElement, SelectionGroupRootProps>(function SelectionGroupRoot(
	{
		children,
		value: controlledValue,
		defaultValue = '',
		onChange,
		orientation = 'horizontal',
		disabled = false,
		readOnly = false,
		activateOnFocus = true,
		className,
		...rest
	},
	ref,
) {
	const isReadOnly = readOnly && !disabled;
	const interactive = !disabled && !isReadOnly;

	const [value, setValueRaw] = useControlledStateWithCallback(
		controlledValue,
		defaultValue,
		onChange,
	);

	const setValue = useCallback((next: string) => {
		if (!interactive) return;
		setValueRaw(next);
	}, [interactive, setValueRaw]);

	const contextValue = useMemo<SelectionGroupContextValue>(() => ({
		value,
		setValue,
		orientation,
		disabled,
		readOnly: isReadOnly,
		interactive,
		activateOnFocus,
	}), [
		activateOnFocus,
		disabled,
		interactive,
		isReadOnly,
		orientation,
		setValue,
		value,
	]);

	const shouldWrap = Boolean(className) || ref != null || Object.keys(rest).length > 0;

	return (
		<SelectionGroupContext.Provider value={contextValue}>
			{shouldWrap ? (
				<div
					ref={ref}
					className={cn(styles.root, className)}
					{...rest}
				>
					{children}
				</div>
			) : (
				children
			)}
		</SelectionGroupContext.Provider>
	);
});

const SelectionGroupList = React.forwardRef<HTMLDivElement, SelectionGroupListProps>(
	function SelectionGroupList(
		{
			children,
			className = '',
			onKeyDown,
			...rest
		},
		forwardedRef,
	) {
		const {
			value,
			setValue,
			orientation,
			interactive,
			activateOnFocus,
		} = useSelectionGroupContext('SelectionGroup.List');

		const getItems = (list: HTMLDivElement) =>
			Array.from(list.querySelectorAll<HTMLElement>(`[${ITEM_ATTR}]`))
				.filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true');

		const handleKeyDown = composeEventHandlers(onKeyDown, (event: React.KeyboardEvent<HTMLDivElement>) => {
			if (!interactive) return;

			const list = event.currentTarget;
			const items = getItems(list);
			if (items.length === 0) return;

			const currentIndex = items.findIndex(
				(el) => el.getAttribute(VALUE_ATTR) === value,
			);
			const index = currentIndex >= 0 ? currentIndex : 0;

			handleRovingFocusKeyDown(event, {
				currentIndex: index,
				length: items.length,
				orientation,
				onMove: (nextIndex) => {
					const next = items[nextIndex];
					const nextValue = next.getAttribute(VALUE_ATTR);
					if (!nextValue) return;

					if (activateOnFocus) {
						setValue(nextValue);
					}
					focusElement(next);
				},
			});
		});

		return (
			<div
				ref={forwardedRef}
				className={cn(styles.list, className)}
				{...rest}
				onKeyDown={handleKeyDown}
			>
				{children}
			</div>
		);
	},
);

const SelectionGroupItem = React.forwardRef<HTMLButtonElement, SelectionGroupItemProps>(
	function SelectionGroupItem(
		{
			value: itemValue,
			children,
			className = '',
			disabled: itemDisabled = false,
			onClick,
			...rest
		},
		forwardedRef,
	) {
		const {
			value,
			setValue,
			disabled: groupDisabled,
			readOnly,
			interactive,
		} = useSelectionGroupContext('SelectionGroup.Item');

		const isSelected = value === itemValue;
		const isDisabled = groupDisabled || itemDisabled;

		return (
			<button
				ref={forwardedRef}
				type='button'
				className={cn(styles.item, className)}
				data-selection-item=''
				data-selection-value={itemValue}
				disabled={isDisabled || undefined}
				aria-disabled={readOnly || undefined}
				tabIndex={isSelected && !isDisabled && !readOnly ? 0 : -1}
				onClick={composeEventHandlers(onClick, () => {
					if (!interactive || itemDisabled || readOnly) return;
					setValue(itemValue);
				})}
				{...rest}
				aria-pressed={
					rest['aria-checked'] == null && rest['aria-selected'] == null
						? isSelected
						: undefined
				}
			>
				{children}
			</button>
		);
	},
);

const SelectionGroupPanel = React.forwardRef<HTMLDivElement, SelectionGroupPanelProps>(
	function SelectionGroupPanel(
		{
			value: panelValue,
			children,
			className = '',
			forceMount = false,
			hidden,
			...rest
		},
		forwardedRef,
	) {
		const {value} = useSelectionGroupContext('SelectionGroup.Panel');
		const isActive = value === panelValue;

		if (!forceMount && !isActive) {
			return null;
		}

		return (
			<div
				ref={forwardedRef}
				className={cn(styles.panel, className)}
				{...rest}
				hidden={hidden ?? (forceMount ? !isActive : undefined)}
			>
				{children}
			</div>
		);
	},
);

/**
 * Составной компонент одиночного выбора: roving focus, панели контента и клавиатурная навигация.
 *
 * @component
 * @example
 * <SelectionGroup.Root value={view} onChange={setView}>
 *   <SelectionGroup.List>
 *     <SelectionGroup.Item value="list">Список</SelectionGroup.Item>
 *     <SelectionGroup.Item value="grid">Сетка</SelectionGroup.Item>
 *   </SelectionGroup.List>
 *   <SelectionGroup.Panel value="list">{listView}</SelectionGroup.Panel>
 * </SelectionGroup.Root>
 */
SelectionGroupRoot.displayName = 'SelectionGroup.Root';
SelectionGroupList.displayName = 'SelectionGroup.List';
SelectionGroupItem.displayName = 'SelectionGroup.Item';
SelectionGroupPanel.displayName = 'SelectionGroup.Panel';

type SelectionGroupComponent = React.ForwardRefExoticComponent<
	SelectionGroupRootProps & React.RefAttributes<HTMLDivElement>
> & {
	Root: typeof SelectionGroupRoot;
	List: typeof SelectionGroupList;
	Item: typeof SelectionGroupItem;
	Panel: typeof SelectionGroupPanel;
};

export const SelectionGroup = Object.assign(SelectionGroupRoot, {
	Root: SelectionGroupRoot,
	List: SelectionGroupList,
	Item: SelectionGroupItem,
	Panel: SelectionGroupPanel,
}) as SelectionGroupComponent;
