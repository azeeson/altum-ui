import type {
	ModalRootProps,
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

import {forwardRef, useId, type FC, type ForwardRefExoticComponent, type RefAttributes} from 'react';
import {DialogBase} from '../../base/DialogBase';
import {Overlay} from '../Overlay/Overlay';
import {useLocale} from '../../locales/localeContext';
import styles from './Modal.module.css';
import {cn} from '../../utils/cn';
import {treeContainsDialogTitle} from '../../utils/visitElementTree';

const ModalRoot = forwardRef<HTMLElement, ModalRootProps>(function ModalRoot(
	{
		open,
		onOpenChange,
		children,
		className,
		id,
		style,
		'aria-labelledby': ariaLabelledBy,
		'aria-label': ariaLabel,
		'aria-describedby': ariaDescribedBy,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const generatedTitleId = useId();
	const titleId = ariaLabelledBy ?? generatedTitleId;
	const labelled = ariaLabelledBy != null || treeContainsDialogTitle(children);

	return (
		<Overlay
			variant='modal'
			purpose='modal'
			open={open}
			onOpenChange={onOpenChange}
			aria-labelledby={ariaLabel || !labelled ? undefined : titleId}
			aria-label={ariaLabel ?? (labelled ? undefined : t('modal.ariaLabel'))}
			aria-describedby={ariaDescribedBy}
		>
			<DialogBase.Surface
				ref={ref}
				variant='floating'
				radius='lg'
				className={cn(styles.modalContent, className)}
				id={id}
				style={style}
				onClose={() => onOpenChange(false)}
				titleId={titleId}
				{...rest}
			>
				{children}
			</DialogBase.Surface>
		</Overlay>
	);
});

const ModalFormFooter: FC<ModalFormFooterProps> = ({
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
 * <Modal open={open} onOpenChange={setOpen}>
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
ModalFormFooter.displayName = 'Modal.FormFooter';

type ModalComponent = ForwardRefExoticComponent<
	ModalRootProps & RefAttributes<HTMLElement>
> & {
	Header: typeof DialogBase.Header;
	Title: typeof DialogBase.Title;
	Close: typeof DialogBase.Close;
	Body: typeof DialogBase.Body;
	Footer: typeof DialogBase.Footer;
	FormFooter: typeof ModalFormFooter;
};

export const Modal = Object.assign(ModalRoot, {
	Header: DialogBase.Header,
	Title: DialogBase.Title,
	Close: DialogBase.Close,
	Body: DialogBase.Body,
	Footer: DialogBase.Footer,
	FormFooter: ModalFormFooter,
}) as ModalComponent;
