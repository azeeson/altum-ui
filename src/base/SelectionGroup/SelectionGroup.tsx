import type {SelectionGroupProps, SelectionOptionRenderProps} from './SelectionGroup.types';
export type {
	SelectionType,
	SelectionOption,
	SelectionOptionRenderProps,
	SelectionOptionRenderState,
	SelectionGroupOrientation,
	SelectionGroupRootAs,
	SelectionGroupRadioProps,
	SelectionGroupCheckboxProps,
	SelectionGroupProps,
} from './SelectionGroup.types';

import {
	Fragment,
	type ComponentPropsWithoutRef,
	type KeyboardEvent,
	type MouseEvent,
	type Ref,
} from 'react';
import {Button} from '../../components/Button/Button';
import {ButtonGroup} from '../../components/ButtonGroup/ButtonGroup';
import {cn} from '../../core/utils/cn';
import styles from './SelectionGroup.module.css';
import {
	isSelectionSelected,
	SELECTION_SELECTED_ATTR,
	SELECTION_VALUE_ATTR,
	selectionItemTabIndex,
} from './SelectionGroup.utils';
import {useSelectionRoot} from './useSelectionRoot';

/**
 * Выбор `radio` (одно значение) или `checkbox` (несколько) по списку `options`.
 * Трек и кнопки — `ButtonGroup` и `Button`. Свой стиль только у выбранного пункта.
 * `customRenderOption` рисует пункт сам, без трека `ButtonGroup`.
 * `as="fieldset"` — семантический корень с нативным каскадом `disabled`.
 * `disabled` группы выключает все пункты. `disabled` у пункта — только его.
 *
 * @component
 * @example
 * <SelectionGroup
 *   aria-label="Вид"
 *   options={[{ value: 'list', label: 'Список' }, { value: 'grid', label: 'Сетка' }]}
 *   value={view}
 *   onChange={setView}
 * />
 */
export const SelectionGroup = ({
	options,
	type = 'radio',
	value: controlledValue,
	defaultValue,
	onChange,
	orientation = 'horizontal',
	disabled = false,
	readOnly = false,
	activateOnFocus = true,
	customRenderOption,
	itemRole,
	children,
	className,
	onClick,
	onKeyDown,
	role,
	variant,
	size,
	width,
	itemFit,
	as = 'div',
	rootRef,
	...rest
}: SelectionGroupProps) => {
	const selection = useSelectionRoot<string | readonly string[]>({
		type,
		value: controlledValue,
		defaultValue,
		onChange: onChange as ((next: string | readonly string[]) => void) | undefined,
		disabled,
		readOnly,
		orientation,
		activateOnFocus,
	});
	const listRole = role ?? (
		itemRole === 'tab'
			? 'tablist'
			: type === 'checkbox'
				? 'group'
				: 'radiogroup'
	);

	const tab = itemRole === 'tab';
	const items = options.map((option) => {
		const selected = isSelectionSelected(type, selection.value, option.value);
		const off = disabled || Boolean(option.disabled);
		const optionProps: SelectionOptionRenderProps = {
			id: option.id,
			role: itemRole ?? (type === 'checkbox' ? 'checkbox' : 'radio'),
			...(tab ? {'aria-selected': selected} : {'aria-checked': selected}),
			'aria-controls': option.controls,
			tabIndex: selectionItemTabIndex(type, selected, off, selection.isReadOnly),
			[SELECTION_VALUE_ATTR]: option.value,
			[SELECTION_SELECTED_ATTR]: selected ? '' : undefined,
			disabled: off ? true : undefined,
			'aria-disabled': off || selection.isReadOnly ? true : undefined,
		};
		if (customRenderOption) {
			return (
				<Fragment key={option.value}>
					{customRenderOption(option, {
						selected,
						optionProps
					})}
				</Fragment>
			);
		}
		return (
			<Button
				key={option.value}
				{...optionProps}
			>
				{option.label}
			</Button>
		);
	});
	const body = (
		<>
			{children}
			{items}
		</>
	);
	const rootProps = {
		...rest,
		...selection.dataProps,
		role: listRole,
		'aria-orientation': orientation,
		'aria-readonly': selection.isReadOnly || undefined,
		onClick: (event: MouseEvent<HTMLElement>) => {
			onClick?.(event as MouseEvent<HTMLDivElement>);
			if (!event.defaultPrevented) selection.onClick(event);
		},
		onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
			onKeyDown?.(event as KeyboardEvent<HTMLDivElement>);
			if (!event.defaultPrevented) selection.onKeyDown(event);
		},
	};

	if (customRenderOption) {
		const useFieldset = as === 'fieldset';
		if (useFieldset) {
			return (
				<fieldset
					{...(rootProps as ComponentPropsWithoutRef<'fieldset'>)}
					ref={rootRef as Ref<HTMLFieldSetElement>}
					className={className}
					disabled={disabled || undefined}
				>
					{body}
				</fieldset>
			);
		}
		return (
			<div
				{...rootProps}
				ref={rootRef as Ref<HTMLDivElement>}
				className={className}
				aria-disabled={disabled || undefined}
			>
				{body}
			</div>
		);
	}

	return (
		<ButtonGroup
			{...rootProps}
			rootRef={rootRef as Ref<HTMLDivElement>}
			className={cn(styles.group, className)}
			variant={variant}
			size={size}
			width={width}
			itemFit={itemFit}
			orientation={orientation}
			disabled={disabled}
			focusable={false}
		>
			{body}
		</ButtonGroup>
	);
};
