import type {SelectionGroupOrientation, SelectionGroupRootProps, SelectionGroupListProps, SelectionGroupItemProps, SelectionGroupPanelProps} from './SelectionGroup.types';
export type {
	SelectionGroupOrientation,
	SelectionGroupRootProps,
	SelectionGroupListProps,
	SelectionGroupItemProps,
	SelectionGroupPanelProps,
} from './SelectionGroup.types';

import React, {createContext, forwardRef, useCallback, useMemo} from 'react';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {useRequiredContext} from '../../hooks/useRequiredContext';
import {ROVING_ITEM_ATTR, useRovingList} from '../../hooks/useRovingList';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import unstyled from '../../styles/unstyledControl.module.css';

export const SELECTION_VALUE_ATTR = 'data-selection-value';

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

export function useSelectionGroupContext(component: string): SelectionGroupContextValue {
	return useRequiredContext(
		SelectionGroupContext,
		`${component} должен использоваться внутри SelectionGroup.Root`,
	);
}

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
		style,
		role,
		onKeyDown,
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

	const shouldWrap = className != null || style != null || role != null || onKeyDown != null || ref != null;

	return (
		<SelectionGroupContext.Provider value={contextValue}>
			{shouldWrap ? (
				<div
					ref={ref}
					className={className}
					style={style}
					role={role}
					onKeyDown={onKeyDown}
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
			className,
			onKeyDown,
			...rest
		},
		forwardedRef,
	) {
		const {
			setValue,
			orientation,
			interactive,
			activateOnFocus,
		} = useSelectionGroupContext('SelectionGroup.List');

		const roving = useRovingList(orientation, (el) => {
			if (!activateOnFocus) return;
			const nextValue = el.getAttribute(SELECTION_VALUE_ATTR);
			if (nextValue) setValue(nextValue);
		});

		return (
			<div
				ref={forwardedRef}
				className={className}
				{...rest}
				onKeyDown={composeEventHandlers(onKeyDown, interactive ? roving : undefined)}
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
			className,
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
				className={cn(unstyled.control, className)}
				{...{[ROVING_ITEM_ATTR]: ''}}
				{...{[SELECTION_VALUE_ATTR]: itemValue}}
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
			className,
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
				className={className}
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
