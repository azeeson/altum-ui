import React, {useRef} from 'react';
import {Backdrop} from '../Backdrop/Backdrop';
import {FocusTrap} from '../FocusTrap/FocusTrap';
import {cn} from '../../utils/cn';
import {composeRefs} from '../../utils/composeRefs';
import {renderChildren} from '../../utils/renderChildren';
import {useModalDismiss, useScrimLayerDismiss} from './Overlay.Dismiss';
import type {
	FloatingLayerProps,
	ModalLayerProps,
	OverlayContentProps,
	SheetLayerProps,
} from './Overlay.types';
import styles from './Overlay.module.css';

type OverlayFocusTrapProps = {
	active: boolean;
	className?: string;
	children: React.ReactNode;
};

/** FocusTrap для modal-слоя с restoreFocus=false (управляется родителем). */
function ModalFocusTrap({active, children}: OverlayFocusTrapProps) {
	return (
		<FocusTrap
			active={active}
			restoreFocus={false}
			className={styles.modalFocusTrap}
		>
			{children}
		</FocusTrap>
	);
}

/** FocusTrap для floating-слоя с backdrop. */
function FloatingFocusTrap({active, children}: OverlayFocusTrapProps) {
	return (
		<FocusTrap
			active={active}
			restoreFocus={false}
			className={styles.floatingFocusTrap}
		>
			{children}
		</FocusTrap>
	);
}

/** FocusTrap для sheet-слоя с backdrop; side задаёт layout trap. */
function SheetFocusTrap({
	active,
	side,
	children,
}: OverlayFocusTrapProps & {
	side: 'top' | 'bottom' | 'left' | 'right';
}) {
	const trapSideClass =
		side === 'top' ? styles.sheetTrapTop
			: side === 'left' ? styles.sheetTrapLeft
				: side === 'right' ? styles.sheetTrapRight
					: styles.sheetTrapBottom;

	return (
		<FocusTrap
			active={active}
			restoreFocus={false}
			className={cn(styles.sheetFocusTrap, trapSideClass)}
		>
			{children}
		</FocusTrap>
	);
}

export function ModalLayer({
	open,
	onClose,
	children,
	asChild,
	className,
	presented,
	layerStyle,
	backdropVariant = 'default',
	backdropBlur = 'sm',
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
	'aria-describedby': ariaDescribedBy,
	role: contentRole = 'dialog',
	contentRef,
}: ModalLayerProps) {
	const rootRef = useRef<HTMLDivElement>(null);

	useModalDismiss({
		open,
		onClose,
		rootRef
	});

	const contentProps: OverlayContentProps = {
		className: cn(
			styles.modalContent,
			presented ? styles.modalContentVisible : styles.modalContentHidden,
			className,
		),
		role: contentRole,
		'aria-modal': true,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		'aria-describedby': ariaDescribedBy,
		onClick: (event) => event.stopPropagation(),
	};

	return (
		<div
			ref={rootRef}
			className={styles.modalRoot}
			style={layerStyle}
			role='presentation'
			data-open={open ? '' : undefined}
			data-presented={presented ? '' : undefined}
		>
			<Backdrop
				position='absolute'
				variant={backdropVariant}
				blur={backdropBlur}
				onClick={open ? onClose : undefined}
				className={cn(
					styles.backdropFade,
					presented ? styles.backdropVisible : styles.backdropHidden,
				)}
			/>
			<ModalFocusTrap active={open}>
				{renderChildren({
					asChild,
					children,
					props: contentProps,
					contentRef,
				})}
			</ModalFocusTrap>
		</div>
	);
}
ModalLayer.displayName = 'Overlay.ModalLayer';

