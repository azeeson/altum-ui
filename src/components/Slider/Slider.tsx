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

import React, {forwardRef, useCallback, useId, useRef} from 'react';
import styles from './Slider.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../LocaleProvider/LocaleProvider';

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

function isRangeValue(value: number | RangeValue): value is RangeValue {
	return Array.isArray(value);
}

/**
 * Ползунок: одно значение или диапазон «от–до» (два thumb).
 *
 * Режим определяется типом `value` (`number` | `[number, number]`)
 * или явным флагом `range`.
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
		range,
		value,
		onChange,
		...rest
	} = props;

	const isRange = range === true || isRangeValue(value);
	const {t} = useLocale();
	const isReadOnly = readOnly && !disabled;
	const isInteractive = !disabled && !isReadOnly;
	const activeThumb = useRef<'start' | 'end' | 'single' | null>(null);
	const trackId = useId();
	const span = max - min || 1;

	const singleValue = isRange ? 0 : (value as number);
	const [start, end] = isRange
		? (value as RangeValue)
		: [min, singleValue];

	const startPct = ((clamp(start, min, max) - min) / span) * 100;
	const endPct = ((clamp(end, min, max) - min) / span) * 100;
	const singlePct = ((clamp(singleValue, min, max) - min) / span) * 100;

	const emitSingle = useCallback((next: number) => {
		(onChange as (value: number) => void)(clamp(next, min, max));
	}, [max, min, onChange]);

	const emitRange = useCallback((nextStart: number, nextEnd: number) => {
		let a = clamp(nextStart, min, max);
		let b = clamp(nextEnd, min, max);
		if (a > b) [a, b] = [b, a];
		(onChange as (value: RangeValue) => void)([a, b]);
	}, [max, min, onChange]);

	const valueFromClientX = (clientX: number, track: HTMLElement) => {
		const rect = track.getBoundingClientRect();
		const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
		const raw = min + ratio * span;
		const stepped = Math.round(raw / step) * step;
		return clamp(stepped, min, max);
	};

	const onPointerDown = (thumb: 'start' | 'end' | 'single') => (
		event: React.PointerEvent<HTMLDivElement>,
	) => {
		if (!isInteractive) return;
		event.preventDefault();
		 
		activeThumb.current = thumb;
		const track = event.currentTarget.parentElement;
		if (!track) return;
		const target = event.currentTarget;
		target.setPointerCapture(event.pointerId);

		const move = (moveEvent: PointerEvent) => {
			const next = valueFromClientX(moveEvent.clientX, track);
			if (activeThumb.current === 'single') {
				emitSingle(next);
			} else if (activeThumb.current === 'start') {
				emitRange(Math.min(next, end), end);
			} else if (activeThumb.current === 'end') {
				emitRange(start, Math.max(next, start));
			}
		};
		const up = () => {
			activeThumb.current = null;
			target.releasePointerCapture(event.pointerId);
			window.removeEventListener('pointermove', move);
			window.removeEventListener('pointerup', up);
		};
		window.addEventListener('pointermove', move);
		window.addEventListener('pointerup', up);
	};

	const onTrackPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
		if (!isInteractive) return;
		if ((event.target as HTMLElement).dataset.thumb) return;
		const next = valueFromClientX(event.clientX, event.currentTarget);
		if (!isRange) {
			emitSingle(next);
			return;
		}
		const distStart = Math.abs(next - start);
		const distEnd = Math.abs(next - end);
		if (distStart <= distEnd) emitRange(next, end);
		else emitRange(start, next);
	};

	const handleKey = (
		thumb: 'start' | 'end' | 'single',
		event: React.KeyboardEvent,
	) => {
		if (!isInteractive) return;
		if (event.key === 'Home' || event.key === 'End') {
			event.preventDefault();
			const next = event.key === 'Home' ? min : max;
			if (thumb === 'single') emitSingle(next);
			else if (thumb === 'start') emitRange(Math.min(next, end), end);
			else emitRange(start, Math.max(next, start));
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
		if (thumb === 'single') emitSingle(singleValue + delta);
		else if (thumb === 'start') emitRange(start + delta, end);
		else emitRange(start, end + delta);
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
				id={trackId}
				className={styles.track}
				onPointerDown={onTrackPointerDown}
				role={isRange ? 'group' : undefined}
				aria-label={
					isRange
						? (ariaLabel ?? t('slider.ariaLabel'))
						: undefined
				}
			>
				{isRange ? (
					<div
						className={styles.bar}
						style={{
							left: `${Math.min(startPct, endPct)}%`,
							width: `${Math.abs(endPct - startPct)}%`,
						}}
					/>
				) : (
					<div
						className={styles.bar}
						style={{width: `${singlePct}%`}}
					/>
				)}

				{isRange ? (
					<>
						<div
							className={cn(
								styles.handle,
								isReadOnly ? styles.handleReadOnly : '',
							)}
							style={{left: `${startPct}%`}}
							data-thumb='start'
							role='slider'
							aria-orientation='horizontal'
							tabIndex={isInteractive ? 0 : -1}
							aria-valuemin={min}
							aria-valuemax={end}
							aria-valuenow={start}
							aria-label={t('slider.from')}
							aria-disabled={disabled || undefined}
							aria-readonly={isReadOnly || undefined}
							onPointerDown={onPointerDown('start')}
							onKeyDown={(e) => handleKey('start', e)}
						>
							{showValues && (
								<span className={styles.tooltip}>
									{start}
								</span>
							)}
						</div>
						<div
							className={cn(
								styles.handle,
								isReadOnly ? styles.handleReadOnly : '',
							)}
							style={{left: `${endPct}%`}}
							data-thumb='end'
							role='slider'
							aria-orientation='horizontal'
							tabIndex={isInteractive ? 0 : -1}
							aria-valuemin={start}
							aria-valuemax={max}
							aria-valuenow={end}
							aria-label={t('slider.to')}
							aria-disabled={disabled || undefined}
							aria-readonly={isReadOnly || undefined}
							onPointerDown={onPointerDown('end')}
							onKeyDown={(e) => handleKey('end', e)}
						>
							{showValues && (
								<span className={styles.tooltip}>
									{end}
								</span>
							)}
						</div>
					</>
				) : (
					<div
						className={cn(
							styles.handle,
							isReadOnly ? styles.handleReadOnly : '',
						)}
						style={{left: `${singlePct}%`}}
						data-thumb='single'
						role='slider'
						aria-orientation='horizontal'
						tabIndex={isInteractive ? 0 : -1}
						aria-valuemin={min}
						aria-valuemax={max}
						aria-valuenow={singleValue}
						aria-label={ariaLabel ?? t('slider.ariaLabel')}
						aria-disabled={disabled || undefined}
						aria-readonly={isReadOnly || undefined}
						onPointerDown={onPointerDown('single')}
						onKeyDown={(e) => handleKey('single', e)}
					>
						{showValues && (
							<span className={styles.tooltip}>
								{singleValue}
							</span>
						)}
					</div>
				)}
			</div>
		</div>
	);
});

Slider.displayName = 'Slider';
