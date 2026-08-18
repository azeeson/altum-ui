import type {
	OverlayZIndexTier,
	SheetDirection,
	SheetProps,
	SheetHeaderProps,
	SheetTitleProps,
	SheetCloseProps,
	SheetBodyProps,
	SheetFooterProps,
} from './Sheet.types';
export type {
	OverlayZIndexTier,
	SheetMode,
	SheetDirection,
	SheetFooterAlign,
	SheetProps,
	SheetHeaderProps,
	SheetTitleProps,
	SheetCloseProps,
	SheetBodyProps,
	SheetFooterProps,
} from './Sheet.types';

import React, {
	createContext,
	forwardRef,
	useCallback,
	useContext,
	useId,
	useMemo,
} from 'react';
import {GrabHandle} from '../GrabHandle/GrabHandle';
import {Box} from '../Box/Box';
import {Layout} from '../Layout/Layout';
import {Overlay, type OverlayContentProps, type OverlayPurpose, type OverlaySheetSide} from '../Overlay/Overlay';
import {DialogBase} from '../../base/DialogBase';
import {MOBILE_MEDIA_QUERY, useMediaQuery} from '../../hooks/useMediaQuery';
import {toCssSize} from '../../utils/cssSize';
import {composeRefs} from '../../utils/composeRefs';
import styles from './Sheet.module.css';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useLocale} from '../LocaleProvider/LocaleProvider';

type SheetContextValue = {
	onClose: () => void;
	titleId: string;
	closeLabel: string;
	bodyPaddingDefault: boolean;
};

const SheetContext = createContext<SheetContextValue | null>(null);

function useSheetContext(component: string): SheetContextValue {
	const context = useContext(SheetContext);
	if (!context) {
		throw new Error(`${component} должен использоваться внутри Sheet`);
	}
	return context;
}

function sheetTierToPurpose(tier?: OverlayZIndexTier): OverlayPurpose | undefined {
	if (tier == null) return undefined;
	switch (tier) {
		case 'overlay':
			return 'sheet';
		case 'modal':
			return 'modal';
		case 'dropdown':
			return 'dropdown';
		case 'lightbox':
			return 'lightbox';
		case 'notification':
			return 'notification';
		default:
			return undefined;
	}
}

function resolveSheetSide(
	mode: 'sidebar' | 'sheet',
	direction: SheetDirection,
): OverlaySheetSide {
	if (mode === 'sidebar') {
		return direction === 'start' ? 'left' : 'right';
	}
	return direction === 'start' ? 'top' : 'bottom';
}

/**
 * Маркер / слот шапки.
 *
 * @component
 * @example
 * <Sheet.Header leftControls={<Button>Назад</Button>} showClose>
 *   <Sheet.Title>Фильтры</Sheet.Title>
 * </Sheet.Header>
 * <Sheet.Header variant="plain">
 *   <Badge label="Черновик" />
 *   <Sheet.Title>Карточка</Sheet.Title>
 *   <Button size="sm">Сохранить</Button>
 * </Sheet.Header>
 */
const SheetHeader = forwardRef<HTMLElement, SheetHeaderProps>(function SheetHeader({
	children,
	className = '',
	variant = 'chrome',
	leftControls,
	rightControls,
	showClose = true,
	...rest
}, ref) {
	const closeControl = showClose ? <SheetClose /> : null;
	const resolvedRight = (rightControls || showClose) ? (
		<>
			{rightControls}
			{closeControl}
		</>
	) : null;

	if (variant === 'plain') {
		return (
			<DialogBase.Header
				ref={ref}
				showClose={false}
				className={cn(styles.headerPlain, className)}
				{...rest}
			>
				<div className={styles.headerPlainContent}>
					{children}
				</div>
				{resolvedRight ? (
					<div className={styles.headerPlainEnd}>
						{resolvedRight}
					</div>
				) : null}
			</DialogBase.Header>
		);
	}

	return (
		<DialogBase.Header
			ref={ref}
			showClose={false}
			className={cn(styles.headerChrome, className)}
			{...rest}
		>
			<div className={cn(styles.headerSide, styles.headerSideStart)}>
				{leftControls}
			</div>
			<div className={styles.headerCenter}>
				{children}
			</div>
			<div className={cn(styles.headerSide, styles.headerSideEnd)}>
				{resolvedRight}
			</div>
		</DialogBase.Header>
	);
});
SheetHeader.displayName = 'Sheet.Header';

/**
 * Заголовок панели (`aria-labelledby`).
 * Ожидается один `Sheet.Title` на панель.
 *
 * @component
 */
