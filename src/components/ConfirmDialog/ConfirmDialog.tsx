import type {
	ConfirmDialogProps,
} from './ConfirmDialog.types';
export type {
	ConfirmDialogSecondaryAction,
	ConfirmDialogProps,
} from './ConfirmDialog.types';

import React, {forwardRef, useId} from 'react';
import {Button} from '../Button/Button';
import {Modal} from '../Modal/Modal';
import {Text} from '../Text/Text';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import styles from './ConfirmDialog.module.css';

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
 *   onCancel={() => setOpen(false)}
 *   onClose={() => setOpen(false)}
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
		onCancel,
		onClose,
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
	const confirmStatus = status === 'danger' ? 'danger' : 'default';
	const messageId = useId();
	const handleCancel = () => {
		if (loading) return;
		onCancel();
		onClose?.();
		onOpenChange?.(false);
	};

	return (
		<Modal
			ref={ref}
			open={open}
			onClose={handleCancel}
			aria-describedby={messageId}
			className={className}
			{...rest}
		>
			<Modal.Header showClose={false}>
				<Modal.Title>
					{title}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Text size='md' id={messageId}>
					{message}
				</Text>
			</Modal.Body>
			<Modal.Footer align='end'>
				<div className={styles.actions}>
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
					<div className={styles.actionsEnd}>
						<Button
							variant='secondary'
							size='md'
							onClick={handleCancel}
							disabled={loading}
						>
							{cancelLabel}
						</Button>
						<Button
							variant='primary'
							status={confirmStatus}
							size='md'
							onClick={onConfirm}
							loading={loading}
						>
							{confirmLabel}
						</Button>
					</div>
				</div>
			</Modal.Footer>
		</Modal>
	);
});

ConfirmDialog.displayName = 'ConfirmDialog';