export function FloatingLayer({
	open,
	onClose,
	children,
	asChild,
	className,
	style,
	presented,
	layerStyle,
	backdrop = false,
	backdropVariant = 'default',
	backdropBlur = 'sm',
	closeOnOutsideClick,
	closeOnEscape = true,
	lockScroll,
	trapFocus = true,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
	'aria-describedby': ariaDescribedBy,
	role: contentRole = 'dialog',
	contentRef,
}: FloatingLayerProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const localContentRef = useRef<HTMLElement | null>(null);
	/* eslint-disable react-hooks/refs -- composeRefs мержит object-ref; значение читается только позже в колбэках/эффектах */
	const mergedContentRef = composeRefs(
		contentRef,
		localContentRef,
	) as React.RefCallback<HTMLElement>;
	/* eslint-enable react-hooks/refs */

	const {resolvedCloseOnOutside} = useScrimLayerDismiss({
		open,
		onClose,
		contentRef: localContentRef,
		rootRef,
		backdrop,
		closeOnOutsideClick,
		closeOnEscape,
		lockScroll,
	});

	const contentProps: OverlayContentProps = {
		className: cn(
			styles.floatingContent,
			presented ? styles.floatingContentVisible : styles.floatingContentHidden,
			className,
		),
		style: {
			...(backdrop ? undefined : layerStyle),
			...style,
		},
		role: contentRole,
		'aria-modal': backdrop || (lockScroll ?? backdrop) ? true : undefined,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		'aria-describedby': ariaDescribedBy,
		onClick: (event) => event.stopPropagation(),
	};

	const panel = renderChildren({
		asChild,
		children,
		props: contentProps,
		contentRef: mergedContentRef,
	});

	if (!backdrop && !trapFocus) {
		return panel;
	}

	return (
		<div
			ref={rootRef}
			className={cn(
				styles.floatingRoot,
				backdrop && styles.floatingRootBackdrop,
			)}
			style={backdrop ? layerStyle : undefined}
			role='presentation'
			data-open={open ? '' : undefined}
			data-presented={presented ? '' : undefined}
		>
			{backdrop && (
				<Backdrop
					position='absolute'
					variant={backdropVariant}
					blur={backdropBlur}
					onClick={open && resolvedCloseOnOutside ? onClose : undefined}
					className={cn(
						styles.backdropFade,
						presented ? styles.backdropVisible : styles.backdropHidden,
					)}
				/>
			)}
			{trapFocus ? (
				<FloatingFocusTrap active={open}>
					{panel}
				</FloatingFocusTrap>
			) : panel}
		</div>
	);
}
FloatingLayer.displayName = 'Overlay.FloatingLayer';

export function SheetLayer({
	side,
	open,
	children,
	asChild,
	className,
	presented,
	onClose,
	layerStyle,
	backdrop = false,
	backdropVariant = 'default',
	backdropBlur = 'sm',
	closeOnOutsideClick,
	closeOnEscape = true,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
	'aria-describedby': ariaDescribedBy,
	role: contentRole = 'dialog',
	contentRef,
}: SheetLayerProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const localContentRef = useRef<HTMLElement | null>(null);
	/* eslint-disable react-hooks/refs -- composeRefs мержит object-ref; значение читается только позже в колбэках/эффектах */
	const mergedContentRef = composeRefs(
		contentRef,
		localContentRef,
	) as React.RefCallback<HTMLElement>;
	/* eslint-enable react-hooks/refs */

	const {resolvedCloseOnOutside} = useScrimLayerDismiss({
		open,
		onClose,
		contentRef: localContentRef,
		rootRef,
		backdrop,
		closeOnOutsideClick,
		closeOnEscape,
		lockScroll: backdrop,
	});

	const sideClass =
		side === 'top' ? styles.sheetTop
			: side === 'left' ? styles.sheetLeft
				: side === 'right' ? styles.sheetRight
					: styles.sheetBottom;

	const contentProps: OverlayContentProps = {
		className: cn(
			styles.sheetPanel,
			backdrop && styles.sheetPanelRaised,
			sideClass,
			presented ? styles.sheetVisible : styles.sheetHidden,
			className,
		),
		style: backdrop ? undefined : layerStyle,
		role: contentRole,
		'aria-modal': backdrop,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		'aria-describedby': ariaDescribedBy,
		onClick: (event) => event.stopPropagation(),
	};

	const panel = renderChildren({
		asChild,
		children,
		props: contentProps,
		contentRef: mergedContentRef,
	});

	if (!backdrop) {
		return panel;
	}

	return (
		<div
			ref={rootRef}
			className={styles.sheetRoot}
			style={layerStyle}
			role='presentation'
			data-open={open ? '' : undefined}
			data-presented={presented ? '' : undefined}
		>
			<Backdrop
				position='absolute'
				variant={backdropVariant}
				blur={backdropBlur}
				onClick={open && resolvedCloseOnOutside ? onClose : undefined}
				className={cn(
					styles.backdropFade,
					presented ? styles.backdropVisible : styles.backdropHidden,
				)}
			/>
			<SheetFocusTrap active={open} side={side}>
				{panel}
			</SheetFocusTrap>
		</div>
	);
}
SheetLayer.displayName = 'Overlay.SheetLayer';
