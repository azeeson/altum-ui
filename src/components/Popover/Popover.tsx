import type {PopoverProps, PopoverTriggerSlotProps} from './Popover.types';
export type {
	PopoverContentVariant,
	PopoverTargetAction,
	PopoverTriggerSlotProps,
	PopoverProps,
} from './Popover.types';

import {
	useCallback,
	useLayoutEffect,
	useRef,
	type CSSProperties,
	type MutableRefObject,
	type Ref,
} from 'react';
import {Box} from '../Box/Box';
import {Overlay} from '../Overlay/Overlay';
import {cn} from '../../core/utils/cn';
import {useFallbackId} from '../../hooks/useFallbackId';
import {anchorNameFor, popoverDomId, positionArea} from '../../core/utils/popover';
import {renderChildren} from '../../core/utils/renderChildren';
import type {AnchorSide} from '../../types';
import floating from '../../styles/floating.module.css';
import styles from './Popover.module.css';

const PLACED_SIDE = /^(top|bottom|left|right)$/;

function anchorFor(panel: HTMLElement, source: EventTarget | null): Element | null {
	if (source instanceof Element) return source;
	if (panel.id === '') return null;
	return document.querySelector(`[popovertarget="${CSS.escape(panel.id)}"]`);
}

/** Сторона из вычисленного `position-area`: `span-right` — выравнивание, не сторона. */
function sideFromPositionArea(area: string, preferred: AnchorSide): AnchorSide | null {
	const words = area.trim().split(/\s+/).filter((word) => PLACED_SIDE.test(word));
	if (words.length === 0) return null;
	if (words.length === 1) return words[0] as AnchorSide;
	const block = words.find((word) => word === 'top' || word === 'bottom');
	const inline = words.find((word) => word === 'left' || word === 'right');
	if (preferred === 'left' || preferred === 'right') return (inline ?? words[0]) as AnchorSide;
	return (block ?? words[0]) as AnchorSide;
}

function readPositionArea(node: HTMLElement, preferred: AnchorSide): AnchorSide {
	const style = getComputedStyle(node) as CSSStyleDeclaration & {positionArea?: string};
	return sideFromPositionArea(style.positionArea ?? '', preferred) ?? preferred;
}

/**
 * Куда панель встанет после flip.
 * Замер идёт на копии: если показать саму панель до открытия,
 * браузер запоминает её закрытый transform и пропускает `@starting-style`.
 */
function measurePlacedSide(panel: HTMLElement, anchor: Element, preferred: AnchorSide): AnchorSide {
	if (panel.matches(':popover-open')) return readPositionArea(panel, preferred);
	const parent = panel.parentElement;
	if (!parent) return preferred;

	const clone = panel.cloneNode(true);
	if (!(clone instanceof HTMLElement)) return preferred;
	clone.removeAttribute('id');
	clone.setAttribute('aria-hidden', 'true');
	clone.inert = true;
	clone.style.setProperty('display', 'block', 'important');
	clone.style.setProperty('visibility', 'hidden', 'important');
	clone.style.setProperty('pointer-events', 'none', 'important');
	parent.appendChild(clone);
	try {
		anchor.getBoundingClientRect();
		return readPositionArea(clone, preferred);
	} finally {
		clone.remove();
	}
}

function syncPlacedSide(panel: HTMLElement, source: EventTarget | null, preferred: AnchorSide) {
	const anchor = anchorFor(panel, source);
	const placed = anchor ? measurePlacedSide(panel, anchor, preferred) : preferred;
	if (panel.getAttribute('data-placed') !== placed) panel.setAttribute('data-placed', placed);
}

function openingSource(event: Event): EventTarget | null | undefined {
	if (!('newState' in event)) return undefined;
	const toggle = event as Event & {
		newState?: string;
		source?: EventTarget | null;
	};
	if (toggle.newState !== 'open') return undefined;
	return toggle.source ?? null;
}

