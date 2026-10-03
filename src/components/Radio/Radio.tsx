import type {
	RadioProps,
	RadioGroupProps,
} from './Radio.types';
export type {
	RadioProps,
	RadioGroupProps,
} from './Radio.types';

import type {ChangeEvent} from 'react';
import {ToggleControlBase} from '../../base/ToggleControlBase';
import {
	SelectionGroup,
	type SelectionGroupRadioProps,
	SELECTION_SELECTED_ATTR,
	SELECTION_VALUE_ATTR,
} from '../../base/SelectionGroup';
import box from '../../styles/toggleBox.module.css';
import toggleGroup from '../../styles/toggleGroup.module.css';
import styles from './Radio.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Радиокнопка с подписью и поддержкой read-only без disabled-стиля.
 *
 * @component
 * @example
 * <Radio name="plan" label="Базовый" value="basic" checked={plan === 'basic'} onChange={selectPlan} />
 */
export const Radio = ({
	label,
	className,
	disabled,
	readOnly,
	size = 'md',
	labelSide = 'end',
	onChange,
	onCheckedChange,
	inputRef,
	labelProps,
	...props
}: RadioProps) => {
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		onChange?.(event);
		onCheckedChange?.(event.target.checked);
	};

	return (
		<ToggleControlBase
			inputRef={inputRef}
			type='radio'
			size={size}
			labelSide={labelSide}
			readOnly={readOnly}
			disabled={disabled}
			className={cn(box.root, styles.root, className)}
			inputClassName={cn(box.input, styles.input)}
			boxClassName={cn(box.box, styles.box)}
			label={label}
			{...props}
			labelProps={labelProps}
			onChange={handleChange}
		/>
	);
};

/**
 * Группа radio: `SelectionGroup` (`as="fieldset"`) + `Radio` через `customRenderOption`.
 * `disabled` каскадом с `<fieldset>`; выбор — один `onChange` на корне `SelectionGroup`.
 *
 * @component
 * @example
 * <RadioGroup
 *   name="plan"
 *   label="Тариф"
 *   options={[{label: 'Базовый', value: 'basic'}, {label: 'Pro', value: 'pro'}]}
 *   value={plan}
 *   onChange={setPlan}
 * />
 */
export const RadioGroup = ({
	name,
	label,
	options,
	value,
	onChange,
	orientation = 'vertical',
	readOnly = false,
	disabled = false,
	size = 'md',
	labelSide = 'end',
	rootRef,
	className,
	...rest
}: RadioGroupProps) => (
	<SelectionGroup
		{...(rest as Partial<SelectionGroupRadioProps>)}
		as='fieldset'
		type='radio'
		role='radiogroup'
		aria-label={label ? undefined : rest['aria-label']}
		options={options}
		value={value}
		onChange={onChange}
		orientation={orientation}
		readOnly={readOnly}
		disabled={disabled}
		size={size}
		rootRef={rootRef}
		className={cn(toggleGroup.fieldset, styles.group, className)}
		customRenderOption={(option, {selected, optionProps}) => (
			<Radio
				name={name}
				value={option.value}
				label={option.label}
				checked={selected}
				disabled={option.disabled}
				readOnly={readOnly}
				size={size}
				labelSide={labelSide}
				labelProps={{
					tabIndex: optionProps.tabIndex,
					'aria-disabled': optionProps['aria-disabled'],
					[SELECTION_VALUE_ATTR]: option.value,
					[SELECTION_SELECTED_ATTR]: selected ? '' : undefined,
				}}
			/>
		)}
	>
		{label ? (
			<legend className={cn(toggleGroup.legend, styles.label)}>
				{label}
			</legend>
		) : null}
	</SelectionGroup>
);
