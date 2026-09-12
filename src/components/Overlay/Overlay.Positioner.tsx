import React, {useCallback, useLayoutEffect, useRef, useState} from 'react';
import {
	computeAnchorPosition,
	type AnchorAlign,
	type AnchorSide,
} from '../../utils/anchorPosition';
import {cn} from '../../utils/cn';
import {composeRefs} from '../../utils/composeRefs';
import {renderChildren} from '../../utils/renderChildren';
import {useAnchorDismiss} from './Overlay.Dismiss';
import type {
	OverlayContentProps,
	OverlayPurpose,
	OverlayTriggerMode,
	OverlayWidthMode,
	OverlayChildren,
} from './Overlay.types';
import styles from './Overlay.module.css';

type AnchorLayerProps = {
	variant: 'popover' | 'dropdown';
	purpose?: OverlayPurpose;
	open: boolean;
	targetRef: React.RefObject<HTMLElement | null>;
	contentRef: React.Ref<HTMLElement | null>;
	triggerMode: OverlayTriggerMode;
	side: AnchorSide;
	align: AnchorAlign;
	sideOffset: number;
	widthMode: OverlayWidthMode;
	children: OverlayChildren;
	className?: string;
	presented: boolean;
	layerStyle?: React.CSSProperties;
	closeDelay: number;
	closeOnOutsideClick?: boolean;
	closeOnEscape?: boolean;
	clearTimers: () => void;
	closeTimerRef: React.MutableRefObject<number | null>;
	pointerRef: React.MutableRefObject<{
		x: number;
		y: number
	} | null>;
	requestOpen: (next: boolean) => void;
	openHover: (next: boolean) => void;
	'aria-label'?: string;
	'aria-labelledby'?: string;
	'aria-describedby'?: string;
	role?: string;
};

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

type AnchorCoords = React.CSSProperties & {
	'--altum-anchor-arrow-along'?: string;
};

function coordsEqual(
	a: AnchorCoords,
	b: AnchorCoords,
): boolean {
	return a.position === b.position
		&& a.top === b.top
		&& a.left === b.left
		&& a.width === b.width
		&& a.maxWidth === b.maxWidth
		&& a.minWidth === b.minWidth
		&& a.transformOrigin === b.transformOrigin
		&& a['--altum-anchor-arrow-along'] === b['--altum-anchor-arrow-along'];
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
	const [coords, setCoords] = useState<AnchorCoords>({
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
		const triggerRect = trigger.getBoundingClientRect();
		const triggerWidth = Math.ceil(triggerRect.width);
		const alongAxis = next.side === 'top' || next.side === 'bottom'
			? triggerRect.left + triggerRect.width / 2 - next.left
			: triggerRect.top + triggerRect.height / 2 - next.top;
		const alongExtent = next.side === 'top' || next.side === 'bottom'
			? content.offsetWidth
			: content.offsetHeight;
		const alongPad = 10;
		const along = Math.round(
			Math.min(Math.max(alongAxis, alongPad), Math.max(alongPad, alongExtent - alongPad)),
		);
		const nextCoords: AnchorCoords = {
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
			'--altum-anchor-arrow-along': `${along}px`,
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

	const originClass =
		resolvedSide === 'top' ? styles.originBottom
			: resolvedSide === 'left' ? styles.originRight
				: resolvedSide === 'right' ? styles.originLeft
					: styles.originTop;

	const contentProps: OverlayContentProps = {
		className: cn(
			styles.anchor,
			purpose === 'tooltip' && styles.anchorTooltip,
			purpose === 'popover' && styles.anchorPopover,
			variant === 'dropdown' && styles.dropdown,
			variant === 'dropdown' && originClass,
			className,
		),
		'data-presented': presented ? '' : undefined,
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

	/* renderChildren навешивает contentRef через render-prop. */
	// eslint-disable-next-line react-hooks/refs -- слияние contentRef для render-prop
	return renderChildren({
		children,
		props: contentProps,
		contentRef: mergedContentRef,
	});
}
AnchorLayer.displayName = 'Overlay.Positioner';
