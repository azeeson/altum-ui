import React, {forwardRef} from 'react';
import {DropdownMenu} from '../DropdownMenu/DropdownMenu';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconMenu} from '../../icons/icons/IconMenu';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import type {TableRowActionsProps} from './Table.types';

/** Меню действий одной строки; используется автоматически через `Table.Content.rowActions`. @component */
export const TableRowActions = forwardRef<HTMLDivElement, TableRowActionsProps>(
	function TableRowActions({groups, 'aria-label': ariaLabel, className, ...rest}, ref) {
		const {t} = useLocale();
		const label = ariaLabel ?? t('table.rowActions');
		return (
			<DropdownMenu
				ref={ref}
				align='right'
				className={className}
				aria-label={label}
				{...rest}
				groups={groups}
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
