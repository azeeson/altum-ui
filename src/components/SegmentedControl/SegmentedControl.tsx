import type {
	SegmentedControlProps,
} from './SegmentedControl.types';
export type {
	SegmentOption,
	SegmentedItemFit,
	SegmentedControlProps,
} from './SegmentedControl.types';

import React, {forwardRef, useRef, useState, useLayoutEffect, useId} from 'react';
import styles from './SegmentedControl.module.css';
import {controlTrackClassName} from '../../utils/controlTrack';
import {cn} from '../../utils/cn';
import {composeRefs} from '../../utils/composeRefs';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {
	SelectionGroup,
} from '../SelectionGroup/SelectionGroup';

/**
 * Переключатель сегментов с анимированным slider и roving focus.
 * Всегда `width: 100%` родителя — ограничение ширины через родителя.
 * Secondary / tinted / ghost / plain читают `--altum-color-button-*` (как ButtonGroup; Box может переопределить).
 *
 * @component
 * @example
 * <SegmentedControl
 *   options={[{ label: 'День', value: 'day' }, { label: 'Неделя', value: 'week' }]}
 *   value={view}
 *   onChange={setView}
 * />
 * @example
 * <SegmentedControl
 *   itemFit="content"
 *   options={[{ label: '1-й', value: '1' }, { label: 'Последний', value: 'last' }]}
 *   value={mode}
 *   onChange={setMode}
 * />
 */
const SegmentedControlInner = forwardRef(function SegmentedControl<
	T extends string | number,
>(
	{
		options,
		value,
		onChange,
		variant = 'primary',
		size = 'md',
		itemFit = 'equal',
		className,
		'aria-label': ariaLabel,
		readOnly = false,
		disabled = false,
		borderless = false,
		...rest
	}: SegmentedControlProps<T>,
	ref: React.ForwardedRef<HTMLDivElement>,
) {
	const {t} = useLocale();
	const containerRef = useRef<HTMLDivElement>(null);
	const groupId = useId();
	const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({});
	const [sliderReady, setSliderReady] = useState(false);
	const isReadOnly = readOnly && !disabled;

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		let frame = 0;
		let enableFrame = 0;
		/** Игнор RO сразу после mount/пересборки — иначе гасит анимацию смены value. */
		let ignoreResize = true;

		const measure = () => {
			const activeEl = container.querySelector(
				`.${styles.active}`,
			) as HTMLElement | null;
			if (!activeEl) return;

			const containerRect = container.getBoundingClientRect();
			const activeRect = activeEl.getBoundingClientRect();
			const left = activeRect.left - containerRect.left - container.clientLeft;

			setSliderStyle({
				width: `${activeRect.width}px`,
				transform: `translateX(${left}px)`,
			});
		};

		measure();
		enableFrame = requestAnimationFrame(() => {
			setSliderReady(true);
			enableFrame = requestAnimationFrame(() => {
				ignoreResize = false;
			});
		});

		const onResize = () => {
			if (ignoreResize) return;
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				setSliderReady(false);
				measure();
				cancelAnimationFrame(enableFrame);
				enableFrame = requestAnimationFrame(() => setSliderReady(true));
			});
		};

		const resizeObserver = new ResizeObserver(onResize);
		resizeObserver.observe(container);
		container.querySelectorAll(`.${styles.segmentBtn}`).forEach((btn) => {
			resizeObserver.observe(btn);
		});

		return () => {
			cancelAnimationFrame(frame);
			cancelAnimationFrame(enableFrame);
			resizeObserver.disconnect();
		};
	}, [
		value,
		options,
		size,
		itemFit,
		variant,
		borderless,
	]);

	const handleValueChange = (next: string) => {
		const option = options.find((item) => String(item.value) === next);
		if (option) onChange(option.value);
	};

	const listClasses = cn(
		styles.segmented,
		controlTrackClassName(variant, {readOnly: isReadOnly}),
		styles[variant],
		styles[size],
		itemFit === 'content' ? styles.fitContent : '',
		borderless ? styles.borderless : '',
		disabled ? styles.disabled : '',
		className,
	);

	return (
		<SelectionGroup.Root
			value={String(value)}
			onChange={handleValueChange}
			disabled={disabled}
			readOnly={readOnly}
			orientation='horizontal'
		>
			<SelectionGroup.List
				ref={composeRefs(ref, containerRef)}
				id={groupId}
				role='radiogroup'
				aria-label={ariaLabel ?? t('segmentedControl.ariaLabel')}
				className={listClasses}
				{...rest}
				aria-readonly={isReadOnly || undefined}
				aria-disabled={disabled || undefined}
			>
				<div
					className={cn(styles.slider, sliderReady && styles.ready)}
					style={sliderStyle}
					aria-hidden='true'
				/>

				{options.map((option) => {
					const optionValue = String(option.value);
					const isActive = option.value === value;

					return (
						<SelectionGroup.Item
							key={optionValue}
							value={optionValue}
							role='radio'
							aria-checked={isActive}
							className={cn(
								styles.segmentBtn,
								isActive && styles.active,
								isReadOnly && styles.segmentBtnReadOnly,
							)}
						>
							<span className={styles.segmentLabel}>
								{option.label}
							</span>
						</SelectionGroup.Item>
					);
				})}
			</SelectionGroup.List>
		</SelectionGroup.Root>
	);
});

SegmentedControlInner.displayName = 'SegmentedControl';

export const SegmentedControl = SegmentedControlInner as <T extends string | number>(
	props: SegmentedControlProps<T> & {ref?: React.Ref<HTMLDivElement>}
) => React.ReactElement;
