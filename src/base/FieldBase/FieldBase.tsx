import type {
	ControlSize,
	FieldWidth,
	FieldLabelPlacement,
	FieldBaseRootProps,
	FieldBaseLabelProps,
	FieldBaseControlProps,
	FieldBasePrefixProps,
	FieldBasePostfixProps,
	FieldBaseButtonProps,
	FieldBaseIconProps,
	FieldBaseClearProps,
	FieldBaseErrorProps,
	FieldBaseHelperProps,
	FieldBaseProps,
} from './FieldBase.types';
export type {
	ControlSize,
	FieldWidth,
	FieldLabelPlacement,
	FieldBaseRootProps,
	FieldBaseLabelProps,
	FieldBaseControlProps,
	FieldBasePrefixProps,
	FieldBasePostfixProps,
	FieldBaseButtonProps,
	FieldBaseIconProps,
	FieldBaseClearProps,
	FieldBaseErrorProps,
	FieldBaseHelperProps,
	FieldBaseProps,
} from './FieldBase.types';

import React, {createContext, forwardRef, useContext} from 'react';
import styles from './FieldBase.module.css';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {ButtonBase} from '../ButtonBase';
import {IconCross} from '../../icons/icons/IconCross';
import {useLocale} from '../../locales';

/**
 * Хешированные классы поверхности контрола. Продукты не импортируют CSS-модуль базы.
 */
export function fieldSurfaceClassName(options?: {readOnly?: boolean}): string {
	return cn(
		styles.controlSurface,
		options?.readOnly ? styles.controlSurfaceReadOnly : '',
	);
}

const WIDTH_CLASS: Record<FieldWidth, string> = {
	xxs: styles.widthXxs,
	xs: styles.widthXs,
	sm: styles.widthSm,
	md: styles.widthMd,
	lg: styles.widthLg,
	xl: styles.widthXl,
	full: styles.widthFull,
};

/** ButtonIcon size под высоту chrome: md/lg → sm. */
function affixButtonSize(fieldSize: ControlSize): ControlSize {
	if (fieldSize === 'sm') return fieldSize;
	return 'sm';
}

interface FieldBaseContextValue {
	labelPlacement: FieldLabelPlacement;
	size: ControlSize;
	disabled: boolean;
	readOnly: boolean;
	hasValue: boolean;
}

const FieldBaseContext = createContext<FieldBaseContextValue | null>(null);

function useFieldBase(component: string): FieldBaseContextValue {
	const context = useContext(FieldBaseContext);
	if (!context) throw new Error(`${component} должен использоваться внутри FieldBase.Root`);
	return context;
}

const FieldBaseRoot = forwardRef<HTMLDivElement, FieldBaseRootProps>(function FieldBaseRoot(
	{
		children,
		size = 'md',
		width = 'full',
		labelPlacement = 'inline',
		error,
		helperText: _helperText,
		disabled = false,
		readOnly = false,
		hasValue = false,
		open = false,
		focused = false,
		className,
		style,
		...rest
	},
	ref,
) {
	const hasError = !!error;

	const rootClassName = cn(
		styles.root,
		size !== 'md' ? styles[size] : '',
		WIDTH_CLASS[width],
		labelPlacement === 'outside' ? styles.placementOutside : '',
		labelPlacement === 'none' ? styles.placementNone : '',
		hasError ? styles.error : '',
		disabled ? styles.disabled : '',
		readOnly ? styles.readOnly : '',
		hasValue ? styles.hasValue : '',
		open ? styles.isOpen : '',
		focused ? styles.focused : '',
		className,
	);

	return (
		<FieldBaseContext.Provider value={{
			labelPlacement,
			size,
			disabled,
			readOnly,
			hasValue
		}}
		>
			<div
				ref={ref}
				className={rootClassName}
				style={style}
				{...rest}
				data-field-size={size}
				data-field-width={width}
				data-label-placement={labelPlacement}
				data-field-disabled={disabled || undefined}
				data-field-error={hasError || undefined}
			>
				{children}
			</div>
		</FieldBaseContext.Provider>
	);
});

FieldBaseRoot.displayName = 'FieldBase.Root';

const FieldBaseLabel = forwardRef<HTMLLabelElement, FieldBaseLabelProps>(function FieldBaseLabel(
	{
		placement,
		className,
		style,
		...props
	},
	ref,
) {
	const {labelPlacement} = useFieldBase('FieldBase.Label');
	const resolvedPlacement = placement ?? labelPlacement;
	if (resolvedPlacement === 'none') return null;
	return (
		<label
			ref={ref}
			className={cn(
				resolvedPlacement === 'outside' ? styles.labelOutside : styles.inputLabel,
				className,
			)}
			{...props}
			style={style}
		/>
	);
});

