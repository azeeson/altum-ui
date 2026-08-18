import type {
	ListOptionBaseProps,
	ListOptionBaseLabelProps,
} from './ListOptionBase.types';
export type {
	ListOptionBaseProps,
	ListOptionBaseLabelProps,
} from './ListOptionBase.types';

import {forwardRef} from 'react';
import {cn} from '../../utils/cn';
import styles from './ListOptionBase.module.css';

export const ListOptionBase = forwardRef<HTMLButtonElement, ListOptionBaseProps>(function ListOptionBase(
	{
		className,
		selected,
		highlighted,
		multiline,
		type = 'button',
		children,
		...props
	},
	ref,
) {
	return (
		<button
			ref={ref}
			type={type}
			className={cn(
				styles.option,
				selected && styles.selected,
				highlighted && styles.highlighted,
				multiline && styles.multiline,
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
});

ListOptionBase.displayName = 'ListOptionBase';

/** Label-обёртка для `ListOptionBase` с ellipsis / multiline layout. */
export const ListOptionBaseLabel = forwardRef<HTMLSpanElement, ListOptionBaseLabelProps>(function ListOptionBaseLabel(
	{
		className,
		multiline,
		children,
		...props
	},
	ref,
) {
	return (
		<span
			ref={ref}
			className={cn(styles.label, multiline && styles.labelMultiline, className)}
			{...props}
		>
			{children}
		</span>
	);
});

ListOptionBaseLabel.displayName = 'ListOptionBaseLabel';
