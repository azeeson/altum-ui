import type {CustomSelectOption, CustomSelectRootProps} from './CustomSelect.types';
export type {
	CustomSelectOption,
	CustomSelectSelectionMode,
	CustomSelectRenderTargetContext,
	CustomSelectContextValue,
	CustomSelectFilterProps,
	CustomSelectListProps,
	CustomSelectChevronProps,
	CustomSelectPlaceholderProps,
	CustomSelectShellProps,
	CustomSelectRootProps,
} from './CustomSelect.types';

import React, {forwardRef, useCallback, useId, useMemo, useRef} from 'react';
import {Dropdown} from '../Dropdown/Dropdown';
import type {ListboxHandle} from '../Listbox/Listbox';
import {defaultListboxFilterFn, filterListboxOptions, findListboxOption, getListboxPath} from '../../utils/listboxOptions';
import {useControlledState} from '../../hooks/useControlledState';
import {CustomSelectFilterContext, CustomSelectOpenContext, CustomSelectSelectionContext, type CustomSelectOpenContextValue, type CustomSelectSelectionContextValue, type CustomSelectFilterContextValue, defaultEmptyValue, toValueArray} from './CustomSelect.context';
import {CustomSelectFilter} from './CustomSelect.Filter';
import {CustomSelectList} from './CustomSelect.List';
import {CustomSelectChevron, CustomSelectPlaceholder, CustomSelectShell} from './CustomSelect.Shell';
export {useCustomSelectContext} from './CustomSelect.context';
export {
	CustomSelectChevron,
	CustomSelectPlaceholder,
	CustomSelectShell,
};

