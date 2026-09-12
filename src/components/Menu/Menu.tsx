import type {MenuProps} from './Menu.types';
export type {MenuProps, MenuTrigger} from './Menu.types';

import React, {forwardRef, useCallback, useState} from 'react';
import {Dropdown} from '../Dropdown/Dropdown';
import {ActionList} from '../ActionList/ActionList';
import type {ActionListItem} from '../ActionList/ActionList.types';
import styles from './Menu.module.css';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {useLocale} from '../../locales/localeContext';
import {renderChildren} from '../../utils/renderChildren';

/**
 * Меню действий: клик по триггеру (`Dropdown` + `ActionList`) или ПКМ / Shift+F10 (`trigger="context"`).
 *
 * @component
 * @example
 * <Menu trigger={<ButtonIcon aria-label="Меню" icon={<IconMenu />} />} items={items} onAction={…} />
 * @example
 * <Menu trigger="context" items={items}>
 *   <Card>ПКМ здесь</Card>
 * </Menu>
 */
export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
	{
		trigger,
		children,
		items,
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
		tabIndex,
		'aria-label': ariaLabel,
		onContextMenu,
		onKeyDown,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const isContext = trigger === 'context';
	const listAria = ariaLabel ?? (isContext ? t('menu.contextAriaLabel') : t('menu.ariaLabel'));
	const resolvedMobileTitle = mobileTitle ?? t('menu.mobileTitle');

	const [isOpen, setOpen] = useControlledStateWithCallback(controlledOpen, false, onOpenChange);
	const [coords, setCoords] = useState({
		top: 0,
		left: 0,
	});

	const handleAction = useCallback((item: ActionListItem) => {
		onAction?.(item);
		setOpen(false);
	}, [onAction, setOpen]);

	const openAt = (top: number, left: number) => {
		setCoords({
			top,
			left,
		});
		setOpen(true);
	};

	const handleContextMenu = composeEventHandlers(onContextMenu, (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		let x = event.clientX;
		let y = event.clientY;
		if (!x && !y) {
			const rect = event.currentTarget.getBoundingClientRect();
			x = rect.left;
			y = rect.bottom;
		}
		openAt(y, x);
	});

	const handleKeyDown = composeEventHandlers(onKeyDown, (event: React.KeyboardEvent<HTMLDivElement>) => {
		const isContextKey = event.key === 'ContextMenu'
			|| (event.shiftKey && event.key === 'F10');
		if (!isContextKey) return;
		event.preventDefault();
		const active = document.activeElement;
		const anchor = active instanceof HTMLElement && event.currentTarget.contains(active)
			? active
			: event.currentTarget;
		const rect = anchor.getBoundingClientRect();
		openAt(rect.bottom, rect.left);
	});

	const list = (
		<ActionList
			aria-label={listAria}
			items={items}
			groups={groups}
			filterable={filterable}
			filterPlaceholder={filterPlaceholder}
			emptyText={emptyText}
			onAction={handleAction}
		/>
	);

	if (isContext) {
		return (
			<>
				<div
					ref={ref}
					className={cn(styles.target, className)}
					{...rest}
					tabIndex={tabIndex ?? 0}
					onContextMenu={handleContextMenu}
					onKeyDown={handleKeyDown}
				>
					{children}
				</div>
				<Dropdown
					className={styles.host}
					open={isOpen}
					onOpenChange={setOpen}
					popupRole='none'
					align='left'
					widthMode={widthMode}
					mobileTitle={resolvedMobileTitle}
					panelClassName={styles.menu}
					renderTrigger={(props, triggerRef) => (
						<span
							{...props}
							ref={triggerRef}
							tabIndex={-1}
							className={styles.anchor}
							style={{
								top: coords.top,
								left: coords.left,
							}}
						/>
					)}
				>
					{list}
				</Dropdown>
			</>
		);
	}

	return (
		<Dropdown
			ref={ref}
			className={className}
			open={isOpen}
			onOpenChange={setOpen}
			popupRole='none'
			align={align}
			widthMode={widthMode}
			mobileTitle={resolvedMobileTitle}
			renderTrigger={(props, triggerRef) => renderChildren({
				children: trigger as React.ReactElement,
				props,
				contentRef: triggerRef,
			})}
			{...rest}
		>
			{list}
		</Dropdown>
	);
});

Menu.displayName = 'Menu';
