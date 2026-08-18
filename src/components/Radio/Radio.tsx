import type {
	RadioProps,
	RadioGroupProps,
} from './Radio.types';
export type {
	RadioProps,
	RadioGroupProps,
} from './Radio.types';

import React, {useId, forwardRef} from 'react';
import {
	ToggleControlBase,
	toggleGroupClassName,
	toggleLegendClassName,
	toggleStackClassName,
} from '../../base/ToggleControlBase';
import {handleRovingFocusKeyDown} from '../../utils/keyboard';
import {composeEventHandlers} from '../../utils/composeEvents';

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
		className = '',
		id: providedId,
		disabled,
		readOnly,
		size = 'md',
		onChange,
		onClick,
		...props
	},
	ref,
) {
	const generatedId = useId();
	const id = providedId || generatedId;
	const isReadOnly = !!readOnly && !disabled;

	return (
		<ToggleControlBase
			id={id}
			controlType='radio'
			size={size}
			className={className}
			readOnly={isReadOnly}
			label={label}
			input={(
				<input
					ref={ref}
					type='radio'
					id={id}
					disabled={disabled}
					{...props}
					aria-readonly={isReadOnly || undefined}
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
		className,
		style,
		readOnly = false,
		disabled = false,
		size = 'md',
		onKeyDown,
		...rest
	},
	ref,
) {
	const groupId = useId();

	const handleKeyDown = composeEventHandlers(onKeyDown, (event: React.KeyboardEvent<HTMLFieldSetElement>) => {
		if (readOnly || disabled) return;

		const inputs = Array.from(
			event.currentTarget.querySelectorAll<HTMLInputElement>('input[type="radio"]')
		);
		const currentIndex = inputs.indexOf(document.activeElement as HTMLInputElement);

		handleRovingFocusKeyDown(event, {
			currentIndex,
			length: inputs.length,
			orientation: orientation === 'horizontal' ? 'horizontal' : 'vertical',
			onMove: (nextIndex) => {
				inputs[nextIndex].focus();
				onChange(options[nextIndex].value);
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
					<Radio
						key={option.value}
						name={name}
						value={option.value}
						label={option.label}
						checked={value === option.value}
						disabled={disabled}
						readOnly={readOnly}
						size={size}
						onChange={() => onChange(option.value)}
					/>
				))}
			</div>
		</fieldset>
	);
});

RadioGroup.displayName = 'RadioGroup';
