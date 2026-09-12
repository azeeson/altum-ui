import type {
	DropdownAlign,
	DropdownTriggerSlotProps,
	DropdownProps,
} from './Dropdown.types';
export type {
	DropdownPopupRole,
	DropdownTriggerMode,
	DropdownAlign,
	DropdownWidthMode,
	DropdownPanelScroll,
	DropdownTriggerAttrs,
	DropdownTriggerSlotProps,
	DropdownProps,
} from './Dropdown.types';

import {forwardRef, lazy, Suspense, useCallback, useEffect, useId, useMemo, useRef} from 'react';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconCross} from '../../icons/icons/IconCross';
import overlayClose from '../../styles/overlayClose.module.css';
import styles from './Dropdown.module.css';
import {focusElement} from '../../utils/a11y';
import {MOBILE_MEDIA_QUERY, useMediaQuery} from '../../hooks/useMediaQuery';
import {useDocumentKeyDown} from '../../hooks/useDocumentKeyDown';
import {useControlledState} from '../../hooks/useControlledState';
import {FOCUSABLE_WITH_ROLES_SELECTOR, handleFocusableListNavigation, handleTabCycle, queryFocusableElements} from '../../utils/focus';
import {cn} from '../../utils/cn';
import {elevateAboveOverlayStack, useOverlayStackZIndex} from '../../utils/overlayStack';
import {Box} from '../Box/Box';
import {useLocale} from '../../locales/localeContext';
import {Overlay} from '../Overlay/Overlay';
import type {AnchorAlign} from '../../types';

const DropdownMobileSheet = lazy(async () => {
	const module = await import('./DropdownMobileSheet');
	return {default: module.DropdownMobileSheet};
});

function mapAlign(align: DropdownAlign): AnchorAlign {
	if (align === 'left' || align === 'start' || align === 'auto') return 'start';
	if (align === 'right' || align === 'end') return 'end';
	return 'center';
}

