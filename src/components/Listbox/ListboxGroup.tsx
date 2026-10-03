import type {ReactNode} from 'react';
import styles from './Listbox.module.css';
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';

type ListboxGroupProps = {
	id: string;
	label: ReactNode | null;
	listboxId: string;
	children: ReactNode;
};

/**
 * Группа пунктов: заголовок и слоты. Выбор и клавиатура остаются у `Listbox`.
 */
export function ListboxGroup({
	id,
	label,
	listboxId,
	children,
}: ListboxGroupProps) {
	const labelId = `${listboxId}-group-${id}`;
	const hasLabel = label != null;

	return (
		<div
			role='group'
			className={cn(utilities.fColumn, styles.group)}
			aria-labelledby={hasLabel ? labelId : undefined}
		>
			{hasLabel ? (
				<div
					id={labelId}
					className={styles.groupLabel}
				>
					{label}
				</div>
			) : null}
			{children}
		</div>
	);
}
