import type {TextControlProps} from './TextControl.types';
export type {TextControlProps} from './TextControl.types';

import {forwardRef, useRef, type CSSProperties, type ChangeEventHandler, type FocusEventHandler} from 'react';
import {
	FieldBase,
	fieldSurfaceClassName,
	useFieldControlAttrs,
} from '../FieldBase';
import {useFieldControl} from '../../hooks/useFieldControl';
import {useAutoResize} from '../../hooks/useAutoResize';
import {composeEventHandlers} from '../../utils/composeEvents';
import {composeRefs} from '../../utils/composeRefs';
import {cn} from '../../utils/cn';

interface SurfaceProps {
	as: 'input' | 'textarea';
	rest?: object;
	className?: string;
	type?: string;
	disabled?: boolean;
	readOnly?: boolean;
	value?: string | number | readonly string[];
	placeholder?: string;
	rows?: number;
	style?: CSSProperties;
	keepPlaceholder?: boolean;
	autoResize?: boolean;
	ariaDescribedBy?: string;
	onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	onFocus?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

const TextControlSurface = forwardRef<HTMLElement, SurfaceProps>(function TextControlSurface(
	{
		as: Tag,
		rest,
		className,
		type,
		disabled,
		readOnly,
		value,
		placeholder,
		rows,
		style,
		onChange,
		onFocus,
		onBlur,
		keepPlaceholder,
		autoResize,
		ariaDescribedBy,
	},
	ref,
) {
	const attrs = useFieldControlAttrs({'aria-describedby': ariaDescribedBy});
	return (
		<Tag
			ref={ref as never}
			{...rest}
			{...attrs}
			type={Tag === 'textarea' ? undefined : type}
			disabled={disabled}
			readOnly={readOnly}
			aria-readonly={readOnly || undefined}
			value={value}
			placeholder={placeholder}
			rows={rows}
			style={style}
			className={cn(
				fieldSurfaceClassName({
					readOnly,
					keepPlaceholder,
					autoResize,
				}),
				className,
			)}
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onBlur}
		/>
	);
});

TextControlSurface.displayName = 'TextControl.Surface';

/**
 * FieldBase + нативный `input`/`textarea`. Продукты — тонкие обёртки.
 *
 * @component
 * @example
 * <TextControl as="input" label="Имя" />
 */
export const TextControl = forwardRef<
	HTMLInputElement | HTMLTextAreaElement,
	TextControlProps
>(function TextControl(
	{
		as = 'input',
		label,
		size = 'md',
		width = 'full',
		labelPlacement = 'inline',
		prefix,
		postfix,
		wrapperClassName = '',
		className = '',
		id: providedId,
		placeholder = ' ',
		type = 'text',
		disabled,
		readOnly,
		error,
		helperText,
		footer,
		active,
		value,
		defaultValue,
		onChange,
		onFocus,
		onBlur,
		onClear,
		clearLabel,
		keepPlaceholder = false,
		controlOverlay,
		minRows = 1,
		maxHeight,
		autoResize = true,
		rows,
		style,
		'aria-describedby': ariaDescribedBy,
		...props
	},
	ref,
) {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const isTextarea = as === 'textarea';
	const field = useFieldControl({
		id: providedId,
		value,
		defaultValue,
		disabled,
		readOnly,
		label,
		labelPlacement,
		placeholder,
		keepPlaceholder,
		onChange: onChange as never,
		onFocus: onFocus as never,
		onBlur: onBlur as never,
		onClear,
	});
	const adjustHeight = useAutoResize(textareaRef, {
		enabled: isTextarea && autoResize,
		minRows,
		maxHeight,
		value: field.currentValue,
	});

	return (
		<FieldBase
			label={label}
			size={size}
			width={width}
			labelPlacement={labelPlacement}
			error={error}
			helperText={helperText}
			footer={footer}
			disabled={!!disabled}
			readOnly={field.isReadOnly}
			hasValue={!field.isEmpty}
			open={labelPlacement === 'inline' && !!active}
			focused={field.focused}
			className={wrapperClassName}
			prefix={prefix}
			postfix={postfix}
			onClear={onClear ? () => {
				field.handleClear();
				if (isTextarea) requestAnimationFrame(adjustHeight);
			} : undefined}
			clearLabel={clearLabel}
			id={field.id}
			controlOverlay={controlOverlay}
		>
			<TextControlSurface
				rest={props}
				as={as}
				ref={isTextarea ? composeRefs(ref, textareaRef) : ref}
				type={type}
				className={className}
				disabled={disabled}
				readOnly={field.isReadOnly}
				keepPlaceholder={keepPlaceholder}
				autoResize={isTextarea && autoResize}
				ariaDescribedBy={ariaDescribedBy}
				placeholder={field.placeholder}
				value={field.isControlled ? value : field.currentValue}
				rows={isTextarea ? (autoResize ? 1 : (rows ?? minRows)) : undefined}
				style={style}
				onChange={composeEventHandlers(field.onChange, () => {
					if (isTextarea && autoResize) requestAnimationFrame(adjustHeight);
				})}
				onFocus={field.onFocus}
				onBlur={field.onBlur}
			/>
		</FieldBase>
	);
});

TextControl.displayName = 'TextControl';
