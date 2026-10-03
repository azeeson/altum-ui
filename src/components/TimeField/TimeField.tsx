import type {TimeFieldProps} from './TimeField.types';
export type {TimeFieldProps} from './TimeField.types';

import {useRef, useState, type RefCallback} from 'react';
import {MaskedField} from '../MaskedField/MaskedField';
import {Popover, type PopoverTriggerSlotProps} from '../Popover/Popover';
import {FieldBaseIcon} from '../TextField/TextField';
import {IconClock} from '../../icons/icons/IconClock';
import {bindFieldChromeRef} from '../../core/utils/dom';
import {commitMaskedValue} from '../../core/utils/commitMaskedValue';
import {uRef} from '../../core/utils/bundle';
import {useFallbackId} from '../../hooks/useFallbackId';
import {popoverDomId, showPopover} from '../../core/utils/popover';
import {WheelTimePicker, type TimeValue} from '../WheelTimePicker';
import {formatHHmm} from '../../core/utils/date';
import styles from './TimeField.module.css';

const isClock = (hours: number, minutes: number) => (
	Number.isInteger(hours)
	&& Number.isInteger(minutes)
	&& hours >= 0 && hours <= 23
	&& minutes >= 0 && minutes <= 59
);

const parseDigitsToTime = (digits: string) => {
	if (digits.length !== 4) return;
	const hours = +digits.slice(0, 2);
	const minutes = +digits.slice(2);
	return isClock(hours, minutes) ? formatHHmm(hours, minutes) : undefined;
};

const parseTime = (value: string): TimeValue | null => {
	const [hours, minutes] = value.split(':').map(Number);
	if (!isClock(hours, minutes)) return null;
	return {
		hours,
		minutes,
	};
};

function markExpanded(host: HTMLElement | null, open: boolean) {
	host?.querySelectorAll<HTMLElement>('[data-field-control]').forEach((node) => {
		node.setAttribute('aria-expanded', open ? 'true' : 'false');
	});
}

/**
 * Поле времени (маска HH:MM) с барабанами в нативном `Popover`.
 * Значение — строка вида `09:30`. На узком экране панель — нижняя шторка (CSS).
 *
 * @component
 * @example
 * <TimeField label="Начало" value={time} onChange={setTime} />
 */
export function TimeField({
	value,
	onChange,
	label,
	disabled,
	readOnly,
	prefix,
	onFocus,
	onClick,
	onKeyDown,
	className,
	inputRef,
	...props
}: TimeFieldProps) {
	const hostRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLElement | null>(null);
	const popoverId = popoverDomId(useFallbackId());
	const committed = value.replace(/\D/g, '');
	const [digits, setDigits] = useState(committed);
	const [synced, setSynced] = useState(committed);
	const [open, setOpen] = useState(false);
	const interactive = !disabled && !readOnly;
	const commitTime = (next: TimeValue) => onChange(formatHHmm(next.hours, next.minutes));

	if (committed !== synced) {
		setSynced(committed);
		setDigits(committed);
	}

	const field = (slot?: PopoverTriggerSlotProps, anchorRef?: RefCallback<HTMLElement>) => (
		<MaskedField
			{...props}
			inputRef={uRef(inputRef, anchorRef ? bindFieldChromeRef(anchorRef) : undefined)}
			className={className}
			label={label}
			mask='99:99'
			value={digits}
			onChange={(next) => {
				if (readOnly) return;
				setDigits(next);
				commitMaskedValue(next, parseDigitsToTime, (time) => onChange(time ?? ''));
			}}
			disabled={disabled}
			readOnly={readOnly}
			prefix={prefix ?? (
				<FieldBaseIcon>
					<IconClock />
				</FieldBaseIcon>
			)}
			popovertarget={slot?.popovertarget}
			popovertargetaction={slot?.popovertargetaction}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) slot?.onClick?.(event);
				if (interactive && !event.defaultPrevented) showPopover(panelRef.current);
			}}
			onKeyDown={onKeyDown}
			onFocus={(event) => {
				onFocus?.(event);
				if (interactive && event.currentTarget.matches(':focus-visible')) {
					showPopover(panelRef.current);
				}
			}}
		/>
	);

	return (
		<div className={styles.host} ref={hostRef}>
			{interactive ? (
				<Popover
					id={popoverId}
					popoverTargetAction='show'
					role='dialog'
					side='bottom'
					align='end'
					widthMode='content'
					className={styles.panel}
					panelRef={panelRef}
					onToggle={(next) => {
						setOpen(next);
						markExpanded(hostRef.current, next);
					}}
					trigger={(slot, anchorRef) => field(slot, anchorRef)}
				>
					<WheelTimePicker
						active={open}
						value={parseTime(value)}
						onChange={commitTime}
					/>
				</Popover>
			) : field()}
		</div>
	);
}
