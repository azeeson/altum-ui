import {createContext, useContext, type RefCallback, type RefObject} from 'react';
import type {ListboxHandle} from '../Listbox/Listbox';
import type {ListboxFilterFn, ListboxGroup} from '../../utils/listboxOptions';
import type {ListboxOption} from '../../utils/listboxOptions';

export type CustomSelectOption = ListboxOption;
export type CustomSelectSelectionMode = 'single' | 'multiple' | 'path';

export interface CustomSelectRenderTargetContext {
	triggerRef: RefCallback<HTMLElement>;
	triggerAttrs: import('../Dropdown/Dropdown').DropdownTriggerAttrs;
	open: boolean;
	disabled: boolean;
	readOnly: boolean;
	interactive: boolean;
	selectionMode: CustomSelectSelectionMode;
	/** Текущее значение: string (single), string[] (multiple | path) */
	value: string | string[];
	selectedOptions: CustomSelectOption[];
	listboxId: string;
	setOpen: (open: boolean) => void;
	/** Сбросить выбор (single → `''`, multiple/path → `[]`) */
	clearValue: () => void;
	/** Снять опцию (multiple); no-op в single/path */
	removeOption: (optionValue: string) => void;
}

export interface CustomSelectOpenContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
	disabled: boolean;
	readOnly: boolean;
	interactive: boolean;
}

export interface CustomSelectSelectionContextValue {
	selectionMode: CustomSelectSelectionMode;
	valueArray: string[];
	selectedOptions: CustomSelectOption[];
	options: CustomSelectOption[];
	groups: ListboxGroup[] | undefined;
	listboxId: string;
	selectOption: (optionValue: string) => void;
	selectPath: (path: string[], options?: {close?: boolean}) => void;
	removeOption: (optionValue: string) => void;
	registerListboxRef: (ref: ListboxHandle | null) => void;
	listboxRef: RefObject<ListboxHandle | null>;
}

export interface CustomSelectFilterContextValue {
	filteredOptions: CustomSelectOption[];
	filterQuery: string;
	setFilterQuery: (query: string) => void;
	filterFn: ListboxFilterFn<CustomSelectOption>;
}

/** Сводная форма контекста — публичный API `useCustomSelectContext`. */
export interface CustomSelectContextValue extends
	CustomSelectOpenContextValue,
	CustomSelectSelectionContextValue,
	CustomSelectFilterContextValue {}

export const CustomSelectOpenContext = createContext<CustomSelectOpenContextValue | null>(null);
export const CustomSelectSelectionContext = createContext<CustomSelectSelectionContextValue | null>(null);
export const CustomSelectFilterContext = createContext<CustomSelectFilterContextValue | null>(null);

export function useCustomSelectOpenContext(component: string): CustomSelectOpenContextValue {
	const context = useContext(CustomSelectOpenContext);
	if (!context) {
		throw new Error(`${component} должен использоваться внутри CustomSelect.Root`);
	}
	return context;
}

export function useCustomSelectSelectionContext(component: string): CustomSelectSelectionContextValue {
	const context = useContext(CustomSelectSelectionContext);
	if (!context) {
		throw new Error(`${component} должен использоваться внутри CustomSelect.Root`);
	}
	return context;
}

export function useCustomSelectFilterContext(component: string): CustomSelectFilterContextValue {
	const context = useContext(CustomSelectFilterContext);
	if (!context) {
		throw new Error(`${component} должен использоваться внутри CustomSelect.Root`);
	}
	return context;
}

export function useCustomSelectContext(component: string): CustomSelectContextValue {
	return {
		...useCustomSelectOpenContext(component),
		...useCustomSelectSelectionContext(component),
		...useCustomSelectFilterContext(component),
	};
}

export function toValueArray(
	mode: CustomSelectSelectionMode,
	value: string | string[] | undefined,
): string[] {
	if (value === undefined) return [];
	if (mode === 'multiple' || mode === 'path') {
		return Array.isArray(value) ? value : value ? [value] : [];
	}
	if (Array.isArray(value)) return value[0] ? [value[0]] : [];
	return value ? [value] : [];
}

export function defaultEmptyValue(mode: CustomSelectSelectionMode): string | string[] {
	return mode === 'single' ? '' : [];
}
