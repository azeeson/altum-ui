/* eslint-disable react-hooks/set-state-in-effect -- Состояние presence должно синхронизироваться с пропом open для exit-переходов. */
/* eslint-disable react-hooks/refs -- Ref'ы передаются непрозрачно в рендереры слотов и не читаются во время render. */
import React, {useEffect, useRef, useState} from 'react';
import {usePrefersReducedMotion} from '../../hooks/usePrefersReducedMotion';
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
import {useAnchorTrigger} from './Overlay.Dismiss';
import {FloatingLayer, ModalLayer, SheetLayer} from './Overlay.Focus';
import {AnchorLayer} from './Overlay.Positioner';
import type {
	OverlayDropdownProps,
	OverlayFloatingProps,
	OverlayModalProps,
	OverlayPopoverProps,
	OverlayProps,
	OverlaySheetProps,
	OverlayVariant,
} from './Overlay.types';
import {
	HOVER_CLOSE_DELAY,
	HOVER_OPEN_DELAY,
	PRESENCE_MS,
	SHEET_PRESENCE_MS,
} from './Overlay.types';

function usePresence(open: boolean, durationMs: number) {
	const reduceMotion = usePrefersReducedMotion();
	const [shouldRender, setShouldRender] = useState(open);
	const [presented, setPresented] = useState(false);

	useEffect(() => {
		if (open) {
			setShouldRender(true);
			let innerFrame = 0;
			const outerFrame = requestAnimationFrame(() => {
				innerFrame = requestAnimationFrame(() => setPresented(true));
			});
			return () => {
				cancelAnimationFrame(outerFrame);
				cancelAnimationFrame(innerFrame);
			};
		}

		setPresented(false);
		if (reduceMotion || durationMs <= 0) {
			setShouldRender(false);
			return undefined;
		}

		const timer = window.setTimeout(() => setShouldRender(false), durationMs);
		return () => window.clearTimeout(timer);
	}, [open, durationMs, reduceMotion]);

	return {
		shouldRender,
		presented,
	};
}

function resolveDefaultPurpose(variant: OverlayVariant) {
	if (variant === 'modal' || variant === 'floating') return 'modal';
	if (variant === 'sheet') return 'sheet';
	if (variant === 'dropdown') return 'dropdown';
	return 'popover';
}

type OverlayRootProps = OverlayProps & {
	forwardedRef?: React.Ref<HTMLElement | null>;
};

