import type {
	FieldsetRootProps,
	FieldsetInnerProps,
	FieldsetContentProps,
	FieldsetLegendProps,
	FieldsetDescriptionProps,
	FieldsetHintProps,
	FieldsetFooterProps,
} from './Fieldset.types';
export type {
	FieldsetVariant,
	FieldsetRootProps,
	FieldsetInnerProps,
	FieldsetContentProps,
	FieldsetLegendProps,
	FieldsetDescriptionProps,
	FieldsetHintProps,
	FieldsetFooterProps,
	FieldsetProps,
} from './Fieldset.types';

import {createContext, forwardRef, useContext, useId} from 'react';
import {Box} from '../Box/Box';
import styles from './Fieldset.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';

interface FieldsetContextValue {
	id: string;
	disabled: boolean;
}

const FieldsetContext = createContext<FieldsetContextValue | null>(null);

function useFieldsetContext() {
	const ctx = useContext(FieldsetContext);
	if (!ctx) throw new Error('Вложенный компонент Fieldset должен использоваться внутри Fieldset');
	return ctx;
}

const FieldsetRoot = forwardRef<HTMLDivElement, FieldsetRootProps>(function FieldsetRoot(
	{
		variant = 'default',
		disabled = false,
		className,
		style,
		id: providedId,
		children,
		...rest
	},
	ref,
) {
	const generatedId = useId();
	const id = providedId ?? generatedId;
	const isPlain = variant === 'plain';

	return (
		<FieldsetContext.Provider value={{
			id,
			disabled
		}}
		>
			<Box
				ref={ref}
				as='div'
				variant={isPlain ? 'plain' : 'outlined'}
				border={!isPlain}
				shadow='none'
				padding={isPlain ? 'none' : 'lg'}
				radius='md'
				className={cn(
					styles.wrapper,
					styles[variant],
					disabled ? styles.disabled : '',
					className,
				)}
				style={style}
				{...rest}
			>
				{children}
			</Box>
		</FieldsetContext.Provider>
	);
});

const FieldsetInner = forwardRef<HTMLFieldSetElement, FieldsetInnerProps>(function FieldsetInner(
	{
		children,
		className,
		style,
		'aria-describedby': describedBy,
		...rest
	},
	ref,
) {
	const {id, disabled} = useFieldsetContext();
	return (
		<fieldset
			ref={ref}
			id={id}
			className={cn(styles.fieldset, className)}
			style={style}
			{...rest}
			disabled={disabled || undefined}
			aria-describedby={describedBy}
		>
			{children}
		</fieldset>
	);
});

const FieldsetContent = forwardRef<HTMLDivElement, FieldsetContentProps>(function FieldsetContent(
	{
		gap = 'var(--altum-g-space-4)',
		children,
		className,
		style,
		...rest
	},
	ref,
) {
	const contentStyle = mergeStyles(
		{'--altum-fieldset-gap': typeof gap === 'number' ? `${gap}px` : gap} as React.CSSProperties,
		style,
	);

	return (
		<div
			ref={ref}
			className={cn(styles.content, className)}
			style={contentStyle}
			{...rest}
		>
			{children}
		</div>
	);
});

const FieldsetLegend = forwardRef<HTMLLegendElement, FieldsetLegendProps>(function FieldsetLegend(
	{children, className, style, ...rest},
	ref,
) {
	if (!children) return null;
	return (
		<legend
			ref={ref}
			className={cn(styles.legend, className)}
			style={style}
			{...rest}
		>
			{children}
		</legend>
	);
});

const FieldsetDescription = forwardRef<HTMLParagraphElement, FieldsetDescriptionProps>(
	function FieldsetDescription(
		{children, className, style, ...rest},
		ref,
	) {
		const {id} = useFieldsetContext();
		if (!children) return null;
		return (
			<p
				ref={ref}
				id={`${id}-description`}
				className={cn(styles.description, className)}
				style={style}
				{...rest}
			>
				{children}
			</p>
		);
	},
);

const FieldsetHint = forwardRef<HTMLParagraphElement, FieldsetHintProps>(function FieldsetHint(
	{children, className, style, ...rest},
	ref,
) {
	const {id} = useFieldsetContext();
	if (!children) return null;
	return (
		<p
			ref={ref}
			id={`${id}-hint`}
			className={cn(styles.hint, className)}
			style={style}
			{...rest}
		>
			{children}
		</p>
	);
});

const FieldsetFooter = forwardRef<HTMLDivElement, FieldsetFooterProps>(function FieldsetFooter(
	{children, className, style, ...rest},
	ref,
) {
	if (!children) return null;
	return (
		<div
			ref={ref}
			className={cn(styles.footer, className)}
			style={style}
			{...rest}
		>
			{children}
		</div>
	);
});

FieldsetRoot.displayName = 'Fieldset';
FieldsetInner.displayName = 'Fieldset.Inner';
FieldsetContent.displayName = 'Fieldset.Content';
FieldsetLegend.displayName = 'Fieldset.Legend';
FieldsetDescription.displayName = 'Fieldset.Description';
FieldsetHint.displayName = 'Fieldset.Hint';
FieldsetFooter.displayName = 'Fieldset.Footer';

/**
 * Группа полей формы (составной API).
 *
 * @component
 * @example
 * <Fieldset>
 *   <Fieldset.Inner>
 *     <Fieldset.Legend>Контакты</Fieldset.Legend>
 *     <Fieldset.Content>
 *       <TextField label="Телефон" />
 *     </Fieldset.Content>
 *   </Fieldset.Inner>
 * </Fieldset>
 */
export const Fieldset = Object.assign(FieldsetRoot, {
	Inner: FieldsetInner,
	Content: FieldsetContent,
	Legend: FieldsetLegend,
	Description: FieldsetDescription,
	Hint: FieldsetHint,
	Footer: FieldsetFooter,
});
