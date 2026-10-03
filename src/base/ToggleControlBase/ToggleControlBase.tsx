import type {ToggleControlBaseProps} from './ToggleControlBase.types';
import {cn} from '../../core/utils/cn';
import {useFallbackId} from '../../hooks/useFallbackId';
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
export const ToggleControlBase = ({
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
	inputRef,
	labelProps,
	onChange,
	onClick,
	...inputProps
}: ToggleControlBaseProps) => {
	const id = useFallbackId(providedId || undefined);
	const hasLabel = !labelHidden && label != null && label !== false && label !== '';
	return (
		<label
			{...labelProps}
			htmlFor={id}
			className={cn(styles.root, className)}
			style={style}
			data-size={size !== 'md' ? size : undefined}
			data-align={align !== 'center' ? align : undefined}
			data-label-side={labelSide !== 'end' ? labelSide : undefined}
		>
			<input
				ref={inputRef}
				id={id}
				className={cn(styles.input, inputClassName)}
				disabled={disabled}
				aria-readonly={readOnly || undefined}
				{...inputProps}
				onChange={(e) => {
					if (readOnly) { e.preventDefault(); return; }
					onChange?.(e);
				}}
				onClick={(e) => {
					if (readOnly) { e.preventDefault(); return; }
					onClick?.(e);
				}}
			/>
			<span className={cn(styles.box, boxClassName)}>
				{boxContent}
			</span>
			{hasLabel ? <span className={cn(styles.labelText, labelClassName)}>
				{label}
			</span> : null}
		</label>
	);
};
