import type {
	RatingProps,
} from './Rating.types';
export type {
	RatingProps,
} from './Rating.types';

import {forwardRef, useCallback, useRef, useState} from 'react';
import {useControlledState} from '../../hooks/useControlledState';
import styles from './Rating.module.css';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useLocale} from '../LocaleProvider/LocaleProvider';

/**
 * Оценка звёздами (отзывы, рейтинги).
 *
 * @component
 * @example
 * <Rating value={rating} onChange={setRating} />
 */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
	{
		value: controlledValue,
		defaultValue = 0,
		onChange,
		max = 5,
		readOnly = false,
		disabled = false,
		size = 'md',
		allowClear = true,
		'aria-label': ariaLabel,
		className,
		style,
		onKeyDown,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const [value, setValue] = useControlledState(controlledValue, defaultValue);
	const [hover, setHover] = useState<number | null>(null);
	const interactive = !readOnly && !disabled;
	const display = hover ?? value;
	const radioRefs = useRef<Array<HTMLButtonElement | null>>([]);

	const commitValue = useCallback((next: number) => {
		setValue(next);
		onChange?.(next);
	}, [onChange, setValue]);

	const focusScore = (score: number) => {
		const index = score <= 0 ? 0 : score - 1;
		radioRefs.current[index]?.focus();
	};

	return (
		<div
			ref={ref}
			className={cn(
				styles.root,
				styles[size],
				disabled ? styles.disabled : '',
				readOnly ? styles.readOnly : '',
				className,
			)}
			style={style}
			onMouseLeave={() => setHover(null)}
			{...rest}
			role='radiogroup'
			aria-label={ariaLabel ?? t('rating.ariaLabel')}
			aria-disabled={disabled || undefined}
			aria-readonly={readOnly || undefined}
			onKeyDown={composeEventHandlers(onKeyDown, (event) => {
				if (!interactive) return;
				const minScore = allowClear ? 0 : 1;
				if (event.key === 'Home') {
					event.preventDefault();
					commitValue(minScore);
					focusScore(minScore);
					return;
				}
				if (event.key === 'End') {
					event.preventDefault();
					commitValue(max);
					focusScore(max);
					return;
				}
				const delta = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 1
					: event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1
						: 0;
				if (!delta) return;
				event.preventDefault();
				const next = Math.min(max, Math.max(minScore, (value || 0) + delta));
				commitValue(next);
				focusScore(next);
			})}
		>
			{Array.from({length: max}, (_, index) => {
				const score = index + 1;
				const filled = score <= display;
				const tabStop = value === score || (value === 0 && score === 1);
				return (
					<button
						key={score}
						ref={(node) => {
							radioRefs.current[index] = node;
						}}
						type='button'
						role='radio'
						aria-checked={value === score}
						aria-label={t('rating.value', {
							score,
							max
						})}
						disabled={!interactive}
						tabIndex={interactive && tabStop ? 0 : -1}
						className={cn(styles.star, filled ? styles.filled : '')}
						onMouseEnter={() => interactive && setHover(score)}
						onFocus={() => interactive && setHover(score)}
						onBlur={() => setHover(null)}
						onClick={() => {
							if (!interactive) return;
							if (allowClear && value === score) commitValue(0);
							else commitValue(score);
						}}
					>
						<svg
							viewBox='0 0 24 24'
							aria-hidden
						>
							<path
								d='M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.5L12 17.8 6.1 20.6l1.2-6.5L2.5 9.5l6.6-.9L12 2.5z'
								fill='currentColor'
							/>
						</svg>
					</button>
				);
			})}
		</div>
	);
});

Rating.displayName = 'Rating';