const SheetTitle = forwardRef<HTMLHeadingElement, SheetTitleProps>(function SheetTitle({
	children,
	className = '',
	as: Tag = 'h2',
	...rest
}, ref) {
	useSheetContext('Sheet.Title');

	return (
		<DialogBase.Title
			ref={ref}
			as={Tag}
			className={cn(styles.titleAlign, className)}
			{...rest}
		>
			{children}
		</DialogBase.Title>
	);
});
SheetTitle.displayName = 'Sheet.Title';

/**
 * Кнопка закрытия.
 *
 * @component
 */
const SheetClose = forwardRef<HTMLButtonElement, SheetCloseProps>(function SheetClose({
	className = '',
	'aria-label': ariaLabelProp,
	...rest
}, ref) {
	const {closeLabel} = useSheetContext('Sheet.Close');
	return (
		<DialogBase.Close
			ref={ref}
			className={className}
			aria-label={ariaLabelProp ?? closeLabel}
			{...rest}
		/>
	);
});
SheetClose.displayName = 'Sheet.Close';

/**
 * Прокручиваемое тело панели.
 *
 * @component
 * @example
 * <Sheet.Body padding={false} role="status" aria-live="polite">…</Sheet.Body>
 */
const SheetBody = forwardRef<HTMLElement, SheetBodyProps>(function SheetBody({
	children,
	className = '',
	padding,
	...rest
}, ref) {
	const {bodyPaddingDefault} = useSheetContext('Sheet.Body');
	const withPadding = padding ?? bodyPaddingDefault;

	if (withPadding) {
		return (
			<DialogBase.Body
				ref={ref}
				className={cn(styles.bodyFollowsHeader, className)}
				{...rest}
			>
				{children}
			</DialogBase.Body>
		);
	}

	return (
		<Layout.Content
			ref={ref}
			className={className}
			{...rest}
		>
			{children}
		</Layout.Content>
	);
});
SheetBody.displayName = 'Sheet.Body';

/**
 * Нижний chrome (действия, secondary buttons).
 *
 * @component
 * @example
 * <Sheet.Footer>
 *   <Button variant="secondary">Отмена</Button>
 *   <Button variant="primary">Применить</Button>
 * </Sheet.Footer>
 */
const SheetFooter = forwardRef<HTMLElement, SheetFooterProps>(function SheetFooter({
	children,
	className = '',
	align = 'end',
	...rest
}, ref) {
	return (
		<DialogBase.Footer
			ref={ref}
			align={align}
			className={className}
			{...rest}
		>
			{children}
		</DialogBase.Footer>
	);
});
SheetFooter.displayName = 'Sheet.Footer';

function isFragmentElement(
	child: React.ReactElement,
): child is React.ReactElement<{children?: React.ReactNode}> {
	return child.type === React.Fragment;
}

function isSheetSlotElement(
	child: React.ReactNode,
): child is React.ReactElement {
	if (!React.isValidElement(child)) return false;
	const type = child.type;
	return (
		type === SheetHeader
		|| type === SheetTitle
		|| type === SheetClose
		|| type === SheetBody
		|| type === SheetFooter
	);
}

/**
 * Обход children с разворачиванием Fragment (и детей слотов — Title внутри Header).
 */
function visitSheetTree(
	node: React.ReactNode,
	visit: (element: React.ReactElement) => void,
): void {
	React.Children.forEach(node, (child) => {
		if (!React.isValidElement(child)) return;

		if (isFragmentElement(child)) {
			visitSheetTree(child.props.children, visit);
			return;
		}

		visit(child);

		if (isSheetSlotElement(child)) {
			const nested = (child.props as {children?: React.ReactNode}).children;
			if (nested != null) {
				visitSheetTree(nested, visit);
			}
		}
	});
}

function containsSheetTitle(children: React.ReactNode): boolean {
	let found = false;
	visitSheetTree(children, (element) => {
		if (element.type === SheetTitle) {
			found = true;
		}
	});
	return found;
}

/**
 * Универсальная выезжающая панель на базе `Overlay` (`variant="sheet"`).
 *
 * Составной API: `Sheet.Header` / `Title` / `Close` / `Body` / `Footer`.
 *
 * Держите `Sheet` смонтированным и управляйте видимостью через `open`
 * (`{open && <Sheet>}` убивает exit-анимацию).
 *
 * @component
 * @example
 * <Sheet open={open} onClose={onClose} mode="sheet" showHandle>
 *   <Sheet.Header showClose>
 *     <Sheet.Title>Фильтры</Sheet.Title>
 *   </Sheet.Header>
 *   <Sheet.Body>…</Sheet.Body>
 *   <Sheet.Footer>
 *     <Button variant="primary">Применить</Button>
 *   </Sheet.Footer>
 * </Sheet>
 */
