import type {
	ConfirmDialogProps,
} from './ConfirmDialog.types';
export type {
	ConfirmDialogSecondaryAction,
	ConfirmDialogProps,
} from './ConfirmDialog.types';

import {Button} from '../Button/Button';
import {Modal} from '../Modal/Modal';
import {Title} from '../Title/Title';
import {useFallbackId} from '../../hooks/useFallbackId';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_confirmDialog} from '../../locales/slices/confirmDialog.ru';

const localeFallback = {
	confirmDialog: ru_confirmDialog,
};

/**
 * Модальное окно подтверждения критического или необратимого действия.
 * Обёртка над `Modal` с фиксированным props-API.
 *
 * @component
 * @example
 * <ConfirmDialog
 *   open={open}
 *   title="Удалить проект?"
 *   message="Данные нельзя будет восстановить."
 *   status="danger"
 *   onConfirm={handleDelete}
 *   onOpenChange={setOpen}
 * />
 */
export function ConfirmDialog({
	open,
	title,
	message,
	confirmLabel: confirmLabelProp,
	cancelLabel: cancelLabelProp,
	status = 'default',
	secondaryAction,
	onConfirm,
	onOpenChange,
	loading = false,
	className,
	id,
	rootRef,
	...rest
}: ConfirmDialogProps) {
	const {t} = useLocale(localeFallback);
	const confirmLabel = confirmLabelProp ?? t('confirmDialog.confirm');
	const cancelLabel = cancelLabelProp ?? t('confirmDialog.cancel');
	const dialogId = useFallbackId(id);
	const titleId = `${dialogId}-title`;
	const messageId = `${dialogId}-message`;
	const handleDismiss = () => {
		if (loading) return;
		onOpenChange(false);
	};

	return (
		<Modal
			rootRef={rootRef}
			open={open}
			onOpenChange={onOpenChange}
			aria-labelledby={titleId}
			aria-describedby={messageId}
			className={className}
			id={dialogId}
			{...rest}
			showClose={false}
		>
			<Modal.Header>
				<Title
					level={3}
					id={titleId}
				>
					{title}
				</Title>
			</Modal.Header>
			<Modal.Body id={messageId}>
				{message}
			</Modal.Body>
			<Modal.Footer
				align={secondaryAction ? 'space-between' : 'end'}
				data-variant={status}
			>
				{secondaryAction && (
					<Button
						variant={secondaryAction.variant ?? 'secondary'}
						size='md'
						onClick={secondaryAction.onClick}
						disabled={loading || secondaryAction.disabled}
					>
						{secondaryAction.label}
					</Button>
				)}
				<Button
					variant='secondary'
					size='md'
					onClick={handleDismiss}
					disabled={loading}
				>
					{cancelLabel}
				</Button>
				<Button
					variant={status === 'danger' ? 'danger' : 'primary'}
					size='md'
					onClick={onConfirm}
					loading={loading}
				>
					{confirmLabel}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
