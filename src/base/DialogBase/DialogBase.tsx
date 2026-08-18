import type {
	DialogBaseContextValue,
	DialogBaseProviderProps,
	DialogHeaderProps,
	DialogTitleProps,
	DialogCloseProps,
	DialogBodyProps,
	DialogFooterProps,
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
} from './DialogBase.types';

import {createContext, forwardRef, useContext} from 'react';
import type {Ref} from 'react';
import {ButtonBase} from '../ButtonBase';
import {useLocale} from '../../locales';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import styles from './DialogBase.module.css';

const DialogBaseContext = createContext<DialogBaseContextValue | null>(null);

export function useDialogBaseContext(component: string): DialogBaseContextValue {
	const context = useContext(DialogBaseContext);
	if (!context) {
		throw new Error(`${component} должен использоваться внутри DialogBase`);
	}
	return context;
}

function DialogCloseIcon() {
	return (
		<svg
			className={styles.closeIcon}
			width={12}
			height={12}
			viewBox='0 0 24 24'
			aria-hidden
		>
			<path
				d='M6 6l12 12M18 6L6 18'
				fill='none'
				stroke='currentColor'
				strokeWidth={2.5}
				strokeLinecap='round'
			/>
		</svg>
	);
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

const DialogHeader = forwardRef<HTMLElement, DialogHeaderProps>(function DialogHeader(
	{
		children,
		className,
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
			<div className={styles.headerContent}>
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
			className={cn(styles.close, className)}
			style={style}
			{...buttonProps}
			{...rest}
			aria-label={ariaLabel}
			onClick={composeEventHandlers(onClick, () => onClose())}
		>
			<DialogCloseIcon />
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
DialogClose.displayName = 'DialogBase.Close';
DialogBody.displayName = 'DialogBase.Body';
DialogFooter.displayName = 'DialogBase.Footer';

export const DialogBase = {
	Provider: DialogBaseProvider,
	Header: DialogHeader,
	Title: DialogTitle,
	Close: DialogClose,
	Body: DialogBody,
	Footer: DialogFooter,
};
