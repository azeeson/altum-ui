import type {
	OverflowActionsDisplay,
	OverflowActionsItemDomProps,
	OverflowActionsItemProps,
	OverflowActionsProps,
} from './OverflowActions.types';
export type {
	OverflowActionsDisplay,
	OverflowActionsItemProps,
	OverflowActionsProps,
} from './OverflowActions.types';

import React, {forwardRef, useCallback, useId, useMemo, useState} from 'react';
import {Dropdown} from '../Dropdown/Dropdown';
import {ActionList} from '../ActionList/ActionList';
import type {ActionListItem} from '../ActionList/ActionList.types';
import {Button} from '../Button/Button';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconDots3} from '../../icons/icons/IconDots3';
import {cn} from '../../utils/cn';
import {useActionSheetContext} from '../ActionSheetTrigger/actionSheetContext';
import styles from './OverflowActions.module.css';
import {useLocale} from '../LocaleProvider/LocaleProvider';

type ParsedItem = OverflowActionsItemProps & {key: string};

const ITEM_OWN_KEYS = new Set([
	'id',
	'icon',
	'label',
	'textValue',
	'disabled',
	'onSelect',
	'className',
	'key',
]);

function isItemElement(
	child: React.ReactNode,
): child is React.ReactElement<OverflowActionsItemProps> {
	return React.isValidElement(child) && child.type === OverflowActionsItem;
}

function parseItems(children: React.ReactNode): ParsedItem[] {
	const items: ParsedItem[] = [];
	React.Children.forEach(children, (child, index) => {
		if (!isItemElement(child)) return;
		const id = child.props.id ?? `action-${index}`;
		items.push({
			...child.props,
			id,
			key: String(child.key ?? id),
		});
	});
	return items;
}

function labelText(item: ParsedItem): string {
	if (typeof item.textValue === 'string' && item.textValue.length > 0) {
		return item.textValue;
	}
	if (typeof item.label === 'string' || typeof item.label === 'number') {
		return String(item.label);
	}
	return item.id ?? item.key;
}

function pickButtonDomProps(
	item: ParsedItem,
): OverflowActionsItemDomProps {
	const domProps: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(item)) {
		if (ITEM_OWN_KEYS.has(key)) continue;
		if (value === undefined) continue;
		domProps[key] = value;
	}
	return domProps as OverflowActionsItemDomProps;
}

/**
 * Маркер действия для `OverflowActions` (рендерит родитель).
 *
 * @component
 * @example
 * <OverflowActions.Item
 *   icon={<IconTrash />}
 *   label="Удалить"
 *   data-testid="action-delete"
 *   aria-keyshortcuts="Delete"
 *   onSelect={…}
 * />
 */
export const OverflowActionsItem: React.FC<OverflowActionsItemProps> = () => null;
OverflowActionsItem.displayName = 'OverflowActions.Item';

function VisibleAction({
	item,
	display,
	size,
}: {
	item: ParsedItem;
	display: OverflowActionsDisplay;
	size: 'sm' | 'md';
}) {
	const aria = labelText(item);
	const showIconOnly = display === 'icon' && item.icon != null;
	const domProps = pickButtonDomProps(item);

	if (showIconOnly) {
		return (
			<ButtonIcon
				{...domProps}
				type='button'
				variant='ghost'
				size={size}
				icon={item.icon}
				id={item.id}
				aria-label={
					(domProps['aria-label'] as string | undefined)
					?? (domProps['aria-labelledby'] ? undefined : aria)
				}
				disabled={item.disabled}
				className={cn(styles.visibleAction, item.className)}
				onClick={() => item.onSelect?.()}
			/>
		);
	}

	return (
		<Button
			{...domProps}
			type='button'
			variant='ghost'
			size={size}
			iconStart={item.icon}
			id={item.id}
			disabled={item.disabled}
			className={cn(styles.visibleAction, item.className)}
			onClick={() => item.onSelect?.()}
		>
			{item.label}
		</Button>
	);
}

/**
 * Корень: видимые действия + overflow через `Dropdown` + `ActionList`.
 */
