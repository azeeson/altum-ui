import type {OverflowGroupGap, OverflowGroupProps} from './OverflowGroup.types';
export type {
	OverflowGroupGap,
	OverflowGroupFit,
	OverflowGroupProps,
} from './OverflowGroup.types';

import React, {forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {composeRefs} from '../../utils/composeRefs';
import {Dropdown} from '../Dropdown/Dropdown';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconDots3} from '../../icons/icons/IconDots3';
import {cn} from '../../utils/cn';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import type {ControlSize} from '../../types';
import styles from './OverflowGroup.module.css';

function toItems(children: React.ReactNode): React.ReactElement[] {
	return React.Children.toArray(children).filter(
		(child): child is React.ReactElement => React.isValidElement(child),
	);
}

function itemKey(item: React.ReactElement, index: number): string {
	if (item.key != null) {
		return String(item.key);
	}
	return `overflow-item-${index}`;
}

function dotsIconSize(size: ControlSize): number {
	switch (size) {
		case 'sm':
			return 16;
		case 'lg':
			return 20;
		default:
			return 18;
	}
}

function gapClassName(gap: OverflowGroupGap): string {
	if (gap === 'sm') return styles.gapSm;
	if (gap === 'lg') return styles.gapLg;
	return styles.gapMd;
}

function readGapPx(el: HTMLElement | null): number {
	if (!el) return 0;
	const value = getComputedStyle(el).columnGap || getComputedStyle(el).gap;
	const parsed = Number.parseFloat(value);
	return Number.isFinite(parsed) ? parsed : 0;
}

/** Максимум элементов, помещающихся в `containerWidth` с учётом кнопки ⋯. */
function computeOverflowVisibleCount(
	containerWidth: number,
	itemWidths: number[],
	moreWidth: number,
	gap: number,
	maxVisible?: number,
): number {
	const total = itemWidths.length;
	if (total === 0 || containerWidth <= 0) return 0;

	const sumSlice = (count: number) => {
		if (count <= 0) return 0;
		let sum = 0;
		for (let i = 0; i < count; i += 1) {
			sum += itemWidths[i] ?? 0;
		}
		return sum + gap * Math.max(0, count - 1);
	};

	const allWidth = sumSlice(total);
	const cappedByMax = maxVisible !== undefined
		? Math.min(total, Math.max(0, Math.floor(maxVisible)))
		: total;

	if (allWidth <= containerWidth && cappedByMax >= total) {
		return total;
	}

	for (let n = cappedByMax; n >= 0; n -= 1) {
		const itemsWidth = sumSlice(n);
		const showMore = n < total;
		const totalWidth = showMore
			? itemsWidth + (n > 0 ? gap : 0) + moreWidth
			: itemsWidth;
		if (totalWidth <= containerWidth) {
			return n;
		}
	}

	return 0;
}

/**
 * Однострочная группа: лишние children уходят за кнопку ⋯ в `Dropdown`.
 *
 * В отличие от `OverflowActions` (фиксированный `visibleCount` + ActionList),
 * лимит считается по ширине контейнера; в меню рендерятся те же children as-is.
 *
 * @component
 * @example
 * <OverflowGroup gap="md">
 *   <Chip>React</Chip>
 *   <Chip>TypeScript</Chip>
 *   <Chip>CSS Modules</Chip>
 * </OverflowGroup>
 *
 * @example
 * <ButtonGroup width="full">
 *   <OverflowGroup fit="container" gap="sm">
 *     <ButtonGroup.Item>Изменить</ButtonGroup.Item>
 *     <ButtonGroup.Item>Поделиться</ButtonGroup.Item>
 *   </OverflowGroup>
 * </ButtonGroup>
 */
