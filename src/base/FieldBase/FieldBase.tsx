import type {
	FieldWidth,
	FieldBaseHostProps,
	FieldBaseButtonProps,
	FieldBaseIconProps,
} from './FieldBase.types';
export type {
	ControlSize,
	FieldWidth,
	FieldLabelPlacement,
	FieldBaseProps,
	FieldBaseHostProps,
	FieldBaseButtonProps,
	FieldBaseIconProps,
} from './FieldBase.types';

import React, {createContext, forwardRef, useMemo} from 'react';
import styles from './FieldBase.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {IconCross} from '../../icons/icons/IconCross';
import {useLocale} from '../../locales/localeContext';
import {useRequiredContext} from '../../hooks/useRequiredContext';
import {FormMessage} from '../../components/FormMessage/FormMessage';

interface FieldControlContextValue {
	id: string;
	invalid: boolean;
	describedBy?: string;
	ariaLabel?: string;
}

const FieldControlContext = createContext<FieldControlContextValue | null>(null);

/**
 * aria/id контрола из оболочки `FieldBase`. Вызывать только у потомка базы.
 *
 * @param extra - Свои `aria-describedby` / `aria-label` (мержатся с полем).
 */
export function useFieldControlAttrs(extra?: {
	'aria-describedby'?: string;
	'aria-label'?: string;
}) {
	const ctx = useRequiredContext(
		FieldControlContext,
		'useFieldControlAttrs должен вызываться внутри FieldBase',
	);
	return {
		id: ctx.id,
		'aria-invalid': ctx.invalid || undefined,
		'aria-describedby': [ctx.describedBy, extra?.['aria-describedby']].filter(Boolean).join(' ')
			|| undefined,
		'aria-label': extra?.['aria-label'] ?? ctx.ariaLabel,
	};
}

/**
 * Хешированные классы поверхности контрола. Продукты не импортируют CSS-модуль базы.
 */
export function fieldSurfaceClassName(options?: {
	readOnly?: boolean;
	/** Показать placeholder (поиск в оверлее). Иначе floating-label прячет его. */
	keepPlaceholder?: boolean;
	autoResize?: boolean;
}): string {
	return cn(
		styles.controlSurface,
		options?.readOnly ? styles.controlSurfaceReadOnly : '',
		options?.keepPlaceholder ? styles.controlSurfaceKeepPlaceholder : '',
		options?.autoResize ? styles.controlSurfaceAutoResize : '',
	);
}

/** Рамка / фон / radius поля — для `.fieldBody` и ячеек PinInput. */
export function fieldChromeClassName(): string {
	return styles.chrome;
}

/** Абсолютный слой поверх control (маска). */
export function fieldOverlayClassName(): string {
	return styles.controlOverlay;
}

const WIDTH_CLASS: Record<FieldWidth, string> = {
	md: '',
	full: styles.widthFull,
};

/**
 * Affix-кнопка внутри prefix/postfix поля.
 *
 * @component
 * @example
 * <TextField postfix={<FieldBaseButton aria-label="Время" icon={<IconClock />} />} />
 */
export const FieldBaseButton = forwardRef<HTMLButtonElement, FieldBaseButtonProps>(
	function FieldBaseButton(
		{
			className,
			icon,
			children,
			type = 'button',
			...props
		},
		ref,
	) {
		return (
			<button
				ref={ref}
				type={type}
				className={cn(unstyled.control, styles.affixButton, className)}
				{...props}
			>
				{icon ?? children}
			</button>
		);
	},
);

FieldBaseButton.displayName = 'FieldBaseButton';

/**
 * Декоративная иконка affix поля.
 *
 * @component
 * @example
 * <TextField prefix={<FieldBaseIcon><IconSearch /></FieldBaseIcon>} />
 */
export const FieldBaseIcon = forwardRef<HTMLSpanElement, FieldBaseIconProps>(
	function FieldBaseIcon(
		{
			className,
			children,
			...props
		},
		ref,
	) {
		return (
			<span
				ref={ref}
				className={cn(styles.affixIcon, className)}
				{...props}
			>
				{children}
			</span>
		);
	},
);

FieldBaseIcon.displayName = 'FieldBaseIcon';

