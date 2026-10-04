import {useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type SyntheticEvent} from 'react';
import {createPortal} from 'react-dom';
import {cn} from '../../core/utils/cn';
import {uRef} from '../../core/utils/bundle';
import type {OverlayProps} from './Overlay.types';
import styles from './Overlay.module.css';
import overlayTransition from '../../styles/overlayTransition.module.css';

export type {
	OverlayVariant,
	OverlaySheetSide,
	OverlayBaseProps,
	OverlayModalProps,
	OverlayFloatingProps,
	OverlaySheetProps,
	OverlayProps,
} from './Overlay.types';

/** Куда вынести слой: тема предка, иначе `document.body`. */
function overlayPortalParent(from: HTMLElement | null): HTMLElement | null {
	if (typeof document === 'undefined') return null;
	const themed = from?.closest('[data-theme]');
	if (themed instanceof HTMLElement && themed.tagName !== 'HTML') return themed;
	return document.body;
}

/**
 * Слепой донор Top Layer: нативный `<dialog>` (`showModal`) или `popover="auto"`.
 * Узел слоя — портал в ближайший `[data-theme]` или в `document.body`: стили обёртки
 * не наследуются содержимым, токены темы остаются.
 * Фокус, Escape и scroll lock у modal/sheet — браузер (`showModal`); отдельный FocusTrap не нужен.
 * Без иконок закрытия, шапок и Box — поверхность и chrome у потребителей (`Modal`, `Sheet`, `Popover`, …).
 * Floating: `open` опционален — без него показ через `popovertarget` / `showPopover`.
 * Визуальный `::backdrop` — `hostClassName` + `overlayScrim` у потребителей.
 * Появление и уход — CSS `@starting-style`, без таймера присутствия.
 *
 * @component
 * @example
 * <Overlay open={open} onOpenChange={setOpen} aria-label="Диалог">
 *   <p>Содержимое</p>
 * </Overlay>
 */
export function Overlay(props: OverlayProps) {
	const {
		open,
		onOpenChange,
		variant = 'modal',
		children,
		className,
		hostClassName,
		style,
		role = 'dialog',
		rootRef,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		'aria-describedby': ariaDescribedBy,
	} = props;
	const nodeRef = useRef<HTMLElement | null>(null);
	const anchorRef = useRef<HTMLSpanElement>(null);
	const [portalParent, setPortalParent] = useState<HTMLElement | null>(null);
	const onOpenChangeRef = useRef(onOpenChange);
	onOpenChangeRef.current = onOpenChange;
	const side = props.variant === 'sheet' ? (props.side ?? 'bottom') : undefined;
	const floatingId = props.variant === 'floating' ? props.id : undefined;
	const floatingDataSide = props.variant === 'floating' ? props['data-side'] : undefined;
	const floatingDataWidthMode = props.variant === 'floating' ? props['data-width-mode'] : undefined;

	useLayoutEffect(() => {
		if (portalParent) return;
		setPortalParent(overlayPortalParent(anchorRef.current));
	}, [portalParent]);

	useLayoutEffect(() => {
		const node = nodeRef.current;
		if (!node || !portalParent) return;

		if (node instanceof HTMLDialogElement) {
			// showModal(): native focus move into dialog, focus restore on close, Escape, top layer.
			if (open) {
				if (!node.open) node.showModal();
			} else if (node.open) {
				node.close();
			}
			return;
		}

		// Без controlled `open` показ ведёт popovertarget / showPopover снаружи.
		if (open === undefined) return;

		if (open) {
			if (!node.matches(':popover-open')) node.showPopover();
		} else if (node.matches(':popover-open')) {
			node.hidePopover();
		}
	}, [open, variant, portalParent]);

	const hasOpenChange = onOpenChange != null;

	useEffect(() => {
		if (variant !== 'floating' || !hasOpenChange || !portalParent) return;
		const node = nodeRef.current;
		if (!node) return;
		const onToggle = (event: Event) => {
			const next = (event as ToggleEvent).newState === 'open';
			onOpenChangeRef.current?.(next);
		};
		node.addEventListener('toggle', onToggle);
		return () => node.removeEventListener('toggle', onToggle);
	}, [variant, hasOpenChange, portalParent]);

	const handleCancel = (event: SyntheticEvent) => {
		event.preventDefault();
		onOpenChange?.(false);
	};

	const handleLightDismiss = (event: MouseEvent<HTMLDialogElement>) => {
		if (event.target === event.currentTarget) onOpenChange?.(false);
	};

	const layer = variant === 'floating' ? (
		<div
			id={floatingId}
			ref={uRef(rootRef, nodeRef)}
			popover='auto'
			className={cn(styles.panel, overlayTransition.fadeScale, hostClassName, className)}
			style={style}
			data-kind='floating'
			data-side={floatingDataSide}
			data-width-mode={floatingDataWidthMode}
			role={role}
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledBy}
			aria-describedby={ariaDescribedBy}
		>
			{children}
		</div>
	) : (
		<dialog
			ref={uRef(rootRef, nodeRef)}
			className={cn(styles.scrim, hostClassName)}
			data-kind={variant}
			data-side={side}
			onCancel={handleCancel}
			onClick={handleLightDismiss}
			role={role}
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledBy}
			aria-describedby={ariaDescribedBy}
		>
			<div
				className={cn(
					styles.panel,
					variant === 'modal' && overlayTransition.fadeScale,
					className,
				)}
				style={style}
				data-kind={variant}
				data-side={side}
			>
				{children}
			</div>
		</dialog>
	);

	return (
		<>
			{portalParent == null ? <span ref={anchorRef} hidden /> : null}
			{portalParent ? createPortal(layer, portalParent) : null}
		</>
	);
}
