import {Menu} from '../Menu/Menu';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconMenu} from '../../icons/icons/IconMenu';
import {useLocale} from '../../locales/localeContext';
import type {TableRowActionsProps} from './Table.types';
import {ruSlice as ru_table} from '../../locales/slices/table.ru';

const localeFallback = {
	table: ru_table,
};

/** Меню действий одной строки; используется автоматически через `Table.rowActions`. @component */
export const TableRowActions = ({
	items,
	'aria-label': ariaLabel,
	className,
	rootRef,
	...rest
}: TableRowActionsProps) => {
	const {t} = useLocale(localeFallback);
	const label = ariaLabel ?? t('table.rowActions');
	return (
		<Menu
			rootRef={rootRef}
			align='right'
			className={className}
			aria-label={label}
			{...rest}
			items={items}
			trigger={(
				<ButtonIcon
					variant='ghost'
					size='sm'
					aria-label={label}
					icon={<IconMenu size={16} />}
				/>
			)}
		/>
	);
};
