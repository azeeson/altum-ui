import type {
	SpinnerSize,
	SpinnerProps,
} from './Spinner.types';
export type {
	SpinnerVariant,
	SpinnerSize,
	SpinnerProps,
} from './Spinner.types';

import {forwardRef} from 'react';
import styles from './Spinner.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';
import {toCssSize} from '../../utils/cssSize';
import {liveStatus} from '../../utils/liveStatus';
import {useLocale} from '../../locales/localeContext';

/**
 * Индикатор загрузки: круг, typing-точки, inline-dots или pulse.
 *
 * @component
 * @example
 * <Spinner size="md" />
 * <Spinner variant="dots" size="sm" />
 * <Spinner variant="pulse" size="lg" />
 * <Spinner variant="typing" label="Ассистент печатает" />
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(function Spinner(
	{
		variant = 'spin',
		size,
		label,
		className,
		style,
		'aria-label': ariaLabel,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const token: SpinnerSize = size === 'sm' || size === 'lg' ? size : 'md';
	const dots = variant === 'typing' || variant === 'dots';
	const resolvedAria = typeof label === 'string'
		? label
		: (ariaLabel ?? t(dots ? 'spinner.typing' : 'spinner.loading'));

	return (
		<div
			ref={ref}
			className={cn(
				styles.root,
				styles[variant],
				token !== 'md' && styles[token],
				className,
			)}
			style={typeof size === 'number' && variant === 'spin'
				? mergeStyles({
					width: toCssSize(size),
					height: toCssSize(size),
				}, style)
				: style}
			{...rest}
			{...liveStatus(rest['aria-hidden'], resolvedAria)}
		>
			{dots && <span className={styles.mark} aria-hidden />}
			{label != null && (
				<span className={styles.label}>
					{label}
				</span>
			)}
		</div>
	);
});

Spinner.displayName = 'Spinner';
