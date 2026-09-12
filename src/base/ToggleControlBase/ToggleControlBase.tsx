import {forwardRef, useId} from 'react';
import type {ToggleControlBaseProps} from './ToggleControlBase.types';
import {cn} from '../../utils/cn';
import {preventWhen} from '../../utils/preventWhen';
import styles from './ToggleControlBase.module.css';

export type {
	ToggleControlAlign,
	ToggleControlBaseProps,
} from './ToggleControlBase.types';

/**
 * Каркас тоггла: `<label>` + скрытый нативный input + визуальный box.
 * Chrome бокса навешивает продукт.
 *
 * @component
 * @example
 * <ToggleControlBase type="checkbox" label="Согласен" checked={on} onChange={...} />
 */
export const ToggleControlBase = forwardRef<HTMLInputElement, ToggleControlBaseProps>(
	function ToggleControlBase(
		{
			id: providedId,
			size = 'md',
			align = 'center',
			boxClassName,
			labelClassName,
			inputClassName,
			labelSide = 'end',
			readOnly = false,
			disabled,
			label,
			labelHidden = false,
			boxContent,
			className,
			style,
			onChange,
			onClick,
			...rest
		},
		ref,
	) {
		const generatedId = useId();
		const id = providedId || generatedId;
		const isReadOnly = !!readOnly && !disabled;
		const hasLabel = !labelHidden && label != null && label !== false && label !== '';

		return (
			<label
				className={cn(styles.root, className)}
				style={style}
				htmlFor={id}
				data-size={size}
				data-align={align}
				data-label-side={labelSide}
			>
				<input
					ref={ref}
					id={id}
					className={cn(styles.input, inputClassName)}
					disabled={disabled}
					aria-readonly={isReadOnly || undefined}
					{...rest}
					onChange={preventWhen(isReadOnly, onChange)}
					onClick={preventWhen(isReadOnly, onClick)}
				/>
				<span className={boxClassName}>
					{boxContent}
				</span>
				{hasLabel ? (
					<span className={cn(styles.labelText, labelClassName)}>
						{label}
					</span>
				) : null}
			</label>
		);
	},
);

ToggleControlBase.displayName = 'ToggleControlBase';
