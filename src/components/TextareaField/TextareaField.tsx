import type {TextareaFieldProps} from './TextareaField.types';
export type {
	TextareaFieldProps,
} from './TextareaField.types';

import React, {useId, forwardRef, useRef, useCallback, useLayoutEffect, useState} from 'react';
import styles from './TextareaField.module.css';
import {adjustElementHeight, getTextareaMinHeightPx} from '../../utils/autoHeight';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {FieldBase, fieldSurfaceClassName} from '../../base/FieldBase';

/**
 * Многострочное поле с авто-ростом по контенту и тем же API, что у TextField.
 *
 * @component
 * @example
 * <TextareaField label="Комментарий" value={note} onChange={(e) => setNote(e.target.value)} />
 */
export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function TextareaField(
	{
		label,
		size = 'md',
		width = 'full',
		labelPlacement = 'inline',
		prefix,
		postfix,
		wrapperClassName = '',
		className = '',
		id: providedId,
		placeholder: placeholderProp = ' ',
		disabled,
		readOnly,
		error,
		helperText,
		minRows = 1,
		maxHeight,
		autoResize = true,
		rows,
		value,
		defaultValue,
		onChange,
		onFocus,
		onBlur,
		onClear,
		clearLabel,
		style,
		...props
	},
	ref,
) {
	const generatedId = useId();
	const id = providedId || generatedId;
	const isReadOnly = !!readOnly && !disabled;
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const [focused, setFocused] = useState(false);
	const [uncontrolledValue, setUncontrolledValue] = useState(
		defaultValue !== undefined ? String(defaultValue) : ''
	);

	const isControlled = value !== undefined;
	const currentValue = isControlled ? String(value) : uncontrolledValue;
	const hasValue = currentValue.length > 0;
	const showPlaceholder = labelPlacement !== 'inline';
	const visiblePlaceholder =
		placeholderProp && placeholderProp.trim() !== ''
			? placeholderProp
			: label;
	const placeholder = showPlaceholder
		? (focused || hasValue ? '' : visiblePlaceholder)
		: ' ';

	const setTextareaRef = useCallback((node: HTMLTextAreaElement | null) => {
		textareaRef.current = node;
		if (typeof ref === 'function') {
			ref(node);
		} else if (ref) {
			ref.current = node;
		}
	}, [ref]);

	const adjustHeight = useCallback(() => {
		const element = textareaRef.current;
		if (!element || !autoResize) return;

		adjustElementHeight(element, {
			minHeightPx: getTextareaMinHeightPx(element, minRows),
			maxHeight,
		});
	}, [autoResize, maxHeight, minRows]);

	useLayoutEffect(() => {
		adjustHeight();
	}, [
		adjustHeight,
		value,
		defaultValue,
		uncontrolledValue,
	]);

	useLayoutEffect(() => {
		if (!autoResize) return undefined;

		const element = textareaRef.current;
		if (!element || typeof ResizeObserver === 'undefined') return undefined;

		const observer = new ResizeObserver(() => {
			adjustHeight();
		});

		observer.observe(element);
		return () => observer.disconnect();
	}, [adjustHeight, autoResize]);

	const handleClear = useCallback(() => {
		if (!isControlled) {
			setUncontrolledValue('');
		}
		onClear?.();
		requestAnimationFrame(adjustHeight);
	}, [adjustHeight, isControlled, onClear]);

	return (
		<FieldBase.Layout
			label={label}
			size={size}
			width={width}
			labelPlacement={labelPlacement}
			error={error}
			helperText={helperText}
			disabled={!!disabled}
			readOnly={isReadOnly}
			hasValue={hasValue}
			focused={focused}
			className={cn(
				wrapperClassName,
				labelPlacement !== 'inline' && styles.outsideChrome,
			)}
			prefix={prefix}
			postfix={postfix}
			onClear={onClear ? handleClear : undefined}
			clearLabel={clearLabel}
			id={id}
			control={(
				<textarea
					ref={setTextareaRef}
					id={id}
					disabled={disabled}
					readOnly={isReadOnly}
					aria-readonly={isReadOnly || undefined}
					rows={autoResize ? 1 : (rows ?? minRows)}
					className={cn(
						fieldSurfaceClassName({readOnly: isReadOnly}),
						styles.textareaElement,
						autoResize ? styles.textareaAutoResize : '',
						className,
					)}
					placeholder={placeholder}
					{...(isControlled
						? {value}
						: {value: uncontrolledValue})}
					onChange={composeEventHandlers(onChange, (event) => {
						if (!isControlled) {
							setUncontrolledValue(event.target.value);
						}
						requestAnimationFrame(adjustHeight);
					})}
					onFocus={composeEventHandlers(onFocus, () => {
						setFocused(true);
					})}
					onBlur={composeEventHandlers(onBlur, () => {
						setFocused(false);
					})}
					style={style}
					{...props}
				/>
			)}
		/>
	);
});

TextareaField.displayName = 'TextareaField';
