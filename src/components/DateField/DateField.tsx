import type {DateFieldProps} from './DateField.types';
export type {DateFieldProps} from './DateField.types';

import {useRef, useState, type RefCallback} from 'react';
import {Calendar} from '../Calendar/Calendar';
import {FieldBaseIcon} from '../TextField/TextField';
import {IconCalendar} from '../../icons/icons/IconCalendar';
import {MaskedField} from '../MaskedField/MaskedField';
import {Popover, type PopoverTriggerSlotProps} from '../Popover/Popover';
import {bindFieldChromeRef} from '../../core/utils/dom';
import {commitMaskedValue} from '../../core/utils/commitMaskedValue';
import {uRef} from '../../core/utils/bundle';
import {formatDateToDigits, parseDigitsToDate} from '../../core/utils/date';
import {useFallbackId} from '../../hooks/useFallbackId';
import {hidePopover, popoverDomId, showPopover} from '../../core/utils/popover';
import styles from './DateField.module.css';

/**
 * Поле даты с маской ввода и календарём в нативном popover.
 * На узком экране панель становится нижней шторкой силами CSS.
 *
 * @component
 * @example
 * <DateField label="Дата рождения" value={date} onChange={setDate} />
 */
export function DateField({
	value,
	onChange,
	label,
	width = 'md',
	disabled = false,
	readOnly = false,
	prefix,
	onClear,
	onClick,
	onFocus,
	inputRef,
	...rest
}: DateFieldProps) {
	const hostRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLElement | null>(null);
	const popoverId = popoverDomId(useFallbackId());
	const committed = formatDateToDigits(value);
	const valueTime = value?.getTime();
	const [digits, setDigits] = useState(committed);
	const [syncedTime, setSyncedTime] = useState(valueTime);
	const [viewDate, setViewDate] = useState(() => value ?? new Date());
	const interactive = !disabled && !readOnly;

	if (valueTime !== syncedTime) {
		setSyncedTime(valueTime);
		setDigits(committed);
	}

	const field = (slot?: PopoverTriggerSlotProps, anchorRef?: RefCallback<HTMLElement>) => (
		<MaskedField
			{...rest}
			inputRef={uRef(inputRef, anchorRef ? bindFieldChromeRef(anchorRef) : undefined)}
			label={label}
			width={width}
			mask='99.99.9999'
			value={digits}
			disabled={disabled}
			readOnly={readOnly}
			type='text'
			prefix={prefix ?? (
				<FieldBaseIcon>
					<IconCalendar />
				</FieldBaseIcon>
			)}
			popovertarget={slot?.popovertarget}
			popovertargetaction={slot?.popovertargetaction}
			onClick={(event) => {
				onClick?.(event);
				slot?.onClick?.(event);
				/* Открываем в click, а не в focus: иначе тот же жест light-dismiss'ит popover=auto. */
				if (interactive && !event.defaultPrevented) showPopover(panelRef.current);
			}}
			onFocus={(event) => {
				onFocus?.(event);
				/* Клавиатура (:focus-visible) — popovertarget/click не сработает. */
				if (interactive && event.currentTarget.matches(':focus-visible')) {
					showPopover(panelRef.current);
				}
			}}
			onChange={(next) => {
				if (!interactive) return;
				setDigits(next);
				commitMaskedValue(next, parseDigitsToDate, (date) => {
					onChange(date);
					if (date) setViewDate(date);
				});
			}}
			onClear={onClear ? () => {
				setDigits('');
				onChange(undefined);
				onClear();
			} : undefined}
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
					align='start'
					widthMode='content'
					className={styles.panel}
					panelRef={panelRef}
					onToggle={(open) => markExpanded(hostRef.current, open)}
					trigger={(slot, anchorRef) => field(slot, anchorRef)}
				>
					<Calendar.Provider
						value={value}
						viewDate={viewDate}
						onViewDateChange={setViewDate}
						onChange={(next) => {
							if (!(next instanceof Date)) return;
							onChange(next);
							setViewDate(next);
							hidePopover(panelRef.current);
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
			) : field()}
		</div>
	);
}

function markExpanded(host: HTMLElement | null, open: boolean) {
	host?.querySelectorAll<HTMLElement>('[data-field-control]').forEach((node) => {
		node.setAttribute('aria-expanded', open ? 'true' : 'false');
	});
}
