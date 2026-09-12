/* eslint-disable react-hooks/refs -- Ref'ы передаются непрозрачно в рендереры слотов и не читаются во время render. */
import React, {useCallback, useRef} from 'react';
import {Backdrop} from '../Backdrop/Backdrop';
import {FocusTrap} from '../FocusTrap/FocusTrap';
import {usePresence} from '../../hooks/usePresence';
import {
	elevateAboveOverlayStack,
	OverlayStackProvider,
	useOverlayStackZIndex,
} from '../../utils/overlayStack';
import {
	OVERLAY_Z_INDEX_DEFAULT,
	resolveStackedOverlayZIndex,
} from '../../utils/overlayZIndex';
import {
	resolveOverlayPurposeSideOffset,
	resolveOverlayPurposeZIndex,
} from '../../utils/overlayPurpose';
import {createLibraryPortal} from '../../utils/portal';
import {composeRefs} from '../../utils/composeRefs';
import {cn} from '../../utils/cn';
import {renderChildren} from '../../utils/renderChildren';
import {useAnchorTrigger, useScrimLayerDismiss} from './Overlay.Dismiss';
import {AnchorLayer} from './Overlay.Positioner';
import type {
	OverlayDropdownProps,
	OverlayFloatingProps,
	OverlayModalProps,
	OverlayPopoverProps,
	OverlayProps,
	OverlaySheetProps,
	OverlaySheetSide,
	OverlayVariant,
	OverlayChildren,
	OverlayContentProps,
} from './Overlay.types';
import {
	HOVER_CLOSE_DELAY,
	HOVER_OPEN_DELAY,
	PRESENCE_MS,
	resolveOverlayDismiss,
} from './Overlay.types';
import styles from './Overlay.module.css';

export type {
	OverlayVariant,
	OverlaySheetSide,
	OverlayTriggerMode,
	OverlayWidthMode,
	DropdownWidthMode,
	DropdownAlign,
	DropdownPanelScroll,
	OverlayPurpose,
	OverlayContentProps,
	OverlayChildren,
	OverlayBaseProps,
	OverlayModalProps,
	OverlayFloatingProps,
	OverlaySheetProps,
	OverlayPopoverProps,
	OverlayDropdownProps,
	OverlayProps,
	OverlayDismiss,
} from './Overlay.types';

const PURPOSE_BY_VARIANT: Record<OverlayVariant, 'modal' | 'sheet' | 'dropdown' | 'popover'> = {
	modal: 'modal',
	floating: 'modal',
	sheet: 'sheet',
	dropdown: 'dropdown',
	popover: 'popover',
};

type ScrimKind = 'modal' | 'floating' | 'sheet';

type ScrimLayerProps = {
	kind: ScrimKind;
	side?: OverlaySheetSide;
	open: boolean;
	presented: boolean;
	onClose: () => void;
	children: OverlayChildren;
	className?: string;
	style?: React.CSSProperties;
	layerStyle?: React.CSSProperties;
	backdrop?: boolean;
	backdropVariant?: OverlayModalProps['backdropVariant'];
	backdropBlur?: OverlayModalProps['backdropBlur'];
	closeOnOutsideClick?: boolean;
	closeOnEscape?: boolean;
	lockScroll?: boolean;
	trapFocus?: boolean;
	contentRef: React.Ref<HTMLElement | null>;
	'aria-label'?: string;
	'aria-labelledby'?: string;
	'aria-describedby'?: string;
	role?: string;
};

function stopBubble(event: React.MouseEvent) {
	event.stopPropagation();
}

