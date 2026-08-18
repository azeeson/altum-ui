import type {
	DropdownMenuProps,
} from './DropdownMenu.types';
export type {
	DropdownMenuProps,
} from './DropdownMenu.types';

import React, {forwardRef, useCallback} from 'react';
import {Dropdown} from '../Dropdown/Dropdown';
import {ActionList} from '../ActionList/ActionList';
import type {ActionListItem} from '../ActionList/ActionList.types';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {useLocale} from '../LocaleProvider/LocaleProvider';

/**
 * Готовое меню по клику: `Dropdown` (`popupRole="none"` — роль listbox у `ActionList`;
 * триггер получает `aria-haspopup="listbox"`).
 *
 * @component
 * @example
 * <DropdownMenu
 *   trigger={<ButtonIcon aria-label="Меню" icon={<IconMenu />} />}
 *   groups={menuGroups}
 *   onAction={(item) => console.log(item.id)}
 * />
 */
export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(function DropdownMenu(
	{
		trigger,
		groups,
		open: controlledOpen,
		onOpenChange,
		align = 'right',
		widthMode = 'content',
		mobileTitle,
		filterable = false,
		filterPlaceholder,
		emptyText,
		onAction,
		className,
		'aria-label': ariaLabel,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const [isOpen, setOpen] = useControlledStateWithCallback(controlledOpen, false, onOpenChange);

	const handleAction = useCallback((item: ActionListItem) => {
		onAction?.(item);
		setOpen(false);
	}, [onAction, setOpen]);

	return (
		<div
			ref={ref}
			className={className}
			{...rest}
		>
			<Dropdown
				open={isOpen}
				onOpenChange={setOpen}
				onClose={() => setOpen(false)}
				align={align}
				widthMode={widthMode}
				popupRole='none'
				mobileTitle={mobileTitle ?? t('dropdownMenu.mobileTitle')}
			>
				<Dropdown.Trigger asChild>
					{trigger}
				</Dropdown.Trigger>
				<Dropdown.Content>
					<ActionList.Root
						className={undefined}
						aria-label={ariaLabel ?? t('dropdownMenu.ariaLabel')}
						onAction={handleAction}
					>
						{filterable && <ActionList.Search placeholder={filterPlaceholder} />}
						{groups.map((group) => (
							<ActionList.Group key={group.id} id={group.id}>
								<ActionList.GroupLabel>
									{group.label}
								</ActionList.GroupLabel>
								{group.items.map((item) => <ActionList.Item key={item.id} {...item} />)}
							</ActionList.Group>
						))}
						{emptyText && (
							<ActionList.Empty>
								{emptyText}
							</ActionList.Empty>
						)}
					</ActionList.Root>
				</Dropdown.Content>
			</Dropdown>
		</div>
	);
});

DropdownMenu.displayName = 'DropdownMenu';
