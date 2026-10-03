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

import {useRef, type CSSProperties, type KeyboardEvent, type PointerEvent} from 'react';
import styles from './Slider.module.css';
import {cn} from '../../core/utils/cn';
import {clamp, unitRatio, valueFromTrackClientX} from '../../core/utils/math';
import {setPointerCapture, hasPointerCapture} from '../../core/utils/dom';
import {getFormControlState} from '../../core/utils/form';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_slider} from '../../locales/slices/slider.ru';

const localeFallback = {
	slider: ru_slider,
};

/** Доли 0…1 на трек; проценты и bar — в CSS (`calc(var(--local-ratio) * 100%)`). */
const trackRatioVars = (ratios: number[], isRange: boolean): CSSProperties => {
	if (isRange) {
		return {
			'--local-ratio-0': ratios[0],
			'--local-ratio-1': ratios[1],
		} as CSSProperties;
	}
	return {
		'--local-ratio': ratios[0],
	} as CSSProperties;
};

/**
 * Ползунок: одно значение или диапазон «от–до» (два thumb).
 *
 * Режим определяется типом `value` (`number` | `[number, number]`).
 * В DOM пишутся доли `--local-ratio` (0…1); ширину/сдвиг считает CSS.
 * `onChange` — на отпускании, по клику в трек и с клавиатуры.
 *
 * @component
 * @example
 * <Slider value={volume} onChange={setVolume} />
 * @example
 * <Slider value={range} onChange={setRange} min={0} max={1000} step={10} />
 */
export const Slider = ({
	min = 0,
	max = 100,
	step = 1,
	disabled = false,
	readOnly = false,
	showValues = true,
	className,
	style,
	'aria-label': ariaLabel,
	value,
	onChange,
	rootRef,
	...rest
}: SliderProps) => {
	const isRange = Array.isArray(value);
	const values = isRange ? value : [value];
	const {t} = useLocale(localeFallback);
	const {isReadOnly, isInteractive} = getFormControlState({
		disabled,
		readOnly,
	});
	const ratios = values.map((item) => unitRatio(clamp(item, min, max), min, max));
	const trackRef = useRef<HTMLDivElement>(null);
	const dragRef = useRef<number[] | null>(null);
	const dragThumbRef = useRef<number | null>(null);
	const valuesRef = useRef(values);
	valuesRef.current = values;

	const emit = (next: number[]) => {
		if (isRange) {
			const from = clamp(Math.min(next[0], next[1]), min, max);
			const to = clamp(Math.max(next[0], next[1]), min, max);
			(onChange as (value: RangeValue) => void)([from, to]);
			return;
		}
		(onChange as (value: number) => void)(clamp(next[0], min, max));
	};

	const valueFromClientX = (clientX: number, track: HTMLElement) => (
		valueFromTrackClientX(clientX, track, min, max, step)
	);

	const paint = (index: number, next: number[]) => {
		const track = trackRef.current;
		if (!track) return;
		const nextRatios = next.map((item) => unitRatio(clamp(item, min, max), min, max));
		if (isRange) {
			track.style.setProperty('--local-ratio-0', String(nextRatios[0]));
			track.style.setProperty('--local-ratio-1', String(nextRatios[1]));
		} else {
			track.style.setProperty('--local-ratio', String(nextRatios[0]));
		}
		const handle = track.querySelector<HTMLElement>(`[data-thumb='${index}']`);
		if (handle) {
			handle.setAttribute('aria-valuenow', String(next[index]));
			const tooltip = handle.querySelector(`.${styles.tooltip}`);
			if (tooltip) tooltip.textContent = String(next[index]);
		}
	};

	const commitDrag = () => {
		dragThumbRef.current = null;
		const next = dragRef.current;
		if (!next) return;
		dragRef.current = null;
		emit(next);
	};

	const thumbIndex = (target: EventTarget | null) => {
		if (!(target instanceof HTMLElement)) return null;
		const thumb = target.closest<HTMLElement>('[data-thumb]');
		if (!thumb) return null;
		const index = Number(thumb.dataset.thumb);
		return Number.isInteger(index) ? index : null;
	};

	const onTrackPointerDown = (event: PointerEvent<HTMLDivElement>) => {
		if (!isInteractive) return;
		const index = thumbIndex(event.target);
		if (index != null) {
			event.preventDefault();
			dragThumbRef.current = index;
			setPointerCapture(event.currentTarget, event.pointerId);
			return;
		}
		const next = valueFromClientX(event.clientX, event.currentTarget);
		const current = valuesRef.current;
		if (!isRange) {
			emit([next]);
			return;
		}
		const closerToStart = Math.abs(next - current[0]) <= Math.abs(next - current[1]);
		emit(closerToStart ? [next, current[1]] : [current[0], next]);
	};

	const onTrackPointerMove = (event: PointerEvent<HTMLDivElement>) => {
		const index = dragThumbRef.current;
		if (index == null || !hasPointerCapture(event.currentTarget, event.pointerId)) return;
		const track = trackRef.current;
		if (!track) return;
		const next = valueFromClientX(event.clientX, track);
		const base = dragRef.current ?? valuesRef.current;
		const nextValues = !isRange
			? [next]
			: index === 0
				? [Math.min(next, base[1]), base[1]]
				: [base[0], Math.max(next, base[0])];
		dragRef.current = nextValues;
		paint(index, nextValues);
	};

	const onTrackKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (!isInteractive) return;
		const index = thumbIndex(event.target);
		if (index == null) return;
		const current = valuesRef.current;
		if (event.key === 'Home' || event.key === 'End') {
			event.preventDefault();
			const edge = event.key === 'Home' ? min : max;
			if (!isRange) emit([edge]);
			else if (index === 0) emit([Math.min(edge, current[1]), current[1]]);
			else emit([current[0], Math.max(edge, current[0])]);
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
		const next = current[index] + delta;
		if (!isRange) emit([next]);
		else if (index === 0) emit([next, current[1]]);
		else emit([current[0], next]);
	};

	return (
		<div
			{...rest}
			ref={rootRef}
			className={cn(styles.wrapper, className)}
			style={style}
			aria-readonly={isReadOnly || undefined}
			data-readonly={isReadOnly ? '' : undefined}
			data-disabled={disabled ? '' : undefined}
		>
			<div
				ref={trackRef}
				className={styles.track}
				style={trackRatioVars(ratios, isRange)}
				data-range={isRange ? '' : undefined}
				onPointerDown={onTrackPointerDown}
				onPointerMove={onTrackPointerMove}
				onPointerUp={commitDrag}
				onLostPointerCapture={commitDrag}
				onKeyDown={onTrackKeyDown}
				role={isRange ? 'group' : undefined}
				aria-label={isRange ? (ariaLabel ?? t('slider.ariaLabel')) : undefined}
			>
				<div className={styles.bar} />
				{values.map((item, index) => (
					<div
						key={index}
						className={styles.handle}
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
};
