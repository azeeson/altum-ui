import type {
	ChipProps,
	ChipGroupProps,
} from './Chip.types';
export type {
	ChipVariant,
	ChipMode,
	ChipProps,
	ChipGroupGap,
	ChipGroupProps,
} from './Chip.types';

import type {MouseEvent, Ref} from 'react';
import {IconCross} from '../../icons/icons/IconCross';
import styles from './Chip.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_chip} from '../../locales/slices/chip.ru';

const localeFallback = {
	chip: ru_chip,
};

/**
 * Компактная метка: чип, тег или toggle-фильтр (`mode`).
 * Secondary / tinted читают `--altum-color-chip-*`.
 *
 * @component
 * @example
 * <Chip mode="toggle" variant="tinted" onClick={() => toggle('react')}>React</Chip>
 * <Chip mode="tag" variant="success">Готово</Chip>
 */
export const Chip = ({
	variant = 'secondary',
	size = 'md',
	mode = 'chip',
	children,
	onRemove,
	onClick,
	disabled = false,
	icon,
	className,
	removeLabel,
	rootRef,
	value,
	...rest
}: ChipProps) => {
	const {t} = useLocale(localeFallback);
	const isTag = mode === 'tag';
	const isToggle = mode === 'toggle';
	const isRemovable = !!onRemove && !disabled;
	const isInteractive = !!onClick && !disabled;
	const splitInteractive = isInteractive && isRemovable;
	const classNames = cn(styles.chip, className);
	const data = {
		'data-variant': variant !== 'primary' ? variant : undefined,
		'data-size': size !== 'md' ? size : undefined,
		'data-mode': mode !== 'chip' ? mode : undefined,
		'data-interactive': isInteractive ? '' as const : undefined,
		'data-removable': isRemovable ? '' as const : undefined,
		'data-disabled': disabled ? '' as const : undefined,
		'data-value': value,
	};
	const body = (
		<>
			{icon && (
				<span className={cn(utilities.fCenter, styles.icon)} aria-hidden={isTag || undefined}>
					{icon}
				</span>
			)}
			<span className={styles.label}>
				{children}
			</span>
		</>
	);
	const remove = isRemovable ? (
		<button
			type='button'
			className={cn(unstyled.control, utilities.fCenter, styles.removeBtn)}
			data-chip-action='remove'
			aria-label={removeLabel ?? t('chip.remove')}
		>
			<IconCross />
		</button>
	) : null;

	const handleRootClick = (event: MouseEvent<HTMLElement>) => {
		const removeBtn = (event.target as HTMLElement).closest('[data-chip-action="remove"]');
		if (removeBtn && event.currentTarget.contains(removeBtn)) {
			event.stopPropagation();
			onRemove?.();
			return;
		}
		onClick?.(event as MouseEvent<HTMLButtonElement | HTMLSpanElement>);
	};

	if (isInteractive && !isRemovable) {
		return (
			<button
				ref={rootRef as Ref<HTMLButtonElement>}
				type='button'
				className={classNames}
				disabled={disabled}
				{...rest}
				{...data}
				aria-pressed={isToggle ? true : undefined}
				aria-disabled={disabled || undefined}
				onClick={onClick}
			>
				{body}
			</button>
		);
	}

	return (
		<span
			ref={rootRef as Ref<HTMLSpanElement>}
			className={classNames}
			{...rest}
			{...data}
			aria-disabled={disabled || undefined}
			onClick={isRemovable || isInteractive ? handleRootClick : undefined}
		>
			{splitInteractive ? (
				<button
					type='button'
					className={cn(unstyled.control, styles.action)}
					onClick={onClick}
					aria-pressed={isToggle || undefined}
					disabled={disabled}
				>
					{body}
				</button>
			) : body}
			{remove}
		</span>
	);
};

/**
 * Горизонтальная группа чипов / тегов (`role="group"`).
 * Упаковка влево, flex-перенос и одинаковый `gap` в каждом ряду.
 * Последний неполный ряд оставляет пустой хвост — это ожидаемо.
 * Выбор — `onSelect` с делегированием по `data-value` (per-chip `onClick` сохранён).
 *
 * @component
 * @example
 * <ChipGroup aria-label="Фильтры" onSelect={setFilter}>
 *   <Chip mode="toggle" value="active">Активные</Chip>
 * </ChipGroup>
 */
export const ChipGroup = ({
	children,
	'aria-label': ariaLabel,
	gap = 'md',
	mode = 'chip',
	onSelect,
	onClick,
	className,
	style,
	rootRef,
	...rest
}: ChipGroupProps) => {
	const {t} = useLocale(localeFallback);

	return (
		<div
			ref={rootRef}
			className={cn(styles.chipGroup, className)}
			style={style}
			{...rest}
			role='group'
			aria-label={ariaLabel ?? (mode === 'tag' ? t('chip.groupTags') : t('chip.groupChips'))}
			data-gap={gap !== 'md' ? gap : undefined}
			onClick={onSelect || onClick ? (event) => {
				onClick?.(event);
				if ((event.target as HTMLElement).closest('[data-chip-action="remove"]')) return;
				if (!onSelect) return;
				const node = (event.target as HTMLElement).closest('[data-value]');
				const value = node?.getAttribute('data-value');
				if (value != null) onSelect(value);
			} : undefined}
		>
			{children}
		</div>
	);
};