function ScrimLayer({
	kind,
	side,
	open,
	presented,
	onClose,
	children,
	className,
	style,
	layerStyle,
	backdrop = false,
	backdropVariant = 'default',
	backdropBlur = 'sm',
	closeOnOutsideClick,
	closeOnEscape = true,
	lockScroll,
	trapFocus = true,
	contentRef,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
	'aria-describedby': ariaDescribedBy,
	role: contentRole = 'dialog',
}: ScrimLayerProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const localContentRef = useRef<HTMLElement | null>(null);
	const mergedContentRef = composeRefs(
		contentRef,
		localContentRef,
	) as React.RefCallback<HTMLElement>;

	const {resolvedCloseOnOutside} = useScrimLayerDismiss({
		open,
		onClose,
		contentRef: localContentRef,
		rootRef,
		backdrop: kind === 'modal' || backdrop,
		closeOnOutsideClick: kind === 'modal' ? true : closeOnOutsideClick,
		closeOnEscape: kind === 'modal' ? true : closeOnEscape,
		lockScroll: kind === 'modal' ? true : kind === 'sheet' ? backdrop : lockScroll,
	});

	const showBackdrop = kind === 'modal' || backdrop;
	const wrap = kind !== 'floating' || showBackdrop || trapFocus;
	const panelStyle = kind === 'floating'
		? (showBackdrop ? style : {
			...layerStyle,
			...style
		})
		: undefined;

	const contentProps: OverlayContentProps = {
		className: cn(styles.panel, className),
		style: panelStyle,
		role: contentRole,
		'aria-modal': kind === 'modal' || showBackdrop || (kind === 'floating' && (lockScroll ?? backdrop))
			? true
			: undefined,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		'aria-describedby': ariaDescribedBy,
		'data-kind': kind,
		'data-side': side,
		'data-presented': presented ? '' : undefined,
		onClick: stopBubble,
	};

	const panel = renderChildren({
		children,
		props: contentProps,
		contentRef: mergedContentRef,
	});

	if (!wrap) return panel;

	const trap = kind === 'sheet' ? open && backdrop : kind === 'modal' ? open : open && trapFocus;

	return (
		<div
			ref={rootRef}
			className={styles.scrim}
			style={showBackdrop || kind !== 'floating' ? layerStyle : undefined}
			role='presentation'
			data-kind={kind}
			data-side={side}
			data-open={open ? '' : undefined}
			data-presented={presented ? '' : undefined}
		>
			{showBackdrop && (
				<Backdrop
					position='absolute'
					variant={backdropVariant}
					blur={backdropBlur}
					onClick={open && (kind === 'modal' || resolvedCloseOnOutside) ? onClose : undefined}
					className={styles.fade}
				/>
			)}
			{kind === 'floating' && !trapFocus ? panel : (
				<FocusTrap
					active={!!trap}
					restoreFocus={false}
					className={styles.trap}
				>
					{panel}
				</FocusTrap>
			)}
		</div>
	);
}

/**
 * Примитив позиционирования без собственного chrome: portal + presence + placement.
 *
 * Варианты: `modal` (Backdrop + FocusTrap), `floating` (свободные x/y, опциональный Backdrop),
 * `sheet` (выезд с края), `popover` / `dropdown` (якорь `targetRef`, flip, triggerMode).
 *
 * `purpose` задаёт z-index и sideOffset из CSS-токенов ThemeProvider
 * (`--altum-g-z-*`, `--altum-overlay-offset-*`); по умолчанию выводится из `variant`.
 *
 * `children` — render-prop `(props, contentRef) => ReactNode` или единственный элемент
 * (slot-пропсы мержатся через `mergeSlotProps`).
 *
 * Держите `Overlay` смонтированным и управляйте через `open`
 * (`{open && <Overlay>}` убивает exit-анимацию).
 *
 * @component
 * @example
 * <Overlay variant="modal" purpose="lightbox" open={open} onOpenChange={setOpen}>
 *   <div>Контент</div>
 * </Overlay>
 */
