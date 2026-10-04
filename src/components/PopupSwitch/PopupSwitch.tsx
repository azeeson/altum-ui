import type {PopupSwitchOption, PopupSwitchProps} from './PopupSwitch.types';
export type {
	PopupSwitchAlign,
	PopupSwitchOption,
	PopupSwitchProps,
	PopupSwitchVariant,
	PopupSwitchWidth,
} from './PopupSwitch.types';

import {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type CSSProperties,
	type KeyboardEvent,
	type MouseEvent,
} from 'react';
import {Button} from '../Button/Button';
import {IconChevronUpDown} from '../../icons/icons/IconChevronUpDown';
import {useFallbackId} from '../../hooks/useFallbackId';
import {handleRovingListKeyDown, ROVING_ITEM_ATTR} from '../../hooks/useRovingList';
import {cn} from '../../core/utils/cn';
import utilities from '../../styles/utilities.module.css';
import {uRef} from '../../core/utils/bundle';
import {
	anchorNameFor,
	hidePopover,
	popoverDomId,
	showPopover,
} from '../../core/utils/popover';
import styles from './PopupSwitch.module.css';

function fadeDuration(node: HTMLElement): number {
	const raw = getComputedStyle(node).transitionDuration.split(',')[0]?.trim() ?? '0s';
	if (raw.endsWith('ms')) return parseFloat(raw);
	if (raw.endsWith('s')) return parseFloat(raw) * 1000;
	return 0;
}

function optionIndex(node: Element | null): number | null {
	if (!(node instanceof HTMLElement)) return null;
	const index = Number(node.dataset.index);
	return Number.isInteger(index) ? index : null;
}

/**
 * Кнопка текущего значения. Список — нативный `popover`: клик снаружи и Escape
 * закрывает браузер. CSS Anchor держит верх панели на верху кнопки, а
 * `translateY` смещает список так, чтобы выбранный пункт накрыл триггер.
 *
 * @component
 * @template T
 * @example
 * <PopupSwitch
 *   options={[{value: 'day', label: 'День'}, {value: 'week', label: 'Неделя'}]}
 *   value={period}
 *   onChange={setPeriod}
 * />
 */
