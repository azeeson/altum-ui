import type {DateRangeFieldProps, DateRangeValue} from './DateRangeField.types';
export type {
	DateRangeValue,
	DateRangeFieldProps,
} from './DateRangeField.types';

import {
	useId,
	useRef,
	useState,
	type FocusEvent,
	type MouseEvent,
	type ReactNode,
	type Ref,
	type RefCallback,
	type RefObject,
} from 'react';
import {MaskedField} from '../MaskedField/MaskedField';
import {Calendar} from '../Calendar/Calendar';
import {Popover, type PopoverTriggerSlotProps} from '../Popover/Popover';
import styles from './DateRangeField.module.css';
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';
import {bindFieldChromeRef} from '../../core/utils/dom';
import {uRef} from '../../core/utils/bundle';
import {formatDateToDigits, parseDigitsToDate} from '../../core/utils/date';
import {useFallbackId} from '../../hooks/useFallbackId';
import {hidePopover, popoverDomId, showPopover} from '../../core/utils/popover';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_dateRangeField} from '../../locales/slices/dateRangeField.ru';

const localeFallback = {
	dateRangeField: ru_dateRangeField,
};

const formatRangeDigits = (range: DateRangeValue): string => {
	if (!range.start && !range.end) return '';
	if (range.start && !range.end) return formatDateToDigits(range.start);
	if (range.start && range.end) {
		return `${formatDateToDigits(range.start)}${formatDateToDigits(range.end)}`;
	}
	return '';
};

const sameInstant = (a?: Date, b?: Date) => (a?.getTime() ?? null) === (b?.getTime() ?? null);

interface RangeInputsProps {
	isSplit: boolean;
	size: DateRangeFieldProps['size'];
	width: DateRangeFieldProps['width'];
	startLabel: string;
	endLabel: string;
	label: string;
	startDigits: string;
	endDigits: string;
	singleDigits: string;
	disabled: boolean;
	readOnly: boolean;
	error?: DateRangeFieldProps['error'];
	description?: DateRangeFieldProps['description'];
	prefix?: DateRangeFieldProps['prefix'];
	postfix?: DateRangeFieldProps['postfix'];
	onClear?: DateRangeFieldProps['onClear'];
	clearLabel?: string;
	fieldId: string;
	inputRef?: Ref<HTMLInputElement>;
	slot?: PopoverTriggerSlotProps;
	anchorRef?: RefCallback<HTMLElement>;
	panelRef: RefObject<HTMLElement | null>;
	interactive: boolean;
	onStart: (digits: string) => void;
	onEnd: (digits: string) => void;
	onRange: (digits: string) => void;
}

