import type {ReactNode} from 'react';
import type {ListboxOption} from '../../core/utils/listboxOptions';

import {getListboxOptionText} from '../../core/utils/listboxOptions';
import {SELECTION_VALUE_ATTR} from '../../base/SelectionGroup';
import {IconCheckmark} from '../../icons/icons/IconCheckmark';
import {cn} from '../../core/utils/cn';
import unstyled from '../../styles/unstyledControl.module.css';
import {LISTBOX_INDEX_ATTR} from './Listbox.utils';
import styles from './Listbox.module.css';

type ListboxRowProps<T extends ListboxOption> = {
	option: T;
	index: number;
	id: string;
	selected: boolean;
	disabled: boolean;
	showCheck: boolean;
	multiline: boolean;
	children: ReactNode;
};

/**
 * Пункт списка без своих обработчиков.
 * Клик и клавиатура живут на контейнере `Listbox`. Курсор — CSS `:hover`.
 * `tabIndex` всегда `-1`: в roving фокус переносит корень.
 * `data-selection-value` — для клика через примитивы SelectionGroup.
 */
export function ListboxRow<T extends ListboxOption>({
	option,
	index,
	id,
	selected,
	disabled,
	showCheck,
	multiline,
	children,
}: ListboxRowProps<T>) {
	const text = getListboxOptionText(option);
	const buttonProps = option.buttonProps;

	return (
		<button
			{...buttonProps}
			id={id}
			type='button'
			role='option'
			aria-selected={selected}
			aria-disabled={disabled || undefined}
			aria-label={
				buttonProps?.['aria-label']
				?? (typeof option.label !== 'string' ? text : undefined)
			}
			tabIndex={-1}
			disabled={disabled}
			{...{
				[LISTBOX_INDEX_ATTR]: index,
				[SELECTION_VALUE_ATTR]: option.value,
			}}
			className={cn(
				unstyled.control,
				styles.option,
				buttonProps?.className,
			)}
		>
			{showCheck ? (
				<span
					className={styles.optionCheck}
					aria-hidden='true'
				>
					{selected ? <IconCheckmark size={14} /> : null}
				</span>
			) : null}
			<span className={cn(styles.label, multiline && styles.labelMultiline)}>
				{children}
			</span>
		</button>
	);
}
