import type React from 'react';
import type {ComponentPropsWithoutRef, ReactNode, SVGProps} from 'react';
import type {DropdownProps, DropdownTriggerAttrs} from '../Dropdown/Dropdown';
import type {ListboxFilterFn, ListboxGroup} from '../../utils/listboxOptions';
import type {ListboxProps} from '../Listbox/Listbox';
import type {FieldBaseProps} from '../../base/FieldBase';
import type {TextFieldProps} from '../TextField/TextField.types';
import type {
	CustomSelectOption,
	CustomSelectRenderTargetContext,
	CustomSelectSelectionMode,
} from './CustomSelect.context';

export type {
	CustomSelectOption,
	CustomSelectSelectionMode,
	CustomSelectRenderTargetContext,
	CustomSelectContextValue,
} from './CustomSelect.context';

export interface CustomSelectChevronProps extends Omit<
	SVGProps<SVGSVGElement>,
	'children' | 'viewBox'
> {
	open?: boolean;
	readOnly?: boolean;
	arrowClassName?: string;
	arrowOpenClassName?: string;
	readOnlyArrowClassName?: string;
}

export interface CustomSelectPlaceholderProps extends Omit<
	React.HTMLAttributes<HTMLSpanElement>,
	'children'
> {
	children?: ReactNode;
}

export interface CustomSelectShellProps
	extends FieldBaseProps,
	Omit<
		React.HTMLAttributes<HTMLDivElement>,
		'children' | 'className' | 'prefix' | keyof FieldBaseProps
	> {
	triggerRef: React.LegacyRef<HTMLDivElement>;
	triggerAttrs: DropdownTriggerAttrs;
	id: string;
	open: boolean;
	isInteractive: boolean;
	hasValue: boolean;
	className?: string;
	/** `aria-haspopup` на кнопке. @default 'listbox' */
	popupRole?: 'listbox' | 'tree' | 'dialog' | 'menu';
	children: ReactNode;
	/** Скрытый сайзер ширины триггера (самый длинный пункт). */
	sizerContent?: ReactNode;
	triggerClassName?: string;
	triggerAs?: 'button' | 'div';
	triggerProps?: Omit<
		React.HTMLAttributes<HTMLElement>,
		'id' | 'className' | 'children' | 'onClick' | 'onKeyDown'
	>;
	wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
}

export interface CustomSelectFilterProps extends Omit<
	TextFieldProps,
	'value' | 'type' | 'prefix' | 'label'
> {
	autoFocus?: boolean;
	/** @default locale `customSelect.filterPlaceholder` */
	label?: string;
}

export interface CustomSelectListProps extends Omit<
	ListboxProps,
	'options' | 'groups' | 'value' | 'onSelect' | 'multiple' | 'id'
> {
	options?: CustomSelectOption[];
	groups?: ListboxGroup[];
	id?: string;
}

export interface CustomSelectRootProps extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'children' | 'onChange' | 'value' | 'defaultValue'
> {
	children: ReactNode;
	options: CustomSelectOption[];
	/** Метаданные групп; опции связываются через `option.groupId` */
	groups?: ListboxGroup[];
	selectionMode?: CustomSelectSelectionMode;
	value?: string | string[];
	defaultValue?: string | string[];
	onChange?: (value: string | string[]) => void;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	disabled?: boolean;
	readOnly?: boolean;
	/**
	 * Закрывать после выбора.
	 * @default true для single, false для multiple/path
	 */
	closeOnSelect?: boolean;
	filterFn?: ListboxFilterFn<CustomSelectOption>;
	/** Контролируемый запрос фильтра (SuggestField / внешний поиск) */
	filterQuery?: string;
	defaultFilterQuery?: string;
	onFilterQueryChange?: (query: string) => void;
	renderTarget: (ctx: CustomSelectRenderTargetContext) => ReactNode;
	align?: DropdownProps['align'];
	/**
	 * Ширина панели относительно триггера.
	 * @default `'trigger-fit'` — не уже триггера, растёт по пунктам, не шире вьюпорта
	 */
	widthMode?: DropdownProps['widthMode'];
	triggerMode?: DropdownProps['triggerMode'];
	mobileTitle?: ReactNode;
	mobileLeftControls?: ReactNode;
	mobileRightControls?: ReactNode;
	panelScroll?: DropdownProps['panelScroll'];
}
