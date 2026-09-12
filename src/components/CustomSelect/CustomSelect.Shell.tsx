import React, {forwardRef} from 'react';
import {FieldBase, FieldBaseIcon, fieldSurfaceClassName, useFieldControlAttrs} from '../../base/FieldBase';
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

type TriggerAttrs = Omit<CustomSelectShellProps['triggerAttrs'], 'className'>;

const ShellTrigger = forwardRef<HTMLElement, {
	triggerAs: 'button' | 'div';
	triggerAttrs: TriggerAttrs;
	triggerProps?: CustomSelectShellProps['triggerProps'];
	id: string;
	open: boolean;
	disabled: boolean;
	readOnly: boolean;
	isInteractive: boolean;
	popupRole: NonNullable<CustomSelectShellProps['popupRole']>;
	triggerClassName?: string;
	sizerContent: React.ReactNode;
	children: React.ReactNode;
}>(function ShellTrigger(
	{
		triggerAs,
		triggerAttrs,
		triggerProps,
		id,
		open,
		disabled,
		readOnly,
		isInteractive,
		popupRole,
		triggerClassName,
		sizerContent,
		children,
	},
	ref,
) {
	const a11y = useFieldControlAttrs();
	const isButton = triggerAs === 'button';
	const Tag = triggerAs;
	return (
		<Tag
			ref={ref as never}
			{...triggerAttrs}
			{...triggerProps}
			{...a11y}
			id={id}
			type={isButton ? 'button' : undefined}
			disabled={isButton ? disabled : undefined}
			role={isButton ? undefined : 'combobox'}
			tabIndex={isButton || disabled ? undefined : 0}
			aria-disabled={isButton ? undefined : (disabled || undefined)}
			aria-readonly={readOnly || undefined}
			aria-haspopup={popupRole}
			aria-expanded={open}
			className={cn(
				fieldSurfaceClassName({readOnly}),
				shellStyles.trigger,
				triggerClassName,
			)}
			onClick={(event: React.MouseEvent<HTMLElement>) => {
				if (!isInteractive) {
					event.preventDefault();
					return;
				}
				triggerAttrs.onClick?.(event);
			}}
			onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
				if (!isInteractive) return;
				triggerAttrs.onKeyDown?.(event);
			}}
		>
			<span className={shellStyles.triggerSizer} aria-hidden='true'>
				{sizerContent}
			</span>
			<span className={shellStyles.triggerText}>
				{children}
			</span>
		</Tag>
	);
});

ShellTrigger.displayName = 'CustomSelect.ShellTrigger';

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
			width = 'md',
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
		const {className: slotClassName, ...attrs} = triggerAttrs;
		return (
			<FieldBase
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
					<FieldBaseIcon>
						<CustomSelectChevron open={open} readOnly={readOnly} />
					</FieldBaseIcon>
				)}
				onClear={onClear}
				clearLabel={clearLabel}
				id={id}
				hasValue={hasValue}
				open={open}
				className={cn(
					slotClassName,
					labelPlacement === 'inline' && shellStyles.placementInline,
					width !== 'full' && shellStyles.fitContent,
					className,
				)}
				ref={composeRefs(
					forwardedRef,
					triggerRef as React.Ref<HTMLDivElement>,
				)}
				{...rest}
				{...wrapperProps}
			>
				<ShellTrigger
					triggerAs={triggerAs}
					triggerAttrs={attrs}
					triggerProps={triggerProps}
					id={id}
					open={open}
					disabled={disabled}
					readOnly={readOnly}
					isInteractive={isInteractive}
					popupRole={popupRole}
					triggerClassName={triggerClassName}
					sizerContent={sizerContent}
				>
					{children}
				</ShellTrigger>
			</FieldBase>
		);
	},
);

CustomSelectShell.displayName = 'CustomSelect.Shell';
