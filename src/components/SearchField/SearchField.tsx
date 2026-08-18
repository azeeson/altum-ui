import type {
	SearchFieldProps,
} from './SearchField.types';
export type {
	SearchFieldProps,
} from './SearchField.types';

import React, {forwardRef} from 'react';
import {TextField} from '../TextField/TextField';
import {FieldBase} from '../../base/FieldBase';
import {IconSearch} from '../../icons/icons/IconSearch';
import styles from './SearchField.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../LocaleProvider/LocaleProvider';

/**
 * Поле поиска с иконкой лупы.
 * По умолчанию `labelPlacement="none"` (toolbar). В формах передавайте `outside`.
 *
 * @component
 * @example
 * <SearchField
 *   label="Поиск"
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   onClear={() => setQuery('')}
 * />
 * @example
 * // Стек формы — выравнивание с внешними лейблами TextField
 * <SearchField label="Поиск" labelPlacement="outside" width="full" />
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
	{
		label,
		size = 'md',
		labelPlacement = 'none',
		value,
		className = '',
		...props
	},
	ref,
) {
	const {t} = useLocale();

	return (
		<TextField
			{...props}
			ref={ref}
			label={label ?? t('searchField.label')}
			size={size}
			labelPlacement={labelPlacement}
			type='search'
			value={value}
			className={cn(styles.searchField, className)}
			prefix={(
				<FieldBase.Icon>
					<IconSearch className={styles.searchIcon} />
				</FieldBase.Icon>
			)}
		/>
	);
});

SearchField.displayName = 'SearchField';
