import type {ReactNode, Ref} from 'react';
import type {
	DropdownAlign,
	DropdownPanelScroll,
	DropdownWidthMode,
} from '../Dropdown/Dropdown';
import type {ListboxNavigation} from '../Listbox/Listbox';
import type {FieldBaseProps, TextFieldAs, TextFieldProps} from '../TextField/TextField.types';
import type {ListboxFilterFn, ListboxGroup, ListboxOption} from '../../core/utils/listboxOptions';

export type SelectOption = ListboxOption;

export type SelectSelectionMode = 'single' | 'multiple' | 'path';

/**
 * Пропсы `TextField` внутри `Select`.
 * Накладываются последними и перекрывают поле.
 * `onClick` / `onKeyDown` / `onFocus` / `onBlur` склеиваются с открытием списка:
 * сначала эти обработчики, затем поведение `Select`, если событие не отменено.
 */
export type SelectInputProps = Partial<Omit<TextFieldProps<'input'>, 'as'>> & {
	as?: TextFieldAs;
	children?: ReactNode;
};

/**
 * Свойства `Select` — выбор из списка: одно поле и панель.
 * Печатный триггер и chips — `SuggestField`, `AutocompleteField`, `MultiSelect` через `inputProps`.
 */
export interface SelectProps extends FieldBaseProps {
	options: SelectOption[];
	/** Метаданные групп; опции связываются через `option.groupId`. */
	groups?: ListboxGroup[];
	selectionMode?: SelectSelectionMode;
	value?: string | string[];
	defaultValue?: string | string[];
	onChange?: (value: string | string[]) => void;
	/** Показать список после монтирования. */
	defaultOpen?: boolean;
	/** Нативное открытие и закрытие панели. Не держит видимость. */
	onOpenChange?: (open: boolean) => void;
	/**
	 * Закрывать после выбора.
	 * @default true для single, false для multiple/path
	 */
	closeOnSelect?: boolean;
	filterFn?: ListboxFilterFn<SelectOption>;
	/** Контролируемый запрос фильтра. Пустая строка — весь список. */
	filterQuery?: string;
	defaultFilterQuery?: string;
	onFilterQueryChange?: (query: string) => void;
	placeholder?: string;
	loading?: boolean;
	/** Разделитель подписей для `selectionMode="path"`. @default ' / ' */
	separator?: string;
	/** `aria-haspopup` на триггере. @default 'listbox' */
	popupRole?: 'listbox' | 'tree' | 'dialog' | 'menu';
	/**
	 * Поиск в панели (`SearchField`).
	 * При печатном триггере (`inputProps.as` = `input` / `textarea`) панель-поиск не рисуется:
	 * список фильтрует `filterQuery`.
	 */
	filterable?: boolean;
	filterPlaceholder?: string;
	align?: DropdownAlign;
	/**
	 * Ширина панели относительно триггера.
	 * @default `'trigger-fit'`; у печатного триггера — `'trigger'`
	 */
	widthMode?: DropdownWidthMode;
	mobileTitle?: ReactNode;
	mobileLeftControls?: ReactNode;
	mobileRightControls?: ReactNode;
	panelScroll?: DropdownPanelScroll;
	navigation?: ListboxNavigation;
	highlightedIndex?: number;
	onHighlightChange?: (index: number) => void;
	showCheck?: boolean;
	noOptionsText?: string;
	/**
	 * `preventDefault` на mousedown по панели списка (options, padding, separators),
	 * чтобы фокус оставался на триггере. Поля ввода внутри панели (фильтр) не блокируются.
	 * @default true
	 */
	preventOptionMouseDown?: boolean;
	/** Имя списка для скринридера. */
	listAriaLabel?: string;
	/**
	 * Перекрывает `TextField` триггера. Кладётся в конец пропсов поля.
	 */
	inputProps?: SelectInputProps;
	/** Класс корня dropdown. `className` остаётся на поле. */
	popupClassName?: string;
	/** Корень dropdown. */
	rootRef?: Ref<HTMLDivElement>;
	className?: string;
	id?: string;
	'aria-label'?: string;
}
