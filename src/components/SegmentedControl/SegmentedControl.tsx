import type {SegmentedControlProps} from './SegmentedControl.types';
export type {
	SegmentOption,
	SegmentedItemFit,
	SegmentedControlVariant,
	SegmentedControlProps,
} from './SegmentedControl.types';

import {useRef} from 'react';
import {SelectionGroup} from '../../base/SelectionGroup';
import type {ButtonGroupVariant} from '../ButtonGroup/ButtonGroup.types';
import {cn} from '../../core/utils/cn';
import styles from './SegmentedControl.module.css';

/** `pill` / `secondary` / `primary` → нейтральная плашка, не заливка CTA. `plain` → ghost. */
function trackSurfaceVariant(
	variant: NonNullable<SegmentedControlProps['variant']>,
): ButtonGroupVariant {
	if (variant === 'pill' || variant === 'secondary' || variant === 'primary') return 'pill';
	if (variant === 'plain') return 'ghost';
	return variant;
}

/**
 * Один активный сегмент: `SelectionGroup` (`radio`). Выбранный пункт — заливка кнопки
 * через CSS `button[aria-selected='true']` / `aria-checked` (без JS-% и без бегунка).
 * Трек и кнопки приходят от `SelectionGroup`. Числовой `value` возвращается типом опции.
 * Default `data-variant="pill"` — скруглённый трек.
 *
 * @component
 * @template T
 * @example
 * <SegmentedControl
 *   itemFit="content"
 *   options={[{ label: 'День', value: 'day' }, { label: 'Неделя', value: 'week' }]}
 *   value={view}
 *   onChange={setView}
 * />
 */
export function SegmentedControl<T extends string | number>({
	options,
	value,
	onChange,
	variant = 'pill',
	size = 'md',
	itemFit = 'equal',
	orientation = 'horizontal',
	readOnly = false,
	disabled = false,
	width = 'full',
	itemRole,
	className,
	onClick,
	onKeyDown,
	role,
	'aria-label': ariaLabel,
	rootRef,
	...rest
}: SegmentedControlProps<T>) {
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;
	const handleChange = (next: string) => {
		const matched = options.find((item) => String(item.value) === next);
		if (matched) onChangeRef.current(matched.value);
	};

	return (
		<SelectionGroup
			{...rest}
			rootRef={rootRef}
			type='radio'
			role={role}
			itemRole={itemRole}
			aria-label={ariaLabel}
			className={cn(styles.track, className)}
			variant={trackSurfaceVariant(variant)}
			size={size}
			width={width}
			itemFit={itemFit}
			orientation={orientation}
			disabled={disabled}
			readOnly={readOnly}
			options={options.map((option) => ({
				value: String(option.value),
				label: option.label,
				disabled: option.disabled,
				id: option.id,
				controls: option.controls,
			}))}
			value={String(value)}
			onChange={handleChange}
			onClick={onClick}
			onKeyDown={onKeyDown}
		/>
	);
}
