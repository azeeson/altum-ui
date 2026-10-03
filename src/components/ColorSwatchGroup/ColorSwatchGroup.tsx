import type {
	ColorSwatchGroupProps,
} from './ColorSwatchGroup.types';
export type {
	ColorSwatchGroupProps,
} from './ColorSwatchGroup.types';

import type {CSSProperties} from 'react';
import styles from './ColorSwatchGroup.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import {cn} from '../../core/utils/cn';
import {SelectionGroup} from '../../base/SelectionGroup';

/**
 * Группа цветовых swatch-кнопок для выбора одного значения из палитры.
 * Выбор — `SelectionGroup`, вид точки — `customRenderOption`.
 *
 * @component
 * @example
 * <ColorSwatchGroup colors={['#ef4444', '#22c55e']} value={color} onChange={setColor} />
 */
export function ColorSwatchGroup({
	colors,
	value,
	onChange,
	size = 'md',
	label,
	className,
	readOnly = false,
	disabled = false,
	rootRef,
	...rest
}: ColorSwatchGroupProps) {
	return (
		<SelectionGroup
			{...rest}
			rootRef={rootRef}
			type='radio'
			aria-label={label}
			className={cn(styles.group, className)}
			data-size={size !== 'md' ? size : undefined}
			disabled={disabled}
			readOnly={readOnly}
			options={colors.map((color) => ({
				value: color,
				label: color,
			}))}
			value={value ?? ''}
			onChange={onChange}
			customRenderOption={(option, {optionProps}) => (
				<button
					type='button'
					{...optionProps}
					aria-label={option.value}
					className={cn(unstyled.control, styles.swatch)}
					style={{'--altum-swatch-color': option.value} as CSSProperties}
				/>
			)}
		/>
	);
}