const CustomSelectRoot = forwardRef<HTMLDivElement, CustomSelectRootProps>(function CustomSelectRoot(
	{
		children,
		options,
		groups,
		selectionMode = 'single',
		value: controlledValue,
		defaultValue,
		onChange,
		open: controlledOpen,
		defaultOpen = false,
		onOpenChange,
		disabled = false,
		readOnly = false,
		closeOnSelect,
		filterFn = defaultListboxFilterFn,
		filterQuery: controlledFilterQuery,
		defaultFilterQuery = '',
		onFilterQueryChange,
		renderTarget,
		align = 'auto',
		widthMode = 'trigger',
		triggerMode,
		mobileTitle,
		mobileLeftControls,
		mobileRightControls,
		panelScroll = 'overlay',
		className,
		...rest
	},
	ref,
) {
	const generatedId = useId();
	const listboxId = `${generatedId}-listbox`;
	const listboxRef = useRef<ListboxHandle | null>(null);

	const [rawValue, setRawValue] = useControlledState<string | string[]>(
		controlledValue,
		defaultValue ?? defaultEmptyValue(selectionMode),
	);
	const valueArray = toValueArray(selectionMode, rawValue);

	const [open, setOpenState] = useControlledState(controlledOpen, defaultOpen);

	const [filterQuery, setFilterQueryState, isFilterControlled] = useControlledState(
		controlledFilterQuery,
		defaultFilterQuery,
	);

	const shouldCloseOnSelect = closeOnSelect ?? selectionMode === 'single';
	const isReadOnly = readOnly && !disabled;
	const interactive = !disabled && !isReadOnly;
	const resolvedTriggerMode = triggerMode
		?? (selectionMode === 'multiple' ? 'combobox' : 'toggle');

	const setOpen = useCallback((next: boolean) => {
		if (!interactive && next) return;
		setOpenState(next);
		onOpenChange?.(next);
		if (!next && !isFilterControlled) {
			setFilterQueryState('');
			onFilterQueryChange?.('');
		}
	}, [
		interactive,
		isFilterControlled,
		onFilterQueryChange,
		onOpenChange,
		setFilterQueryState,
		setOpenState,
	]);

	const setFilterQuery = useCallback((query: string) => {
		setFilterQueryState(query);
		onFilterQueryChange?.(query);
	}, [onFilterQueryChange, setFilterQueryState]);

	const emitValue = useCallback((nextArray: string[]) => {
		const nextValue: string | string[] = selectionMode === 'single'
			? (nextArray[0] ?? '')
			: nextArray;
		setRawValue(nextValue);
		onChange?.(nextValue);
	}, [onChange, selectionMode, setRawValue]);

	const clearValue = useCallback(() => {
		if (!interactive) return;
		emitValue([]);
	}, [emitValue, interactive]);

	const selectPath = useCallback((path: string[], pathOptions?: {close?: boolean}) => {
		if (!interactive) return;
		emitValue(path);
		if (pathOptions?.close ?? shouldCloseOnSelect) setOpen(false);
	}, [
		emitValue,
		interactive,
		setOpen,
		shouldCloseOnSelect,
	]);

	const selectOption = useCallback((optionValue: string) => {
		if (!interactive) return;

		if (selectionMode === 'multiple') {
			const isSelected = valueArray.includes(optionValue);
			const next = isSelected
				? valueArray.filter((item) => item !== optionValue)
				: [...valueArray, optionValue];
			emitValue(next);
			if (shouldCloseOnSelect) setOpen(false);
			return;
		}

		if (selectionMode === 'path') {
			const path = getListboxPath(options, optionValue).map((item) => item.value);
			selectPath(path.length > 0 ? path : [optionValue], {close: shouldCloseOnSelect});
			return;
		}

		emitValue([optionValue]);
		if (shouldCloseOnSelect) setOpen(false);
	}, [
		emitValue,
		interactive,
		options,
		selectPath,
		selectionMode,
		setOpen,
		shouldCloseOnSelect,
		valueArray,
	]);

	const removeOption = useCallback((optionValue: string) => {
		if (!interactive || selectionMode !== 'multiple') return;
		emitValue(valueArray.filter((item) => item !== optionValue));
	}, [
		emitValue,
		interactive,
		selectionMode,
		valueArray,
	]);

	const registerListboxRef = useCallback((ref: ListboxHandle | null) => {
		listboxRef.current = ref;
	}, []);

	const selectedOptions = useMemo(() => {
		if (selectionMode === 'path') {
			return valueArray
				.map((item) => findListboxOption(options, item))
				.filter((item): item is CustomSelectOption => Boolean(item));
		}
		return valueArray
			.map((item) => {
				const matched = findListboxOption(options, item);
				if (matched) return matched;
				if (!item) return undefined;
				return {
					value: item,
					label: item,
				} as CustomSelectOption;
			})
			.filter((item): item is CustomSelectOption => Boolean(item));
	}, [options, selectionMode, valueArray]);

	const filteredOptions = useMemo(
		() => filterListboxOptions({
			options,
			query: filterQuery,
			enabled: true,
			filterFn,
		}),
		[filterFn, filterQuery, options,],
	);

	const openContextValue = useMemo<CustomSelectOpenContextValue>(() => ({
		open,
		setOpen,
		disabled,
		readOnly: isReadOnly,
		interactive,
	}), [
		disabled,
		interactive,
		isReadOnly,
		open,
		setOpen,
	]);

	const selectionContextValue = useMemo<CustomSelectSelectionContextValue>(() => ({
		selectionMode,
		valueArray,
		selectedOptions,
		options,
		groups,
		listboxId,
		selectOption,
		selectPath,
		removeOption,
		registerListboxRef,
		listboxRef,
	}), [
		groups,
		listboxId,
		options,
		registerListboxRef,
		removeOption,
		selectOption,
		selectPath,
		selectedOptions,
		selectionMode,
		valueArray,
	]);

	const filterContextValue = useMemo<CustomSelectFilterContextValue>(() => ({
		filteredOptions,
		filterQuery,
		setFilterQuery,
		filterFn,
	}), [
		filterFn,
		filterQuery,
		filteredOptions,
		setFilterQuery,
	]);

	const handleRenderTarget = useCallback((
		triggerAttrs: import('../Dropdown/Dropdown').DropdownTriggerAttrs,
		triggerRef: React.RefCallback<HTMLElement>,
	) => renderTarget({
		triggerRef,
		triggerAttrs,
		open,
		disabled,
		readOnly: isReadOnly,
		interactive,
		selectionMode,
		value: selectionMode === 'single' ? (valueArray[0] ?? '') : valueArray,
		selectedOptions,
		listboxId,
		setOpen,
		clearValue,
		removeOption,
	}), [
		clearValue,
		disabled,
		interactive,
		isReadOnly,
		listboxId,
		open,
		removeOption,
		renderTarget,
		selectedOptions,
		selectionMode,
		setOpen,
		valueArray,
	]);

	const handleOpen = useCallback(() => {
		if (interactive) setOpen(true);
	}, [interactive, setOpen]);

	const handleClose = useCallback(() => {
		setOpen(false);
	}, [setOpen]);

	return (
		<CustomSelectOpenContext.Provider value={openContextValue}>
			<CustomSelectSelectionContext.Provider value={selectionContextValue}>
				<CustomSelectFilterContext.Provider value={filterContextValue}>
					<Dropdown
						ref={ref}
						open={open}
						onOpenChange={(next) => {
							if (next) handleOpen();
							else handleClose();
						}}
						onClose={handleClose}
						widthMode={widthMode}
						align={align}
						popupRole='none'
						triggerMode={resolvedTriggerMode}
						mobileTitle={mobileTitle}
						mobileLeftControls={mobileLeftControls}
						mobileRightControls={mobileRightControls}
						panelScroll={panelScroll}
						className={className}
						{...rest}
					>
						<Dropdown.Trigger asChild={false}>
							{handleRenderTarget}
						</Dropdown.Trigger>
						<Dropdown.Content>
							{children}
						</Dropdown.Content>
					</Dropdown>
				</CustomSelectFilterContext.Provider>
			</CustomSelectSelectionContext.Provider>
		</CustomSelectOpenContext.Provider>
	);
});

CustomSelectRoot.displayName = 'CustomSelect.Root';

/**
 * Составной select на базе Dropdown + Listbox: single / multiple / path, фильтрация и кастомный trigger.
 *
 * @component
 * @example
 * <CustomSelect.Root
 *   options={options}
 *   renderTarget={(ctx) => <button type="button" {...ctx.triggerAttrs}>{ctx.selectedOptions[0]?.label}</button>}
 * >
 *   <CustomSelect.Filter />
 *   <CustomSelect.List />
 * </CustomSelect.Root>
 */
export const CustomSelect = Object.assign(CustomSelectRoot, {
	Root: CustomSelectRoot,
	Filter: CustomSelectFilter,
	List: CustomSelectList,
	Shell: CustomSelectShell,
	Chevron: CustomSelectChevron,
	Placeholder: CustomSelectPlaceholder,
});
