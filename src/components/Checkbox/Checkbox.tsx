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

import React, {useEffect, useId, useRef, forwardRef} from 'react';
import {
	ToggleControlBase,
	toggleGroupClassName,
	toggleLegendClassName,
	toggleStackClassName,
} from '../../base/ToggleControlBase';
import {focusElement} from '../../utils/a11y';
import {handleRovingFocusKeyDown} from '../../utils/keyboard';
import {composeEventHandlers} from '../../utils/composeEvents';
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
		className = '',
		id: providedId,
		disabled,
		readOnly,
		onChange,
		onClick,
		size = 'md',
		labelSide = 'end',
		indeterminate = false,
		mode = 'default',
		align: alignProp,
		checked,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		...props
	},
	ref,
) {
	const generatedId = useId();
	const id = providedId || generatedId;
	const isReadOnly = !!readOnly && !disabled;
	const isTask = mode === 'task';
	const align = alignProp ?? (isTask ? 'start' : 'center');
	const inputRef = useRef<HTMLInputElement>(null);
	const hideLabel = labelVisibility === 'hidden';

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.indeterminate = indeterminate;
		}
	}, [indeterminate]);

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
			id={id}
			controlType={isTask ? 'task' : 'checkbox'}
			size={size}
			align={align}
			labelSide={labelSide}
			readOnly={isReadOnly}
			checked={!!checked}
			className={className}
			label={label}
			labelHidden={hideLabel}
			input={(
				<input
					ref={composeRefs(ref, inputRef)}
					type='checkbox'
					id={id}
					disabled={disabled}
					checked={checked}
					{...props}
					aria-label={ariaLabel}
					aria-labelledby={ariaLabelledBy}
					aria-readonly={isReadOnly || undefined}
					aria-checked={indeterminate ? 'mixed' : checked}
					onChange={composeEventHandlers(onChange, (event) => {
						if (isReadOnly) event.preventDefault();
					})}
					onClick={composeEventHandlers(onClick, (event) => {
						if (isReadOnly) event.preventDefault();
					})}
				/>
			)}
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
		className,
		style,
		readOnly = false,
		disabled = false,
		size = 'md',
		labelSide = 'end',
		onKeyDown,
		...rest
	},
	ref,
) {
	const groupId = useId();

	const handleCheckboxChange = (val: string, checked: boolean) => {
		if (readOnly || disabled) return;
		if (checked) onChange([...value, val]);
		else onChange(value.filter((item) => item !== val));
	};

	const handleKeyDown = composeEventHandlers(onKeyDown, (event: React.KeyboardEvent<HTMLFieldSetElement>) => {
		if (readOnly || disabled) return;
		const inputs = Array.from(
			event.currentTarget.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'),
		);
		const currentIndex = inputs.indexOf(document.activeElement as HTMLInputElement);
		handleRovingFocusKeyDown(event, {
			currentIndex,
			length: inputs.length,
			orientation: orientation === 'horizontal' ? 'horizontal' : 'vertical',
			onMove: (nextIndex) => {
				focusElement(inputs[nextIndex]);
			},
		});
	});

	return (
		<fieldset
			ref={ref}
			className={toggleGroupClassName(className)}
			style={style}
			{...rest}
			onKeyDown={handleKeyDown}
		>
			{label && (
				<legend id={groupId} className={toggleLegendClassName()}>
					{label}
				</legend>
			)}
			<div className={toggleStackClassName(orientation)}>
				{options.map((option) => (
					<Checkbox
						key={option.value}
						label={option.label}
						checked={value.includes(option.value)}
						disabled={disabled}
						readOnly={readOnly}
						size={size}
						labelSide={labelSide}
						onChange={(event) => handleCheckboxChange(option.value, event.target.checked)}
					/>
				))}
			</div>
		</fieldset>
	);
});

CheckboxGroup.displayName = 'CheckboxGroup';
