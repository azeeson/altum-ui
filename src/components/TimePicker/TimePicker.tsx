import type {
	TimePickerProps,
	TimePickerFieldProps,
} from './TimePicker.types';
export type {
	TimePickerProps,
	TimePickerFieldProps,
} from './TimePicker.types';

import React, {
	forwardRef,
	useState,
	useEffect,
	useLayoutEffect,
	useRef,
	useId,
	useCallback,
} from 'react';
import styles from './TimePicker.module.css';
import {Dropdown} from '../Dropdown/Dropdown';
import {MaskedField} from '../MaskedField/MaskedField';
import {FieldBase} from '../../base/FieldBase';
import {Box} from '../Box/Box';
import {IconClock} from '../../icons/icons/IconClock';
import {SelectionGroup} from '../SelectionGroup/SelectionGroup';
import {cn} from '../../utils/cn';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {composeRefs} from '../../utils/composeRefs';

const buildHourItems = (): string[] =>
	Array.from({length: 24}, (_, i) => (i < 10 ? `0${i}` : `${i}`));

const buildMinuteItems = (): string[] =>
	Array.from({length: 12}, (_, i) => {
		const minute = i * 5;
		return minute < 10 ? `0${minute}` : `${minute}`;
	});

const normalizeHour = (hour: string): string => {
	const hourNum = parseInt(hour, 10);
	if (Number.isNaN(hourNum) || hourNum < 0 || hourNum > 23) return hour;
	return hourNum < 10 ? `0${hourNum}` : `${hourNum}`;
};

const normalizeMinute = (minute: string): string => {
	const minuteNum = parseInt(minute, 10);
	if (Number.isNaN(minuteNum) || minuteNum < 0 || minuteNum > 59) return minute;
	return minuteNum < 10 ? `0${minuteNum}` : `${minuteNum}`;
};

/** Ближайшая 5-минутная метка для скролла, если точное значение вне списка */
const resolveMinuteForScroll = (minute: string, minuteItems: string[]): string => {
	if (minuteItems.includes(minute)) return minute;
	const minuteNum = parseInt(minute, 10);
	if (Number.isNaN(minuteNum)) return minuteItems[0];

	return minuteItems.reduce((nearest, item) => {
		const nearestDiff = Math.abs(parseInt(nearest, 10) - minuteNum);
		const itemDiff = Math.abs(parseInt(item, 10) - minuteNum);
		return itemDiff < nearestDiff ? item : nearest;
	}, minuteItems[0]);
};

interface TimePickerColumnProps {
	scrollRef: React.Ref<HTMLDivElement>;
	items: string[];
	value: string;
	ariaLabel: string;
	onSelect: (nextValue: string) => void;
	isItemSelected: (item: string) => boolean;
}

const TimePickerColumn: React.FC<TimePickerColumnProps> = ({
	scrollRef,
	items,
	value,
	ariaLabel,
	onSelect,
	isItemSelected,
}) => (
	<div className={styles.timeCol}>
		<SelectionGroup.Root
			value={value}
			onChange={onSelect}
			orientation='vertical'
		>
			<SelectionGroup.List
				ref={scrollRef}
				className={styles.timeColScroll}
				role='listbox'
				aria-label={ariaLabel}
			>
				<div className={styles.timeColPad} aria-hidden='true' />
				{items.map((item) => (
					<SelectionGroup.Item
						key={item}
						value={item}
						role='option'
						aria-selected={isItemSelected(item)}
						className={isItemSelected(item) ? styles.timeSelected : styles.timeOption}
						onClick={(event) => event.stopPropagation()}
					>
						{item}
					</SelectionGroup.Item>
				))}
				<div className={styles.timeColPad} aria-hidden='true' />
			</SelectionGroup.List>
		</SelectionGroup.Root>
	</div>
);

/**
 * Панель выбора времени с колонками часов и минут; для поля — `TimePickerField`.
 *
 * @component
 * @example
 * <TimePicker value="09:30" onChange={setTime} embedded />
 */
