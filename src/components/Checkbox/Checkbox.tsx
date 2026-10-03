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

import {useRef, type ChangeEvent} from 'react';
import {ToggleControlBase} from '../../base/ToggleControlBase';
import {ToggleGroupBase} from '../../base/ToggleGroupBase';
import box from '../../styles/toggleBox.module.css';
import styles from './Checkbox.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Чекбокс: `size`, `labelSide`, `indeterminate`, `mode` (`default` | `task`),
 * `labelVisibility` (`visible` | `hidden`).
 *
 * @component
 * @example
 * <Checkbox label="Выбрать всё" indeterminate checked={false} onChange={...} />
 * <Checkbox labelVisibility="hidden" aria-label="Выполнено" mode="task" checked={done} onChange={...} />
 */
export const Checkbox = ({
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
	inputRef,
	...props
}: CheckboxProps) => {
	const isTask = mode === 'task';
	const hideLabel = labelVisibility === 'hidden';
	const warnedRef = useRef(false);
	const missingName = hideLabel && !ariaLabel && !ariaLabelledBy;

	if (process.env.NODE_ENV !== 'production') {
		if (missingName && !warnedRef.current) {
			warnedRef.current = true;
			console.warn(
				'[Checkbox] labelVisibility="hidden" требует aria-label или aria-labelledby.',
			);
		}
		if (!missingName) warnedRef.current = false;
	}

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		onChange?.(event);
		onCheckedChange?.(event.target.checked);
	};

	return (
		<ToggleControlBase
			inputRef={inputRef}
			type='checkbox'
			size={size}
			align={alignProp ?? (isTask ? 'start' : 'center')}
			labelSide={labelSide}
			readOnly={readOnly}
			disabled={disabled}
			checked={checked}
			className={cn(box.root, styles.root, className)}
			inputClassName={cn(box.input, styles.input)}
			boxClassName={cn(box.box, styles.box)}
			label={label}
			labelHidden={hideLabel}
			{...props}
			labelProps={{
				'data-mode': mode !== 'default' ? mode : undefined,
				'data-indeterminate': indeterminate ? '' : undefined,
			}}
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledBy}
			aria-checked={indeterminate ? 'mixed' : checked}
			onChange={handleChange}
		/>
	);
};

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
export const CheckboxGroup = ({
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
	...rest
}: CheckboxGroupProps) => {
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;
	const valueRef = useRef(value);
	valueRef.current = value;

	const handleChange = (event: ChangeEvent<HTMLFieldSetElement>) => {
		if (readOnly || disabled) return;
		const target = event.target;
		if (!(target instanceof HTMLInputElement)) return;
		const current = valueRef.current;
		if (target.checked) onChangeRef.current([...current, target.value]);
		else onChangeRef.current(current.filter((item) => item !== target.value));
	};

	return (
		<ToggleGroupBase
			rootRef={rootRef}
			label={label}
			orientation={orientation}
			readOnly={readOnly}
			disabled={disabled}
			{...rest}
			onChange={handleChange}
		>
			{options.map((option) => (
				<Checkbox
					key={option.value}
					value={option.value}
					label={option.label}
					checked={value.includes(option.value)}
					disabled={disabled}
					readOnly={readOnly}
					size={size}
					labelSide={labelSide}
				/>
			))}
		</ToggleGroupBase>
	);
};
