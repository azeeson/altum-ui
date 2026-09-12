import type {SearchFieldProps} from './SearchField.types';
export type {SearchFieldProps} from './SearchField.types';

import {forwardRef} from 'react';
import {TextField} from '../TextField/TextField';
import {FieldBaseIcon} from '../../base/FieldBase';
import {IconSearch} from '../../icons/icons/IconSearch';
import {useLocale} from '../../locales/localeContext';

/**
 * Поле поиска с иконкой лупы.
 * По умолчанию `labelPlacement="none"` (toolbar). В формах передавайте `outside`.
 *
 * @component
 * @example
 * <SearchField label="Поиск" value={query} onChange={(e) => setQuery(e.target.value)} />
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
	{
		label,
		labelPlacement = 'none',
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
			labelPlacement={labelPlacement}
			type='search'
			prefix={(
				<FieldBaseIcon>
					<IconSearch />
				</FieldBaseIcon>
			)}
		/>
	);
});

SearchField.displayName = 'SearchField';
