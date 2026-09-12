import type {
	SegmentedControlProps,
} from './SegmentedControl.types';
export type {
	SegmentOption,
	SegmentedItemFit,
	SegmentedControlProps,
} from './SegmentedControl.types';

import React, {forwardRef} from 'react';
import {ButtonGroup} from '../ButtonGroup/ButtonGroup';

/**
 * Переключатель сегментов: обёртка над `ButtonGroup` (`mode="toggle"`, `width="full"`).
 * `itemFit` — `equal` | `content`. Secondary / tinted / ghost / plain — колодец + слайдер.
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
		variant = 'secondary',
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
	const handleChange = (next: string | string[]) => {
		if (typeof next !== 'string') return;
		const option = options.find((item) => String(item.value) === next);
		if (option) onChange(option.value);
	};

	return (
		<ButtonGroup
			{...rest}
			ref={ref}
			mode='toggle'
			width='full'
			itemFit={itemFit}
			variant={variant}
			size={size}
			value={String(value)}
			onChange={handleChange}
			disabled={disabled}
			readOnly={readOnly}
			borderless={borderless}
			aria-label={ariaLabel}
			className={className}
		>
			{options.map((option) => (
				<ButtonGroup.Item
					key={String(option.value)}
					value={String(option.value)}
				>
					{option.label}
				</ButtonGroup.Item>
			))}
		</ButtonGroup>
	);
});

SegmentedControlInner.displayName = 'SegmentedControl';

export const SegmentedControl = SegmentedControlInner as <T extends string | number>(
	props: SegmentedControlProps<T> & {ref?: React.Ref<HTMLDivElement>}
) => React.ReactElement;
