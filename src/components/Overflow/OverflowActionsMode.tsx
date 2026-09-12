import type {
	OverflowDisplay,
	OverflowItemDomProps,
	OverflowItemProps,
	OverflowProps,
} from './Overflow.types';
import type {ControlSize} from '../../types';

import React, {forwardRef, useCallback, useId, useMemo, useState} from 'react';
import {ActionList} from '../ActionList/ActionList';
import type {ActionListItem} from '../ActionList/ActionList.types';
import {Button} from '../Button/Button';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {cn} from '../../utils/cn';
import {useActionSheetContext} from '../ActionSheetTrigger/actionSheetContext';
import styles from './Overflow.module.css';
import {useLocale} from '../../locales/localeContext';
import {OverflowMore} from './OverflowMore';

type ParsedItem = OverflowItemProps & {key: string};

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
): child is React.ReactElement<OverflowItemProps> {
	return React.isValidElement(child) && child.type === OverflowItem;
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

function pickButtonDomProps(item: ParsedItem): OverflowItemDomProps {
	const domProps: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(item)) {
		if (ITEM_OWN_KEYS.has(key) || value === undefined) continue;
		domProps[key] = value;
	}
	return domProps as OverflowItemDomProps;
}

/**
 * Маркер действия для `Overflow` (рендерит родитель).
 *
 * @component
 * @example
 * <Overflow.Item icon={<IconTrash />} label="Удалить" onSelect={…} />
 */
export const OverflowItem: React.FC<OverflowItemProps> = () => null;
OverflowItem.displayName = 'Overflow.Item';

function VisibleAction({
	item,
	display,
	size,
}: {
	item: ParsedItem;
	display: OverflowDisplay;
	size: ControlSize;
}) {
	const aria = labelText(item);
	const showIconOnly = display === 'icon' && item.icon != null;
	const domProps = pickButtonDomProps(item);
	const shared = {
		...domProps,
		type: 'button' as const,
		variant: 'ghost' as const,
		size,
		id: item.id,
		disabled: item.disabled,
		className: cn(styles.item, item.className),
		onClick: () => item.onSelect?.(),
	};

	if (showIconOnly) {
		return (
			<ButtonIcon
				{...shared}
				icon={item.icon}
				aria-label={
					(domProps['aria-label'] as string | undefined)
					?? (domProps['aria-labelledby'] ? undefined : aria)
				}
			/>
		);
	}

	return (
		<Button
			{...shared}
			iconStart={item.icon}
		>
			{item.label}
		</Button>
	);
}

/**
 * Корень: видимые действия + overflow через `Dropdown` + `ActionList`.
 */
export const OverflowMode = forwardRef<HTMLDivElement, OverflowProps>(function OverflowMode(
	{
		children,
		visibleCount,
		display = 'icon-label',
		showOverflowTrigger: showOverflowTriggerProp,
		size = 'sm',
		mobileTitle,
		className,
		'aria-label': ariaLabel,
		gap: _gap,
		fit: _fit,
		maxVisible: _maxVisible,
		align: _align,
		moreLabel: _moreLabel,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const resolvedAriaLabel = ariaLabel ?? t('overflow.ariaLabel');
	const resolvedMobileTitle = mobileTitle ?? t('overflow.title');
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
			groupId: 'overflow',
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

	return (
		<div
			ref={ref}
			className={cn(styles.root, styles.actions, className)}
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

			{hasOverflow && (
				<OverflowMore
					open={isOpen}
					onOpenChange={setOpen}
					size={size}
					mobileTitle={resolvedMobileTitle}
					ariaLabel={t('overflow.more')}
					hidden={hideTrigger}
				>
					<ActionList
						id={listId}
						aria-label={resolvedAriaLabel}
						items={actionListItems}
						groups={[
							{
								id: 'overflow',
								label: t('overflow.title'),
							},
						]}
						onAction={handleAction}
					/>
				</OverflowMore>
			)}
		</div>
	);
});

OverflowMode.displayName = 'Overflow';
