import type {
	PopoverTriggerMode,
	PopoverTriggerSlotProps,
	PopoverProps,
} from './Popover.types';
export type {
	PopoverTriggerMode,
	PopoverContentVariant,
	PopoverTriggerSlotProps,
	PopoverProps,
} from './Popover.types';

import {forwardRef, useId, useRef} from 'react';
import {FocusTrap} from '../FocusTrap/FocusTrap';
import {Overlay} from '../Overlay/Overlay';
import {Box} from '../Box/Box';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {cn} from '../../utils/cn';
import styles from './Popover.module.css';

/**
 * Плавающий слой на базе Overlay.
 * Якорь — `renderTrigger`; содержимое панели — `children`.
 *
 * @component
 * @example
 * <Popover renderTrigger={(props, ref) => <Button {...props} ref={ref}>Открыть</Button>}>
 *   Текст описания.
 * </Popover>
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
	{
		children,
		renderTrigger,
		open: controlledOpen,
		defaultOpen = false,
		onOpenChange,
		trigger = 'click',
		disabled = false,
		wrap = false,
		className,
		variant = 'panel',
		arrow = true,
		panelClassName,
		role,
		side = 'bottom',
		align = 'center',
		openDelay = 200,
		closeDelay = 100,
		dismiss,
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
	const open = !disabled && openValue;
	const triggerMode: PopoverTriggerMode = trigger;
	const wrapClass = wrap ? styles.wrap : undefined;
	const triggerSlotProps: PopoverTriggerSlotProps = triggerMode === 'click'
		? {
			'aria-haspopup': 'dialog',
			'aria-expanded': open,
			'aria-controls': contentId,
			className: wrapClass,
		}
		: {
			'aria-describedby': open ? contentId : undefined,
			className: wrapClass,
		};

	const assignTriggerRef = (node: HTMLElement | null) => {
		triggerRef.current = node;
	};

	const triggerNode = wrap
		? (
			<span
				ref={assignTriggerRef}
				className={styles.wrap}
				aria-haspopup={triggerSlotProps['aria-haspopup']}
				aria-expanded={triggerSlotProps['aria-expanded']}
				aria-controls={triggerSlotProps['aria-controls']}
				aria-describedby={triggerSlotProps['aria-describedby']}
			>
				{renderTrigger({}, () => undefined)}
			</span>
		)
		: renderTrigger(triggerSlotProps, assignTriggerRef);

	const resolvedRole = role ?? (variant === 'tooltip' ? 'tooltip' : 'dialog');
	const Panel = variant === 'panel' ? Box : 'div';
	const panelProps = variant === 'panel'
		? {
			variant: 'floating' as const,
			padding: 'md' as const,
			as: 'div' as const
		}
		: undefined;

	return (
		<div
			ref={ref}
			className={cn(styles.root, className)}
			{...rest}
		>
			{triggerNode}
			{!disabled && (
				<Overlay
					variant='popover'
					purpose={variant === 'tooltip' ? 'tooltip' : 'popover'}
					open={open}
					onOpenChange={setOpen}
					targetRef={triggerRef}
					triggerMode={triggerMode}
					side={side}
					align={align}
					openDelay={openDelay}
					closeDelay={closeDelay}
					dismiss={dismiss ?? (triggerMode === 'click' ? 'all' : 'none')}
					role={resolvedRole}
				>
					<Panel
						{...panelProps}
						id={contentId}
						role={resolvedRole}
						className={cn(
							styles.content,
							variant === 'tooltip' ? styles.contentTooltip
								: variant === 'plain' ? styles.contentPlain
									: styles.contentPanel,
							arrow && styles.withArrow,
							panelClassName,
						)}
						aria-modal={resolvedRole === 'dialog' ? true : undefined}
					>
						{variant === 'panel' ? (
							<FocusTrap active={open} restoreFocus={false}>
								{children}
							</FocusTrap>
						) : children}
						{arrow ? <span className={styles.arrow} aria-hidden /> : null}
					</Panel>
				</Overlay>
			)}
		</div>
	);
});

Popover.displayName = 'Popover';