const OverflowActionsRoot = forwardRef<HTMLDivElement, OverflowActionsProps>(function OverflowActionsRoot(
	{
		children,
		visibleCount,
		display = 'icon-label',
		showOverflowTrigger: showOverflowTriggerProp,
		size = 'sm',
		mobileTitle,
		className,
		'aria-label': ariaLabel,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const resolvedAriaLabel = ariaLabel ?? t('overflowActions.ariaLabel');
	const resolvedMobileTitle = mobileTitle ?? t('overflowActions.title');
	const listId = useId();
	const sheet = useActionSheetContext();
	const [internalOpen, setInternalOpen] = useState(false);

	const items = useMemo(() => parseItems(children), [children]);

	const limit = visibleCount === undefined || !Number.isFinite(visibleCount)
		? items.length
		: Math.max(0, Math.floor(visibleCount));

	const visibleItems = items.slice(0, limit);
	const overflowItems = items.slice(limit);
	const hasOverflow = overflowItems.length > 0;

	const hideTrigger = !(showOverflowTriggerProp ?? sheet?.shouldShowOverflowTrigger ?? true);

	const isControlledBySheet = sheet != null && hasOverflow;
	const isOpen = isControlledBySheet ? sheet.overflowOpen : internalOpen;

	const setOpen = useCallback((next: boolean) => {
		if (isControlledBySheet) {
			sheet.setOverflowOpen(next);
		} else {
			setInternalOpen(next);
		}
	}, [isControlledBySheet, sheet]);

	const actionListItems: ActionListItem[] = useMemo(
		() => overflowItems.map((item) => ({
			id: item.id ?? item.key,
			label: item.label,
			textValue: labelText(item),
			icon: item.icon,
			disabled: item.disabled,
			onSelect: item.onSelect,
			buttonProps: pickButtonDomProps(item),
		})),
		[overflowItems],
	);

	const handleAction = useCallback((entry: ActionListItem) => {
		entry.onSelect?.();
		setOpen(false);
	}, [setOpen]);

	const showOverflowTrigger = hasOverflow && !hideTrigger;
	const mountOverflowMenu = hasOverflow;

	return (
		<div
			ref={ref}
			className={cn(styles.root, className)}
			{...rest}
			role='toolbar'
			aria-label={resolvedAriaLabel}
		>
			{visibleItems.map((item) => (
				<VisibleAction
					key={item.key}
					item={item}
					display={display}
					size={size}
				/>
			))}

			{mountOverflowMenu && (
				<Dropdown
					open={isOpen}
					onOpenChange={setOpen}
					onClose={() => setOpen(false)}
					align='right'
					widthMode='content'
					popupRole='listbox'
					mobileTitle={resolvedMobileTitle}
				>
					<Dropdown.Trigger asChild>
						<ButtonIcon
							type='button'
							variant='ghost'
							size={size}
							icon={<IconDots3 size={size === 'sm' ? 16 : 18} />}
							aria-label={t('overflowActions.more')}
							className={cn(
								styles.overflowTrigger,
								!showOverflowTrigger ? styles.srOnlyTrigger : '',
							)}
						/>
					</Dropdown.Trigger>
					<Dropdown.Content>
						<ActionList.Root
							id={listId}
							aria-label={resolvedAriaLabel}
							onAction={handleAction}
						>
							<ActionList.Group id='overflow'>
								<ActionList.GroupLabel>
									{t('overflowActions.title')}
								</ActionList.GroupLabel>
								{actionListItems.map((item) => (
									<ActionList.Item key={item.id} {...item} />
								))}
							</ActionList.Group>
						</ActionList.Root>
					</Dropdown.Content>
				</Dropdown>
			)}
		</div>
	);
});

OverflowActionsRoot.displayName = 'OverflowActions';

type OverflowActionsComponent = React.ForwardRefExoticComponent<
	OverflowActionsProps & React.RefAttributes<HTMLDivElement>
> & {
	Item: typeof OverflowActionsItem;
};

/**
 * Панель действий с overflow: лишние пункты уходят в `Dropdown` (⋯).
 *
 * Составной API: `OverflowActions` + `OverflowActions.Item`.
 *
 * - `visibleCount={0}` — все действия только в меню;
 * - `display="icon"` — снаружи только иконки (без иконки всегда лейбл);
 * - в меню ⋯ всегда иконка (если есть) + лейбл;
 * - с `ActionSheetTrigger` на touch+mobile ⋯ визуально скрыт (long-press), но остаётся в Tab-порядке.
 * - на `Item` можно передать `data-*` / `aria-*` — уйдут на видимую кнопку и на пункт в меню ⋯.
 *
 * @component
 * @example
 * <OverflowActions visibleCount={2} display="icon">
 *   <OverflowActions.Item icon={<IconEdit />} label="Изменить" onSelect={…} />
 *   <OverflowActions.Item icon={<IconCopy />} label="Копировать" onSelect={…} />
 *   <OverflowActions.Item label="Удалить" data-testid="delete" onSelect={…} />
 * </OverflowActions>
 */
export const OverflowActions = Object.assign(OverflowActionsRoot, {
	Item: OverflowActionsItem,
}) as OverflowActionsComponent;
