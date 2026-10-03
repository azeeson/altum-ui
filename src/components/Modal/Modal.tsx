import type {
	ModalBodyProps,
	ModalFooterProps,
	ModalHeaderProps,
	ModalRootProps,
} from './Modal.types';
export type {
	ModalFooterAlign,
	ModalRootProps,
	ModalHeaderProps,
	ModalBodyProps,
	ModalFooterProps,
	ModalProps,
} from './Modal.types';

import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_modal} from '../../locales/slices/modal.ru';
import {DialogLayout} from '../DialogLayout/DialogLayout';
import {Layout} from '../Layout/Layout';
import {Overlay} from '../Overlay/Overlay';
import styles from './Modal.module.css';
import overlayScrim from '../../styles/overlayScrim.module.css';

const localeFallback = {
	modal: ru_modal,
};

const ModalHeader = ({rootRef, ...props}: ModalHeaderProps) => (
	<Layout.Header
		rootRef={rootRef}
		sticky
		{...props}
	/>
);

const ModalBody = ({className, rootRef, ...props}: ModalBodyProps) => (
	<Layout.Content
		rootRef={rootRef}
		{...props}
		className={cn(styles.body, className)}
	/>
);

const ModalFooter = ({align = 'end', rootRef, ...props}: ModalFooterProps) => (
	<Layout.Footer
		rootRef={rootRef}
		sticky
		align={align}
		{...props}
	/>
);

const ModalRoot = ({
	open,
	onOpenChange,
	children,
	size = 'md',
	className,
	'aria-labelledby': ariaLabelledBy,
	'aria-label': ariaLabel,
	'aria-describedby': ariaDescribedBy,
	rootRef,
	...rest
}: ModalRootProps) => {
	const {t} = useLocale(localeFallback);

	return (
		<Overlay
			variant='modal'
			open={open}
			onOpenChange={onOpenChange}
			hostClassName={overlayScrim.host}
			aria-labelledby={ariaLabel ? undefined : ariaLabelledBy}
			aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : t('modal.ariaLabel'))}
			aria-describedby={ariaDescribedBy}
		>
			<DialogLayout
				rootRef={rootRef}
				{...rest}
				variant='floating'
				radius='lg'
				className={cn(styles.modalContent, className)}
				data-size={size !== 'md' ? size : undefined}
				onClose={() => onOpenChange(false)}
			>
				<Layout padding='md' gap='md'>
					{children}
				</Layout>
			</DialogLayout>
		</Overlay>
	);
};

/**
 * Модальное окно на базе `Overlay` (`variant="modal"`).
 * Корень — `DialogLayout`, шапка, тело и футер — `Layout`.
 *
 * @component
 * @example
 * <Modal open={open} onOpenChange={setOpen}>
 *   <Modal.Header>
 *     <Title level={3}>Заголовок</Title>
 *   </Modal.Header>
 *   <Modal.Body>…</Modal.Body>
 *   <Modal.Footer>
 *     <Button onClick={() => setOpen(false)}>ОК</Button>
 *   </Modal.Footer>
 * </Modal>
 */
export const Modal = Object.assign(ModalRoot, {
	Header: ModalHeader,
	Body: ModalBody,
	Footer: ModalFooter,
});
