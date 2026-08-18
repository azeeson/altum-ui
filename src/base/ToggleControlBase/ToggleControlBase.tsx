import {
	cloneElement,
	forwardRef,
	isValidElement,
} from 'react';
import type {ToggleControlBaseProps} from './ToggleControlBase.types';
import {cn} from '../../utils/cn';
import styles from './ToggleControlBase.module.css';

export type {
	ToggleControlType,
	ToggleControlAlign,
	ToggleControlBaseProps,
} from './ToggleControlBase.types';

/**
 * Хешированный класс fieldset группы Checkbox / Radio.
 */
export function toggleGroupClassName(className?: string): string {
	return cn(styles.groupFieldset, className);
}

/**
 * Хешированный класс legend группы.
 */
export function toggleLegendClassName(className?: string): string {
	return cn(styles.groupLegend, className);
}

/**
 * Стек опций в группе (`vertical` | `horizontal`).
 */
export function toggleStackClassName(
	orientation: 'horizontal' | 'vertical' = 'vertical',
	className?: string,
): string {
	return cn(
		styles.controlsStack,
		orientation === 'horizontal' ? styles.horizontal : '',
		className,
	);
}

const TYPE_CLASS: Record<NonNullable<ToggleControlBaseProps['controlType']>, string> = {
	checkbox: styles.checkboxType,
	task: styles.taskType,
	radio: styles.radioType,
	switch: styles.switchType,
};

/**
 * Каркас тоггла: `<label>` + скрытый нативный input + визуальный box.
 * Продукты не импортируют CSS-модуль базы.
 *
 * @component
 * @example
 * <ToggleControlBase id={id} label="Согласен" input={<input id={id} type="checkbox" />} />
 */
export const ToggleControlBase = forwardRef<HTMLLabelElement, ToggleControlBaseProps>(
	function ToggleControlBase(
		{
			id,
			controlType = 'checkbox',
			size = 'md',
			align = 'center',
			boxClassName,
			labelClassName,
			labelSide = 'end',
			readOnly = false,
			disabled: _disabled,
			checked = false,
			label,
			labelHidden = false,
			input,
			boxContent,
			className,
			style,
			...rest
		},
		ref,
	) {
		const hasLabel = !labelHidden && label != null && label !== false && label !== '';

		const labelEl = hasLabel ? (
			<span className={cn(styles.labelText, labelClassName)}>
				{label}
			</span>
		) : null;

		const inputNode = isValidElement<{className?: string}>(input)
			? cloneElement(input, {
				className: cn(styles.input, input.props.className),
			})
			: input;

		return (
			<label
				ref={ref}
				className={cn(
					styles.root,
					TYPE_CLASS[controlType],
					size !== 'md' ? styles[size] : '',
					labelSide === 'start' ? styles.labelStart : '',
					align === 'start' ? styles.alignStart : styles.alignCenter,
					controlType === 'task' && checked ? styles.checked : '',
					readOnly ? styles.readOnly : '',
					className,
				)}
				style={style}
				{...rest}
				htmlFor={id}
			>
				{labelSide === 'start' && labelEl}
				{inputNode}
				<span
					className={cn(
						controlType === 'switch' ? '' : styles.box,
						boxClassName,
					)}
				>
					{boxContent}
				</span>
				{labelSide === 'end' && labelEl}
			</label>
		);
	},
);

ToggleControlBase.displayName = 'ToggleControlBase';