FieldBaseLabel.displayName = 'FieldBase.Label';

const FieldBaseControl = forwardRef<HTMLDivElement, FieldBaseControlProps>(function FieldBaseControl(
	{className, style, ...props},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.fieldBody, className)}
			style={style}
			{...props}
		/>
	);
});

FieldBaseControl.displayName = 'FieldBase.Control';

const FieldBasePrefix = forwardRef<HTMLSpanElement, FieldBasePrefixProps>(function FieldBasePrefix(
	{className, style, ...props},
	ref,
) {
	return (
		<span
			ref={ref}
			className={cn(styles.prefixWrapper, className)}
			style={style}
			{...props}
		/>
	);
});

FieldBasePrefix.displayName = 'FieldBase.Prefix';

const FieldBasePostfix = forwardRef<HTMLSpanElement, FieldBasePostfixProps>(function FieldBasePostfix(
	{className, style, ...props},
	ref,
) {
	return (
		<span
			ref={ref}
			className={cn(styles.postfixWrapper, className)}
			style={style}
			{...props}
		/>
	);
});

FieldBasePostfix.displayName = 'FieldBase.Postfix';

const FieldBaseButton = forwardRef<HTMLButtonElement, FieldBaseButtonProps>(
	function FieldBaseButton(
		{
			variant = 'ghost',
			size: sizeProp,
			className,
			style,
			...props
		},
		ref,
	) {
		const {size: fieldSize} = useFieldBase('FieldBase.Button');
		const {icon, children, ...buttonProps} = props;
		return (
			<ButtonBase
				ref={ref}
				variant={variant}
				size={sizeProp ?? affixButtonSize(fieldSize)}
				className={cn(styles.affixButton, className)}
				style={style}
				{...buttonProps}
			>
				{icon ?? children}
			</ButtonBase>
		);
	},
);

FieldBaseButton.displayName = 'FieldBase.Button';

const FieldBaseIcon = forwardRef<HTMLSpanElement, FieldBaseIconProps>(function FieldBaseIcon(
	{
		className,
		style,
		children,
		...props
	},
	ref,
) {
	return (
		<span
			ref={ref}
			className={cn(styles.affixIcon, className)}
			style={style}
			{...props}
		>
			{children}
		</span>
	);
});

FieldBaseIcon.displayName = 'FieldBase.Icon';

const FieldBaseClear = forwardRef<HTMLButtonElement, FieldBaseClearProps>(function FieldBaseClear(
	{
		visible,
		className,
		style,
		onClick,
		onMouseDown,
		...props
	},
	ref,
) {
	const {t} = useLocale();
	const {disabled, readOnly, hasValue} = useFieldBase('FieldBase.Clear');
	const showClear = visible ?? (hasValue && !disabled && !readOnly);
	return (
		<FieldBaseButton
			ref={ref}
			{...props}
			type={props.type ?? 'button'}
			className={cn(styles.clearBtn, !showClear ? styles.clearBtnHidden : '', className)}
			style={style}
			aria-label={props['aria-label'] ?? t('common.clear')}
			aria-hidden={!showClear}
			tabIndex={showClear ? props.tabIndex ?? 0 : -1}
			icon={<IconCross size={12} aria-hidden />}
			onClick={(event) => {
				if (!showClear) return;
				composeEventHandlers(onClick, (clickEvent) => {
					clickEvent.preventDefault();
					clickEvent.stopPropagation();
				})(event);
			}}
			onMouseDown={composeEventHandlers(onMouseDown, (event) => {
				event.preventDefault();
			})}
			data-field-clear-btn=''
		/>
	);
});

FieldBaseClear.displayName = 'FieldBase.Clear';

const FieldBaseError = forwardRef<HTMLParagraphElement, FieldBaseErrorProps>(function FieldBaseError(
	{error, className, id, ...rest},
	ref,
) {
	if (typeof error !== 'string') return null;
	return (
		<p
			ref={ref}
			className={cn(styles.errorText, className)}
			id={id}
			{...rest}
			data-type='error'
			role='alert'
		>
			{error}
		</p>
	);
});

FieldBaseError.displayName = 'FieldBase.Error';

const FieldBaseHelper = forwardRef<HTMLSpanElement, FieldBaseHelperProps>(function FieldBaseHelper(
	{
		children,
		helperText,
		className,
		style,
		id,
		...rest
	},
	ref,
) {
	const text = children ?? helperText;
	if (!text) return null;
	return (
		<span
			ref={ref}
			className={cn(styles.helperText, className)}
			style={style}
			id={id}
			{...rest}
		>
			{text}
		</span>
	);
});

