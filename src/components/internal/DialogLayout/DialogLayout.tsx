import type {DialogLayoutProps} from './DialogLayout.types';
export type {DialogLayoutProps} from './DialogLayout.types';

import {Box} from '../../Box/Box';
import {CloseControl} from '../CloseControl/CloseControl';
import {cn} from '../../../core/utils/cn';
import styles from './DialogLayout.module.css';

/**
 * Поверхность диалога: контент в `Box`, крестик в правом верхнем углу поверх него.
 * Кнопка вне потока и не сдвигает содержимое. Внутренний узел — не экспорт библиотеки.
 *
 * @component
 * @example
 * <DialogLayout variant="floating" radius="lg" onClose={close}>
 *   <p>Текст доходит до правого края, крестик лежит сверху.</p>
 * </DialogLayout>
 */
export const DialogLayout = ({
	children,
	className,
	onClose,
	showClose = true,
	closeLabel,
	rootRef,
	...rest
}: DialogLayoutProps) => {
	return (
		<Box
			{...rest}
			rootRef={rootRef}
			className={cn(styles.root, className)}
		>
			{children}
			{showClose && onClose != null && (
				<CloseControl
					className={styles.close}
					aria-label={closeLabel}
					onClick={onClose}
				/>
			)}
		</Box>
	);
};
