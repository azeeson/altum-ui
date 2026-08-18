import React, {useCallback, useLayoutEffect, useRef, useState} from 'react';
import {
	computeAnchorPosition,
	type AnchorSide,
} from '../../utils/anchorPosition';
import {cn} from '../../utils/cn';
import {composeRefs} from '../../utils/composeRefs';
import {renderChildren} from '../../utils/renderChildren';
import {useAnchorDismiss} from './Overlay.Dismiss';
import type {
	AnchorLayerProps,
	OverlayContentProps,
	OverlayWidthMode,
} from './Overlay.types';
import styles from './Overlay.module.css';

function transformOriginForSide(side: AnchorSide): string {
	if (side === 'bottom') return 'top center';
	if (side === 'top') return 'bottom center';
	if (side === 'left') return 'center right';
	return 'center left';
}

/** Intrinsic width без влияния CSS max-width: 100vw (иначе trigger-fit раздувается на весь экран). */
function measureIntrinsicWidth(content: HTMLElement): number {
	const prevWidth = content.style.width;
	const prevMaxWidth = content.style.maxWidth;
	const prevMinWidth = content.style.minWidth;
	content.style.width = 'max-content';
	content.style.maxWidth = 'none';
	content.style.minWidth = '0';
	const measured = Math.ceil(content.getBoundingClientRect().width);
	content.style.width = prevWidth;
	content.style.maxWidth = prevMaxWidth;
	content.style.minWidth = prevMinWidth;
	return measured;
}

function resolveWidthStyle(
	widthMode: OverlayWidthMode,
	trigger: HTMLElement,
	content: HTMLElement,
): {
	width?: number;
	maxWidth: number;
} {
	const triggerWidth = Math.ceil(trigger.getBoundingClientRect().width);
	const viewportMax = Math.max(0, window.innerWidth - 16);

	if (widthMode === 'trigger') {
		const width = Math.min(triggerWidth, viewportMax);
		return {
			width,
			maxWidth: width,
		};
	}

	if (widthMode === 'trigger-fit') {
		const contentWidth = measureIntrinsicWidth(content);
		const width = Math.min(Math.max(triggerWidth, contentWidth), viewportMax);
		return {
			width,
			maxWidth: width,
		};
	}

	return {
		width: undefined,
		maxWidth: viewportMax,
	};
}

function coordsEqual(
	a: React.CSSProperties,
	b: React.CSSProperties,
): boolean {
	return a.position === b.position
		&& a.top === b.top
		&& a.left === b.left
		&& a.width === b.width
		&& a.maxWidth === b.maxWidth
		&& a.minWidth === b.minWidth
		&& a.transformOrigin === b.transformOrigin;
}