const FieldBaseClear = forwardRef<HTMLButtonElement, {
	visible?: boolean;
	className?: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
	'aria-label'?: string;
}>(function FieldBaseClear(
	{
		visible,
		className,
		onClick,
		onMouseDown,
		...props
	},
	ref,
) {
	const {t} = useLocale();
	const hidden = visible === false;
	const forced = visible === true;
	return (
		<FieldBaseButton
			ref={ref}
			{...props}
			className={cn(styles.clearBtn, hidden ? styles.clearBtnHidden : '', className)}
			aria-label={props['aria-label'] ?? t('common.clear')}
			icon={<IconCross size={12} aria-hidden />}
			onClick={composeEventHandlers(onClick, (event) => {
				event.preventDefault();
				event.stopPropagation();
			})}
			onMouseDown={composeEventHandlers(onMouseDown, (event) => {
				event.preventDefault();
			})}
			data-field-clear-btn=''
			data-visible={forced ? 'true' : undefined}
		/>
	);
});

FieldBaseClear.displayName = 'FieldBaseClear';

/**
 * Оболочка поля: label / prefix / control / postfix / clear / error.
 *
 * @component
 * @example
 * <FieldBase
 *   id={id}
 *   label="Эл. почта"
 *   hasValue={Boolean(email)}
 *   prefix={<FieldBaseIcon><IconUser /></FieldBaseIcon>}
 * >
 *   <input id={id} />
 * </FieldBase>
 */
export const FieldBase = forwardRef<HTMLDivElement, FieldBaseHostProps>(function FieldBase(
	{
		label,
		labelPlacement = 'inline',
		size = 'md',
		width = 'md',
		error,
		helperText,
		footer,
		disabled = false,
		readOnly = false,
		prefix,
		postfix,
		onClear,
		clearLabel,
		id,
		hasValue = false,
		focused = false,
		open = false,
		chrome = true,
		className,
		style,
		children,
		controlOverlay,
		labelId,
		...rest
	},
	ref,
) {
	const hasError = !!error;
	const errorId = typeof error === 'string' ? `${id}-error` : undefined;
	const helperId = helperText && !hasError ? `${id}-helper` : undefined;
	const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;
	const controlCtx = useMemo<FieldControlContextValue>(() => ({
		id,
		invalid: hasError,
		describedBy,
		ariaLabel: labelPlacement === 'none' && label ? label : undefined,
	}), [
		describedBy,
		hasError,
		id,
		label,
		labelPlacement
	]);

	return (
		<div
			ref={ref}
			className={cn(
				styles.root,
				size !== 'md' ? styles[size] : '',
				WIDTH_CLASS[width],
				labelPlacement === 'outside' ? styles.placementOutside : '',
				labelPlacement === 'none' ? styles.placementNone : '',
				chrome ? '' : styles.chromeOff,
				hasError ? styles.error : '',
				disabled ? styles.disabled : '',
				readOnly ? styles.readOnly : '',
				hasValue ? styles.hasValue : '',
				open ? styles.isOpen : '',
				focused ? styles.focused : '',
				className,
			)}
			style={style}
			{...rest}
			data-field-size={size}
			data-field-width={width}
			data-label-placement={labelPlacement}
			data-field-disabled={disabled || undefined}
			data-field-error={hasError || undefined}
		>
			{labelPlacement === 'outside' ? (
				<label
					className={styles.labelOutside}
					htmlFor={id}
					id={labelId}
				>
					{label}
				</label>
			) : null}
			<div className={cn(styles.chrome, styles.fieldBody)} data-field-chrome=''>
				{prefix ? (
					<span className={cn(styles.affix, styles.affixStart)}>
						{prefix}
					</span>
				) : null}
				<FieldControlContext.Provider value={controlCtx}>
					<div className={styles.controlSlot}>
						{children}
						{controlOverlay}
						{labelPlacement === 'inline' ? (
							<label
								className={styles.inputLabel}
								htmlFor={id}
								id={labelId}
							>
								{label}
							</label>
						) : null}
					</div>
				</FieldControlContext.Provider>
				{(onClear || postfix) ? (
					<span className={cn(styles.affix, styles.affixEnd)}>
						{onClear ? (
							<FieldBaseClear aria-label={clearLabel} onClick={onClear} />
						) : null}
						{postfix}
					</span>
				) : null}
			</div>
			{helperText && !hasError ? (
				<FormMessage id={helperId}>
					{helperText}
				</FormMessage>
			) : null}
			{typeof error === 'string' ? (
				<FormMessage variant='error' id={errorId}>
					{error}
				</FormMessage>
			) : null}
			{footer}
		</div>
	);
});

FieldBase.displayName = 'FieldBase';
