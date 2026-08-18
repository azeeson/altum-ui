import type {ContextMenuProps} from './ContextMenu.types';
export type {
	ContextMenuProps,
} from './ContextMenu.types';

import React, {forwardRef, useCallback, useLayoutEffect, useRef, useState} from 'react';
import {ActionList} from '../ActionList/ActionList';
import type {ActionListItem} from '../ActionList/ActionList.types';
import {Box} from '../Box/Box';
import {Overlay} from '../Overlay/Overlay';
import {clampToViewport} from '../../utils/anchorPosition';
import styles from './ContextMenu.module.css';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useLocale} from '../LocaleProvider/LocaleProvider';

/**
 * Контекстное меню по правому клику или Shift+F10 / клавише ContextMenu:
 * ActionList в `Overlay` (`variant="floating"`) у курсора (или у сфокусированного узла).
 *
 * @component
 * @example
 * <ContextMenu groups={groups} onAction={handleAction}>
 *   <Card>ПКМ здесь</Card>
 * </ContextMenu>
 */
export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(function ContextMenu(
	{
		children,
		groups,
		onAction,
		filterable = false,
		emptyText,
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
	const [open, setOpen] = useState(false);
	const [coords, setCoords] = useState<{
		top: number;
		left: number
	}>({
		top: 0,
		left: 0,
	});
	const menuRef = useRef<HTMLElement | null>(null);

	const close = useCallback(() => setOpen(false), []);

	const handleContextMenu = composeEventHandlers(onContextMenu, (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		let x = event.clientX;
		let y = event.clientY;
		if (!x && !y) {
			const rect = event.currentTarget.getBoundingClientRect();
			x = rect.left;
			y = rect.bottom;
		}
		setCoords({
			top: y,
			left: x,
		});
		setOpen(true);
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
		setCoords({
			top: rect.bottom,
			left: rect.left,
		});
		setOpen(true);
	});

	useLayoutEffect(() => {
		if (!open || !menuRef.current) return;
		const rect = menuRef.current.getBoundingClientRect();
		const clamped = clampToViewport(coords.left, coords.top, rect.width, rect.height);
		if (clamped.top !== coords.top || clamped.left !== coords.left) {
			setCoords(clamped);
		}
	}, [coords.left, coords.top, open]);

	const handleAction = (item: ActionListItem) => {
		onAction?.(item);
		close();
	};

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
			<Overlay
				variant='floating'
				purpose='dropdown'
				open={open}
				onClose={close}
				role='presentation'
				style={{
					top: coords.top,
					left: coords.left,
				}}
				trapFocus
				closeOnOutsideClick
				closeOnEscape
				asChild
			>
				<Box
					ref={menuRef}
					variant='floating'
					border
					shadow='md'
					padding='none'
					radius='md'
					className={styles.menu}
				>
					<ActionList.Root
						aria-label={ariaLabel ?? t('contextMenu.ariaLabel')}
						onAction={handleAction}
					>
						{filterable && <ActionList.Search />}
						{groups.map((group) => (
							<ActionList.Group key={group.id} id={group.id}>
								<ActionList.GroupLabel>
									{group.label}
								</ActionList.GroupLabel>
								{group.items.map((item) => (
									<ActionList.Item key={item.id} {...item} />
								))}
							</ActionList.Group>
						))}
						{emptyText && (
							<ActionList.Empty>
								{emptyText}
							</ActionList.Empty>
						)}
					</ActionList.Root>
				</Box>
			</Overlay>
		</>
	);
});

ContextMenu.displayName = 'ContextMenu';
