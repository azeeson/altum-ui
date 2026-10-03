import type {ChangeEvent, MouseEvent} from 'react';
import type {RatingProps} from './Rating.types';
export type {RatingProps} from './Rating.types';

import {useId, useRef} from 'react';
import {useControlledState} from '../../hooks/useControlledState';
import styles from './Rating.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_rating} from '../../locales/slices/rating.ru';

const localeFallback = {
	rating: ru_rating,
};

/**
 * Оценка звёздами (отзывы, рейтинги).
 * Смена значения и сброс слушаются на корне группы.
 *
 * @component
 * @example
 * <Rating value={rating} onChange={setRating} />
 */
export const Rating = ({
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
	rootRef,
	onClick,
	...rest
}: RatingProps) => {
	const {t} = useLocale(localeFallback);
	const [value, setValue] = useControlledState(controlledValue, defaultValue);
	const name = useId();
	const interactive = !readOnly && !disabled;
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;

	const commit = (next: number) => {
		setValue(next);
		onChangeRef.current?.(next);
	};

	const handleChange = (event: ChangeEvent<HTMLDivElement>) => {
		if (!interactive) return;
		const target = event.target;
		if (!(target instanceof HTMLInputElement) || target.type !== 'radio') return;
		const nextScore = Number(target.value);
		if (!Number.isFinite(nextScore)) return;
		if (allowClear && nextScore === value) return;
		commit(nextScore);
	};

	const handleClick = (event: MouseEvent<HTMLDivElement>) => {
		onClick?.(event);
		if (event.defaultPrevented || !interactive || !allowClear) return;
		const target = event.target;
		if (!(target instanceof Element)) return;
		const radio = target.closest('input[type="radio"]');
		if (!(radio instanceof HTMLInputElement)) return;
		const nextScore = Number(radio.value);
		if (value !== nextScore) return;
		event.preventDefault();
		commit(0);
	};

	return (
		<div
			ref={rootRef}
			className={cn(styles.root, className)}
			{...rest}
			role='radiogroup'
			aria-label={ariaLabel ?? t('rating.ariaLabel')}
			aria-disabled={disabled || undefined}
			aria-readonly={readOnly || undefined}
			data-size={size !== 'md' ? size : undefined}
			data-readonly={readOnly ? '' : undefined}
			data-disabled={disabled ? '' : undefined}
			onChange={handleChange}
			onClick={handleClick}
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
							className={unstyled.control}
						/>
					</label>
				);
			})}
		</div>
	);
};
