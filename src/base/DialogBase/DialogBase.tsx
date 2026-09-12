import type {
	DialogBaseContextValue,
	DialogBaseProviderProps,
	DialogHeaderProps,
	DialogTitleProps,
	DialogCloseProps,
	DialogBodyProps,
	DialogFooterProps,
	DialogSurfaceProps,
} from './DialogBase.types';
export type {
	DialogBaseContextValue,
	DialogBaseProviderProps,
	DialogHeaderProps,
	DialogTitleProps,
	DialogCloseProps,
	DialogBodyProps,
	DialogFooterProps,
	DialogFooterAlign,
	DialogSurfaceProps,
} from './DialogBase.types';

import {createContext, forwardRef, useContext} from 'react';
import type {Ref} from 'react';
import {ButtonBase} from '../ButtonBase';
import {Box} from '../../components/Box/Box';
import {IconCross} from '../../icons/icons/IconCross';
import {useLocale} from '../../locales/localeContext';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {markDialogTitle} from '../../utils/visitElementTree';
import overlayClose from '../../styles/overlayClose.module.css';
import styles from './DialogBase.module.css';

const DialogBaseContext = createContext<DialogBaseContextValue | null>(null);

export function useDialogBaseContext(component: string): DialogBaseContextValue {
	const context = useContext(DialogBaseContext);
	if (!context) {
		throw new Error(`${component} должен использоваться внутри DialogBase`);
	}
	return context;
}

function DialogBaseProvider({
	onClose,
	titleId,
	onDragHandlePointerDown,
	children,
}: DialogBaseProviderProps) {
	return (
		<DialogBaseContext.Provider value={{
			onClose,
			titleId,
			onDragHandlePointerDown
		}}
		>
			{children}
		</DialogBaseContext.Provider>
	);
}
DialogBaseProvider.displayName = 'DialogBase.Provider';

const DialogSurface = forwardRef<HTMLElement, DialogSurfaceProps>(function DialogSurface(
	{
		onClose,
		titleId,
		onDragHandlePointerDown,
		className,
		children,
		variant = 'floating',
		...rest
	},
	ref,
) {
	return (
		<Box
			ref={ref}
			variant={variant}
			className={cn(styles.shell, className)}
			{...rest}
		>
			<DialogBaseProvider
				onClose={onClose}
				titleId={titleId}
				onDragHandlePointerDown={onDragHandlePointerDown}
			>
				{children}
			</DialogBaseProvider>
		</Box>
	);
});
DialogSurface.displayName = 'DialogBase.Surface';

const DialogHeader = forwardRef<HTMLElement, DialogHeaderProps>(function DialogHeader(
	{
		children,
		className,
		contentClassName,
		style,
		showClose = true,
		onPointerDown,
		...rest
	},
	ref,
) {
	const {onDragHandlePointerDown} = useDialogBaseContext('DialogBase.Header');
	return (
		<header
			ref={ref}
			className={cn(styles.header, className)}
			style={style}
			{...rest}
			onPointerDown={composeEventHandlers(onPointerDown, onDragHandlePointerDown)}
		>
			<div className={cn(styles.headerContent, contentClassName)}>
				{children}
			</div>
			{showClose ? <DialogClose /> : null}
		</header>
	);
});

const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(function DialogTitle(
	{
		children,
		className,
		style,
		as: Tag = 'h3',
		...rest
	},
	ref,
) {
	const {titleId} = useDialogBaseContext('DialogBase.Title');
	return (
		<Tag
			ref={ref}
			className={cn(styles.title, className)}
			style={style}
			{...rest}
			id={titleId}
		>
			{children}
		</Tag>
	);
});

const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(function DialogClose(
	{
		className,
		style,
		onClick,
		'aria-label': ariaLabelProp,
		'data-drag-ignore': dragIgnore,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const ariaLabel = ariaLabelProp ?? t('common.close');
	const {onClose, onDragHandlePointerDown} = useDialogBaseContext('DialogBase.Close');
	const buttonProps = onDragHandlePointerDown || dragIgnore != null ? {'data-drag-ignore': ''} : undefined;

	return (
		<ButtonBase
			ref={ref}
			variant='ghost'
			className={cn(overlayClose.close, className)}
			style={style}
			{...buttonProps}
			{...rest}
			aria-label={ariaLabel}
			onClick={composeEventHandlers(onClick, () => onClose())}
		>
			<IconCross
				className={overlayClose.icon}
				size={16}
				aria-hidden
			/>
		</ButtonBase>
	);
});

const DialogBody = forwardRef<HTMLElement, DialogBodyProps>(function DialogBody(
	{
		children,
		className,
		style,
		...rest
	},
	ref,
) {
	return (
		<div
			ref={ref as Ref<HTMLDivElement>}
			className={cn(styles.body, className)}
			style={style}
			{...rest}
		>
			{children}
		</div>
	);
});

const FOOTER_ALIGN_CLASS = {
	start: styles.alignStart,
	center: styles.alignCenter,
	end: styles.alignEnd,
	'space-between': styles.alignSpaceBetween,
} as const;

const DialogFooter = forwardRef<HTMLElement, DialogFooterProps>(function DialogFooter(
	{
		children,
		className,
		style,
		align = 'end',
		...rest
	},
	ref,
) {
	return (
		<footer
			ref={ref}
			className={cn(styles.footer, FOOTER_ALIGN_CLASS[align], className)}
			style={style}
			{...rest}
		>
			{children}
		</footer>
	);
});

DialogHeader.displayName = 'DialogBase.Header';
DialogTitle.displayName = 'DialogBase.Title';
markDialogTitle(DialogTitle);
DialogClose.displayName = 'DialogBase.Close';
DialogBody.displayName = 'DialogBase.Body';
DialogFooter.displayName = 'DialogBase.Footer';

export const DialogBase = {
	Provider: DialogBaseProvider,
	Surface: DialogSurface,
	Header: DialogHeader,
	Title: DialogTitle,
	Close: DialogClose,
	Body: DialogBody,
	Footer: DialogFooter,
};
