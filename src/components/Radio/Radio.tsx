import type {
	RadioProps,
	RadioGroupProps,
} from './Radio.types';
export type {
	RadioProps,
	RadioGroupProps,
} from './Radio.types';

import {forwardRef} from 'react';
import {ToggleControlBase} from '../../base/ToggleControlBase';
import {ToggleGroupBase} from '../../base/ToggleGroupBase';
import box from '../../styles/toggleBox.module.css';
import styles from './Radio.module.css';
import {cn} from '../../utils/cn';

/**
 * Радиокнопка с подписью и поддержкой read-only без disabled-стиля.
 *
 * @component
 * @example
 * <Radio name="plan" label="Базовый" value="basic" checked={plan === 'basic'} onChange={selectPlan} />
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
	{
		label,
		className,
		disabled,
		readOnly,
		size = 'md',
		labelSide = 'end',
		onChange,
		onCheckedChange,
		...props
	},
	ref,
) {
	return (
		<ToggleControlBase
			ref={ref}
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
			onChange={(event) => {
				onChange?.(event);
				onCheckedChange?.(event.target.checked);
			}}
		/>
	);
});

Radio.displayName = 'Radio';

/**
 * Группа radio с единым `name`/`value` и roving focus (стрелки меняют выбор).
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
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
	{
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
		...rest
	},
	ref,
) {
	return (
		<ToggleGroupBase
			ref={ref}
			label={label}
			orientation={orientation}
			readOnly={readOnly}
			disabled={disabled}
			onMove={(index) => onChange(options[index].value)}
			{...rest}
		>
			{options.map((option) => (
				<Radio
					key={option.value}
					name={name}
					value={option.value}
					label={option.label}
					checked={value === option.value}
					disabled={disabled}
					readOnly={readOnly}
					size={size}
					labelSide={labelSide}
					onChange={() => onChange(option.value)}
				/>
			))}
		</ToggleGroupBase>
	);
});

RadioGroup.displayName = 'RadioGroup';
