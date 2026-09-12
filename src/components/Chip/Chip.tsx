import type {
	ChipProps,
	ChipGroupProps,
} from './Chip.types';
export type {
	ChipVariant,
	ChipAs,
	ChipMode,
	ChipProps,
	ChipGroupGap,
	ChipGroupLayout,
	ChipGroupOverflowAffordance,
	ChipGroupProps,
} from './Chip.types';

import {forwardRef, type Ref} from 'react';
import {IconCross} from '../../icons/icons/IconCross';
import styles from './Chip.module.css';
import status from '../../styles/status.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import {cn} from '../../utils/cn';
import {composeRefs} from '../../utils/composeRefs';
import {useOverflowEdges} from '../../hooks/useOverflowEdges';
import {useScrollFocusedChildIntoView} from '../../hooks/useScrollFocusedChildIntoView';
import {useLocale} from '../../locales/localeContext';

const STATUS = {
	success: 1,
	info: 1,
	warning: 1,
	error: 1,
} as const;

/**
 * Компактная метка: чип, тег или toggle-фильтр (`mode`).
 * Secondary / tinted читают `--altum-color-chip-*`.
 *
 * @component
 * @example
 * <Chip mode="toggle" variant="tinted" onClick={() => toggle('react')}>React</Chip>
 * <Chip mode="tag" variant="success">Готово</Chip>
 */
export const Chip = forwardRef<HTMLButtonElement | HTMLSpanElement, ChipProps>(function Chip(
	{
		variant = 'primary',
		size = 'md',
		mode,
		as: asProp = 'chip',
		children,
		onRemove,
		onClick,
		disabled = false,
		icon,
		className,
		removeLabel,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const chipMode = mode ?? asProp;
	const isTag = chipMode === 'tag';
	const isToggle = chipMode === 'toggle';
	const isInteractive = !!onClick && !disabled;
	const splitInteractive = isInteractive && !!onRemove;
	const Element = isInteractive && !onRemove ? 'button' : 'span';
	const isStatus = variant in STATUS;

	const body = (
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
	);

	return (
		<Element
			ref={ref as Ref<HTMLButtonElement & HTMLSpanElement>}
			className={cn(
				styles.chip,
				isTag ? styles.modeTag : styles.modeChip,
				isStatus ? status[variant as keyof typeof STATUS] : styles[variant],
				isStatus ? status.surface : '',
				isStatus && isInteractive ? status.clickable : '',
				styles[size],
				isToggle ? (isStatus ? status.active : styles.active) : '',
				isInteractive ? styles.clickable : '',
				onRemove ? styles.chipRemovable : '',
				disabled ? styles.disabled : '',
				className,
			)}
			type={Element === 'button' ? 'button' : undefined}
			{...rest}
			aria-pressed={isInteractive && isToggle && !splitInteractive ? true : undefined}
			aria-disabled={disabled || undefined}
			disabled={Element === 'button' ? disabled : undefined}
			onClick={isInteractive && !splitInteractive ? onClick : undefined}
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
			{onRemove && !disabled && (
				<button
					type='button'
					className={cn(unstyled.control, styles.removeBtn)}
					onClick={(event) => {
						event.stopPropagation();
						onRemove();
					}}
					aria-label={removeLabel ?? t('chip.remove')}
				>
					<IconCross />
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
 *   <Chip mode="toggle">Активные</Chip>
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
		mode,
		as: groupAsProp = 'chip',
		className,
		style,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const groupMode = mode ?? groupAsProp;
	const useFade = layout === 'scrollX' && (overflowAffordance ?? 'fade') === 'fade';
	const {ref: scrollerRef, start: fadeStart, end: fadeEnd} = useOverflowEdges<HTMLDivElement>(useFade);
	useScrollFocusedChildIntoView(scrollerRef, layout === 'scrollX');

	return (
		<div
			ref={composeRefs(ref, scrollerRef)}
			className={cn(
				styles.chipGroup,
				gap === 'sm' ? styles.gapSm : gap === 'lg' ? styles.gapLg : '',
				layout === 'scrollX' ? styles.layoutScrollX : '',
				useFade ? styles.layoutScrollXFade : '',
				useFade && fadeStart ? styles.fadeStart : '',
				useFade && fadeEnd ? styles.fadeEnd : '',
				className,
			)}
			style={style}
			{...rest}
			role='group'
			aria-label={ariaLabel ?? (groupMode === 'tag' ? t('chip.groupTags') : t('chip.groupChips'))}
		>
			{children}
		</div>
	);
});

ChipGroup.displayName = 'ChipGroup';