/**
 * Выпадающая панель: desktop Overlay и mobile Sheet.
 * Якорь — `renderTrigger`; содержимое панели — `children`.
 *
 * @component
 * @example
 * <Dropdown
 *   renderTrigger={(props, ref) => <Button {...props} ref={ref}>Меню</Button>}
 *   widthMode="content"
 *   mobileTitle="Меню"
 * >
 *   <ActionList items={menuItems} />
 * </Dropdown>
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(function Dropdown(
	{
		children,
		renderTrigger,
		open: controlledIsOpen,
		onOpenChange,
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
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const overlayStackZ = useOverlayStackZIndex();
	const elevatedZIndex = elevateAboveOverlayStack(overlayStackZ);
	const isCombobox = triggerMode === 'combobox';
	const [isOpen, setIsOpen] = useControlledState(controlledIsOpen, false);
	const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

	const triggerRef = useRef<HTMLElement | null>(null);
	const dropdownRef = useRef<HTMLElement | null>(null);
	const sheetRef = useRef<HTMLDivElement>(null);
	const previousFocusRef = useRef<HTMLElement | null>(null);
	const dropdownId = useId();
	const trapTab = popupRole === 'menu';

	const getFocusableTrigger = useCallback((): HTMLElement | null => {
		if (!triggerRef.current) return null;
		return (
			triggerRef.current.querySelector<HTMLElement>('[role="combobox"]')
			?? triggerRef.current.querySelector<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
			?? triggerRef.current
		);
	}, []);

	const closeDropdown = useCallback(() => {
		onOpenChange?.(false);
		setIsOpen(false);

		if (isCombobox) {
			const active = document.activeElement;
			if (active instanceof Node && triggerRef.current?.contains(active)) {
				return;
			}
			const inPopup = active instanceof Node && (
				Boolean(dropdownRef.current?.contains(active))
				|| Boolean(sheetRef.current?.contains(active))
			);
			if (!inPopup) {
				return;
			}
		}

		const focusTarget = previousFocusRef.current ?? getFocusableTrigger();
		focusElement(focusTarget);
	}, [
		getFocusableTrigger,
		isCombobox,
		onOpenChange,
		setIsOpen
	]);

	const openDropdown = useCallback(() => {
		previousFocusRef.current = document.activeElement as HTMLElement;
		onOpenChange?.(true);
		setIsOpen(true);
	}, [onOpenChange, setIsOpen]);

	const toggleDropdown = useCallback(() => {
		if (isOpen) {
			closeDropdown();
		} else {
			openDropdown();
		}
	}, [closeDropdown, isOpen, openDropdown]);

	const handleTriggerKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (isCombobox) {
				if (isOpen && (event.key === 'Enter' || event.key === ' ')) {
					return;
				}
				if (!isOpen && (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
					event.preventDefault();
					openDropdown();
				}
				return;
			}

			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				toggleDropdown();
				return;
			}

			if (!isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
				event.preventDefault();
				openDropdown();
			}
		},
		[
			isCombobox,
			isOpen,
			openDropdown,
			toggleDropdown,
		],
	);

	useDocumentKeyDown((event) => {
		if (!isOpen || !dropdownRef.current) return;

		const focusableElements = queryFocusableElements(
			dropdownRef.current,
			FOCUSABLE_WITH_ROLES_SELECTOR,
		);
		if (focusableElements.length === 0) return;

		if (handleTabCycle(event, focusableElements, {
			wrap: trapTab || isMobile,
			onTabForwardFromLast: trapTab || isMobile ? undefined : closeDropdown,
		})) {
			return;
		}

		if (isCombobox && !dropdownRef.current.contains(document.activeElement)) {
			return;
		}

		handleFocusableListNavigation(event, focusableElements);
	}, {enabled: isOpen});

	useEffect(() => {
		if (!isOpen || isCombobox || !dropdownRef.current) return;
		focusElement(dropdownRef.current.querySelector<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="option"]'
		));
	}, [isCombobox, isOpen]);

	useEffect(() => {
		if (!isOpen || !isCombobox) return;

		const handleFocusIn = (event: FocusEvent) => {
			const focusTarget = event.target as Node;
			if (
				triggerRef.current?.contains(focusTarget)
				|| dropdownRef.current?.contains(focusTarget)
				|| sheetRef.current?.contains(focusTarget)
			) {
				return;
			}
			closeDropdown();
		};

		document.addEventListener('focusin', handleFocusIn);
		return () => document.removeEventListener('focusin', handleFocusIn);
	}, [closeDropdown, isCombobox, isOpen]);

	const triggerAttrs: DropdownTriggerSlotProps = useMemo(() => ({
		type: 'button',
		'aria-haspopup': popupRole === 'menu'
			? 'menu'
			: popupRole === 'dialog'
				? 'dialog'
				: 'listbox',
		'aria-expanded': isOpen,
		'aria-controls': isOpen ? dropdownId : undefined,
		...(isCombobox ? {} : {tabIndex: 0}),
		onKeyDown: handleTriggerKeyDown,
		onClick: (event) => {
			if (isCombobox) {
				if (!isOpen) openDropdown();
				return;
			}
			event.preventDefault();
			toggleDropdown();
		},
	}), [
		dropdownId,
		handleTriggerKeyDown,
		isCombobox,
		isOpen,
		openDropdown,
		popupRole,
		toggleDropdown,
	]);

	const panelRole = popupRole === 'none' ? undefined : popupRole;
	const panelClasses = cn(
		styles.panel,
		isMobile && styles.mobile,
		panelScroll === 'content' && styles.contentScroll,
		panelClassName,
	);
	const panelHandlers = {
		onClick: (event: React.MouseEvent) => event.stopPropagation(),
		onMouseDown: (event: React.MouseEvent) => {
			if (isCombobox) event.preventDefault();
		},
	};

	let panel: React.ReactNode = null;
	if (isMobile) {
		panel = (
			<Suspense fallback={null}>
				<DropdownMobileSheet
					sheetRef={sheetRef as React.Ref<HTMLDivElement>}
					open={isOpen}
					onOpenChange={(next) => {
						if (!next) closeDropdown();
					}}
					zIndex={elevatedZIndex}
					mobileTitle={mobileTitle}
					mobileLeftControls={mobileLeftControls}
					mobileRightControls={mobileRightControls ?? (
						mobileTitle ? (
							<ButtonIcon
								appearance='diskClose'
								aria-label={t('common.close')}
								icon={(
									<IconCross
										className={overlayClose.icon}
										size={16}
										aria-hidden
									/>
								)}
								onClick={closeDropdown}
							/>
						) : undefined
					)}
				>
					<div
						id={dropdownId}
						ref={dropdownRef as React.Ref<HTMLDivElement>}
						role={panelRole}
						className={panelClasses}
						{...panelHandlers}
					>
						{children}
					</div>
				</DropdownMobileSheet>
			</Suspense>
		);
	} else {
		panel = (
			<Overlay
				ref={dropdownRef}
				variant='dropdown'
				purpose='dropdown'
				open={isOpen}
				onOpenChange={(next) => {
					if (!next) closeDropdown();
				}}
				targetRef={triggerRef}
				triggerMode='manual'
				side='bottom'
				align={mapAlign(align)}
				widthMode={widthMode}
				dismiss='all'
				role={panelRole ?? 'presentation'}
			>
				<Box
					as='div'
					variant='floating'
					id={dropdownId}
					role={panelRole}
					className={panelClasses}
					{...boxProps}
					{...panelHandlers}
				>
					{children}
				</Box>
			</Overlay>
		);
	}

	return (
		<div
			ref={ref}
			className={cn(styles.root, className)}
			{...rest}
		>
			{renderTrigger(triggerAttrs, (node) => {
				triggerRef.current = node;
			})}
			{panel}
		</div>
	);
});

Dropdown.displayName = 'Dropdown';