export function OverlayRoot(props: OverlayRootProps) {
	const {
		variant,
		open,
		onClose,
		className,
		purpose: purposeProp,
		children,
		asChild = true,
		forwardedRef,
	} = props;
	const parentOverlayZ = useOverlayStackZIndex();
	const purpose = purposeProp ?? resolveDefaultPurpose(variant);
	const duration = variant === 'sheet'
		? SHEET_PRESENCE_MS
		: purpose === 'tooltip'
			? 0
			: PRESENCE_MS;
	const {shouldRender, presented} = usePresence(open, duration);

	const purposeZ = resolveOverlayPurposeZIndex(purpose);
	const purposeSideOffset = resolveOverlayPurposeSideOffset(purpose);
	const zIndexOverride = props.zIndex;

	const isAnchor = variant === 'popover' || variant === 'dropdown';
	const anchorProps = isAnchor ? (props as OverlayPopoverProps | OverlayDropdownProps) : null;
	const targetRef = anchorProps?.targetRef;
	const triggerMode = anchorProps?.triggerMode ?? 'manual';
	const onOpenChange = anchorProps?.onOpenChange;
	const contentRef = useRef<HTMLElement | null>(null);
	const mergedContentRef = composeRefs(
		forwardedRef,
		contentRef,
	) as React.RefCallback<HTMLElement>;
	const fallbackTargetRef = useRef<HTMLElement | null>(null);

	const requestOpen = React.useCallback((next: boolean) => {
		onOpenChange?.(next);
		if (!next) onClose();
	}, [onClose, onOpenChange]);

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
		zIndexOverride ?? purposeZ,
		parentOverlayZ,
	);
	const elevated = isAnchor
		? (elevateAboveOverlayStack(parentOverlayZ) ?? resolvedRootZIndex)
		: resolvedRootZIndex;

	const layerStyle: React.CSSProperties | undefined = elevated != null
		? {zIndex: elevated}
		: undefined;

	if (!shouldRender) return null;

	const stackValue = elevated ?? OVERLAY_Z_INDEX_DEFAULT;

	return createLibraryPortal(
		<OverlayStackProvider value={stackValue}>
			{variant === 'modal' && (
				<ModalLayer
					open={open}
					onClose={onClose}
					presented={presented}
					asChild={asChild}
					className={className}
					layerStyle={layerStyle}
					backdropVariant={(props as OverlayModalProps).backdropVariant}
					backdropBlur={(props as OverlayModalProps).backdropBlur}
					aria-label={props['aria-label']}
					aria-labelledby={props['aria-labelledby']}
					aria-describedby={props['aria-describedby']}
					role={props.role}
					contentRef={mergedContentRef}
				>
					{children}
				</ModalLayer>
			)}
			{variant === 'floating' && (
				<FloatingLayer
					open={open}
					onClose={onClose}
					presented={presented}
					asChild={asChild}
					className={className}
					style={(props as OverlayFloatingProps).style}
					layerStyle={layerStyle}
					backdrop={(props as OverlayFloatingProps).backdrop}
					backdropVariant={(props as OverlayFloatingProps).backdropVariant}
					backdropBlur={(props as OverlayFloatingProps).backdropBlur}
					closeOnOutsideClick={(props as OverlayFloatingProps).closeOnOutsideClick}
					closeOnEscape={(props as OverlayFloatingProps).closeOnEscape}
					lockScroll={(props as OverlayFloatingProps).lockScroll}
					trapFocus={(props as OverlayFloatingProps).trapFocus}
					aria-label={props['aria-label']}
					aria-labelledby={props['aria-labelledby']}
					aria-describedby={props['aria-describedby']}
					role={props.role}
					contentRef={mergedContentRef}
				>
					{children}
				</FloatingLayer>
			)}
			{variant === 'sheet' && (
				<SheetLayer
					side={(props as OverlaySheetProps).side ?? 'bottom'}
					open={open}
					presented={presented}
					onClose={onClose}
					asChild={asChild}
					className={className}
					layerStyle={layerStyle}
					backdrop={(props as OverlaySheetProps).backdrop}
					backdropVariant={(props as OverlaySheetProps).backdropVariant}
					backdropBlur={(props as OverlaySheetProps).backdropBlur}
					closeOnOutsideClick={(props as OverlaySheetProps).closeOnOutsideClick}
					closeOnEscape={(props as OverlaySheetProps).closeOnEscape}
					aria-label={props['aria-label']}
					aria-labelledby={props['aria-labelledby']}
					aria-describedby={props['aria-describedby']}
					role={props.role}
					contentRef={mergedContentRef}
				>
					{children}
				</SheetLayer>
			)}
			{isAnchor && targetRef && (
				<AnchorLayer
					variant={variant}
					purpose={purpose}
					open={open}
					targetRef={targetRef}
					contentRef={mergedContentRef}
					triggerMode={triggerMode}
					side={anchorProps?.side ?? 'bottom'}
					align={anchorProps?.align ?? 'start'}
					sideOffset={purposeSideOffset}
					widthMode={
						variant === 'dropdown'
							? ((props as OverlayDropdownProps).widthMode ?? 'trigger-fit')
							: 'content'
					}
					presented={presented}
					asChild={asChild}
					className={className}
					layerStyle={layerStyle}
					closeDelay={anchorProps?.closeDelay ?? HOVER_CLOSE_DELAY}
					closeOnOutsideClick={anchorProps?.closeOnOutsideClick}
					closeOnEscape={anchorProps?.closeOnEscape}
					clearTimers={clearTimers}
					closeTimerRef={closeTimerRef}
					pointerRef={pointerRef}
					requestOpen={requestOpen}
					openHover={openHover}
					aria-label={props['aria-label']}
					aria-labelledby={props['aria-labelledby']}
					aria-describedby={props['aria-describedby']}
					role={props.role}
				>
					{children}
				</AnchorLayer>
			)}
		</OverlayStackProvider>,
	);
}
OverlayRoot.displayName = 'Overlay.Root';
