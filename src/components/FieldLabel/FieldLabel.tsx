import type {
	FieldLabelProps,
} from './FieldLabel.types';
export type {
	FieldLabelLayout,
	FieldLabelAlign,
	FieldLabelJustify,
	FieldLabelProps,
} from './FieldLabel.types';

import {forwardRef, type CSSProperties} from 'react';
import {As} from '../../base/As';
import {Flex} from '../../base/Flex';
import {Type} from '../../base/Type';
import {toCssSize} from '../../utils/cssSize';
import {mergeStyles} from '../../utils/mergeStyles';
import {useFallbackId} from '../../hooks/useFallbackId';
import styles from './FieldLabel.module.css';
import {cn} from '../../utils/cn';

const TYPE_SIZE = {
	sm: 'xs',
	md: 'sm',
	lg: 'md',
} as const;

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
	const uid = useFallbackId(providedId);
	const labelledBy = htmlFor ? undefined : uid;
	const horizontal = layout === 'horizontal';

	return (
		<Flex
			ref={ref}
			direction={horizontal ? 'row' : 'column'}
			gap={horizontal ? 'lg' : 'xs'}
			align={horizontal ? align : 'start'}
			justify={horizontal ? justify : 'start'}
			wrap={false}
			className={cn(
				horizontal && styles.horizontal,
				horizontal && justify === 'between' && styles.between,
				horizontal && labelWidth !== undefined && styles.fixed,
				className,
			)}
			style={mergeStyles(
				labelWidth !== undefined
					? ({'--altum-field-label-width': toCssSize(labelWidth)} as CSSProperties)
					: undefined,
				style,
			)}
			{...rest}
		>
			<Type
				as={htmlFor ? 'label' : 'span'}
				id={labelledBy}
				size={TYPE_SIZE[size]}
				weight='medium'
				className={cn(styles.label, labelClassName)}
				{...(htmlFor ? {htmlFor} : null) as object}
			>
				{label}
			</Type>
			<As
				className={cn(styles.content, contentClassName)}
				aria-labelledby={labelledBy}
			>
				{children}
			</As>
		</Flex>
	);
});

FieldLabel.displayName = 'FieldLabel';
