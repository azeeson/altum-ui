import type {
	TextFieldProps,
} from './TextField.types';
export type {
	FieldLabelPlacement,
	TextFieldProps,
} from './TextField.types';

import React, {useId, forwardRef, useState, useCallback} from 'react';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import styles from './TextField.module.css';
import {FieldBase, fieldSurfaceClassName} from '../../base/FieldBase';

/**
 * Текстовое поле с floating / outside label, prefix/postfix, опциональной очисткой и состояниями ошибки.
 *
 * @component
 * @example
 * <TextField
 *   label="Эл. почта"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   onClear={() => setEmail('')}
 *   width="full"
 * />
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
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
		type = 'text',
		disabled,
		readOnly,
		error,
		helperText,
		active,
		value,
		defaultValue,
		onChange,
		onFocus,
		onBlur,
		onClear,
		clearLabel,
		controlOverlay,
		...props
	},
	ref,
) {
	const generatedId = useId();
	const id = providedId || generatedId;
	const [focused, setFocused] = useState(false);
	const [uncontrolledValue, setUncontrolledValue] = useState(
		defaultValue !== undefined ? String(defaultValue) : ''
	);

	const isReadOnly = !!readOnly && !disabled;
	const isControlled = value !== undefined;
	const currentValue = isControlled ? String(value) : uncontrolledValue;
	const isEmpty = currentValue.length === 0;
	const showPlaceholder = labelPlacement !== 'inline';

	const visiblePlaceholder =
		placeholderProp && placeholderProp.trim() !== ''
			? placeholderProp
			: label;

	const placeholder = showPlaceholder
		? (focused || !isEmpty ? '' : visiblePlaceholder)
		: ' ';

	const handleClear = useCallback(() => {
		if (!isControlled) {
			setUncontrolledValue('');
		}
		onClear?.();
	}, [isControlled, onClear]);

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
			hasValue={!isEmpty}
			open={labelPlacement === 'inline' && !!active}
			focused={focused}
			className={wrapperClassName}
			prefix={prefix}
			postfix={postfix}
			onClear={onClear ? handleClear : undefined}
			clearLabel={clearLabel}
			id={id}
			controlOverlay={controlOverlay}
			control={(
				<input
					ref={ref}
					type={type}
					id={id}
					disabled={disabled}
					readOnly={isReadOnly}
					aria-readonly={isReadOnly || undefined}
					className={cn(
						fieldSurfaceClassName({readOnly: isReadOnly}),
						styles.inputElement,
						className,
					)}
					placeholder={placeholder}
					{...(isControlled
						? {value}
						: {value: uncontrolledValue})}
					onChange={composeEventHandlers(onChange, (e) => {
						if (!isControlled) {
							setUncontrolledValue(e.target.value);
						}
					})}
					onFocus={composeEventHandlers(onFocus, () => {
						setFocused(true);
					})}
					onBlur={composeEventHandlers(onBlur, () => {
						setFocused(false);
					})}
					{...props}
				/>
			)}
		/>
	);
});

TextField.displayName = 'TextField';
