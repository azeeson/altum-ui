import type {SearchFieldProps} from './SearchField.types';
export type {SearchFieldProps} from './SearchField.types';

import {FieldBaseIcon, TextField} from '../TextField/TextField';
import {IconSearch} from '../../icons/icons/IconSearch';

/**
 * Поле поиска с иконкой лупы. Без `label` — тулбарный вид; в формах передайте `label`.
 *
 * @component
 * @example
 * <SearchField placeholder="Поиск" value={query} onChange={(e) => setQuery(e.target.value)} />
 */
export const SearchField = ({
	label,
	'aria-label': ariaLabel,
	inputRef,
	...props
}: SearchFieldProps) => (
	<TextField
		{...props}
		inputRef={inputRef}
		label={label}
		aria-label={ariaLabel ?? (label ? undefined : 'Поиск')}
		type='search'
		prefix={(
			<FieldBaseIcon>
				<IconSearch />
			</FieldBaseIcon>
		)}
	/>
);
