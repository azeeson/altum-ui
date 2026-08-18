import type {
	ChipProps,
	ChipGroupProps,
} from './Chip.types';
export type {
	ChipVariant,
	ChipMode,
	ChipProps,
	ChipGroupGap,
	ChipGroupLayout,
	ChipGroupOverflowAffordance,
	ChipGroupProps,
} from './Chip.types';

import React, {forwardRef, useCallback, useEffect, useRef, useState} from 'react';
import {IconCross} from '../../icons/icons/IconCross';
import styles from './Chip.module.css';
import {cn} from '../../utils/cn';
import {composeRefs} from '../../utils/composeRefs';
import type {ControlSize} from '../../types';
import {useLocale} from '../LocaleProvider/LocaleProvider';

const REMOVE_ICON_SIZE: Record<ControlSize, number> = {
	sm: 8,
	md: 10,
	lg: 12,
};

/**
 * Компактная метка: фильтр-чип или тег (`mode="tag"`).
 * Tag с `onClick` кликабелен и получает тот же hover, что chip.
 * Secondary / tinted читают `--altum-color-chip-*` (Box может переопределить).
 *
 * @component
 * @example
 * <Chip variant="tinted" active onClick={() => toggle('react')}>React</Chip>
 * <Chip mode="tag" variant="success">Готово</Chip>
 * <Chip mode="tag" variant="info" onClick={() => {}}>Кликабельный тег</Chip>
 */
export const Chip = React.forwardRef<HTMLButtonElement | HTMLSpanElement, ChipProps>(function Chip(
	{
		variant = 'primary',
		size = 'md',
		mode = 'chip',
		active = false,
		children,
		onRemove,
		onClick,
		disabled = false,
		icon,
		className = '',
		removeLabel,
		onKeyDown,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const isTag = mode === 'tag';
	const isInteractive = !!onClick && !disabled;
	const splitInteractive = isInteractive && !!onRemove;
	const Element = isInteractive && !onRemove ? 'button' : 'span';

	const classes = cn(
		styles.chip,
		isTag ? styles.modeTag : styles.modeChip,
		styles[variant],
		styles[size],
		!isTag && active ? styles.active : '',
		isInteractive ? styles.clickable : '',
		onRemove ? styles.chipRemovable : '',
		disabled ? styles.disabled : '',
		className,
	);

	const handleClick: React.MouseEventHandler<HTMLButtonElement | HTMLSpanElement> = (event) => {
		onClick?.(event);
		if (event.defaultPrevented || !isInteractive || splitInteractive) return;
	};

	return (
		<Element
			ref={ref as React.Ref<HTMLButtonElement & HTMLSpanElement>}
			className={classes}
			type={Element === 'button' ? 'button' : undefined}
			{...rest}
			aria-pressed={isInteractive && !isTag && !splitInteractive ? active : undefined}
			aria-disabled={disabled || undefined}
			disabled={Element === 'button' ? disabled : undefined}
			onClick={isInteractive && !splitInteractive ? handleClick : undefined}
			onKeyDown={onKeyDown}
		>
			{splitInteractive ? (
				<button
					type='button'
					className={styles.action}
					onClick={(event) => {
						onClick?.(event);
					}}
					aria-pressed={!isTag ? active : undefined}
					disabled={disabled}
				>
					{icon && (
						<span className={styles.icon} aria-hidden={isTag || undefined}>
							{icon}
						</span>
					)}
					<span className={styles.label}>
						{children}
					</span>
				</button>
			) : (
				<>
					{icon && (
						<span className={styles.icon} aria-hidden={isTag || undefined}>
							{icon}
						</span>
					)}
					<span className={styles.label}>
						{children}
					</span>
				</>
			)}
			{onRemove && !disabled && (
				<button
					type='button'
					className={styles.removeBtn}
					onClick={(event) => {
						event.stopPropagation();
						onRemove();
					}}
					aria-label={removeLabel ?? t('chip.remove')}
				>
					<IconCross size={REMOVE_ICON_SIZE[size]} />
				</button>
			)}
		</Element>
	);
});

Chip.displayName = 'Chip';

/**
 * Горизонтальная группа чипов / тегов (`role="group"`).
 *
 * `layout="wrap"` (по умолчанию): упаковка влево, flex-перенос и одинаковый `gap` в каждом ряду.
 * Последний неполный ряд оставляет пустой хвост — это ожидаемо. Не растягивайте через `space-between`.
 *
 * @component
 * @example
 * <ChipGroup aria-label="Фильтры">
 *   <Chip active>Активные</Chip>
 * </ChipGroup>
 * <ChipGroup layout="scrollX" gap="sm" aria-label="Теги">
 *   <Chip mode="tag">дизайн</Chip>
 * </ChipGroup>
 */
export const ChipGroup = forwardRef<HTMLDivElement, ChipGroupProps>(function ChipGroup(
	{
		children,
		'aria-label': ariaLabel,
		gap = 'md',
		layout = 'wrap',
		overflowAffordance,
		mode = 'chip',
		className,
		style,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const scrollerRef = useRef<HTMLDivElement>(null);
	const [fadeStart, setFadeStart] = useState(false);
	const [fadeEnd, setFadeEnd] = useState(false);
	const useFade = layout === 'scrollX' && (overflowAffordance ?? 'fade') === 'fade';

	const updateFades = useCallback(() => {
		const el = scrollerRef.current;
		if (!el || !useFade) {
			setFadeStart(false);
			setFadeEnd(false);
			return;
		}
		const {scrollLeft, scrollWidth, clientWidth} = el;
		const maxScroll = scrollWidth - clientWidth;
		setFadeStart(scrollLeft > 2);
		setFadeEnd(maxScroll > 2 && scrollLeft < maxScroll - 2);
	}, [useFade]);

	useEffect(() => {
		updateFades();
		const el = scrollerRef.current;
		if (!el || !useFade) return undefined;
		const onScroll = () => updateFades();
		el.addEventListener('scroll', onScroll, {passive: true});
		const ro = typeof ResizeObserver !== 'undefined'
			? new ResizeObserver(() => updateFades())
			: null;
		ro?.observe(el);
		return () => {
			el.removeEventListener('scroll', onScroll);
			ro?.disconnect();
		};
	}, [updateFades, useFade, children]);

	useEffect(() => {
		if (layout !== 'scrollX') return undefined;
		const el = scrollerRef.current;
		if (!el) return undefined;
		const onFocusIn = (event: FocusEvent) => {
			const target = event.target;
			if (!(target instanceof HTMLElement) || !el.contains(target)) return;
			target.scrollIntoView({
				inline: 'nearest',
				block: 'nearest',
			});
		};
		el.addEventListener('focusin', onFocusIn);
		return () => el.removeEventListener('focusin', onFocusIn);
	}, [layout]);

	const gapClass = gap === 'sm'
		? styles.gapSm
		: gap === 'lg'
			? styles.gapLg
			: styles.gapMd;

	const resolvedLabel = ariaLabel
		?? (mode === 'tag' ? t('chip.groupTags') : t('chip.groupChips'));

	return (
		<div
			ref={composeRefs(ref, scrollerRef)}
			className={cn(
				styles.chipGroup,
				gapClass,
				layout === 'scrollX' ? styles.layoutScrollX : '',
				useFade ? styles.layoutScrollXFade : '',
				useFade && fadeStart ? styles.fadeStart : '',
				useFade && fadeEnd ? styles.fadeEnd : '',
				className,
			)}
			style={style}
			{...rest}
			role='group'
			aria-label={resolvedLabel}
		>
			{children}
		</div>
	);
});

ChipGroup.displayName = 'ChipGroup';
