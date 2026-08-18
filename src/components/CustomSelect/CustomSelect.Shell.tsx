import React, {forwardRef} from 'react';
import {FieldBase, fieldSurfaceClassName} from '../../base/FieldBase';
import {composeRefs} from '../../utils/composeRefs';
import {cn} from '../../utils/cn';
import shellStyles from './CustomSelect.Shell.module.css';
import type {
	CustomSelectChevronProps,
	CustomSelectPlaceholderProps,
	CustomSelectShellProps,
} from './CustomSelect.types';

export type {
	CustomSelectChevronProps,
	CustomSelectPlaceholderProps,
	CustomSelectShellProps,
} from './CustomSelect.types';

/**
 * SVG-шеврон для полей с выпадающим списком.
 */
export const CustomSelectChevron = forwardRef<SVGSVGElement, CustomSelectChevronProps>(
	function CustomSelectChevron({
		open = false,
		readOnly = false,
		className,
		arrowClassName = shellStyles.arrow,
		arrowOpenClassName = shellStyles.open,
		readOnlyArrowClassName = shellStyles.readOnly,
		...rest
	}, ref) {
		return (
			<svg
				ref={ref}
				className={cn(
					arrowClassName,
					open && arrowOpenClassName,
					readOnly && readOnlyArrowClassName,
					className,
				)}
				viewBox='0 0 24 24'
				{...rest}
				aria-hidden='true'
			>
				<path d='M6 9l6 6 6-6' />
			</svg>
		);
	},
);

CustomSelectChevron.displayName = 'CustomSelect.Chevron';

/**
 * Placeholder-текст внутри trigger dropdown-поля.
 */
export const CustomSelectPlaceholder = forwardRef<HTMLSpanElement, CustomSelectPlaceholderProps>(
	function CustomSelectPlaceholder({
		children,
		className,
		...rest
	}, ref) {
		return (
			<span
				ref={ref}
				className={cn(shellStyles.placeholder, className)}
				{...rest}
			>
				{children}
			</span>
		);
	},
);

CustomSelectPlaceholder.displayName = 'CustomSelect.Placeholder';

/**
 * FieldBase + button trigger + chevron для Select.
 */
export const CustomSelectShell = forwardRef<HTMLDivElement, CustomSelectShellProps>(
	function CustomSelectShell(
		{
			triggerRef,
			triggerAttrs,
			id,
			label,
			size = 'md',
			labelPlacement = 'inline',
			width = 'full',
			error,
			helperText,
			disabled = false,
			readOnly = false,
			open,
			isInteractive,
			hasValue,
			className = '',
			popupRole = 'listbox',
			children,
			sizerContent = '\u00a0',
			prefix,
			onClear,
			clearLabel,
			triggerClassName = '',
			triggerAs = 'button',
			triggerProps,
			wrapperProps,
			...rest
		},
		forwardedRef,
	) {
		const {
			className: slotClassName,
			...buttonTriggerAttrs
		} = triggerAttrs;

		const triggerContent = (
			<>
				<span className={shellStyles.triggerSizer} aria-hidden='true'>
					{sizerContent}
				</span>
				<span className={shellStyles.triggerText}>
					{children}
				</span>
			</>
		);
		const triggerHandlers = {
			onClick: (event: React.MouseEvent<HTMLElement>) => {
				if (!isInteractive) {
					event.preventDefault();
					return;
				}
				buttonTriggerAttrs.onClick?.(event);
			},
			onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
				if (!isInteractive) return;
				buttonTriggerAttrs.onKeyDown?.(event);
			},
		};

		const control = triggerAs === 'button' ? (
			<button
				{...buttonTriggerAttrs}
				{...triggerProps}
				id={id}
				type='button'
				disabled={disabled}
				aria-readonly={readOnly || undefined}
				aria-haspopup={popupRole}
				aria-expanded={open}
				className={cn(
					fieldSurfaceClassName({readOnly}),
					shellStyles.trigger,
					triggerClassName,
				)}
				{...triggerHandlers}
			>
				{triggerContent}
			</button>
		) : (
			<div
				{...buttonTriggerAttrs}
				{...triggerProps}
				id={id}
				role='combobox'
				tabIndex={disabled ? undefined : 0}
				aria-disabled={disabled || undefined}
				aria-readonly={readOnly || undefined}
				aria-haspopup={popupRole}
				aria-expanded={open}
				className={cn(
					fieldSurfaceClassName({readOnly}),
					shellStyles.trigger,
					triggerClassName,
				)}
				{...triggerHandlers}
			>
				{triggerContent}
			</div>
		);

		return (
			<FieldBase.Layout
				label={label}
				labelPlacement={labelPlacement}
				size={size}
				width={width}
				error={error}
				helperText={helperText}
				disabled={disabled}
				readOnly={readOnly}
				prefix={prefix}
				postfix={(
					<FieldBase.Icon>
						<CustomSelectChevron open={open} readOnly={readOnly} />
					</FieldBase.Icon>
				)}
				onClear={onClear}
				clearLabel={clearLabel}
				id={id}
				hasValue={hasValue}
				open={open}
				className={cn(
					slotClassName,
					labelPlacement === 'inline' && shellStyles.placementInline,
					labelPlacement !== 'inline' && shellStyles.placementFlush,
					className,
				)}
				control={control}
				ref={composeRefs(
					forwardedRef,
					triggerRef as React.Ref<HTMLDivElement>,
				)}
				rootProps={{
					...rest,
					...wrapperProps,
				}}
			/>
		);
	},
);

CustomSelectShell.displayName = 'CustomSelect.Shell';