FieldBaseHelper.displayName = 'FieldBase.Helper';

interface FieldBaseLayoutProps extends FieldBaseProps {
	id: string;
	hasValue: boolean;
	focused?: boolean;
	open?: boolean;
	className?: string;
	control: React.ReactNode;
	/** Абсолютный слой поверх control (например маска MaskedField). */
	controlOverlay?: React.ReactNode;
	onClear?: () => void;
	labelId?: string;
	rootProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'children'>;
	ref?: React.Ref<HTMLDivElement>;
}

const FieldBaseLayout = forwardRef<HTMLDivElement, FieldBaseLayoutProps>(
	function FieldBaseLayout(
		{
			label,
			labelPlacement = 'inline',
			size = 'md',
			width = 'full',
			error,
			helperText,
			disabled = false,
			readOnly = false,
			prefix,
			postfix,
			onClear,
			clearLabel,
			id,
			hasValue,
			focused = false,
			open = false,
			className,
			control,
			controlOverlay,
			labelId,
			rootProps,
		},
		ref,
	) {
		const errorId = typeof error === 'string' ? `${id}-error` : undefined;
		const helperId = helperText ? `${id}-helper` : undefined;
		const existingAriaLabel = React.isValidElement(control)
			? (control.props as {'aria-label'?: string})['aria-label']
			: undefined;
		const existingDescribedBy = React.isValidElement(control)
			? (control.props as {'aria-describedby'?: string})['aria-describedby']
			: undefined;
		const describedBy = [errorId, helperId, existingDescribedBy]
			.filter(Boolean)
			.join(' ')
		|| undefined;

		const controlNode = React.isValidElement(control)
			? React.cloneElement(
				control as React.ReactElement<Record<string, unknown>>,
				{
					'aria-invalid': error ? true : undefined,
					'aria-describedby': describedBy,
					'aria-label': existingAriaLabel ?? (
						labelPlacement === 'none' && label ? label : undefined
					),
				},
			)
			: control;

		return (
			<FieldBaseRoot
				ref={ref}
				size={size}
				width={width}
				labelPlacement={labelPlacement}
				error={error}
				helperText={helperText}
				disabled={disabled}
				readOnly={readOnly}
				hasValue={hasValue}
				open={open}
				focused={focused}
				className={className}
				{...rootProps}
			>
				{labelPlacement === 'outside' && (
					<FieldBaseLabel
						placement='outside'
						htmlFor={id}
						id={labelId}
					>
						{label}
					</FieldBaseLabel>
				)}
				<FieldBaseControl>
					{prefix && (
						<FieldBasePrefix>
							{prefix}
						</FieldBasePrefix>
					)}
					{controlNode}
					{controlOverlay}
					{labelPlacement === 'inline' && (
						<FieldBaseLabel htmlFor={id} id={labelId}>
							{label}
						</FieldBaseLabel>
					)}
					{(onClear || postfix) && (
						<FieldBasePostfix>
							{onClear && (
								<FieldBaseClear aria-label={clearLabel} onClick={onClear} />
							)}
							{postfix}
						</FieldBasePostfix>
					)}
				</FieldBaseControl>
				{helperText ? (
					<FieldBaseHelper id={helperId} helperText={helperText} />
				) : null}
				<FieldBaseError id={errorId} error={error} />
			</FieldBaseRoot>
		);
	}
);

FieldBaseLayout.displayName = 'FieldBase.Layout';

/**
 * Составная оболочка поля: label / prefix / control / postfix / clear / error.
 *
 * @component
 * @example
 * <FieldBase.Root width="md" hasValue={Boolean(email)}>
 *   <FieldBase.Control>
 *     <input id={id} />
 *     <FieldBase.Label htmlFor={id}>Эл. почта</FieldBase.Label>
 *   </FieldBase.Control>
 * </FieldBase.Root>
 */
export const FieldBase = Object.assign(FieldBaseRoot, {
	Root: FieldBaseRoot,
	Label: FieldBaseLabel,
	Prefix: FieldBasePrefix,
	Control: FieldBaseControl,
	Postfix: FieldBasePostfix,
	Button: FieldBaseButton,
	Icon: FieldBaseIcon,
	Clear: FieldBaseClear,
	Error: FieldBaseError,
	Helper: FieldBaseHelper,
	Layout: FieldBaseLayout,
});


