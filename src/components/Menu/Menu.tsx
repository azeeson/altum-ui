import type {KeyboardEvent, MouseEvent, MutableRefObject, ReactElement} from 'react';
import type {MenuProps} from './Menu.types';
export type {MenuProps, MenuTrigger} from './Menu.types';

import {useCallback, useRef} from 'react';
import {ActionList} from '../ActionList/ActionList';
import {Dropdown, type DropdownPopup} from '../Dropdown/Dropdown';
import styles from './Menu.module.css';
import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';
import {popoverFromInvoker, showPopover} from '../../core/utils/popover';
import {renderChildren} from '../../core/utils/renderChildren';
import {ruSlice as ru_menu} from '../../locales/slices/menu.ru';

const localeFallback = {
	menu: ru_menu,
};

/**
 * Меню действий: клик по триггеру (`Dropdown` + `ActionList`) или ПКМ / Shift+F10 (`trigger="context"`).
 *
 * @component
 * @example
 * <Menu trigger={<ButtonIcon variant='ghost' aria-label="Меню" icon={<IconMenu/>} />} items={items} onAction={…} />
 * @example
 * <Menu trigger="context" items={items}>
 *   <Card>ПКМ здесь</Card>
 * </Menu>
 */
export function Menu({
	trigger,
	children,
	items,
	groups,
	onOpenChange,
	popupRef: popupRefProp,
	align = 'right',
	widthMode,
	mobileTitle,
	emptyText,
	onAction,
	className,
	tabIndex,
	'aria-label': ariaLabel,
	onContextMenu,
	onKeyDown,
	rootRef,
	...rest
}: MenuProps) {
	const {t} = useLocale(localeFallback);
	const context = trigger === 'context';
	const ownRef = useRef<DropdownPopup | null>(null);
	const anchorRef = useRef<HTMLSpanElement | null>(null);
	const bindPopup = useCallback((node: DropdownPopup | null) => {
		ownRef.current = node;
		if (typeof popupRefProp === 'function') popupRefProp(node);
		else if (popupRefProp) (popupRefProp as MutableRefObject<DropdownPopup | null>).current = node;
	}, [popupRefProp]);

	const positionPanel = (top: number, left: number) => {
		const panel = popoverFromInvoker(anchorRef.current);
		if (!panel) return panel;
		panel.style.setProperty('--altum-menu-x', `${left}px`);
		panel.style.setProperty('--altum-menu-y', `${top}px`);
		return panel;
	};

	const openPanel = (panel: HTMLElement | null) => {
		if (panel) showPopover(panel);
		else ownRef.current?.show();
	};

	/**
	 * ПКМ: Safari шлёт contextmenu на mousedown (кнопка ещё зажата) —
	 * синхронный / microtask showPopover закрывает `popover=auto` на pointerup.
	 * Chrome шлёт contextmenu уже после pointerup (`buttons === 0`) — открываем сразу.
	 */
	const openAt = (top: number, left: number, buttons = 0) => {
		const panel = positionPanel(top, left);
		if (buttons & 2) {
			const onUp = () => {
				window.removeEventListener('pointerup', onUp, true);
				window.removeEventListener('pointercancel', onUp, true);
				openPanel(panel);
			};
			window.addEventListener('pointerup', onUp, true);
			window.addEventListener('pointercancel', onUp, true);
			return;
		}
		queueMicrotask(() => openPanel(panel));
	};

	const dropdown = (
		<Dropdown
			rootRef={context ? undefined : rootRef}
			className={context ? styles.host : className}
			popupRef={bindPopup}
			onOpenChange={onOpenChange}
			popupRole='none'
			align={context ? 'left' : align}
			widthMode={widthMode}
			mobileTitle={mobileTitle ?? t('menu.mobileTitle')}
			panelClassName={context ? styles.menu : undefined}
			trigger={(props, triggerRef) => {
				if (!context) {
					return renderChildren({
						children: trigger as ReactElement,
						props,
						contentRef: triggerRef,
					});
				}
				const {popovertarget} = props;
				return (
					<span
						ref={(node) => {
							anchorRef.current = node;
							triggerRef(node);
						}}
						tabIndex={-1}
						className={styles.anchor}
						aria-hidden
						popovertarget={popovertarget}
					/>
				);
			}}
			{...(context ? {} : rest)}
		>
			<ActionList
				aria-label={ariaLabel ?? (context ? t('menu.contextAriaLabel') : t('menu.ariaLabel'))}
				items={items}
				groups={groups}
				emptyText={emptyText}
				onAction={(item) => {
					onAction?.(item);
					ownRef.current?.hide();
				}}
			/>
		</Dropdown>
	);

	if (!context) return dropdown;

	return (
		<>
			<div
				ref={rootRef}
				className={cn(styles.target, className)}
				{...rest}
				tabIndex={tabIndex ?? 0}
				onContextMenu={(event: MouseEvent<HTMLDivElement>) => {
					onContextMenu?.(event);
					if (event.defaultPrevented) return;
					event.preventDefault();
					let x = event.clientX;
					let y = event.clientY;
					if (!x && !y) {
						const rect = event.currentTarget.getBoundingClientRect();
						x = rect.left;
						y = rect.bottom;
					}
					openAt(y, x, event.buttons);
				}}
				onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
					onKeyDown?.(event);
					if (event.defaultPrevented) return;
					if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) return;
					event.preventDefault();
					const active = document.activeElement;
					const node = active instanceof HTMLElement && event.currentTarget.contains(active)
						? active
						: event.currentTarget;
					const rect = node.getBoundingClientRect();
					openAt(rect.bottom, rect.left, 0);
				}}
			>
				{children}
			</div>
			{dropdown}
		</>
	);
}
