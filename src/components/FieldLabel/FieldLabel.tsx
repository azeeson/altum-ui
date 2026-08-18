import type {
	FieldLabelProps,
} from './FieldLabel.types';
export type {
	FieldLabelLayout,
	FieldLabelAlign,
	FieldLabelJustify,
	FieldLabelProps,
} from './FieldLabel.types';

import {forwardRef, useId, type CSSProperties} from 'react';
import {toCssSize} from '../../utils/cssSize';
import styles from './FieldLabel.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';

/**
 * Обёртка «подпись + контент» для полей формы в vertical и horizontal раскладках.
 *
 * @component
 * @example
 * <FieldLabel label="Эл. почта" htmlFor="email">
 *   <TextField id="email" label="Эл. почта" />
 * </FieldLabel>
 */
export const FieldLabel = forwardRef<HTMLDivElement, FieldLabelProps>(function FieldLabel(
	{
		label,
		children,
		layout = 'vertical',
		size = 'md',
		htmlFor,
		labelWidth,
		align = 'center',
		justify = 'start',
		className,
		style,
		labelClassName,
		contentClassName,
		id: providedId,
		...rest
	},
	ref,
) {
	const generatedId = useId();
	const labelId = providedId ?? generatedId;

	const rootClasses = cn(
		styles.fieldLabel,
		styles[size],
		styles[layout],
		layout === 'horizontal' ? styles[`align_${align}`] : '',
		layout === 'horizontal' ? styles[`justify_${justify}`] : '',
		layout === 'horizontal' && labelWidth !== undefined ? styles.fixedLabelWidth : '',
		className,
	);

	const rootStyle = mergeStyles(
		labelWidth !== undefined
			? ({'--altum-field-label-width': toCssSize(labelWidth)} as CSSProperties)
			: undefined,
		style,
	);

	const LabelTag = htmlFor ? 'label' : 'span';

	return (
		<div
			ref={ref}
			className={rootClasses}
			style={rootStyle}
			{...rest}
		>
			<LabelTag
				id={htmlFor ? undefined : labelId}
				htmlFor={htmlFor}
				className={cn(styles.label, labelClassName)}
			>
				{label}
			</LabelTag>
			<div
				className={cn(styles.content, contentClassName)}
				aria-labelledby={htmlFor ? undefined : labelId}
			>
				{children}
			</div>
		</div>
	);
});

FieldLabel.displayName = 'FieldLabel';
