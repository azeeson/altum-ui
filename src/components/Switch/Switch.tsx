import type {
	SwitchProps,
} from './Switch.types';
export type {
	SwitchLabelSide,
	SwitchProps,
} from './Switch.types';

import type {ChangeEvent} from 'react';
import styles from './Switch.module.css';
import {ToggleControlBase} from '../../base/ToggleControlBase';
import {cn} from '../../core/utils/cn';

/**
 * Переключатель: `size`, `labelSide`.
 *
 * @component
 * @example
 * <Switch label="Уведомления" labelSide="start" size="sm" checked={on} onChange={setOn} />
 */
export const Switch = ({
	label,
	checked,
	onChange,
	onCheckedChange,
	className,
	disabled,
	readOnly,
	size = 'md',
	labelSide = 'end',
	inputRef,
	...props
}: SwitchProps) => {
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.checked);
		onCheckedChange?.(event.target.checked);
	};

	return (
		<ToggleControlBase
			inputRef={inputRef}
			type='checkbox'
			role='switch'
			size={size}
			labelSide={labelSide}
			readOnly={readOnly}
			disabled={disabled}
			checked={checked}
			className={cn(styles.root, className)}
			inputClassName={styles.input}
			boxClassName={styles.switchTrack}
			label={label}
			{...props}
			aria-checked={checked}
			onChange={handleChange}
		/>
	);
};
