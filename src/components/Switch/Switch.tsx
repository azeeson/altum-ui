import type {
	SwitchProps,
} from './Switch.types';
export type {
	SwitchLabelSide,
	SwitchProps,
} from './Switch.types';

import {forwardRef} from 'react';
import styles from './Switch.module.css';
import {ToggleControlBase} from '../../base/ToggleControlBase';
import {cn} from '../../utils/cn';

/**
 * Переключатель: `size`, `labelSide`.
 *
 * @component
 * @example
 * <Switch label="Уведомления" labelSide="start" size="sm" checked={on} onChange={setOn} />
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
	{
		label,
		checked,
		onChange,
		onCheckedChange,
		className,
		disabled,
		readOnly,
		size = 'md',
		labelSide = 'end',
		...props
	},
	ref,
) {
	return (
		<ToggleControlBase
			ref={ref}
			type='checkbox'
			role='switch'
			size={size}
			labelSide={labelSide}
			readOnly={readOnly}
			disabled={disabled}
			checked={checked}
			className={cn(styles.root, className)}
			inputClassName={styles.input}
			boxClassName={cn(styles.switchTrack, readOnly && !disabled ? styles.readOnlyTrack : '')}
			boxContent={<div className={styles.switchThumb} />}
			label={label}
			{...props}
			aria-checked={checked}
			onChange={(event) => {
				onChange(event.target.checked);
				onCheckedChange?.(event.target.checked);
			}}
		/>
	);
});

Switch.displayName = 'Switch';
