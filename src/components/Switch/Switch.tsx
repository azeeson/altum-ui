import type {
	SwitchProps,
} from './Switch.types';
export type {
	SwitchLabelSide,
	SwitchProps,
} from './Switch.types';

import React, {useId, forwardRef} from 'react';
import styles from './Switch.module.css';
import {ToggleControlBase} from '../../base/ToggleControlBase';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';

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
		className = '',
		id: providedId,
		disabled,
		readOnly,
		onClick,
		size = 'md',
		labelSide = 'end',
		...props
	},
	ref,
) {
	const generatedId = useId();
	const id = providedId || generatedId;
	const isReadOnly = !!readOnly && !disabled;

	return (
		<ToggleControlBase
			id={id}
			controlType='switch'
			size={size}
			labelSide={labelSide}
			readOnly={isReadOnly}
			className={cn(styles.root, size !== 'md' ? styles[size] : '', className)}
			boxClassName={cn(styles.switchTrack, isReadOnly ? styles.readOnlyTrack : '')}
			boxContent={<div className={styles.switchThumb} />}
			label={label}
			input={(
				<input
					ref={ref}
					type='checkbox'
					id={id}
					className={styles.input}
					checked={checked}
					disabled={disabled}
					{...props}
					role='switch'
					aria-checked={checked}
					aria-readonly={isReadOnly || undefined}
					onChange={(e) => {
						if (isReadOnly) {
							e.preventDefault();
							return;
						}
						onChange(e.target.checked);
					}}
					onClick={composeEventHandlers(onClick, (event) => {
						if (isReadOnly) event.preventDefault();
					})}
				/>
			)}
		/>
	);
});

Switch.displayName = 'Switch';
