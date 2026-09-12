import type {
	RatingProps,
} from './Rating.types';
export type {
	RatingProps,
} from './Rating.types';

import {forwardRef, useId} from 'react';
import {useControlledState} from '../../hooks/useControlledState';
import styles from './Rating.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../../locales/localeContext';

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
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const [value, setValue] = useControlledState(controlledValue, defaultValue);
	const name = useId();
	const interactive = !readOnly && !disabled;

	const commitValue = (next: number) => {
		setValue(next);
		onChange?.(next);
	};

	return (
		<div
			ref={ref}
			className={cn(
				styles.root,
				styles[size],
				disabled && styles.disabled,
				readOnly && styles.readOnly,
				className,
			)}
			{...rest}
			role='radiogroup'
			aria-label={ariaLabel ?? t('rating.ariaLabel')}
			aria-disabled={disabled || undefined}
			aria-readonly={readOnly || undefined}
		>
			{Array.from({length: max}, (_, index) => {
				const score = index + 1;
				return (
					<label key={score} className={styles.star}>
						<input
							type='radio'
							name={name}
							value={score}
							checked={value === score}
							disabled={!interactive}
							onChange={() => commitValue(score)}
							onClick={() => {
								if (allowClear && value === score) commitValue(0);
							}}
						/>
					</label>
				);
			})}
		</div>
	);
});

Rating.displayName = 'Rating';
