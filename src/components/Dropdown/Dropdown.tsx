import type {
	DropdownTriggerSlotProps,
	DropdownPopup,
	DropdownProps,
} from './Dropdown.types';
export type {
	DropdownPopupRole,
	DropdownTriggerMode,
	DropdownAlign,
	DropdownWidthMode,
	DropdownPanelScroll,
	DropdownPanelState,
	DropdownTriggerAttrs,
	DropdownTriggerSlotProps,
	DropdownPopup,
	DropdownProps,
} from './Dropdown.types';

import {
	useLayoutEffect,
	useRef,
	useState,
	type MouseEvent as ReactMouseEvent,
	type MutableRefObject,
	type ReactNode,
	type RefCallback,
} from 'react';
import {Box} from '../Box/Box';
import {Popover} from '../Popover/Popover';
import {Title} from '../Title/Title';
import styles from './Dropdown.module.css';
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';
import {hidePopover, showPopover} from '../../core/utils/popover';
import {renderChildren} from '../../core/utils/renderChildren';
import type {PopoverTriggerSlotProps} from '../Popover/Popover.types';

const ITEM_SELECTOR = '[role="option"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

/**
 * Список или меню у кнопки: выбрать значение или одну команду.
 * Панель — `Popover` (`popover="auto"`): клик снаружи и Escape закрывает браузер.
 * На узком экране та же панель становится нижней шторкой силами CSS.
 * На широком вход идёт от стороны, с которой панель реально открылась.
 * Стрелки по пунктам ходят у списка внутри (`Listbox`, `ActionList`).
 * Форма, фильтры и календарь — это `Popover`, не список.
 *
 * @component
 * @example
 * <Dropdown trigger={<Button>Язык</Button>} widthMode="content">
 *   <ActionList items={languages} />
 * </Dropdown>
 */
export function Dropdown({
	children,
	trigger,
	defaultOpen = false,
	onOpenChange,
	popupRef,
	popupRole = 'none',
	triggerMode = 'toggle',
	className,
	boxProps,
	align = 'auto',
	widthMode = 'content',
	panelScroll = 'overlay',
	mobileTitle,
	mobileLeftControls,
	mobileRightControls,
	panelClassName,
	rootRef,
	...rest
}: DropdownProps) {
	const isCombobox = triggerMode === 'combobox';
	const renderPanel = typeof children === 'function' ? children : null;
	const [open, setOpen] = useState(defaultOpen);
	const panelRef = useRef<HTMLElement | null>(null);
	const onOpenChangeRef = useRef(onOpenChange);
	onOpenChangeRef.current = onOpenChange;

	const api = useRef<DropdownPopup>({
		show() {},
		hide() {},
	});
	api.current.show = () => showPopover(panelRef.current);
	api.current.hide = () => hidePopover(panelRef.current);

	useLayoutEffect(() => {
		const node = api.current;
		if (typeof popupRef === 'function') {
			popupRef(node);
			return () => popupRef(null);
		}
		if (popupRef) (popupRef as MutableRefObject<DropdownPopup | null>).current = node;
		return () => {
			if (popupRef) (popupRef as MutableRefObject<DropdownPopup | null>).current = null;
		};
	}, [popupRef]);

	const triggerAttrs: DropdownTriggerSlotProps = {
		type: 'button',
		'aria-haspopup': popupRole === 'menu' || popupRole === 'dialog' ? popupRole : 'listbox',
		...(isCombobox ? {} : {tabIndex: 0}),
	};
	const panelRole = popupRole === 'none' ? undefined : popupRole;
	const popoverAlign = align === 'right' || align === 'end'
		? 'end'
		: align === 'center'
			? 'center'
			: 'start';
	const titled = typeof mobileTitle === 'string' || typeof mobileTitle === 'number';
	const hasMobileChrome = mobileTitle != null
		|| mobileLeftControls != null
		|| mobileRightControls != null;
	const {
		className: boxClassName,
		onClick: boxOnClick,
		onMouseDown: boxOnMouseDown,
		...boxRest
	} = boxProps ?? {};
	const closeOnItem = (event: ReactMouseEvent) => {
		if (event.target instanceof Element && event.target.closest(ITEM_SELECTOR)) {
			hidePopover(panelRef.current);
		}
	};
	const keepComboboxFocus = (event: ReactMouseEvent) => {
		if (isCombobox) event.preventDefault();
	};
	const slotTrigger = (slot?: PopoverTriggerSlotProps, anchorRef?: RefCallback<HTMLElement>) => renderChildren({
		children: trigger,
		props: {
			...triggerAttrs,
			...slot,
			onClick: (event) => {
				triggerAttrs.onClick?.(event);
				if (!event.defaultPrevented) slot?.onClick?.(event);
			},
		},
		contentRef: anchorRef,
	});

	return (
		<div
			ref={rootRef}
			{...rest}
			className={cn(styles.root, className)}
		>
			<Popover
				variant='plain'
				defaultOpen={defaultOpen}
				popoverTargetAction={isCombobox ? 'show' : 'toggle'}
				side='bottom'
				align={popoverAlign}
				widthMode={widthMode}
				role={panelRole ?? 'presentation'}
				className={cn(styles.panel, panelClassName)}
				panelRef={panelRef}
				onToggle={(next) => {
					if (renderPanel) setOpen(next);
					onOpenChangeRef.current?.(next);
				}}
				trigger={slotTrigger}
			>
				{hasMobileChrome ? (
					<header className={styles.mobileHeader}>
						{mobileLeftControls}
						{mobileTitle != null ? (
							<div className={styles.mobileTitle}>
								{titled ? <Title level={3}>
									{mobileTitle}
								</Title> : mobileTitle}
							</div>
						) : null}
						{mobileRightControls}
					</header>
				) : null}
				<Box
					variant='floating'
					{...boxRest}
					data-scroll={panelScroll}
					className={cn(
						panelScroll === 'content' && utilities.scrollport,
						styles.box,
						boxClassName,
					)}
					onClick={(event) => {
						boxOnClick?.(event);
						if (!event.defaultPrevented) closeOnItem(event);
					}}
					onMouseDown={(event) => {
						boxOnMouseDown?.(event);
						if (!event.defaultPrevented) keepComboboxFocus(event);
					}}
				>
					{renderPanel ? renderPanel({open}) : children as ReactNode}
				</Box>
			</Popover>
		</div>
	);
}
