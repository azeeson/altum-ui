import type {ActionItemProps} from './ActionItem.types';
export type {ActionItemProps} from './ActionItem.types';

import styles from './ActionItem.module.css';
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Подпись пункта: иконка, текст, описание и шорткат.
 * Кнопку и выбор делает `Listbox` внутри `ActionList`.
 *
 * @component
 * @example
 * <ActionItem label="Переименовать" shortcut="↵" />
 */
export function ActionItem({
	label,
	description,
	icon,
	shortcut,
	className,
	...rest
}: ActionItemProps) {
	return (
		<span
			className={cn(styles.root, className)}
			{...rest}
		>
			{icon != null && (
				<span className={cn(utilities.fCenter, styles.icon)} aria-hidden>
					{icon}
				</span>
			)}
			<span className={styles.body}>
				<span className={styles.label}>
					{label}
				</span>
				{description != null && (
					<span className={styles.description}>
						{description}
					</span>
				)}
			</span>
			{shortcut != null && (
				<span className={styles.shortcut}>
					{shortcut}
				</span>
			)}
		</span>
	);
}
