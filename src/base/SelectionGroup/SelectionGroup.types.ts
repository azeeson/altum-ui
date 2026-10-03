import type {ReactNode, Ref} from 'react';
import type {ButtonGroupRootProps} from '../../components/ButtonGroup/ButtonGroup.types';

export type {SelectionType} from './SelectionGroup.utils';

export type SelectionGroupOrientation = 'horizontal' | 'vertical';

/** Корень при `customRenderOption`: `div` или семантический `fieldset`. */
export type SelectionGroupRootAs = 'div' | 'fieldset';

/**
 * Пункт списка. `value` — идентификатор, `label` — подпись кнопки.
 * `disabled` недоступен сам пункт; `disabled` группы выключает все.
 */
export type SelectionOption = {
	value: string;
	label: ReactNode;
	disabled?: boolean;
	id?: string;
	/** `aria-controls` — панель, которой управляет пункт. */
	controls?: string;
};

/**
 * Атрибуты пункта, которые вызываетющий код раскладывает на свой элемент.
 * Роль, aria, tabindex и `data-selection-value` нужны делегированию клика и стрелкам.
 */
export type SelectionOptionRenderProps = {
	id?: string;
	role: 'radio' | 'checkbox' | 'tab';
	'aria-checked'?: boolean;
	'aria-selected'?: boolean;
	'aria-controls'?: string;
	tabIndex: number;
	'data-selection-value': string;
	'data-selected'?: '';
	disabled?: true;
	'aria-disabled'?: true;
};

/** Состояние пункта для `customRenderOption`. */
export type SelectionOptionRenderState = {
	selected: boolean;
	optionProps: SelectionOptionRenderProps;
};

/**
 * Общие свойства `SelectionGroup`, без значения выбора.
 * Вид трека — пропсы `ButtonGroup`. Пункты рисуются `Button`.
 */
type SelectionGroupBaseProps = Omit<
	ButtonGroupRootProps,
	'children' | 'focusable' | 'onChange' | 'defaultValue' | 'rootRef'
> & {
	options: readonly SelectionOption[];
	/**
	 * Узел внутри трека перед пунктами.
	 */
	children?: ReactNode;
	/**
	 * Корень при `customRenderOption`. `fieldset` — нативный каскад `disabled`.
	 * Без `customRenderOption` игнорируется (трек — `ButtonGroup` / `div`).
	 * @default 'div'
	 */
	as?: SelectionGroupRootAs;
	/** Корень группы (`div` или `fieldset` при `as="fieldset"`). */
	rootRef?: Ref<HTMLDivElement | HTMLFieldSetElement>;
	/**
	 * Выбор нельзя менять. Это не проп `ButtonGroup`: группа кнопок не поле.
	 * @default false
	 */
	readOnly?: boolean;
	/**
	 * Менять value при навигации стрелками.
	 * @default true
	 */
	activateOnFocus?: boolean;
	/**
	 * Свой элемент пункта вместо `Button`.
	 * На элемент нужно разложить `optionProps`: роль, aria, tabindex и `disabled`.
	 * Трек `ButtonGroup` в этом режиме не используется.
	 */
	customRenderOption?: (
		option: SelectionOption,
		state: SelectionOptionRenderState,
	) => ReactNode;
	/**
	 * Роль пункта. Без неё — `radio` или `checkbox`.
	 * `tab` — список вкладок.
	 */
	itemRole?: 'tab';
};

/**
 * `SelectionGroup` с одним значением.
 */
export interface SelectionGroupRadioProps extends SelectionGroupBaseProps {
	type?: 'radio';
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
}

/**
 * `SelectionGroup` с несколькими значениями.
 */
export interface SelectionGroupCheckboxProps extends SelectionGroupBaseProps {
	type: 'checkbox';
	value?: readonly string[];
	defaultValue?: readonly string[];
	onChange?: (value: string[]) => void;
}

/**
 * Свойства `SelectionGroup`.
 * `radio` — одно значение, `checkbox` — несколько.
 * Пункты задаются `options`. `children` — дополнительный узел перед пунктами.
 */
export type SelectionGroupProps = SelectionGroupRadioProps | SelectionGroupCheckboxProps;
