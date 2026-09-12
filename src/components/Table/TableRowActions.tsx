import React, {forwardRef} from 'react';
import {Menu} from '../Menu/Menu';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconMenu} from '../../icons/icons/IconMenu';
import {useLocale} from '../../locales/localeContext';
import type {TableRowActionsProps} from './Table.types';

/** Меню действий одной строки; используется автоматически через `Table.rowActions`. @component */
export const TableRowActions = forwardRef<HTMLDivElement, TableRowActionsProps>(
	function TableRowActions({items, 'aria-label': ariaLabel, className, ...rest}, ref) {
		const {t} = useLocale();
		const label = ariaLabel ?? t('table.rowActions');
		return (
			<Menu
				ref={ref}
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
	},
);

TableRowActions.displayName = 'Table.RowActions';
