import type {
	OverlayZIndexTier,
	SheetDirection,
	SheetProps,
	SheetHeaderProps,
	SheetBodyProps,
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

import {forwardRef, useId, type Ref} from 'react';
import {GrabHandle} from '../GrabHandle/GrabHandle';
import {Overlay, type OverlayPurpose, type OverlaySheetSide} from '../Overlay/Overlay';
import {DialogBase} from '../../base/DialogBase';
import {MOBILE_MEDIA_QUERY, useMediaQuery} from '../../hooks/useMediaQuery';
import {toCssSize} from '../../utils/cssSize';
import styles from './Sheet.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../../locales/localeContext';
import {treeContainsDialogTitle} from '../../utils/visitElementTree';

function sheetTierToPurpose(tier?: OverlayZIndexTier): OverlayPurpose | undefined {
	if (tier == null) return undefined;
	if (tier === 'overlay') return 'sheet';
	if (tier === 'modal') return 'modal';
	if (tier === 'dropdown') return 'dropdown';
	if (tier === 'lightbox') return 'lightbox';
	if (tier === 'notification') return 'notification';
	return undefined;
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
 */
const SheetHeader = forwardRef<HTMLElement, SheetHeaderProps>(function SheetHeader({
	children,
	className = '',
	variant = 'chrome',
	leftControls,
	rightControls,
	showClose: showCloseProp,
	...rest
}, ref) {
	const showClose = showCloseProp ?? (rightControls == null);
	const closeControl = showClose ? <DialogBase.Close /> : null;
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
				contentClassName={styles.headerPlainInner}
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
			contentClassName={styles.headerChromeContent}
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
 * Прокручиваемое тело панели.
 *
 * @component
 */
const SheetBody = forwardRef<HTMLElement, SheetBodyProps>(function SheetBody({
	children,
	className = '',
	padding = true,
	...rest
}, ref) {
	if (padding) {
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
		<div
			ref={ref as Ref<HTMLDivElement>}
			className={cn(styles.bodyFlush, className)}
			{...rest}
		>
			{children}
		</div>
	);
});
SheetBody.displayName = 'Sheet.Body';

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
 * <Sheet open={open} onOpenChange={setOpen} mode="sheet" showHandle>
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
		onOpenChange,
		children,
		showHandle = false,
		mode = 'auto',
		direction = 'end',
		backdrop = true,
		width = 280,
		height,
		backdropVariant = 'default',
		backdropBlur = 'sm',
		zIndexTier,
		zIndex,
		dismiss,
		className = '',
		style,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const titleId = useId();
	const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
	const resolvedMode: 'sidebar' | 'sheet' = mode === 'auto'
		? (isMobile ? 'sheet' : 'sidebar')
		: mode;
	const side = resolveSheetSide(resolvedMode, direction);
	const labelled = treeContainsDialogTitle(children);
	const handleAtOuterStart = showHandle && !(resolvedMode === 'sheet' && direction === 'start');
	const handleAtOuterEnd = showHandle && resolvedMode === 'sheet' && direction === 'start';

	return (
		<Overlay
			variant='sheet'
			side={side}
			open={open}
			onOpenChange={onOpenChange}
			backdrop={backdrop}
			backdropVariant={backdropVariant}
			backdropBlur={backdropBlur}
			purpose={sheetTierToPurpose(zIndexTier)}
			zIndex={zIndex}
			dismiss={dismiss}
			aria-labelledby={labelled ? titleId : ariaLabelledBy}
			aria-label={ariaLabel ?? (labelled ? undefined : t('sheet.ariaLabel'))}
		>
			<DialogBase.Surface
				as='div'
				padding='none'
				radius={resolvedMode === 'sidebar' ? 'none' : 'md'}
				ref={ref}
				data-mode={resolvedMode}
				data-direction={direction}
				data-z-tier={zIndexTier}
				className={cn(
					styles.sheet,
					styles[`panel_${resolvedMode}`],
					styles[`panel_${direction}`],
					showHandle && styles.sheetWithHandle,
					className,
				)}
				style={{
					...(resolvedMode === 'sidebar'
						? {width: toCssSize(width)}
						: (height === undefined ? undefined : {height: toCssSize(height)})),
					...style,
				}}
				onClose={() => onOpenChange(false)}
				titleId={titleId}
				{...rest}
			>
				{handleAtOuterStart && <GrabHandle className={styles.grabHandleOverlay} />}
				{children}
				{handleAtOuterEnd && <GrabHandle className={styles.grabHandleOverlay} />}
			</DialogBase.Surface>
		</Overlay>
	);
});

SheetRoot.displayName = 'Sheet';

type SheetComponent = typeof SheetRoot & {
	Header: typeof SheetHeader;
	Title: typeof DialogBase.Title;
	Close: typeof DialogBase.Close;
	Body: typeof SheetBody;
	Footer: typeof DialogBase.Footer;
};

/**
 * Универсальная выезжающая панель (составной API).
 */
export const Sheet = Object.assign(SheetRoot, {
	Header: SheetHeader,
	Title: DialogBase.Title,
	Close: DialogBase.Close,
	Body: SheetBody,
	Footer: DialogBase.Footer,
}) as SheetComponent;