const SheetRoot = forwardRef<HTMLDivElement, SheetProps>(function Sheet(
	{
		open,
		onClose,
		onOpenChange,
		children,
		showHandle = false,
		mode = 'auto',
		direction = 'end',
		backdrop = true,
		width = 280,
		height,
		closeLabel: closeLabelProp,
		backdropVariant = 'default',
		backdropBlur = 'sm',
		zIndexTier,
		zIndex,
		padding = true,
		className = '',
		style,
		onClick,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const closeLabel = closeLabelProp ?? t('common.close');
	const titleId = useId();
	const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
	const handleClose = useCallback(() => {
		onClose();
		onOpenChange?.(false);
	}, [onClose, onOpenChange]);

	const resolvedMode: 'sidebar' | 'sheet' = mode === 'auto'
		? (isMobile ? 'sheet' : 'sidebar')
		: mode;

	const side = resolveSheetSide(resolvedMode, direction);
	const labelled = containsSheetTitle(children);
	const purpose = sheetTierToPurpose(zIndexTier);

	const panelStyle: React.CSSProperties = {
		...(resolvedMode === 'sidebar'
			? {width: toCssSize(width)}
			: (height === undefined ? {} : {height: toCssSize(height)})),
		...style,
	};

	const contextValue = useMemo<SheetContextValue>(() => ({
		onClose: handleClose,
		titleId,
		closeLabel,
		bodyPaddingDefault: padding,
	}), [
		handleClose,
		titleId,
		closeLabel,
		padding,
	]);

	const handleAtOuterStart = showHandle && !(resolvedMode === 'sheet' && direction === 'start');
	const handleAtOuterEnd = showHandle && resolvedMode === 'sheet' && direction === 'start';

	return (
		<Overlay
			variant='sheet'
			side={side}
			open={open}
			onClose={handleClose}
			backdrop={backdrop}
			backdropVariant={backdropVariant}
			backdropBlur={backdropBlur}
			purpose={purpose}
			zIndex={zIndex}
			aria-labelledby={labelled ? titleId : ariaLabelledBy}
			aria-label={ariaLabel ?? (labelled ? undefined : t('sheet.ariaLabel'))}
			asChild={false}
		>
			{(slotProps: OverlayContentProps, contentRef) => (
				<Box
					as='div'
					variant='floating'
					padding='none'
					radius={resolvedMode === 'sidebar' ? 'none' : 'md'}
					ref={composeRefs(ref, contentRef as React.RefCallback<HTMLDivElement>)}
					data-mode={resolvedMode}
					data-direction={direction}
					data-z-tier={zIndexTier}
					className={cn(
						styles.sheet,
						styles[`panel_${resolvedMode}`],
						styles[`panel_${direction}`],
						showHandle ? styles.sheetWithHandle : '',
						slotProps.className,
						className,
					)}
					style={{
						...panelStyle,
						...slotProps.style,
					}}
					{...rest}
					role={slotProps.role}
					aria-modal={slotProps['aria-modal']}
					aria-labelledby={slotProps['aria-labelledby']}
					aria-label={slotProps['aria-label']}
					onClick={composeEventHandlers(onClick, slotProps.onClick)}
				>
					<SheetContext.Provider value={contextValue}>
						<DialogBase.Provider onClose={handleClose} titleId={titleId}>
							{handleAtOuterStart && <GrabHandle />}
							<Layout className={styles.sheetLayout}>
								{children}
							</Layout>
							{handleAtOuterEnd && <GrabHandle />}
						</DialogBase.Provider>
					</SheetContext.Provider>
				</Box>
			)}
		</Overlay>
	);
});

SheetRoot.displayName = 'Sheet';

type SheetComponent = typeof SheetRoot & {
	Header: typeof SheetHeader;
	Title: typeof SheetTitle;
	Close: typeof SheetClose;
	Body: typeof SheetBody;
	Footer: typeof SheetFooter;
};

/**
 * Универсальная выезжающая панель (составной API).
 */
export const Sheet = Object.assign(SheetRoot, {
	Header: SheetHeader,
	Title: SheetTitle,
	Close: SheetClose,
	Body: SheetBody,
	Footer: SheetFooter,
}) as SheetComponent;
