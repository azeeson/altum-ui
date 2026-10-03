import type {ReactNode, Ref} from 'react';
import type {
	DropdownAlign,
	DropdownPanelScroll,
	DropdownWidthMode,
} from '../Dropdown/Dropdown';
import type {FieldBaseProps} from '../TextField/TextField.types';
import type {SelectOption} from '../Select/Select';
import type {ListboxFilterFn, ListboxGroup} from '../../core/utils/listboxOptions';

/**
 * Публичный тип `MultiSelectOption`.
 */
export type MultiSelectOption = SelectOption;

/**
 * Свойства `MultiSelect` — multiple-выбор с chips в триггере
 * (декоратор над `Select`: `inputProps.children`).
 */
export interface MultiSelectProps extends FieldBaseProps {
	options: MultiSelectOption[];
	groups?: ListboxGroup[];
	value?: string[];
	defaultValue?: string[];
	onChange?: (value: string[]) => void;
	placeholder?: string;
	loading?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	closeOnSelect?: boolean;
	filterFn?: ListboxFilterFn<MultiSelectOption>;
	filterable?: boolean;
	filterPlaceholder?: string;
	filterQuery?: string;
	defaultFilterQuery?: string;
	onFilterQueryChange?: (query: string) => void;
	align?: DropdownAlign;
	widthMode?: DropdownWidthMode;
	mobileTitle?: ReactNode;
	mobileLeftControls?: ReactNode;
	mobileRightControls?: ReactNode;
	panelScroll?: DropdownPanelScroll;
	showCheck?: boolean;
	noOptionsText?: string;
	listAriaLabel?: string;
	popupClassName?: string;
	rootRef?: Ref<HTMLDivElement>;
	className?: string;
	id?: string;
	'aria-label'?: string;
}
