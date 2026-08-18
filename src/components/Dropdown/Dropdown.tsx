import type {DropdownPopupRole, DropdownTriggerMode, DropdownAlign, DropdownWidthMode, DropdownPanelScroll, DropdownTriggerSlotProps, DropdownProps, DropdownTriggerProps, DropdownContentProps} from './Dropdown.types';
export type {
	DropdownPopupRole,
	DropdownTriggerMode,
	DropdownAlign,
	DropdownWidthMode,
	DropdownPanelScroll,
	DropdownTriggerAttrs,
	DropdownTriggerSlotProps,
	DropdownProps,
	DropdownTriggerProps,
	DropdownContentProps,
} from './Dropdown.types';

import React, {createContext, forwardRef, lazy, Suspense, useCallback, useContext, useEffect, useId, useMemo, useRef} from 'react';
import {composeRefs} from '../../utils/composeRefs';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconCross} from '../../icons/icons/IconCross';
import styles from './Dropdown.module.css';
import {focusElement} from '../../utils/a11y';
import {useOutsideClick} from '../../hooks/useOutsideClick';
import {MOBILE_MEDIA_QUERY, useMediaQuery} from '../../hooks/useMediaQuery';
import {useDocumentKeyDown} from '../../hooks/useDocumentKeyDown';
import {useControlledState} from '../../hooks/useControlledState';
import {FOCUSABLE_WITH_ROLES_SELECTOR, handleFocusableListNavigation, handleTabCycle, queryFocusableElements} from '../../utils/focus';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {elevateAboveOverlayStack, useOverlayStackZIndex} from '../../utils/overlayStack';
import {Box} from '../Box/Box';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {Overlay, type OverlayContentProps} from '../Overlay/Overlay';
import {renderChildren} from '../../utils/renderChildren';
import type {AnchorAlign} from '../../types';

const DropdownMobileSheet = lazy(async () => {
	const module = await import('./DropdownMobileSheet');
	return {default: module.DropdownMobileSheet};
});

