import type {
	ColorSwatchGroupProps,
} from './ColorSwatchGroup.types';
export type {
	ColorSwatchGroupProps,
} from './ColorSwatchGroup.types';

import {forwardRef, type CSSProperties} from 'react';
import styles from './ColorSwatchGroup.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';
import {SelectionGroup} from '../SelectionGroup/SelectionGroup';

/**
 * Группа цветовых swatch-кнопок для выбора одного значения из палитры.
 *
 * @component
 * @example
 * <ColorSwatchGroup colors={['#ef4444', '#22c55e']} value={color} onChange={setColor} />
 */
export const ColorSwatchGroup = forwardRef<HTMLDivElement, ColorSwatchGroupProps>(
	function ColorSwatchGroup(
		{
			colors,
			value,
			onChange,
			size = 'md',
			label,
			className,
			style,
			readOnly = false,
			disabled = false,
			onKeyDown,
			...rest
		},
		ref,
	) {
		const isReadOnly = readOnly && !disabled;

		return (
			<SelectionGroup.Root
				ref={ref}
				value={value ?? ''}
				onChange={onChange}
				disabled={disabled}
				readOnly={readOnly}
				className={cn(
					styles.group,
					styles[size],
					isReadOnly ? styles.readOnly : '',
					disabled ? styles.disabled : '',
					className,
				)}
				style={style}
				{...rest}
				role='radiogroup'
				aria-label={label}
				aria-readonly={isReadOnly || undefined}
				aria-disabled={disabled || undefined}
			>
				<SelectionGroup.List className={styles.list} onKeyDown={onKeyDown}>
					{colors.map((color) => {
						const isSelected = value === color;
						return (
							<SelectionGroup.Item
								key={color}
								value={color}
								role='radio'
								aria-checked={isSelected}
								aria-label={color}
								className={cn(
									styles.swatch,
									isSelected ? styles.selected : '',
									isReadOnly ? styles.swatchReadOnly : '',
								)}
								style={mergeStyles({'--altum-swatch-color': color} as CSSProperties, undefined)}
							/>
						);
					})}
				</SelectionGroup.List>
			</SelectionGroup.Root>
		);
	},
);

ColorSwatchGroup.displayName = 'ColorSwatchGroup';
