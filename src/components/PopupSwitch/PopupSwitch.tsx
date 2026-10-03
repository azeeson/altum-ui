import type {PopupSwitchOption, PopupSwitchProps} from './PopupSwitch.types';
export type {
	PopupSwitchAlign,
	PopupSwitchOption,
	PopupSwitchProps,
	PopupSwitchVariant,
	PopupSwitchWidth,
} from './PopupSwitch.types';

import {
	useLayoutEffect,
	useRef,
	useState,
	type CSSProperties,
	type HTMLAttributes,
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

function optionIndex(node: Element | null): number | null {
	if (!(node instanceof HTMLElement)) return null;
	const index = Number(node.dataset.index);
	return Number.isInteger(index) ? index : null;
}

function openFromToggle(event: {nativeEvent: Event}): boolean {
	return (event.nativeEvent as ToggleEvent).newState === 'open';
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
	const selectedIndex = options.findIndex((option) => option.value === value);
	const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
	const resolvedSelectedIndex = selectedIndex >= 0 ? selectedIndex : 0;
	// translateY: значение-driven, но при закрытии после выбора замораживаем старый
	// индекс до конца fade — иначе резкий сдвиг + opacity = дёрганье. Синк после
	// анимации (пока скрыт), чтобы следующее открытие уже было со смещением.
	const [panelSelectedIndex, setPanelSelectedIndex] = useState(resolvedSelectedIndex);
	const selectedIndexRef = useRef(resolvedSelectedIndex);
	const pendingCloseSyncRef = useRef(false);
	const closeSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	selectedIndexRef.current = resolvedSelectedIndex;
	const stableWidth = width === 'options';
	const reserveIcon = stableWidth && options.some((option) => option.icon != null);

	const syncPanelSelectedIndex = () => {
		pendingCloseSyncRef.current = false;
		if (closeSyncTimerRef.current != null) {
			clearTimeout(closeSyncTimerRef.current);
			closeSyncTimerRef.current = null;
		}
		setPanelSelectedIndex(selectedIndexRef.current);
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
		setPanelSelectedIndex(resolvedSelectedIndex);
	}, [resolvedSelectedIndex]);

	useLayoutEffect(() => () => {
		if (closeSyncTimerRef.current != null) clearTimeout(closeSyncTimerRef.current);
	}, []);

	const selectAt = (index: number) => {
		const option = options[index];
		if (!option) return;
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

	const onToggle = (event: {nativeEvent: Event}) => {
		const open = openFromToggle(event);
		triggerRef.current?.setAttribute('aria-expanded', open ? 'true' : 'false');
		if (open) {
			if (pendingCloseSyncRef.current) syncPanelSelectedIndex();
			const panel = panelRef.current;
			const current = panel?.querySelector<HTMLElement>('[aria-selected="true"]')
				?? panel?.querySelector<HTMLElement>('[role="option"]');
			current?.focus();
			return;
		}

		// Закрытие: не трогаем translate до конца opacity-fade.
		pendingCloseSyncRef.current = true;
		const panel = panelRef.current;
		const finish = () => {
			if (!pendingCloseSyncRef.current) return;
			panel?.removeEventListener('transitionend', onTransitionEnd);
			syncPanelSelectedIndex();
		};
		const onTransitionEnd = (transitionEvent: TransitionEvent) => {
			if (transitionEvent.target !== panel) return;
			if (transitionEvent.propertyName !== 'opacity') return;
			finish();
		};
		panel?.addEventListener('transitionend', onTransitionEnd);
		if (closeSyncTimerRef.current != null) clearTimeout(closeSyncTimerRef.current);
		// --altum-motion-overlay = 0.2s; fallback для reduced-motion / пропущенного transitionend
		closeSyncTimerRef.current = setTimeout(finish, 250);
	};

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
				{...({onToggle} as unknown as HTMLAttributes<HTMLDivElement>)}
			>
				{options.map((option, index) => (
					<PopupOption
						key={String(option.value)}
						option={option}
						optionId={`${listId}-option-${index}`}
						index={index}
						selected={option.value === value}
						tabIndex={index === (selectedIndex >= 0 ? selectedIndex : 0) ? 0 : -1}
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
