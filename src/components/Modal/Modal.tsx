import type {
	ModalRootProps,
	ModalHeaderProps,
	ModalTitleProps,
	ModalCloseProps,
	ModalBodyProps,
	ModalFooterProps,
	ModalFormFooterProps,
} from './Modal.types';
export type {
	ModalFooterAlign,
	ModalRootProps,
	ModalHeaderProps,
	ModalTitleProps,
	ModalCloseProps,
	ModalBodyProps,
	ModalFooterProps,
	ModalFormFooterProps,
	ModalProps,
} from './Modal.types';

import React, {forwardRef, useId} from 'react';
import {Layout} from '../Layout/Layout';
import {Box} from '../Box/Box';
import {DialogBase} from '../../base/DialogBase';
import {Overlay, type OverlayContentProps} from '../Overlay/Overlay';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import styles from './Modal.module.css';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';

function isFragmentElement(
	child: React.ReactElement,
): child is React.ReactElement<{children?: React.ReactNode}> {
	return child.type === React.Fragment;
}

function visitModalTree(
	node: React.ReactNode,
	visit: (element: React.ReactElement) => void,
): void {
	React.Children.forEach(node, (child) => {
		if (!React.isValidElement(child)) return;

		if (isFragmentElement(child)) {
			visitModalTree(child.props.children, visit);
			return;
		}

		visit(child);

		const nested = (child.props as {children?: React.ReactNode}).children;
		if (nested != null) {
			visitModalTree(nested, visit);
		}
	});
}

function containsModalTitle(children: React.ReactNode): boolean {
	let found = false;
	visitModalTree(children, (element) => {
		if (element.type === ModalTitle) {
			found = true;
		}
	});
	return found;
}

const ModalRoot = forwardRef<HTMLElement, ModalRootProps>(function ModalRoot(
	{
		open,
		onClose,
		onOpenChange,
		children,
		className,
		id,
		style,
		'aria-labelledby': ariaLabelledBy,
		'aria-label': ariaLabel,
		'aria-describedby': ariaDescribedBy,
		onClick,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const generatedTitleId = useId();
	const titleId = ariaLabelledBy ?? generatedTitleId;
	const labelled = ariaLabelledBy != null || containsModalTitle(children);
	const handleClose = () => {
		onClose();
		onOpenChange?.(false);
	};

	return (
		<Overlay
			ref={ref}
			variant='modal'
			purpose='modal'
			open={open}
			onClose={handleClose}
			aria-labelledby={ariaLabel || !labelled ? undefined : titleId}
			aria-label={ariaLabel ?? (labelled ? undefined : t('modal.ariaLabel'))}
			aria-describedby={ariaDescribedBy}
			asChild={false}
		>
			{(slotProps: OverlayContentProps, contentRef) => (
				<Box
					as='div'
					variant='floating'
					ref={contentRef}
					role={slotProps.role}
					aria-modal={slotProps['aria-modal']}
					aria-labelledby={slotProps['aria-labelledby']}
					aria-label={slotProps['aria-label']}
					aria-describedby={slotProps['aria-describedby']}
					className={cn(styles.modalContent, slotProps.className, className)}
					id={id}
					style={slotProps.style ? {
						...slotProps.style,
						...style
					} : style}
					{...rest}
					onClick={composeEventHandlers(onClick, slotProps.onClick)}
				>
					<DialogBase.Provider onClose={handleClose} titleId={titleId}>
						<Layout className={styles.modalLayout}>
							{children}
						</Layout>
					</DialogBase.Provider>
				</Box>
			)}
		</Overlay>
	);
});

const ModalHeader = forwardRef<HTMLElement, ModalHeaderProps>(function ModalHeader(
	{className, ...rest},
	ref,
) {
	return (
		<DialogBase.Header
			ref={ref}
			className={className}
			{...rest}
		/>
	);
});

const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(function ModalTitle(
	{className, ...rest},
	ref,
) {
	return (
		<DialogBase.Title
			ref={ref}
			className={className}
			{...rest}
		/>
	);
});

const ModalClose = forwardRef<HTMLButtonElement, ModalCloseProps>(function ModalClose(props, ref) {
	return <DialogBase.Close {...props} ref={ref} />;
});

const ModalBody = forwardRef<HTMLElement, ModalBodyProps>(function ModalBody(
	{className, ...rest},
	ref,
) {
	return (
		<DialogBase.Body
			ref={ref}
			className={className}
			{...rest}
		/>
	);
});

const ModalFooter = forwardRef<HTMLElement, ModalFooterProps>(function ModalFooter(
	{className, ...rest},
	ref,
) {
	return (
		<DialogBase.Footer
			ref={ref}
			className={className}
			{...rest}
		/>
	);
});

const ModalFormFooter: React.FC<ModalFormFooterProps> = ({
	className = '',
	message,
	align,
	children,
}) => (
	<DialogBase.Footer
		align={align ?? (message != null ? 'space-between' : 'end')}
		className={cn(styles.formFooter, className)}
	>
		{message != null && (
			<div className={styles.formFooterStatus} role='status'>
				{message}
			</div>
		)}
		{children != null && (
			<div className={styles.formFooterActions}>
				{children}
			</div>
		)}
	</DialogBase.Footer>
);

/**
 * Модальное окно на базе `Overlay` (`variant="modal"`).
 * Составной API: `Modal` + `Header` / `Title` / `Close` / `Body` / `Footer` / `FormFooter`.
 *
 * @component
 * @example
 * <Modal open={open} onClose={() => setOpen(false)}>
 *   <Modal.Header>
 *     <Modal.Title>Заголовок</Modal.Title>
 *   </Modal.Header>
 *   <Modal.Body>…</Modal.Body>
 *   <Modal.Footer>
 *     <Button onClick={() => setOpen(false)}>ОК</Button>
 *   </Modal.Footer>
 * </Modal>
 */
ModalRoot.displayName = 'Modal';
ModalHeader.displayName = 'Modal.Header';
ModalTitle.displayName = 'Modal.Title';
ModalClose.displayName = 'Modal.Close';
ModalBody.displayName = 'Modal.Body';
ModalFooter.displayName = 'Modal.Footer';
ModalFormFooter.displayName = 'Modal.FormFooter';

type ModalComponent = React.ForwardRefExoticComponent<
	ModalRootProps & React.RefAttributes<HTMLElement>
> & {
	Header: typeof ModalHeader;
	Title: typeof ModalTitle;
	Close: typeof ModalClose;
	Body: typeof ModalBody;
	Footer: typeof ModalFooter;
	FormFooter: typeof ModalFormFooter;
};

export const Modal = Object.assign(ModalRoot, {
	Header: ModalHeader,
	Title: ModalTitle,
	Close: ModalClose,
	Body: ModalBody,
	Footer: ModalFooter,
	FormFooter: ModalFormFooter,
}) as ModalComponent;