export const OverflowGroup = forwardRef<HTMLDivElement, OverflowGroupProps>(function OverflowGroup(
	{
		children,
		gap = 'md',
		size = 'md',
		fit = 'content',
		maxVisible,
		align = 'right',
		moreLabel,
		mobileTitle,
		className,
		'aria-label': ariaLabel,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const items = useMemo(() => toItems(children), [children]);
	const itemsSignature = useMemo(
		() => items.map((item, index) => itemKey(item, index)).join('\0'),
		[items],
	);
	const measureKey = `${itemsSignature}|${gap}|${size}|${fit}|${maxVisible ?? ''}`;

	const [settledKey, setSettledKey] = useState('');
	const [visibleCount, setVisibleCount] = useState(items.length);
	const [isOpen, setIsOpen] = useState(false);

	const rootRef = useRef<HTMLDivElement>(null);
	const rowRef = useRef<HTMLDivElement>(null);
	const moreMeasureRef = useRef<HTMLDivElement>(null);
	const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
	const widthsRef = useRef<number[]>([]);
	const moreWidthRef = useRef(0);

	const measuring = settledKey !== measureKey;
	const resolvedAriaLabel = ariaLabel ?? t('overflowGroup.ariaLabel');
	const resolvedMoreLabel = moreLabel ?? t('overflowGroup.more');
	const resolvedMobileTitle = mobileTitle ?? t('overflowGroup.title');
	const gapClass = gapClassName(gap);
	const iconSize = dotsIconSize(size);

	const applyVisibleCount = useCallback((next: number) => {
		setVisibleCount((prev) => (prev === next ? prev : next));
	}, []);

	const recomputeFromCache = useCallback(() => {
		const root = rootRef.current;
		const row = rowRef.current;
		if (!root || !row || widthsRef.current.length === 0) return;

		const next = computeOverflowVisibleCount(
			root.clientWidth,
			widthsRef.current,
			moreWidthRef.current,
			readGapPx(row),
			maxVisible,
		);
		applyVisibleCount(next);
	}, [applyVisibleCount, maxVisible]);

	useLayoutEffect(() => {
		const root = rootRef.current;
		const row = rowRef.current;
		if (!root || !row) return;

		if (measuring) {
			itemRefs.current = itemRefs.current.slice(0, items.length);
			widthsRef.current = items.map((_, index) => (
				itemRefs.current[index]?.offsetWidth ?? 0
			));
			moreWidthRef.current = moreMeasureRef.current?.offsetWidth ?? 0;

			const next = computeOverflowVisibleCount(
				root.clientWidth,
				widthsRef.current,
				moreWidthRef.current,
				readGapPx(row),
				maxVisible,
			);
			applyVisibleCount(next);
			setSettledKey(measureKey);
			return;
		}

		recomputeFromCache();
	// eslint-disable-next-line react-hooks/exhaustive-deps -- measureKey/items.length фиксируют идентичность children; полный `items` переизмерял бы при каждом render родителя
	}, [
		applyVisibleCount,
		items.length,
		maxVisible,
		measureKey,
		measuring,
		recomputeFromCache,
	]);

	useEffect(() => {
		const root = rootRef.current;
		if (!root || typeof ResizeObserver === 'undefined') return undefined;

		const ro = new ResizeObserver(() => {
			if (settledKey !== measureKey) return;
			recomputeFromCache();
		});
		ro.observe(root);
		return () => ro.disconnect();
	}, [measureKey, recomputeFromCache, settledKey]);

	const hasOverflow = !measuring && visibleCount < items.length;
	const displayCount = measuring ? items.length : visibleCount;
	const visibleItems = items.slice(0, displayCount);
	const overflowItems = hasOverflow ? items.slice(visibleCount) : [];

	return (
		<div
			ref={composeRefs(ref, rootRef)}
			className={cn(
				styles.root,
				fit === 'container' ? styles.fitContainer : styles.fitContent,
				className,
			)}
			role='group'
			aria-label={resolvedAriaLabel}
			{...rest}
		>
			<div ref={rowRef} className={cn(styles.row, gapClass)}>
				{visibleItems.map((item, index) => (
					<div
						key={itemKey(item, index)}
						ref={(node) => {
							itemRefs.current[index] = node;
						}}
						className={styles.item}
					>
						{item}
					</div>
				))}

				{measuring && (
					<div
						ref={moreMeasureRef}
						className={cn(styles.measureItem, styles.moreMeasure)}
						aria-hidden
					>
						<ButtonIcon
							type='button'
							variant='ghost'
							size={size}
							icon={<IconDots3 size={iconSize} />}
							aria-label={resolvedMoreLabel}
							className={styles.overflowTrigger}
							tabIndex={-1}
						/>
					</div>
				)}

				{hasOverflow && (
					<div className={styles.moreSlot}>
						<Dropdown
							open={isOpen}
							onOpenChange={setIsOpen}
							onClose={() => setIsOpen(false)}
							align={align}
							widthMode='content'
							popupRole='none'
							mobileTitle={resolvedMobileTitle}
						>
							<Dropdown.Trigger asChild>
								<ButtonIcon
									type='button'
									variant='ghost'
									size={size}
									icon={<IconDots3 size={iconSize} />}
									aria-label={resolvedMoreLabel}
									className={styles.overflowTrigger}
								/>
							</Dropdown.Trigger>
							<Dropdown.Content className={styles.menuPanel}>
								<div className={styles.menuStack}>
									{overflowItems.map((item, index) => (
										<div
											key={itemKey(item, visibleCount + index)}
											className={styles.menuItem}
										>
											{React.cloneElement(
												item as React.ReactElement<{className?: string}>,
												{
													className: cn(
														styles.menuItemControl,
														(item.props as {className?: string}).className,
													),
												},
											)}
										</div>
									))}
								</div>
							</Dropdown.Content>
						</Dropdown>
					</div>
				)}
			</div>
		</div>
	);
});

OverflowGroup.displayName = 'OverflowGroup';