function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
	if (typeof ref === 'function') {
		ref(node);
		return;
	}
	if (ref != null) {
		(ref as MutableRefObject<T | null>).current = node;
	}
}

/**
 * Немодальная панель у триггера: текст, форма, фильтры, календарь.
 * Хост — `Overlay variant="floating"` (`popover="auto"`). Сторона — CSS Anchor Positioning.
 * Вход масштабируется от грани, которой панель реально прижата к якорю, в том числе после flip.
 * Клик внутри не закрывает. `Tab` ходит по полям и дальше по странице: фокус не запирается.
 *
 * @component
 * @example
 * <Popover trigger={<Button>Фильтры</Button>}>
 *   Форма фильтров
 * </Popover>
 */
export function Popover({
	children,
	trigger,
	id,
	disabled = false,
	variant = 'panel',
	className,
	role,
	side = 'bottom',
	align = 'center',
	widthMode,
	popoverTargetAction = 'toggle',
	defaultOpen = false,
	onToggle,
	panelRef,
}: PopoverProps) {
	const generatedId = useFallbackId();
	const popoverId = id ?? popoverDomId(generatedId);
	const anchorName = anchorNameFor(popoverId);
	const localPanelRef = useRef<HTMLElement | null>(null);
	const sideRef = useRef(side);
	sideRef.current = side;
	const onBeforeToggle = useRef((event: Event) => {
		const panel = event.currentTarget;
		if (!(panel instanceof HTMLElement)) return;
		const source = openingSource(event);
		if (source === undefined) return;
		syncPlacedSide(panel, source, sideRef.current);
	}).current;
	const area = positionArea(side, align);

	const assignAnchor = (node: HTMLElement | null) => {
		node?.style.setProperty('anchor-name', anchorName);
	};

	const setPanelRefs = useCallback((node: HTMLElement | null) => {
		const prev = localPanelRef.current;
		if (prev && prev !== node) prev.removeEventListener('beforetoggle', onBeforeToggle);
		localPanelRef.current = node;
		assignRef(panelRef, node);
		if (!node) return;
		node.removeEventListener('beforetoggle', onBeforeToggle);
		node.addEventListener('beforetoggle', onBeforeToggle);
		if (!defaultOpen || disabled || node.matches(':popover-open')) return;
		syncPlacedSide(node, null, sideRef.current);
		node.showPopover();
	}, [
		defaultOpen,
		disabled,
		onBeforeToggle,
		panelRef,
	]);

	useLayoutEffect(() => {
		if (!defaultOpen || disabled) return;
		const panel = localPanelRef.current;
		if (!panel || panel.matches(':popover-open')) return;
		syncPlacedSide(panel, null, sideRef.current);
		panel.showPopover();
	}, [defaultOpen, disabled]);

	const triggerSlotProps: PopoverTriggerSlotProps = disabled
		? {}
		: {
			popovertarget: popoverId,
			popovertargetaction: popoverTargetAction,
		};
	const panelStyle = {
		'--altum-popover-anchor': anchorName,
		'--altum-popover-area': area,
	} as CSSProperties;

	return (
		<>
			{renderChildren({
				children: trigger,
				props: triggerSlotProps,
				contentRef: assignAnchor,
			})}
			<Overlay
				variant='floating'
				id={popoverId}
				rootRef={setPanelRefs}
				role={role ?? 'dialog'}
				className={cn(
					variant === 'plain' && floating.panel,
					styles.anchor,
					widthMode != null && styles.sized,
					styles.content,
					className,
				)}
				style={panelStyle}
				data-side={side}
				data-width-mode={widthMode}
				onOpenChange={onToggle}
			>
				{variant === 'panel' ? (
					<Box
						variant='floating'
						className={styles.contentPanel}
					>
						{children}
					</Box>
				) : (
					children
				)}
			</Overlay>
		</>
	);
}