export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(function TimePicker(
	{
		value,
		onChange,
		className,
		embedded = false,
		active = true,
		...rest
	},
	ref,
) {
	const {messages} = useLocale();
	const [hours, minutes] = value.split(':');
	const selectedHour = normalizeHour(hours || '12');
	const selectedMinute = normalizeMinute(minutes || '00');

	const hourItems = buildHourItems();
	const minuteItems = buildMinuteItems();
	const minuteInList = minuteItems.includes(selectedMinute);
	const scrollMinute = resolveMinuteForScroll(selectedMinute, minuteItems);
	const minuteGroupValue = minuteInList ? selectedMinute : scrollMinute;

	const hourScrollRef = useRef<HTMLDivElement>(null);
	const minuteScrollRef = useRef<HTMLDivElement>(null);

	 
	const scrollToSelected = useCallback(() => {
		const scrollColumn = (container: HTMLDivElement | null, targetValue: string) => {
			if (!container) return;
			const target = Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find(
				(button) => button.textContent === targetValue,
			);
			if (!target) return;

			const offset =
				target.offsetTop - container.clientHeight / 2 + target.clientHeight / 2;
			const maxScrollTop = container.scrollHeight - container.clientHeight;
			container.scrollTop = Math.max(0, Math.min(maxScrollTop, offset));
		};

		scrollColumn(hourScrollRef.current, selectedHour);
		scrollColumn(minuteScrollRef.current, scrollMinute);
		 
	}, [scrollMinute, selectedHour]);

	useLayoutEffect(() => {
		if (!active) return;

		const scheduleScroll = () => {
			scrollToSelected();
			requestAnimationFrame(scrollToSelected);
		};

		scheduleScroll();
		const afterSheetAnimation = window.setTimeout(scrollToSelected, 300);

		const observers = [hourScrollRef, minuteScrollRef]
			.map((ref) => {
				if (!ref.current) return null;
				const observer = new ResizeObserver(scrollToSelected);
				observer.observe(ref.current);
				return observer;
			})
			.filter(Boolean) as ResizeObserver[];

		return () => {
			window.clearTimeout(afterSheetAnimation);
			observers.forEach((observer) => observer.disconnect());
		};
	}, [active, scrollToSelected]);

	const rootClasses = cn(
		styles.timePicker,
		embedded && styles.timePickerEmbedded,
		className,
	);

	const columns = (
		<>
			<TimePickerColumn
				scrollRef={hourScrollRef}
				items={hourItems}
				value={selectedHour}
				ariaLabel={messages.timePicker.hours}
				onSelect={(hour) => onChange(`${hour}:${selectedMinute}`)}
				isItemSelected={(hour) => hour === selectedHour}
			/>
			<div className={styles.timeSeparator} aria-hidden='true'>
				:
			</div>
			<TimePickerColumn
				scrollRef={minuteScrollRef}
				items={minuteItems}
				value={minuteGroupValue}
				ariaLabel={messages.timePicker.minutes}
				onSelect={(minute) => onChange(`${selectedHour}:${minute}`)}
				isItemSelected={(minute) => minuteInList && minute === selectedMinute}
			/>
		</>
	);

	/* Автономный режим: Box.floating — та же поверхность, что Dropdown.Content. */
	if (embedded) {
		return (
			<div
				ref={ref}
				className={rootClasses}
				onClick={(event) => event.stopPropagation()}
				{...rest}
			>
				{columns}
			</div>
		);
	}

	return (
		<Box
			variant='floating'
			ref={ref}
			{...rest}
		>
			<div className={rootClasses} onClick={(event) => event.stopPropagation()}>
				{columns}
			</div>
		</Box>
	);
});

TimePicker.displayName = 'TimePicker';

const parseDigitsToTime = (digits: string): boolean => {
	if (digits.length !== 4) return false;
	const h = parseInt(digits.slice(0, 2), 10);
	const m = parseInt(digits.slice(2, 4), 10);
	return h >= 0 && h < 24 && m >= 0 && m < 60;
};

/**
 * Поле времени (маска HH:MM) с выпадающей панелью `TimePicker`.
 * Значение — строка вида `09:30`.
 *
 * @component
 * @example
 * <TimePickerField
 *   label="Начало"
 *   value={time}
 *   onChange={setTime}
 *   onClear={() => {}}
 * />
 */
export const TimePickerField = forwardRef<HTMLInputElement, TimePickerFieldProps>(
	function TimePickerField({
		value,
		onChange,
		label,
		size = 'md',
		className = '',
		disabled = false,
		readOnly = false,
		onClear,
		clearLabel,
		prefix,
		id: providedId,
		...props
	}, ref) {
		const [isOpen, setIsOpen] = useState(false);
		const [inputValue, setInputValue] = useState(value.replace(/\D/g, ''));
		const generatedId = useId();
		const fieldId = providedId ?? generatedId;
		const isInteractive = !disabled && !readOnly;

		useEffect(() => {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- синхронизация локального ввода с value
			setInputValue(value.replace(/\D/g, ''));
		}, [value]);

		const handleInputChange = (nextValue: string) => {
			if (readOnly) return;
			setInputValue(nextValue);
			if (nextValue.length === 4 && parseDigitsToTime(nextValue)) {
				const formatted = `${nextValue.slice(0, 2)}:${nextValue.slice(2, 4)}`;
				onChange(formatted);
			} else if (!nextValue) {
				// Сбрасывать родителя только когда пусто — незавершённые правки оставляют локальные цифры
				onChange('');
			}
		};

		const handleClear = () => {
			setInputValue('');
			onChange('');
			onClear?.();
		};

		return (
			<Dropdown
				open={isOpen}
				onClose={() => setIsOpen(false)}
				onOpenChange={(next) => {
					if (next && isInteractive) setIsOpen(true);
					if (!next) setIsOpen(false);
				}}
				triggerMode='combobox'
				widthMode='trigger-fit'
				popupRole='dialog'
				panelScroll='content'
				mobileTitle={label}
			>
				<Dropdown.Trigger asChild>
					<MaskedField
						ref={composeRefs(ref)}
						id={fieldId}
						{...props}
						label={label}
						size={size}
						mask='99:99'
						value={inputValue}
						className={cn(className)}
						onChange={handleInputChange}
						onFocus={() => isInteractive && setIsOpen(true)}
						active={isOpen}
						disabled={disabled}
						readOnly={readOnly}
						aria-haspopup='dialog'
						prefix={prefix ?? (
							<FieldBase.Icon>
								<IconClock />
							</FieldBase.Icon>
						)}
						onClear={onClear ? handleClear : undefined}
						clearLabel={clearLabel}
					/>
				</Dropdown.Trigger>
				<Dropdown.Content>
					<TimePicker
						embedded
						active={isOpen}
						value={value}
						onChange={(time) => {
							onChange(time);
							setIsOpen(false);
						}}
					/>
				</Dropdown.Content>
			</Dropdown>
		);
	},
);

TimePickerField.displayName = 'TimePickerField';
