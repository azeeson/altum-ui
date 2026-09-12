import type {
	RangeValue,
	SliderProps,
} from './Slider.types';
export type {
	RangeValue,
	SliderSingleProps,
	SliderRangeProps,
	SliderProps,
} from './Slider.types';

import {forwardRef, type KeyboardEvent, type PointerEvent} from 'react';
import styles from './Slider.module.css';
import {cn} from '../../utils/cn';
import {clamp} from '../../utils/clamp';
import {useLocale} from '../../locales/localeContext';

/**
 * Ползунок: одно значение или диапазон «от–до» (два thumb).
 *
 * Режим определяется типом `value` (`number` | `[number, number]`).
 *
 * @component
 * @example
 * <Slider value={volume} onChange={setVolume} />
 * @example
 * <Slider value={range} onChange={setRange} min={0} max={1000} step={10} />
 */
export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(props, ref) {
	const {
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		readOnly = false,
		showValues = true,
		className,
		'aria-label': ariaLabel,
		value,
		onChange,
		...rest
	} = props;

	const isRange = Array.isArray(value);
	const values = isRange ? value : [value];
	const {t} = useLocale();
	const isReadOnly = readOnly && !disabled;
	const isInteractive = !disabled && !isReadOnly;
	const span = max - min || 1;
	const pct = values.map((item) => ((clamp(item, min, max) - min) / span) * 100);
	const barLeft = isRange ? Math.min(pct[0], pct[1]) : 0;
	const barWidth = isRange ? Math.abs(pct[1] - pct[0]) : pct[0];

	const emit = (next: number[]) => {
		if (isRange) {
			const from = clamp(Math.min(next[0], next[1]), min, max);
			const to = clamp(Math.max(next[0], next[1]), min, max);
			(onChange as (value: RangeValue) => void)([from, to]);
			return;
		}
		(onChange as (value: number) => void)(clamp(next[0], min, max));
	};

	const valueFromClientX = (clientX: number, track: HTMLElement) => {
		const rect = track.getBoundingClientRect();
		const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
		return clamp(Math.round((min + ratio * span) / step) * step, min, max);
	};

	const setFromPointer = (index: number, clientX: number, track: HTMLElement) => {
		const next = valueFromClientX(clientX, track);
		if (!isRange) {
			emit([next]);
			return;
		}
		emit(index === 0 ? [Math.min(next, values[1]), values[1]] : [values[0], Math.max(next, values[0])]);
	};

	const onTrackPointerDown = (event: PointerEvent<HTMLDivElement>) => {
		if (!isInteractive) return;
		if ((event.target as HTMLElement).dataset.thumb) return;
		const next = valueFromClientX(event.clientX, event.currentTarget);
		if (!isRange) {
			emit([next]);
			return;
		}
		const closerToStart = Math.abs(next - values[0]) <= Math.abs(next - values[1]);
		emit(closerToStart ? [next, values[1]] : [values[0], next]);
	};

	const handleKey = (index: number, event: KeyboardEvent) => {
		if (!isInteractive) return;
		if (event.key === 'Home' || event.key === 'End') {
			event.preventDefault();
			const edge = event.key === 'Home' ? min : max;
			if (!isRange) emit([edge]);
			else if (index === 0) emit([Math.min(edge, values[1]), values[1]]);
			else emit([values[0], Math.max(edge, values[0])]);
			return;
		}
		const delta =
			event.key === 'ArrowLeft' || event.key === 'ArrowDown'
				? -step
				: event.key === 'ArrowRight' || event.key === 'ArrowUp'
					? step
					: 0;
		if (!delta) return;
		event.preventDefault();
		const next = values[index] + delta;
		if (!isRange) emit([next]);
		else if (index === 0) emit([next, values[1]]);
		else emit([values[0], next]);
	};

	return (
		<div
			ref={ref}
			className={cn(
				styles.wrapper,
				isReadOnly ? styles.readOnly : '',
				disabled ? styles.disabled : '',
				className,
			)}
			{...rest}
			aria-readonly={isReadOnly || undefined}
		>
			<div
				className={styles.track}
				onPointerDown={onTrackPointerDown}
				role={isRange ? 'group' : undefined}
				aria-label={isRange ? (ariaLabel ?? t('slider.ariaLabel')) : undefined}
			>
				<div
					className={styles.bar}
					style={{
						left: `${barLeft}%`,
						width: `${barWidth}%`,
					}}
				/>
				{values.map((item, index) => (
					<div
						key={index}
						className={styles.handle}
						style={{left: `${pct[index]}%`}}
						data-thumb={index}
						role='slider'
						aria-orientation='horizontal'
						tabIndex={isInteractive ? 0 : -1}
						aria-valuemin={index === 0 ? min : values[0]}
						aria-valuemax={isRange && index === 0 ? values[1] : max}
						aria-valuenow={item}
						aria-label={
							isRange
								? t(index === 0 ? 'slider.from' : 'slider.to')
								: (ariaLabel ?? t('slider.ariaLabel'))
						}
						aria-disabled={disabled || undefined}
						aria-readonly={isReadOnly || undefined}
						onPointerDown={(event) => {
							if (!isInteractive) return;
							event.preventDefault();
							event.currentTarget.setPointerCapture(event.pointerId);
						}}
						onPointerMove={(event) => {
							if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
							const track = event.currentTarget.parentElement;
							if (!track) return;
							setFromPointer(index, event.clientX, track);
						}}
						onKeyDown={(event) => handleKey(index, event)}
					>
						{showValues && (
							<span className={styles.tooltip}>
								{item}
							</span>
						)}
					</div>
				))}
			</div>
		</div>
	);
});

Slider.displayName = 'Slider';
