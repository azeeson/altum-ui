import type {PopoverProps, PopoverTriggerSlotProps} from './Popover.types';
export type {
	PopoverContentVariant,
	PopoverTargetAction,
	PopoverTriggerSlotProps,
	PopoverProps,
} from './Popover.types';

import {
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
import floating from '../../styles/floating.module.css';
import styles from './Popover.module.css';

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
	const area = positionArea(side, align);

	const assignAnchor = (node: HTMLElement | null) => {
		node?.style.setProperty('anchor-name', anchorName);
	};

	const setPanelRefs = (node: HTMLElement | null) => {
		localPanelRef.current = node;
		assignRef(panelRef, node);
	};

	useLayoutEffect(() => {
		if (!defaultOpen || disabled) return;
		const panel = localPanelRef.current;
		if (panel && !panel.matches(':popover-open')) panel.showPopover();
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
