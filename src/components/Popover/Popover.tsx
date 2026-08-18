import type {
	PopoverTriggerMode,
	PopoverTriggerSlotProps,
	PopoverProps,
	PopoverTriggerProps,
	PopoverContentProps,
} from './Popover.types';
export type {
	PopoverTriggerMode,
	PopoverContentVariant,
	PopoverTriggerSlotProps,
	PopoverProps,
	PopoverTriggerProps,
	PopoverContentProps,
} from './Popover.types';

import React, {
	createContext,
	forwardRef,
	isValidElement,
	useContext,
	useId,
	useMemo,
	useRef,
} from 'react';
import {FocusTrap} from '../FocusTrap/FocusTrap';
import {composeRefs} from '../../utils/composeRefs';
import {Overlay, type OverlayContentProps} from '../Overlay/Overlay';
import {Box} from '../Box/Box';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {renderChildren} from '../../utils/renderChildren';
import {cn} from '../../utils/cn';
import type {AnchorAlign, AnchorSide} from '../../types';
import styles from './Popover.module.css';

interface PopoverContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
	triggerRef: React.RefObject<HTMLElement | null>;
	rootRef: React.Ref<HTMLDivElement | null>;
	contentId: string;
	side: AnchorSide;
	align: AnchorAlign;
	triggerMode: PopoverTriggerMode;
	disabled: boolean;
	openDelay: number;
	closeDelay: number;
	closeOnOutsideClick: boolean;
	closeOnEscape: boolean;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext(component: string): PopoverContextValue {
	const context = useContext(PopoverContext);
	if (!context) {
		throw new Error(`${component} должен использоваться внутри Popover`);
	}
	return context;
}

function isDisabledElement(node: React.ReactNode): boolean {
	if (!isValidElement(node)) return false;
	const props = node.props as {
		disabled?: boolean;
		'aria-disabled'?: boolean | 'true' | 'false';
	};
	return !!(props.disabled || props['aria-disabled'] === true || props['aria-disabled'] === 'true');
}

function arrowClass(side: AnchorSide | undefined): string {
	if (side === 'bottom') return styles.arrow_bottom;
	if (side === 'left') return styles.arrow_left;
	if (side === 'right') return styles.arrow_right;
	return styles.arrow_top;
}

const PopoverRoot = forwardRef<HTMLDivElement, PopoverProps>(function PopoverRoot(
	{
		children,
		open: controlledOpen,
		defaultOpen = false,
		onOpenChange,
		side = 'bottom',
		align = 'center',
		trigger = 'click',
		openDelay = 200,
		closeDelay = 100,
		disabled = false,
		closeOnOutsideClick,
		closeOnEscape,
		className,
		...rest
	},
	ref,
) {
	const triggerRef = useRef<HTMLElement | null>(null);
	const contentId = useId();
	const [openValue, setOpen] = useControlledStateWithCallback(
		controlledOpen,
		defaultOpen,
		onOpenChange,
	);
	const open = disabled ? false : openValue;

	const value = useMemo<PopoverContextValue>(() => ({
		open,
		setOpen,
		triggerRef,
		rootRef: ref,
		contentId,
		side,
		align,
		triggerMode: trigger,
		disabled,
		openDelay,
		closeDelay,
		closeOnOutsideClick: closeOnOutsideClick ?? trigger === 'click',
		closeOnEscape: closeOnEscape ?? trigger === 'click',
	}), [
		align,
		closeDelay,
		closeOnEscape,
		closeOnOutsideClick,
		contentId,
		disabled,
		open,
		openDelay,
		ref,
		setOpen,
		side,
		trigger,
	]);

	return (
		<PopoverContext.Provider value={value}>
			<div
				ref={ref}
				className={cn(styles.root, className)}
				{...rest}
			>
				{children}
			</div>
		</PopoverContext.Provider>
	);
});

const PopoverTrigger = forwardRef<HTMLElement, PopoverTriggerProps>(function PopoverTrigger(props, ref) {
	const {
		children,
		asChild,
		wrap,
		className,
	} = props;
	const {
		open,
		contentId,
		triggerRef,
		triggerMode,
		disabled,
	} = usePopoverContext('Popover.Trigger');

	const resolvedAsChild = asChild === true;
	const shouldWrap = wrap ?? (
		resolvedAsChild
		&& isValidElement(children)
		&& isDisabledElement(children)
	);

	const triggerSlotProps: PopoverTriggerSlotProps = triggerMode === 'click'
		? {
			'aria-haspopup': 'dialog',
			'aria-expanded': open,
			'aria-controls': contentId,
			className: cn(
				!resolvedAsChild && shouldWrap ? styles.wrap : undefined,
				className,
			),
		}
		: {
			'aria-describedby': open ? contentId : undefined,
			className: cn(
				!resolvedAsChild && shouldWrap ? styles.wrap : undefined,
				className,
			),
		};

	const triggerChildren = resolvedAsChild && shouldWrap
		? (
			<span className={cn(styles.wrap, className)}>
				{children as React.ReactElement}
			</span>
		)
		: children;

	/* eslint-disable-next-line react-hooks/refs -- composeRefs мержит object-ref; значение читается только позже */
	const mergedTriggerRef = composeRefs(ref, triggerRef);

	if (disabled && !resolvedAsChild) {
		return renderChildren({
			asChild: false,
			children: triggerChildren,
			props: triggerSlotProps,
			contentRef: mergedTriggerRef,
		});
	}

	return renderChildren({
		asChild: resolvedAsChild,
		children: triggerChildren,
		props: triggerSlotProps,
		contentRef: mergedTriggerRef,
	});
});

