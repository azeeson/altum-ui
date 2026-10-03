import type {CSSProperties} from 'react';
import type {SpinnerSize, SpinnerProps} from './Spinner.types';
export type {SpinnerVariant, SpinnerSize, SpinnerProps} from './Spinner.types';

import styles from './Spinner.module.css';
import {cn} from '../../core/utils/cn';
import {toCssSize} from '../../core/utils/cssSize';
import {liveStatus} from '../../core/utils/liveStatus';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_spinner} from '../../locales/slices/spinner.ru';

const localeFallback = {
	spinner: ru_spinner,
};

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
export const Spinner = ({
	variant = 'spin',
	size,
	label,
	className,
	style,
	rootRef,
	'aria-label': ariaLabel,
	...rest
}: SpinnerProps) => {
	const {t} = useLocale(localeFallback);
	const token: SpinnerSize = size === 'sm' || size === 'lg' ? size : 'md';
	const dots = variant === 'typing' || variant === 'dots';
	const resolvedAria = typeof label === 'string'
		? label
		: (ariaLabel ?? t(dots ? 'spinner.typing' : 'spinner.loading'));
	const numeric = typeof size === 'number' && variant === 'spin';

	return (
		<div
			ref={rootRef}
			{...rest}
			className={cn(styles.root, className)}
			data-variant={variant}
			data-size={token !== 'md' ? token : undefined}
			style={numeric
				? {
					'--altum-spinner-size': toCssSize(size),
					...style,
				} as CSSProperties
				: style}
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
};
