import type {CustomSelectOption, CustomSelectRootProps} from '../CustomSelect/CustomSelect';
import type {FieldBaseProps} from '../../base/FieldBase';

export type SelectOption = CustomSelectOption;

/**
 * Свойства `Select` — поле выбора на CustomSelect + FieldBase chrome.
 *
 * `label` обязателен. Кастомный триггер — {@link CustomSelect}.
 */
export interface SelectProps extends
	Omit<CustomSelectRootProps, 'renderTarget' | 'children' | 'prefix'>,
	Omit<FieldBaseProps, 'disabled' | 'readOnly'> {
	placeholder?: string;
	loading?: boolean;
	/** Разделитель подписей для `selectionMode="path"`. @default ' / ' */
	separator?: string;
	/** `aria-haspopup` на trigger. @default 'listbox' */
	popupRole?: 'listbox' | 'tree' | 'dialog' | 'menu';
	/** Показать поле фильтра в панели. */
	filterable?: boolean;
	filterPlaceholder?: string;
}
