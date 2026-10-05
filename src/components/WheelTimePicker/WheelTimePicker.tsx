import type {WheelTimePickerProps} from './WheelTimePicker.types';
export type {
	TimePopupProps,
	TimeValue,
	WheelTimePickerProps,
} from './WheelTimePicker.types';

import {useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent} from 'react';
import styles from './WheelTimePicker.module.css';
import scroll from '../../styles/scrollable.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_timeField} from '../../locales/slices/timeField.ru';

const localeFallback = {
	timeField: ru_timeField,
};




const ROW_HEIGHT = 36;
const HOURS = Array.from({length: 24}, (_, index) => index);
const MINUTES = Array.from({length: 60}, (_, index) => index);
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const pad2 = (value: number) => (value < 10 ? `0${value}` : `${value}`);

function WheelColumn({
	items,
	value,
	onChange,
	ariaLabel,
	active,
}: {
	items: number[];
	value: number;
	onChange: (next: number) => void;
	ariaLabel: string;
	active: boolean;
}) {
	const [reduceMotion] = useState(
		() => typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches,
	);
	const scrollRef = useRef<HTMLDivElement>(null);
	const programmaticRef = useRef(false);
	const userDrivingRef = useRef(false);
	const fromUserRef = useRef<number | null>(null);
	const pendingBehaviorRef = useRef<ScrollBehavior>('auto');
	const alignGenRef = useRef(0);
	const lockTimerRef = useRef(0);
	const settleTimerRef = useRef(0);

	const selectedIndex = items.indexOf(value);
	const index = selectedIndex < 0 ? 0 : selectedIndex;

	const rowSize = (scroller: HTMLElement) => {
		const item = scroller.querySelector<HTMLElement>('button[data-index]');
		const height = item?.getBoundingClientRect().height ?? 0;
		return height > 0 ? height : ROW_HEIGHT;
	};

	/** Индекс пункта, чей центр ближе всего к середине полосы выбора. */
	const indexUnderHighlight = () => {
		const scroller = scrollRef.current;
		if (!scroller) return 0;
		const root = scroller.closest(`.${styles.root}`);
		const band = root?.querySelector(`.${styles.highlight}`)?.getBoundingClientRect();
		const scrollerRect = scroller.getBoundingClientRect();
		const mid = band
			? band.top + band.height / 2
			: scrollerRect.top + scroller.clientHeight / 2;
		const buttons = scroller.querySelectorAll<HTMLButtonElement>('button[data-index]');
		let best = 0;
		let bestDist = Infinity;
		buttons.forEach((button) => {
			const rect = button.getBoundingClientRect();
			const dist = Math.abs(rect.top + rect.height / 2 - mid);
			if (dist < bestDist) {
				bestDist = dist;
				best = Number(button.dataset.index);
			}
		});
		return Number.isInteger(best) ? best : 0;
	};

	const emitIfChanged = (nextIndex: number) => {
		const clamped = Math.min(Math.max(nextIndex, 0), items.length - 1);
		const next = items[clamped];
		if (next == null || next === value) return;
		fromUserRef.current = clamped;
		onChange(next);
	};

	const alignTo = useCallback((nextIndex: number, behavior: ScrollBehavior) => {
		const scroller = scrollRef.current;
		if (!scroller) return false;
		const top = nextIndex * rowSize(scroller);
		const gen = alignGenRef.current + 1;
		alignGenRef.current = gen;
		programmaticRef.current = true;
		window.clearTimeout(lockTimerRef.current);
		if (behavior === 'auto') {
			scroller.scrollTop = top;
			const reached = Math.abs(scroller.scrollTop - top) <= 1;
			if (reached) {
				requestAnimationFrame(() => {
					if (alignGenRef.current === gen) programmaticRef.current = false;
				});
			}
			return reached;
		}
		scroller.scrollTo({
			top,
			behavior,
		});
		const started = Date.now();
		const finish = () => {
			const node = scrollRef.current;
			if (!node || alignGenRef.current !== gen || !programmaticRef.current) return;
			const done = Math.abs(node.scrollTop - top) <= 1 || Date.now() - started > 400;
			if (!done) {
				lockTimerRef.current = window.setTimeout(finish, 16);
				return;
			}
			programmaticRef.current = false;
		};
		lockTimerRef.current = window.setTimeout(finish, 16);
		return true;
	}, []);

	useLayoutEffect(() => {
		if (!active || userDrivingRef.current) return;
		if (fromUserRef.current === index) {
			fromUserRef.current = null;
			return;
		}
		const behavior = pendingBehaviorRef.current;
		pendingBehaviorRef.current = 'auto';
		let frames = 0;
		let frameId = 0;
		let cancelled = false;
		const tryAlign = () => {
			if (cancelled || userDrivingRef.current) return;
			const reached = alignTo(index, frames === 0 ? behavior : 'auto');
			if (reached) return;
			frames += 1;
			if (frames > 30) {
				programmaticRef.current = false;
				return;
			}
			frameId = requestAnimationFrame(tryAlign);
		};
		tryAlign();
		return () => {
			cancelled = true;
			cancelAnimationFrame(frameId);
		};
	}, [active, alignTo, index]);

	useEffect(() => () => {
		window.clearTimeout(lockTimerRef.current);
		window.clearTimeout(settleTimerRef.current);
	}, []);

	const markUserScroll = () => {
		programmaticRef.current = false;
		userDrivingRef.current = true;
		window.clearTimeout(lockTimerRef.current);
	};

	const onScroll = () => {
		if (programmaticRef.current) return;
		userDrivingRef.current = true;
		emitIfChanged(indexUnderHighlight());
		window.clearTimeout(settleTimerRef.current);
		settleTimerRef.current = window.setTimeout(() => {
			if (!scrollRef.current) return;
			const next = indexUnderHighlight();
			const clamped = Math.min(Math.max(next, 0), items.length - 1);
			const same = items[clamped] === value;
			userDrivingRef.current = false;
			if (!same) emitIfChanged(clamped);
		}, 80);
	};

	const onScrollerClick = (event: MouseEvent<HTMLDivElement>) => {
		const button = (event.target as HTMLElement).closest('button[data-index]');
		if (!(button instanceof HTMLButtonElement) || !event.currentTarget.contains(button)) return;
		event.stopPropagation();
		const itemIndex = Number(button.dataset.index);
		if (!Number.isInteger(itemIndex)) return;
		const item = items[itemIndex];
		if (item == null) return;
		userDrivingRef.current = false;
		pendingBehaviorRef.current = reduceMotion ? 'auto' : 'smooth';
		onChange(item);
	};

	return (
		<div className={styles.column}>
			<div
				ref={scrollRef}
				className={cn(scroll.area, scroll.hide, styles.scroller)}
				role='listbox'
				aria-label={ariaLabel}
				onPointerDown={markUserScroll}
				onWheel={markUserScroll}
				onScroll={onScroll}
				onClick={onScrollerClick}
			>
				<div className={styles.spacer} aria-hidden />
				{items.map((item, itemIndex) => {
					const selected = item === value;
					return (
						<button
							key={item}
							type='button'
							role='option'
							aria-selected={selected}
							aria-current={selected || undefined}
							className={cn(unstyled.control, utilities.fCenter, styles.item)}
							data-index={itemIndex}
						>
							{pad2(item)}
						</button>
					);
				})}
				<div className={styles.spacer} aria-hidden />
			</div>
		</div>
	);
}