function RangeInputs({
	isSplit,
	size = 'md',
	width,
	startLabel,
	endLabel,
	label,
	startDigits,
	endDigits,
	singleDigits,
	disabled,
	readOnly,
	error,
	description,
	prefix,
	postfix,
	onClear,
	clearLabel,
	fieldId,
	inputRef,
	slot,
	anchorRef,
	panelRef,
	interactive,
	onStart,
	onEnd,
	onRange,
}: RangeInputsProps): ReactNode {
	const openFromClick = (event: MouseEvent<HTMLElement>) => {
		slot?.onClick?.(event);
		/* Открываем в click, а не в focus: иначе тот же жест light-dismiss'ит popover=auto. */
		if (interactive && !event.defaultPrevented) showPopover(panelRef.current);
	};
	const openFromKeyboardFocus = (event: FocusEvent<HTMLElement>) => {
		/* Клавиатура (:focus-visible) — popovertarget/click не сработает. */
		if (interactive && event.currentTarget.matches(':focus-visible')) {
			showPopover(panelRef.current);
		}
	};

	if (isSplit) {
		return (
			<div
				className={styles.splitFields}
				data-size={size !== 'md' ? size : undefined}
				ref={anchorRef}
				popovertarget={slot?.popovertarget}
				popovertargetaction={slot?.popovertargetaction}
				onClick={slot || interactive ? openFromClick : undefined}
				onFocusCapture={(event) => {
					if (
						interactive
						&& event.target instanceof HTMLElement
						&& event.target.matches(':focus-visible')
					) {
						showPopover(panelRef.current);
					}
				}}
			>
				<div className={styles.fieldSlot}>
					<MaskedField
						inputRef={inputRef}
						label={startLabel}
						size={size}
						mask='99.99.9999'
						type='text'
						value={startDigits}
						onChange={onStart}
						disabled={disabled}
						readOnly={readOnly}
					/>
				</div>
				<span className={cn(utilities.fCenter, styles.dash)} aria-hidden>
					—
				</span>
				<div className={styles.fieldSlot}>
					<MaskedField
						label={endLabel}
						size={size}
						mask='99.99.9999'
						type='text'
						value={endDigits}
						onChange={onEnd}
						disabled={disabled}
						readOnly={readOnly}
					/>
				</div>
			</div>
		);
	}

	return (
		<MaskedField
			inputRef={uRef(inputRef, anchorRef ? bindFieldChromeRef(anchorRef) : undefined)}
			id={fieldId}
			label={label}
			size={size}
			width={width}
			mask='99.99.9999 — 99.99.9999'
			type='text'
			value={singleDigits}
			error={error}
			description={description}
			prefix={prefix}
			postfix={postfix}
			onClear={onClear}
			clearLabel={clearLabel}
			disabled={disabled}
			readOnly={readOnly}
			popovertarget={slot?.popovertarget}
			popovertargetaction={slot?.popovertargetaction}
			onClick={openFromClick}
			onFocus={openFromKeyboardFocus}
			onChange={onRange}
		/>
	);
}

/** Пустая часть очищает границу, 8 цифр парсятся, недописанная оставляет текущую. */
const boundFromPart = (part: string, current: Date | undefined): Date | undefined => {
	if (part.length === 8) return parseDigitsToDate(part);
	if (part.length === 0) return undefined;
	return current;
};

/**
 * Выбор диапазона дат: маскированное поле + календарь в режиме range.
 * Панель — нативный popover; на узком экране она становится нижней шторкой.
 *
 * @component
 * @example
 * <DateRangeField value={range} onChange={setRange} label="Период отчёта" />
 */
