import type {WheelTimePickerProps} from './WheelTimePicker.types';
export type {
	TimePopupProps,
	TimeValue,
	WheelTimePickerProps,
} from './WheelTimePicker.types';

import {forwardRef, useCallback, useEffect, useLayoutEffect, useRef} from 'react';
import styles from './WheelTimePicker.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../../locales/localeContext';

const ROW_HEIGHT = 36;
const PROGRAMMATIC_AUTO_MS = 40;
const PROGRAMMATIC_SMOOTH_MS = 280;
const HOURS = Array.from({length: 24}, (_, index) => index);
const MINUTES = Array.from({length: 60}, (_, index) => index);

const pad2 = (value: number) => (value < 10 ? `0${value}` : `${value}`);

const prefersReducedMotion = () => (
	typeof window !== 'undefined'
	&& window.matchMedia('(prefers-reduced-motion: reduce)').matches
);

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
	const scrollRef = useRef<HTMLDivElement>(null);
	const programmaticRef = useRef(false);
	const userScrollRef = useRef(false);
	const targetIndexRef = useRef<number | null>(null);
	const lockTimerRef = useRef(0);
	const settleTimerRef = useRef(0);

	const selectedIndex = items.indexOf(value);
	const index = selectedIndex < 0 ? 0 : selectedIndex;

	const unlockProgrammatic = useCallback(() => {
		programmaticRef.current = false;
		targetIndexRef.current = null;
	}, []);

	const scrollToIndex = useCallback((nextIndex: number, behavior: ScrollBehavior) => {
		const scroller = scrollRef.current;
		if (!scroller) return;
		targetIndexRef.current = nextIndex;
		programmaticRef.current = true;
		userScrollRef.current = false;
		window.clearTimeout(lockTimerRef.current);
		const top = nextIndex * ROW_HEIGHT;
		if (behavior === 'auto') {
			scroller.scrollTop = top;
		} else {
			scroller.scrollTo({
				top,
				behavior,
			});
		}
		const delay = behavior === 'smooth' ? PROGRAMMATIC_SMOOTH_MS : PROGRAMMATIC_AUTO_MS;
		const startedAt = Date.now();
		const tryUnlock = () => {
			if (!scrollRef.current) return;
			const reached = Math.abs(scrollRef.current.scrollTop - top) <= 1;
			const timedOut = Date.now() - startedAt > delay + 200;
			if (reached || timedOut) {
				unlockProgrammatic();
				return;
			}
			lockTimerRef.current = window.setTimeout(tryUnlock, 16);
		};
		lockTimerRef.current = window.setTimeout(tryUnlock, delay);
	}, [unlockProgrammatic]);

	useLayoutEffect(() => {
		if (!active) return;
		if (targetIndexRef.current === index) return;
		scrollToIndex(index, 'auto');
	}, [active, index, scrollToIndex]);

	useEffect(() => () => {
		window.clearTimeout(lockTimerRef.current);
		window.clearTimeout(settleTimerRef.current);
	}, []);

	const emitIfChanged = (nextIndex: number) => {
		const clamped = Math.min(Math.max(nextIndex, 0), items.length - 1);
		const next = items[clamped];
		if (next !== value) onChange(next);
	};

	const readIndex = (scrollTop: number) => (
		Math.min(Math.max(Math.round(scrollTop / ROW_HEIGHT), 0), items.length - 1)
	);

	const markUserScroll = () => {
		if (programmaticRef.current) return;
		userScrollRef.current = true;
	};

	const onScroll = () => {
		if (programmaticRef.current || !userScrollRef.current) return;
		const scroller = scrollRef.current;
		if (!scroller) return;
		const raw = scroller.scrollTop / ROW_HEIGHT;
		const nextIndex = readIndex(scroller.scrollTop);
		if (Math.abs(raw - nextIndex) < 0.05) {
			emitIfChanged(nextIndex);
		}
		window.clearTimeout(settleTimerRef.current);
		settleTimerRef.current = window.setTimeout(() => {
			if (programmaticRef.current || !userScrollRef.current || !scrollRef.current) {
				return;
			}
			emitIfChanged(readIndex(scrollRef.current.scrollTop));
			userScrollRef.current = false;
		}, 80);
	};

	return (
		<div className={styles.column}>
			<div
				ref={scrollRef}
				className={styles.scroller}
				role='listbox'
				aria-label={ariaLabel}
				onPointerDown={markUserScroll}
				onWheel={markUserScroll}
				onTouchStart={markUserScroll}
				onScroll={onScroll}
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
							className={cn(unstyled.control, styles.item, selected && styles.selected)}
							onClick={(event) => {
								event.stopPropagation();
								onChange(item);
								scrollToIndex(
									itemIndex,
									prefersReducedMotion() ? 'auto' : 'smooth',
								);
							}}
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
export const WheelTimePicker = forwardRef<HTMLDivElement, WheelTimePickerProps>(function WheelTimePicker(
	{
		value,
		onChange,
		active = true,
		className,
		...rest
	},
	ref,
) {
	const {messages} = useLocale();
	const hours = value?.hours ?? 0;
	const minutes = value?.minutes ?? 0;

	return (
		<div
			ref={ref}
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
				<div className={styles.separator} aria-hidden>
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
});

WheelTimePicker.displayName = 'WheelTimePicker';