export function AnchorLayer({
	variant,
	purpose,
	open,
	targetRef,
	contentRef,
	triggerMode,
	side,
	align,
	sideOffset,
	widthMode,
	children,
	asChild,
	className,
	presented,
	layerStyle,
	closeDelay,
	closeOnOutsideClick,
	closeOnEscape,
	clearTimers,
	closeTimerRef,
	pointerRef,
	requestOpen,
	openHover,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
	'aria-describedby': ariaDescribedBy,
	role: contentRole,
}: AnchorLayerProps) {
	const localContentRef = useRef<HTMLElement | null>(null);
	/* eslint-disable react-hooks/refs -- composeRefs мержит object-ref; значение читается только в колбэках measure/dismiss */
	const mergedContentRef = composeRefs(
		contentRef,
		localContentRef,
	) as React.RefCallback<HTMLElement>;
	/* eslint-enable react-hooks/refs */
	const [coords, setCoords] = useState<React.CSSProperties>({
		position: 'fixed',
		top: -9999,
		left: -9999,
	});
	const [resolvedSide, setResolvedSide] = useState<AnchorSide>(side);
	const coordsRef = useRef(coords);
	const resolvedSideRef = useRef(resolvedSide);
	const repositionRafRef = useRef(0);

	useAnchorDismiss({
		open,
		targetRef,
		contentRef: localContentRef,
		triggerMode,
		closeOnOutsideClick,
		closeOnEscape,
		requestOpen,
	});

	/* measurePosition намеренно замыкает изменяемые ref (DOM триггера/контента); React Compiler не может сохранить эту мемоизацию. */
	// eslint-disable-next-line react-hooks/preserve-manual-memoization -- ref в deps / теле нужны для живого позиционирования
	const measurePosition = useCallback(() => {
		const trigger = targetRef.current;
		const content = localContentRef.current;
		if (!trigger || !content) return null;

		let widthStyle: {
			width?: number;
			maxWidth: number;
		} | null = null;

		if (variant === 'dropdown') {
			widthStyle = resolveWidthStyle(widthMode, trigger, content);
			content.style.width = widthStyle.width != null ? `${widthStyle.width}px` : 'max-content';
			content.style.maxWidth = `${widthStyle.maxWidth}px`;
			content.style.minWidth = widthMode === 'trigger-fit' || widthMode === 'trigger'
				? `${Math.min(
					Math.ceil(trigger.getBoundingClientRect().width),
					widthStyle.maxWidth,
				)}px`
				: '';
		}

		const next = computeAnchorPosition(trigger, content, side, align, sideOffset);
		const triggerWidth = Math.ceil(trigger.getBoundingClientRect().width);
		const nextCoords: React.CSSProperties = {
			position: next.position,
			top: next.top,
			left: next.left,
			width: widthStyle?.width,
			maxWidth: widthStyle?.maxWidth,
			minWidth: widthMode === 'trigger-fit' || widthMode === 'trigger'
				? Math.min(
					triggerWidth,
					widthStyle?.maxWidth ?? Number.POSITIVE_INFINITY,
				)
				: undefined,
			transformOrigin: transformOriginForSide(next.side),
		};

		return {
			side: next.side,
			coords: nextCoords,
		};
	}, [
		align,
		// eslint-disable-next-line react-hooks/preserve-manual-memoization -- идентичность ref стабильна; .current читается внутри measurePosition
		localContentRef,
		side,
		sideOffset,
		targetRef,
		variant,
		widthMode,
	]);

	const flushPosition = useCallback(() => {
		const measured = measurePosition();
		if (!measured) return;

		const sideChanged = measured.side !== resolvedSideRef.current;
		const coordsChanged = !coordsEqual(measured.coords, coordsRef.current);

		if (sideChanged) {
			resolvedSideRef.current = measured.side;
			setResolvedSide(measured.side);
		}
		if (coordsChanged) {
			coordsRef.current = measured.coords;
			setCoords(measured.coords);
		}
	}, [measurePosition]);

	const schedulePositionUpdate = useCallback(() => {
		if (repositionRafRef.current) return;
		repositionRafRef.current = requestAnimationFrame(() => {
			repositionRafRef.current = 0;
			flushPosition();
		});
	}, [flushPosition]);

	useLayoutEffect(() => {
		if (!open) return;
		flushPosition();
	}, [
		open,
		flushPosition,
		children,
		presented
	]);

	useLayoutEffect(() => {
		if (!open) return;
		const onReposition = () => schedulePositionUpdate();
		const resizeObserver = new ResizeObserver(onReposition);
		if (targetRef.current) resizeObserver.observe(targetRef.current);
		if (localContentRef.current) resizeObserver.observe(localContentRef.current);
		window.addEventListener('resize', onReposition);
		window.addEventListener('scroll', onReposition, true);
		return () => {
			resizeObserver.disconnect();
			window.removeEventListener('resize', onReposition);
			window.removeEventListener('scroll', onReposition, true);
			if (repositionRafRef.current) {
				cancelAnimationFrame(repositionRafRef.current);
				repositionRafRef.current = 0;
			}
		};
	}, [
		localContentRef,
		open,
		targetRef,
		schedulePositionUpdate
	]);

	const animClass = variant === 'dropdown'
		? (presented ? styles.dropdownVisible : styles.dropdownHidden)
		: (presented ? styles.popoverVisible : styles.popoverHidden);

	const originClass =
		resolvedSide === 'top' ? styles.originBottom
			: resolvedSide === 'left' ? styles.originRight
				: resolvedSide === 'right' ? styles.originLeft
					: styles.originTop;

	const contentProps: OverlayContentProps = {
		className: cn(
			styles.anchorLayer,
			purpose === 'tooltip' && styles.anchorTooltip,
			variant === 'dropdown' && styles.dropdownLayer,
			animClass,
			variant === 'dropdown' && originClass,
			className,
		),
		style: {
			...coords,
			...layerStyle,
		},
		role: contentRole ?? (variant === 'dropdown' ? 'listbox' : 'dialog'),
		'data-side': resolvedSide,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		'aria-describedby': ariaDescribedBy,
		onPointerEnter: triggerMode === 'hover'
			? () => {
				clearTimers();
				openHover(true);
			}
			: undefined,
		onPointerLeave: triggerMode === 'hover'
			? () => {
				clearTimers();
				closeTimerRef.current = window.setTimeout(
					() => openHover(false),
					closeDelay,
				);
			}
			: undefined,
		onPointerMove: triggerMode === 'hover'
			? (event) => {
				pointerRef.current = {
					x: event.clientX,
					y: event.clientY,
				};
			}
			: undefined,
	};

	/* renderChildren может навесить contentRef через cloneElement; доступ к ref — намеренная проводка слота. */
	// eslint-disable-next-line react-hooks/refs -- слияние contentRef для asChild/render-prop
	return renderChildren({
		asChild,
		children,
		props: contentProps,
		contentRef: mergedContentRef,
	});
}
AnchorLayer.displayName = 'Overlay.Positioner';
