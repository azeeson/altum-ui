import type {FieldLabelProps} from './FieldLabel.types';
export type {
	FieldLabelLayout,
	FieldLabelAlign,
	FieldLabelJustify,
	FieldLabelProps,
} from './FieldLabel.types';

import type {CSSProperties} from 'react';
import {toCssSize} from '../../core/utils/cssSize';
import {useFallbackId} from '../../hooks/useFallbackId';
import styles from './FieldLabel.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Обёртка «подпись + контент» для полей формы в vertical и horizontal раскладках.
 *
 * @component
 * @example
 * <FieldLabel label="Эл. почта" htmlFor="email">
 *   <TextField id="email" label="Эл. почта" />
 * </FieldLabel>
 */
export function FieldLabel({
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
	rootRef,
	...rest
}: FieldLabelProps) {
	const uid = useFallbackId(providedId);
	const labelledBy = htmlFor ? undefined : uid;

	return (
		<div
			{...rest}
			ref={rootRef}
			className={cn(styles.root, className)}
			data-layout={layout !== 'vertical' ? layout : undefined}
			data-size={size !== 'md' ? size : undefined}
			data-align={align !== 'center' ? align : undefined}
			data-justify={justify !== 'start' ? justify : undefined}
			data-fixed={labelWidth !== undefined ? '' : undefined}
			style={{
				...(labelWidth !== undefined
					? {'--altum-field-label-width': toCssSize(labelWidth)}
					: null),
				...style,
			} as CSSProperties}
		>
			{htmlFor ? (
				<label
					htmlFor={htmlFor}
					className={cn(styles.label, labelClassName)}
				>
					{label}
				</label>
			) : (
				<span
					id={labelledBy}
					className={cn(styles.label, labelClassName)}
				>
					{label}
				</span>
			)}
			<div
				className={cn(styles.content, contentClassName)}
				aria-labelledby={labelledBy}
			>
				{children}
			</div>
		</div>
	);
}