interface DropdownContextValue {
	isOpen: boolean;
	openDropdown: () => void;
	closeDropdown: () => void;
	toggleDropdown: () => void;
	triggerRef: React.RefObject<HTMLElement | null>;
	dropdownRef: React.MutableRefObject<HTMLElement | null>;
	sheetRef: React.RefObject<HTMLDivElement | null>;
	dropdownId: string;
	align: DropdownAlign;
	widthMode: DropdownWidthMode;
	popupRole: DropdownPopupRole;
	triggerMode: DropdownTriggerMode;
	isCombobox: boolean;
	isMobile: boolean;
	panelScroll: DropdownPanelScroll;
	mobileTitle?: React.ReactNode;
	mobileLeftControls?: React.ReactNode;
	mobileRightControls?: React.ReactNode;
	elevatedZIndex: number | string | undefined;
	handleTriggerKeyDown: (event: React.KeyboardEvent) => void;
	triggerAttrs: DropdownTriggerSlotProps;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext(component: string): DropdownContextValue {
	const context = useContext(DropdownContext);
	if (!context) {
		throw new Error(`${component} должен использоваться внутри Dropdown`);
	}
	return context;
}

function mapAlign(align: DropdownAlign): AnchorAlign {
	if (align === 'left' || align === 'auto') return 'start';
	if (align === 'right') return 'end';
	return 'center';
}

const DropdownRoot = forwardRef<HTMLDivElement, DropdownProps>(function DropdownRoot(
	{
		children,
		open: controlledIsOpen,
		onClose,
		onOpenChange,
		align = 'auto',
		widthMode = 'content',
		popupRole = 'none',
		triggerMode = 'toggle',
		mobileTitle,
		mobileLeftControls,
		mobileRightControls,
		panelScroll = 'overlay',
		className,
		...rest
	},
	ref,
) {
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
		onClose?.();
		onOpenChange?.(false);
		setIsOpen(false);

		const focusTarget = previousFocusRef.current ?? getFocusableTrigger();
		focusElement(focusTarget);
	}, [
		getFocusableTrigger,
		onClose,
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

	useOutsideClick(
		[triggerRef, sheetRef],
		closeDropdown,
		{enabled: isOpen && isMobile},
	);

	useDocumentKeyDown((event) => {
		if (!isOpen) return;
		if (!dropdownRef.current) return;

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

		const focusInPopup = dropdownRef.current.contains(document.activeElement);
		if (isCombobox && !focusInPopup) {
			return;
		}

		handleFocusableListNavigation(event, focusableElements);
	}, {enabled: isOpen});

	useEffect(() => {
		if (!isOpen || isCombobox || !dropdownRef.current) return;

		const firstFocusable = dropdownRef.current.querySelector<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="option"]'
		);
		focusElement(firstFocusable);
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
		onKeyDown: handleTriggerKeyDown,
		onClick: (event) => {
			if (isCombobox) {
				if (!isOpen) {
					openDropdown();
				}
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

	const value = useMemo<DropdownContextValue>(() => ({
		isOpen,
		openDropdown,
		closeDropdown,
		toggleDropdown,
		triggerRef,
		dropdownRef,
		sheetRef,
		dropdownId,
		align,
		widthMode,
		popupRole,
		triggerMode,
		isCombobox,
		isMobile,
		panelScroll,
		mobileTitle,
		mobileLeftControls,
		mobileRightControls,
		elevatedZIndex,
		handleTriggerKeyDown,
		triggerAttrs,
	}), [
		align,
		closeDropdown,
		dropdownId,
		elevatedZIndex,
		handleTriggerKeyDown,
		isCombobox,
		isMobile,
		isOpen,
		mobileLeftControls,
		mobileRightControls,
		mobileTitle,
		openDropdown,
		panelScroll,
		popupRole,
		toggleDropdown,
		triggerAttrs,
		triggerMode,
		widthMode,
	]);

	return (
		<DropdownContext.Provider value={value}>
			<div
				ref={ref}
				className={cn(styles.root, className)}
				{...rest}
			>
				{children}
			</div>
		</DropdownContext.Provider>
	);
});

const DropdownTrigger = forwardRef<HTMLElement, DropdownTriggerProps>(function DropdownTrigger(props, ref) {
	const {
		children,
		asChild,
		className,
	} = props;
	const {
		triggerRef,
		triggerAttrs,
	} = useDropdownContext('Dropdown.Trigger');

	const resolvedAsChild = asChild === true;
	const slotProps: DropdownTriggerSlotProps = {
		...triggerAttrs,
		...(resolvedAsChild ? {tabIndex: 0} : {}),
		...(className ? {className} : {}),
	};

	return renderChildren({
		asChild: resolvedAsChild,
		children,
		props: slotProps,
		/* eslint-disable-next-line react-hooks/refs -- composeRefs мержит object-ref; значение читается только позже */
		contentRef: composeRefs(ref, triggerRef),
	});
});

const DropdownContent = forwardRef<HTMLElement, DropdownContentProps>(function DropdownContent(
	{
		children,
		className,
		boxProps,
		onClick,
		onMouseDown,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const {
		isOpen,
		closeDropdown,
		triggerRef,
		dropdownRef,
		sheetRef,
		dropdownId,
		align,
		widthMode,
		popupRole,
		isCombobox,
		isMobile,
		panelScroll,
		mobileTitle,
		mobileLeftControls,
		mobileRightControls,
		elevatedZIndex,
	} = useDropdownContext('Dropdown.Content');

	const panelRole = popupRole === 'none' ? undefined : popupRole;

	const resolvedMobileRightControls = mobileRightControls ?? (
		mobileTitle ? (
			<ButtonIcon
				variant='ghost'
				size='sm'
				aria-label={t('common.close')}
				onClick={closeDropdown}
			>
				<IconCross size={14} />
			</ButtonIcon>
		) : undefined
	);

	const panelClasses = cn(
		isMobile ? styles.mobilePanel : styles.dropdownOverlay,
		panelScroll === 'content' ? styles.dropdownPanelContentScroll : '',
		className,
	);

	const panelHandlers = {
		onClick: composeEventHandlers(onClick, (event: React.MouseEvent) => event.stopPropagation()),
		onMouseDown: composeEventHandlers(onMouseDown, (event: React.MouseEvent) => {
			if (isCombobox) {
				event.preventDefault();
			}
		}),
	};

	if (isMobile) {
		return (
			<Suspense fallback={null}>
				<DropdownMobileSheet
					sheetRef={sheetRef as React.Ref<HTMLDivElement>}
					open={isOpen}
					onClose={closeDropdown}
					zIndex={elevatedZIndex}
					mobileTitle={mobileTitle}
					mobileLeftControls={mobileLeftControls}
					mobileRightControls={resolvedMobileRightControls}
				>
					<div
						id={dropdownId}
						ref={composeRefs(ref, dropdownRef as React.Ref<HTMLDivElement>)}
						role={panelRole}
						className={panelClasses}
						{...rest}
						{...panelHandlers}
					>
						{children}
					</div>
				</DropdownMobileSheet>
			</Suspense>
		);
	}

	return (
		<Overlay
			ref={ref}
			variant='dropdown'
			purpose='dropdown'
			open={isOpen}
			onClose={closeDropdown}
			targetRef={triggerRef}
			triggerMode='manual'
			side='bottom'
			align={mapAlign(align)}
			widthMode={widthMode}
			closeOnOutsideClick
			closeOnEscape
			asChild={false}
		>
			{(slotProps: OverlayContentProps, contentRef) => (
				<Box
					as='div'
					variant='floating'
					id={dropdownId}
					ref={(node: HTMLDivElement | null) => {
						dropdownRef.current = node;
						contentRef(node);
					}}
					role={panelRole}
					className={cn(
						isMobile ? styles.mobilePanel : styles.dropdownOverlay,
						panelScroll === 'content' ? styles.dropdownPanelContentScroll : '',
						slotProps.className,
						className,
					)}
					style={slotProps.style}
					data-side={slotProps['data-side']}
					{...boxProps}
					{...rest}
					{...panelHandlers}
				>
					{children}
				</Box>
			)}
		</Overlay>
	);
});

DropdownRoot.displayName = 'Dropdown';
DropdownTrigger.displayName = 'Dropdown.Trigger';
DropdownContent.displayName = 'Dropdown.Content';

/**
 * Универсальная выпадающая панель: desktop Overlay и mobile Sheet.
 * Составной API: `Dropdown` + `Trigger` + `Content`.
 *
 * @component
 * @example
 * <Dropdown>
 *   <Dropdown.Trigger asChild>
 *     <Button>Меню</Button>
 *   </Dropdown.Trigger>
 *   <Dropdown.Content>
 *     <ActionList items={menuItems} />
 *   </Dropdown.Content>
 * </Dropdown>
 */
export const Dropdown = Object.assign(DropdownRoot, {
	Trigger: DropdownTrigger,
	Content: DropdownContent,
});