export function PopupSwitch<T extends string | number = string>({
	value,
	options,
	onChange,
	disabled = false,
	className,
	placeholder,
	size = 'md',
	variant = 'secondary',
	width = 'auto',
	align = 'start',
	rootRef,
	'aria-label': ariaLabel,
}: PopupSwitchProps<T>) {
	const listId = popoverDomId(useFallbackId());
	const triggerId = `${listId}-trigger`;
	const anchorName = anchorNameFor(listId);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	// Пока панель гаснет, в списке остаётся прежний пункт — иначе ряд сдвигается.
	// Кнопка показывает новое значение сразу.
	const [visibleValue, setVisibleValue] = useState(value);
	const valueRef = useRef(value);
	const pendingCloseSyncRef = useRef(false);
	const closeSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	valueRef.current = value;
	const visibleIndex = options.findIndex((option) => option.value === visibleValue);
	const panelSelectedIndex = visibleIndex >= 0 ? visibleIndex : 0;
	const selectedIndex = options.findIndex((option) => option.value === value);
	const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
	const stableWidth = width === 'options';
	const reserveIcon = stableWidth && options.some((option) => option.icon != null);

	const syncVisibleValue = () => {
		pendingCloseSyncRef.current = false;
		if (closeSyncTimerRef.current != null) {
			clearTimeout(closeSyncTimerRef.current);
			closeSyncTimerRef.current = null;
		}
		setVisibleValue(valueRef.current);
	};

	useLayoutEffect(() => {
		const node = triggerRef.current;
		if (!node) return;
		node.style.setProperty('anchor-name', anchorName);
		if (!node.hasAttribute('aria-expanded')) node.setAttribute('aria-expanded', 'false');
		return () => {
			node.style.removeProperty('anchor-name');
		};
	}, [anchorName]);

	useLayoutEffect(() => {
		if (disabled) hidePopover(panelRef.current);
	}, [disabled]);

	useLayoutEffect(() => {
		if (pendingCloseSyncRef.current) return;
		if (panelRef.current?.matches(':popover-open')) return;
		setVisibleValue(value);
	}, [value]);

	useLayoutEffect(() => () => {
		if (closeSyncTimerRef.current != null) clearTimeout(closeSyncTimerRef.current);
	}, []);

	const selectAt = (index: number) => {
		const option = options[index];
		if (!option) return;
		pendingCloseSyncRef.current = true;
		onChange(option.value);
		hidePopover(panelRef.current);
	};

	const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
		if (disabled) return;
		if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
		event.preventDefault();
		showPopover(panelRef.current);
	};

	const onListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (options.length === 0) return;
		if (event.key === 'Enter' || event.key === ' ') {
			const option = (event.target as HTMLElement).closest('[role="option"]');
			const index = optionIndex(option);
			if (index == null || !event.currentTarget.contains(option)) return;
			event.preventDefault();
			selectAt(index);
			return;
		}
		handleRovingListKeyDown(event, 'vertical');
	};

	const onOptionClick = (event: MouseEvent<HTMLDivElement>) => {
		const option = (event.target as HTMLElement).closest('[role="option"]');
		if (!(option instanceof HTMLElement) || !event.currentTarget.contains(option)) return;
		if (option.hasAttribute('disabled')) return;
		const index = optionIndex(option);
		if (index == null) return;
		selectAt(index);
	};

	const optionsRef = useRef(options);
	optionsRef.current = options;

	useEffect(() => {
		const panel = panelRef.current;
		if (!panel) return;
		const finish = () => {
			if (!pendingCloseSyncRef.current) return;
			panel.removeEventListener('transitionend', onTransitionEnd);
			syncVisibleValue();
		};
		const onTransitionEnd = (transitionEvent: TransitionEvent) => {
			if (transitionEvent.target !== panel) return;
			if (transitionEvent.propertyName !== 'opacity') return;
			finish();
		};
		const onToggle = (event: Event) => {
			const open = (event as ToggleEvent).newState === 'open';
			triggerRef.current?.setAttribute('aria-expanded', open ? 'true' : 'false');
			if (open) {
				if (pendingCloseSyncRef.current) syncVisibleValue();
				const nextIndex = optionsRef.current.findIndex((option) => option.value === valueRef.current);
				const current = panel.querySelector<HTMLElement>(
					nextIndex >= 0 ? `[data-index="${nextIndex}"]` : '[role="option"]',
				);
				current?.focus();
				return;
			}

			pendingCloseSyncRef.current = true;
			if (closeSyncTimerRef.current != null) clearTimeout(closeSyncTimerRef.current);
			const wait = fadeDuration(panel);
			if (wait <= 0) {
				finish();
				return;
			}
			panel.addEventListener('transitionend', onTransitionEnd);
			closeSyncTimerRef.current = setTimeout(finish, wait + 40);
		};
		panel.addEventListener('toggle', onToggle);
		return () => {
			panel.removeEventListener('toggle', onToggle);
			panel.removeEventListener('transitionend', onTransitionEnd);
		};
	}, []);

	const triggerPrefix = reserveIcon
		? (
			<span
				className={cn(utilities.fCenter, styles.iconSlot)}
				aria-hidden
			>
				{selected?.icon}
			</span>
		)
		: selected?.icon
			? (
				<span aria-hidden>
					{selected.icon}
				</span>
			)
			: undefined;

	const triggerLabel = stableWidth
		? (
			<span className={styles.value}>
				{options.map((option) => {
					const current = option.value === value;
					return (
						<span
							key={String(option.value)}
							className={current ? undefined : styles.valueReserve}
							aria-hidden={current ? undefined : true}
						>
							{option.label}
						</span>
					);
				})}
				{placeholder
					? (
						<span
							className={selected ? styles.valueReserve : undefined}
							aria-hidden={selected ? true : undefined}
						>
							{placeholder}
						</span>
					)
					: null}
			</span>
		)
		: selected?.label ?? placeholder ?? '';

	const panelStyle = {
		'--altum-popover-anchor': anchorName,
		'--altum-popup-switch-selected': panelSelectedIndex,
	} as CSSProperties;

	return (
		<div className={styles.root}>
			<Button
				rootRef={uRef(rootRef, triggerRef)}
				id={triggerId}
				type='button'
				variant={variant}
				size={size}
				disabled={disabled}
				className={cn(styles.trigger, className)}
				prefix={triggerPrefix}
				postfix={<IconChevronUpDown aria-hidden />}
				popovertarget={disabled ? undefined : listId}
				aria-haspopup='listbox'
				aria-controls={listId}
				aria-label={ariaLabel}
				onKeyDown={onTriggerKeyDown}
			>
				{triggerLabel}
			</Button>
			<div
				ref={panelRef}
				id={listId}
				popover='auto'
				role='listbox'
				aria-orientation='vertical'
				aria-label={ariaLabel}
				aria-labelledby={ariaLabel ? undefined : triggerId}
				className={cn(utilities.scrollport, styles.panel)}
				style={panelStyle}
				data-size={size === 'md' ? undefined : size}
				data-align={align === 'start' ? undefined : align}
				onKeyDown={onListKeyDown}
				onClick={onOptionClick}
			>
				{options.map((option, index) => (
					<PopupOption
						key={String(option.value)}
						option={option}
						optionId={`${listId}-option-${index}`}
						index={index}
						selected={visibleIndex >= 0 && index === visibleIndex}
						tabIndex={index === panelSelectedIndex ? 0 : -1}
						size={size}
						variant={variant}
					/>
				))}
			</div>
		</div>
	);
}

function PopupOption<T extends string | number>({
	option,
	optionId,
	index,
	selected,
	tabIndex,
	size,
	variant,
}: {
	option: PopupSwitchOption<T>;
	optionId: string;
	index: number;
	selected: boolean;
	tabIndex: number;
	size: NonNullable<PopupSwitchProps<T>['size']>;
	variant: NonNullable<PopupSwitchProps<T>['variant']>;
}) {
	return (
		<Button
			type='button'
			role='option'
			id={optionId}
			data-index={index}
			{...{[ROVING_ITEM_ATTR]: ''}}
			aria-selected={selected}
			tabIndex={tabIndex}
			variant={variant}
			size={size}
			fullWidth
			className={styles.option}
			prefix={option.icon
				? <span aria-hidden>
					{option.icon}
				</span>
				: undefined}
			postfix={(
				<span className={styles.chevron} aria-hidden>
					{selected ? <IconChevronUpDown /> : null}
				</span>
			)}
		>
			<span className={styles.text}>
				{option.label}
			</span>
		</Button>
	);
}
