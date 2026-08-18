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
import {useLocale} from '../LocaleProvider/LocaleProvider';

const SPIN_PX: Record<SpinnerSize, number> = {
	sm: 16,
	md: 24,
	lg: 40,
};

function resolveTokenSize(size: number | SpinnerSize | undefined): SpinnerSize {
	if (size === 'sm' || size === 'lg') return size;
	return 'md';
}

function DotsMark({className}: {className?: string}) {
	return (
		<span className={cn(styles.dots, className)} aria-hidden>
			<span className={styles.dot} />
			<span className={styles.dot} />
			<span className={styles.dot} />
		</span>
	);
}

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
	const hidden = rest['aria-hidden'] === true || rest['aria-hidden'] === 'true';
	const {t} = useLocale();
	const tokenSize = resolveTokenSize(typeof size === 'number' ? undefined : size);
	const resolvedAria = typeof label === 'string'
		? label
		: (ariaLabel ?? (variant === 'typing' || variant === 'dots' ? t('spinner.typing') : t('spinner.loading')));

	if (variant === 'typing' || variant === 'dots') {
		return (
			<div
				ref={ref}
				className={cn(
					styles.cluster,
					styles[tokenSize],
					variant === 'typing' ? styles.typing : styles.dotsVariant,
					className,
				)}
				{...rest}
				style={style}
				role={hidden ? undefined : 'status'}
				aria-live={hidden ? undefined : 'polite'}
				aria-label={hidden ? undefined : resolvedAria}
			>
				<DotsMark className={variant === 'typing' ? styles.typingDots : styles.inlineDots} />
				{label != null && (
					<span className={styles.label}>
						{label}
					</span>
				)}
			</div>
		);
	}

	if (variant === 'pulse') {
		return (
			<div
				ref={ref}
				className={cn(styles.pulse, styles[tokenSize], className)}
				style={style}
				{...rest}
				role={hidden ? undefined : 'status'}
				aria-label={hidden ? undefined : resolvedAria}
			/>
		);
	}

	const px = typeof size === 'number' ? size : SPIN_PX[tokenSize];

	return (
		<div
			ref={ref}
			className={cn(styles.spinner, styles[`spin_${tokenSize}`], className)}
			style={mergeStyles({
				width: `${px}px`,
				height: `${px}px`
			}, style)}
			{...rest}
			role={hidden ? undefined : 'status'}
			aria-label={hidden ? undefined : resolvedAria}
		/>
	);
});

Spinner.displayName = 'Spinner';