export const Overlay = React.forwardRef<HTMLElement, OverlayProps>(function Overlay(props, ref) {
	const {
		variant,
		open,
		onOpenChange,
		className,
		purpose: purposeProp,
		children,
	} = props;
	const parentOverlayZ = useOverlayStackZIndex();
	const purpose = purposeProp ?? PURPOSE_BY_VARIANT[variant];
	const duration = purpose === 'tooltip' ? 0 : PRESENCE_MS;
	const {shouldRender, presented} = usePresence(open, duration);

	const isAnchor = variant === 'popover' || variant === 'dropdown';
	const anchorProps = isAnchor ? (props as OverlayPopoverProps | OverlayDropdownProps) : null;
	const targetRef = anchorProps?.targetRef;
	const triggerMode = anchorProps?.triggerMode ?? 'manual';
	const contentRef = useRef<HTMLElement | null>(null);
	const mergedContentRef = composeRefs(ref, contentRef) as React.RefCallback<HTMLElement>;
	const fallbackTargetRef = useRef<HTMLElement | null>(null);

	const requestOpen = useCallback((next: boolean) => {
		onOpenChange(next);
	}, [onOpenChange]);
	const onClose = useCallback(() => {
		onOpenChange(false);
	}, [onOpenChange]);

	const {pointerRef, clearTimers, closeTimerRef, openHover} = useAnchorTrigger({
		enabled: isAnchor,
		open,
		targetRef: targetRef ?? fallbackTargetRef,
		contentRef,
		triggerMode,
		purpose,
		openDelay: anchorProps?.openDelay ?? HOVER_OPEN_DELAY,
		closeDelay: anchorProps?.closeDelay ?? HOVER_CLOSE_DELAY,
		requestOpen,
	});

	const resolvedRootZIndex = resolveStackedOverlayZIndex(
		undefined,
		props.zIndex ?? resolveOverlayPurposeZIndex(purpose),
		parentOverlayZ,
	);
	const elevated = isAnchor
		? (elevateAboveOverlayStack(parentOverlayZ) ?? resolvedRootZIndex)
		: resolvedRootZIndex;
	const layerStyle: React.CSSProperties | undefined = elevated != null
		? {zIndex: elevated}
		: undefined;

	if (!shouldRender) return null;

	const floatingProps = props as OverlayFloatingProps;
	const sheetProps = props as OverlaySheetProps;
	const floatingDismiss = resolveOverlayDismiss(floatingProps.dismiss, {
		outside: !!floatingProps.backdrop,
		escape: true,
	});
	const sheetDismiss = resolveOverlayDismiss(sheetProps.dismiss, {
		outside: !!sheetProps.backdrop,
		escape: true,
	});
	const anchorDismiss = resolveOverlayDismiss(anchorProps?.dismiss, {
		outside: triggerMode === 'click',
		escape: triggerMode !== 'hover',
	});
	const aria = {
		'aria-label': props['aria-label'],
		'aria-labelledby': props['aria-labelledby'],
		'aria-describedby': props['aria-describedby'],
		role: props.role,
	};

	let layer: React.ReactNode = null;
	if (variant === 'modal') {
		const modal = props as OverlayModalProps;
		layer = (
			<ScrimLayer
				kind='modal'
				open={open}
				onClose={onClose}
				presented={presented}
				className={className}
				layerStyle={layerStyle}
				backdropVariant={modal.backdropVariant ?? (purpose === 'lightbox' ? 'strong' : undefined)}
				backdropBlur={modal.backdropBlur ?? (purpose === 'lightbox' ? 'md' : undefined)}
				contentRef={mergedContentRef}
				{...aria}
			>
				{children}
			</ScrimLayer>
		);
	} else if (variant === 'floating') {
		layer = (
			<ScrimLayer
				kind='floating'
				open={open}
				onClose={onClose}
				presented={presented}
				className={className}
				style={floatingProps.style}
				layerStyle={layerStyle}
				backdrop={floatingProps.backdrop}
				backdropVariant={floatingProps.backdropVariant}
				backdropBlur={floatingProps.backdropBlur}
				closeOnOutsideClick={floatingDismiss.outside}
				closeOnEscape={floatingDismiss.escape}
				lockScroll={floatingProps.lockScroll}
				trapFocus={floatingProps.trapFocus}
				contentRef={mergedContentRef}
				{...aria}
			>
				{children}
			</ScrimLayer>
		);
	} else if (variant === 'sheet') {
		layer = (
			<ScrimLayer
				kind='sheet'
				side={sheetProps.side ?? 'bottom'}
				open={open}
				presented={presented}
				onClose={onClose}
				className={className}
				layerStyle={layerStyle}
				backdrop={sheetProps.backdrop}
				backdropVariant={sheetProps.backdropVariant}
				backdropBlur={sheetProps.backdropBlur}
				closeOnOutsideClick={sheetDismiss.outside}
				closeOnEscape={sheetDismiss.escape}
				contentRef={mergedContentRef}
				{...aria}
			>
				{children}
			</ScrimLayer>
		);
	} else if (isAnchor && targetRef) {
		layer = (
			<AnchorLayer
				variant={variant}
				purpose={purpose}
				open={open}
				targetRef={targetRef}
				contentRef={mergedContentRef}
				triggerMode={triggerMode}
				side={anchorProps?.side ?? 'bottom'}
				align={anchorProps?.align ?? 'start'}
				sideOffset={resolveOverlayPurposeSideOffset(purpose)}
				widthMode={
					variant === 'dropdown'
						? ((props as OverlayDropdownProps).widthMode ?? 'trigger-fit')
						: 'content'
				}
				presented={presented}
				className={className}
				layerStyle={layerStyle}
				closeDelay={anchorProps?.closeDelay ?? HOVER_CLOSE_DELAY}
				closeOnOutsideClick={anchorDismiss.outside}
				closeOnEscape={anchorDismiss.escape}
				clearTimers={clearTimers}
				closeTimerRef={closeTimerRef}
				pointerRef={pointerRef}
				requestOpen={requestOpen}
				openHover={openHover}
				{...aria}
			>
				{children}
			</AnchorLayer>
		);
	}

	return createLibraryPortal(
		<OverlayStackProvider value={elevated ?? OVERLAY_Z_INDEX_DEFAULT}>
			{layer}
		</OverlayStackProvider>,
	);
});

Overlay.displayName = 'Overlay';