export function DateRangeField({
	value,
	onChange,
	label,
	startLabel,
	endLabel,
	layout = 'single',
	size = 'md',
	width = 'md',
	className,
	disabled = false,
	readOnly = false,
	error,
	description,
	prefix,
	postfix,
	onClear,
	clearLabel,
	rootRef,
	inputRef,
	...rest
}: DateRangeFieldProps) {
	const {messages} = useLocale(localeFallback);
	const hostRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLElement | null>(null);
	const popoverId = popoverDomId(useFallbackId());
	const fieldId = useId();
	const isSplit = layout === 'split';
	const interactive = !disabled && !readOnly;
	const startTime = value.start?.getTime();
	const endTime = value.end?.getTime();
	const stamp = `${startTime ?? ''}|${endTime ?? ''}`;
	const [startDigits, setStartDigits] = useState(() => formatDateToDigits(value.start));
	const [endDigits, setEndDigits] = useState(() => formatDateToDigits(value.end));
	const [singleDigits, setSingleDigits] = useState(() => formatRangeDigits(value));
	const [synced, setSynced] = useState(stamp);
	const [viewDate, setViewDate] = useState(() => value.end ?? value.start ?? new Date());

	if (stamp !== synced) {
		setSynced(stamp);
		setStartDigits(formatDateToDigits(value.start));
		setEndDigits(formatDateToDigits(value.end));
		setSingleDigits(formatRangeDigits(value));
	}

	const publish = (next: DateRangeValue) => {
		if (sameInstant(next.start, value.start) && sameInstant(next.end, value.end)) return;
		onChange(next);
	};

	const commitBound = (digits: string, bound: 'start' | 'end') => {
		if (!interactive) return;
		if (bound === 'start') setStartDigits(digits);
		else setEndDigits(digits);
		if (digits.length !== 0 && digits.length !== 8) return;
		const parsed = digits ? parseDigitsToDate(digits) : undefined;
		if (digits && !parsed) return;
		if (bound === 'start') {
			publish({
				start: parsed,
				end: value.end && parsed && parsed > value.end ? undefined : value.end,
			});
		} else if (value.start && parsed && parsed < value.start) {
			publish({
				start: parsed,
				end: value.start,
			});
		} else {
			publish({
				start: value.start,
				end: parsed,
			});
		}
		if (parsed) setViewDate(parsed);
	};

	const commitRange = (digits: string) => {
		if (!interactive) return;
		setSingleDigits(digits);
		const startPart = digits.slice(0, 8);
		const endPart = digits.slice(8, 16);
		let nextStart = boundFromPart(startPart, value.start);
		let nextEnd = boundFromPart(endPart, value.end);
		if (nextStart && nextEnd && nextEnd < nextStart) {
			[nextStart, nextEnd] = [nextEnd, nextStart];
		}
		publish({
			start: nextStart,
			end: nextEnd,
		});
		const typed = endPart.length === 8 ? nextEnd : startPart.length === 8 ? nextStart : undefined;
		if (typed) setViewDate(typed);
	};

	const inputs = (slot?: PopoverTriggerSlotProps, anchorRef?: RefCallback<HTMLElement>) => (
		<RangeInputs
			isSplit={isSplit}
			size={size}
			width={width}
			startLabel={startLabel ?? messages.dateRangeField.start}
			endLabel={endLabel ?? messages.dateRangeField.end}
			label={label ?? messages.dateRangeField.label}
			startDigits={startDigits}
			endDigits={endDigits}
			singleDigits={singleDigits}
			disabled={disabled}
			readOnly={readOnly}
			error={error}
			description={description}
			prefix={prefix}
			postfix={postfix}
			onClear={onClear}
			clearLabel={clearLabel}
			fieldId={fieldId}
			inputRef={inputRef}
			slot={slot}
			anchorRef={anchorRef}
			panelRef={panelRef}
			interactive={interactive}
			onStart={(digits) => commitBound(digits, 'start')}
			onEnd={(digits) => commitBound(digits, 'end')}
			onRange={commitRange}
		/>
	);

	return (
		<div
			ref={uRef(rootRef, hostRef)}
			className={cn(styles.root, className)}
			data-layout={layout}
			data-width={width === 'full' ? 'full' : undefined}
			{...rest}
		>
			{interactive ? (
				<Popover
					id={popoverId}
					popoverTargetAction='show'
					role='dialog'
					side='bottom'
					align='start'
					widthMode='content'
					className={styles.panel}
					panelRef={panelRef}
					onToggle={(open) => markExpanded(hostRef.current, open)}
					trigger={(slot, anchorRef) => inputs(slot, anchorRef)}
				>
					<Calendar.Provider
						selectionMode='range'
						value={value}
						viewDate={viewDate}
						onViewDateChange={setViewDate}
						onChange={(next) => {
							if (next instanceof Date) return;
							onChange(next);
							if (next.end) setViewDate(next.end);
							else if (next.start) setViewDate(next.start);
							if (next.start && next.end) hidePopover(panelRef.current);
						}}
					>
						<Calendar.Root>
							<Calendar.Header>
								<Calendar.Nav direction='prev' />
								<Calendar.Title />
								<Calendar.Nav direction='next' />
							</Calendar.Header>
							<Calendar.Body />
						</Calendar.Root>
					</Calendar.Provider>
				</Popover>
			) : inputs()}
		</div>
	);
}

function markExpanded(host: HTMLElement | null, open: boolean) {
	host?.querySelectorAll<HTMLElement>('[data-field-control]').forEach((node) => {
		node.setAttribute('aria-expanded', open ? 'true' : 'false');
	});
}