const PopoverContent = forwardRef<HTMLElement, PopoverContentProps>(function PopoverContent(
	{
		children,
		variant = 'panel',
		arrow = false,
		className,
		role,
		...rest
	},
	ref,
) {
	const {
		open,
		setOpen,
		triggerRef,
		rootRef,
		contentId,
		side,
		align,
		triggerMode,
		disabled,
		openDelay,
		closeDelay,
		closeOnOutsideClick,
		closeOnEscape,
	} = usePopoverContext('Popover.Content');

	if (disabled) return null;

	const resolvedRole = role ?? (variant === 'tooltip' ? 'tooltip' : 'dialog');
	const variantClass = variant === 'tooltip'
		? styles.contentTooltip
		: variant === 'plain'
			? styles.contentPlain
			: styles.contentPanel;
	const purpose = variant === 'tooltip' ? 'tooltip' as const : 'popover' as const;

	return (
		<Overlay
			ref={composeRefs(rootRef, ref)}
			variant='popover'
			purpose={purpose}
			open={open}
			onClose={() => setOpen(false)}
			onOpenChange={setOpen}
			targetRef={triggerRef}
			triggerMode={triggerMode}
			side={side}
			align={align}
			openDelay={openDelay}
			closeDelay={closeDelay}
			closeOnOutsideClick={closeOnOutsideClick}
			closeOnEscape={closeOnEscape}
			asChild={false}
		>
			{(slotProps: OverlayContentProps, contentRef) => {
				const resolvedSide = slotProps['data-side'] ?? side;
				const contentClassName = cn(
					styles.content,
					variantClass,
					arrow ? styles.withArrow : '',
					slotProps.className,
					className,
				);
				const contentInner = (
					<>
						{children}
						{arrow && (
							<span
								className={cn(styles.arrow, arrowClass(resolvedSide))}
								aria-hidden
							/>
						)}
					</>
				);

				if (variant === 'panel') {
					return (
						<Box
							as='div'
							variant='floating'
							padding='md'
							id={contentId}
							ref={contentRef}
							role={resolvedRole}
							className={contentClassName}
							style={slotProps.style}
							data-side={slotProps['data-side']}
							onPointerEnter={slotProps.onPointerEnter}
							onPointerLeave={slotProps.onPointerLeave}
							onPointerMove={slotProps.onPointerMove}
							{...rest}
							aria-modal={resolvedRole === 'dialog' ? true : undefined}
						>
							<FocusTrap active={open} restoreFocus={false}>
								{contentInner}
							</FocusTrap>
						</Box>
					);
				}

				return (
					<div
						id={contentId}
						ref={contentRef}
						role={resolvedRole}
						className={contentClassName}
						style={slotProps.style}
						data-side={slotProps['data-side']}
						onPointerEnter={slotProps.onPointerEnter}
						onPointerLeave={slotProps.onPointerLeave}
						onPointerMove={slotProps.onPointerMove}
						{...rest}
					>
						{contentInner}
					</div>
				);
			}}
		</Overlay>
	);
});

PopoverRoot.displayName = 'Popover';
PopoverTrigger.displayName = 'Popover.Trigger';
PopoverContent.displayName = 'Popover.Content';

/**
 * Плавающий слой на базе `Overlay` (`variant="popover"`).
 * Составной API: `Popover` + `Trigger` + `Content`.
 *
 * @component
 * @example
 * <Popover>
 *   <Popover.Trigger asChild>
 *     <Button variant="secondary">Открыть</Button>
 *   </Popover.Trigger>
 *   <Popover.Content>Текст описания.</Popover.Content>
 * </Popover>
 * @example
 * <Popover trigger="hover" openDelay={200}>
 *   <Popover.Trigger asChild>
 *     <button type="button">?</button>
 *   </Popover.Trigger>
 *   <Popover.Content variant="tooltip">Подсказка</Popover.Content>
 * </Popover>
 */
type PopoverComponent = React.ForwardRefExoticComponent<
	PopoverProps & React.RefAttributes<HTMLElement>
> & {
	Trigger: typeof PopoverTrigger;
	Content: typeof PopoverContent;
};

export const Popover = Object.assign(PopoverRoot, {
	Trigger: PopoverTrigger,
	Content: PopoverContent,
}) as PopoverComponent;
