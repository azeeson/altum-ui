import type {
	CheckboxProps,
	CheckboxGroupProps,
} from './Checkbox.types';
export type {
	LabelSide,
	CheckboxMode,
	CheckboxProps,
	CheckboxGroupProps,
} from './Checkbox.types';

import {useEffect, forwardRef} from 'react';
import {ToggleControlBase} from '../../base/ToggleControlBase';
import {ToggleGroupBase} from '../../base/ToggleGroupBase';
import box from '../../styles/toggleBox.module.css';
import styles from './Checkbox.module.css';
import {cn} from '../../utils/cn';
import {composeRefs} from '../../utils/composeRefs';

/**
 * Чекбокс: `size`, `labelSide`, `indeterminate`, `mode` (`default` | `task`),
 * `labelVisibility` (`visible` | `hidden`).
 *
 * @component
 * @example
 * <Checkbox label="Выбрать всё" indeterminate checked={false} onChange={...} />
 * <Checkbox labelVisibility="hidden" aria-label="Выполнено" mode="task" checked={done} onChange={...} />
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
	{
		label,
		labelVisibility = 'visible',
		className,
		disabled,
		readOnly,
		size = 'md',
		labelSide = 'end',
		indeterminate = false,
		mode = 'default',
		align: alignProp,
		checked,
		onChange,
		onCheckedChange,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		...props
	},
	ref,
) {
	const isTask = mode === 'task';
	const hideLabel = labelVisibility === 'hidden';

	useEffect(() => {
		if (
			process.env.NODE_ENV !== 'production'
			&& hideLabel
			&& !ariaLabel
			&& !ariaLabelledBy
		) {
			console.warn(
				'[Checkbox] labelVisibility="hidden" требует aria-label или aria-labelledby.',
			);
		}
	}, [hideLabel, ariaLabel, ariaLabelledBy]);

	return (
		<ToggleControlBase
			ref={composeRefs(ref, (node) => {
				if (node) node.indeterminate = indeterminate;
			})}
			type='checkbox'
			size={size}
			align={alignProp ?? (isTask ? 'start' : 'center')}
			labelSide={labelSide}
			readOnly={readOnly}
			disabled={disabled}
			checked={checked}
			className={cn(
				box.root,
				styles.root,
				isTask ? styles.task : '',
				isTask && checked ? styles.checked : '',
				className,
			)}
			inputClassName={cn(box.input, styles.input)}
			boxClassName={cn(box.box, styles.box)}
			label={label}
			labelHidden={hideLabel}
			{...props}
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledBy}
			aria-checked={indeterminate ? 'mixed' : checked}
			onChange={(event) => {
				onChange?.(event);
				onCheckedChange?.(event.target.checked);
			}}
		/>
	);
});

Checkbox.displayName = 'Checkbox';

/**
 * Группа чекбоксов с общим value-массивом и roving focus (стрелки).
 *
 * @component
 * @example
 * <CheckboxGroup
 *   label="Каналы"
 *   options={[{label: 'Эл. почта', value: 'email'}]}
 *   value={selected}
 *   onChange={setSelected}
 * />
 */
export const CheckboxGroup = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(function CheckboxGroup(
	{
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
			{...rest}
		>
			{options.map((option) => (
				<Checkbox
					key={option.value}
					label={option.label}
					checked={value.includes(option.value)}
					disabled={disabled}
					readOnly={readOnly}
					size={size}
					labelSide={labelSide}
					onChange={(event) => {
						if (readOnly || disabled) return;
						if (event.target.checked) onChange([...value, option.value]);
						else onChange(value.filter((item) => item !== option.value));
					}}
				/>
			))}
		</ToggleGroupBase>
	);
});

CheckboxGroup.displayName = 'CheckboxGroup';
