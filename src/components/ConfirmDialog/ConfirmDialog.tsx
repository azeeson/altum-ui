import type {
	ConfirmDialogProps,
} from './ConfirmDialog.types';
export type {
	ConfirmDialogSecondaryAction,
	ConfirmDialogProps,
} from './ConfirmDialog.types';

import {forwardRef, useId} from 'react';
import {Button} from '../Button/Button';
import {Modal} from '../Modal/Modal';
import {useLocale} from '../../locales/localeContext';

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
export const ConfirmDialog = forwardRef<HTMLElement, ConfirmDialogProps>(function ConfirmDialog(
	{
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
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const confirmLabel = confirmLabelProp ?? t('confirmDialog.confirm');
	const cancelLabel = cancelLabelProp ?? t('confirmDialog.cancel');
	const messageId = useId();
	const handleDismiss = () => {
		if (loading) return;
		onOpenChange(false);
	};

	return (
		<Modal
			ref={ref}
			open={open}
			onOpenChange={onOpenChange}
			aria-describedby={messageId}
			className={className}
			{...rest}
		>
			<Modal.Header showClose={false}>
				<Modal.Title>
					{title}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body id={messageId}>
				{message}
			</Modal.Body>
			<Modal.Footer align={secondaryAction ? 'space-between' : 'end'}>
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
					variant='primary'
					status={status === 'danger' ? 'danger' : 'default'}
					size='md'
					onClick={onConfirm}
					loading={loading}
				>
					{confirmLabel}
				</Button>
			</Modal.Footer>
		</Modal>
	);
});

ConfirmDialog.displayName = 'ConfirmDialog';