/**
 * Попап времени из двух барабанов: часы `00–23` и минуты `00–59`.
 *
 * @component
 * @example
 * <WheelTimePicker value={{hours: 14, minutes: 30}} onChange={setTime} />
 */
export const WheelTimePicker = ({
	value,
	onChange,
	active = true,
	className,
	rootRef,
	...rest
}: WheelTimePickerProps) => {
	const {messages} = useLocale(localeFallback);
	const hours = value?.hours ?? 0;
	const minutes = value?.minutes ?? 0;

	return (
		<div
			ref={rootRef}
			className={cn(styles.root, className)}
			onClick={(event) => event.stopPropagation()}
			{...rest}
		>
			<div className={styles.highlight} aria-hidden />
			<div className={styles.columns}>
				<WheelColumn
					items={HOURS}
					value={hours}
					ariaLabel={messages.timeField.hours}
					active={active}
					onChange={(nextHours) => onChange({
						hours: nextHours,
						minutes: value?.minutes ?? 0,
					})}
				/>
				<div className={cn(utilities.fCenter, styles.separator)} aria-hidden>
					:
				</div>
				<WheelColumn
					items={MINUTES}
					value={minutes}
					ariaLabel={messages.timeField.minutes}
					active={active}
					onChange={(nextMinutes) => onChange({
						hours: value?.hours ?? 0,
						minutes: nextMinutes,
					})}
				/>
			</div>
		</div>
	);
};
