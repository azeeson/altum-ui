import type {AlertProps, AlertVariant} from './Alert.types';
export type {
	AlertVariant,
	AlertLayout,
	AlertProps,
} from './Alert.types';

import {forwardRef, type ReactNode} from 'react';
import {IconCheckmark} from '../../icons/icons/IconCheckmark';
import {IconCross} from '../../icons/icons/IconCross';
import {IconInformation} from '../../icons/icons/IconInformation';
import {IconWarning} from '../../icons/icons/IconWarning';
import {IconWrong} from '../../icons/icons/IconWrong';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import mediaItem from '../../styles/MediaItem.module.css';
import overlayClose from '../../styles/overlayClose.module.css';
import styles from './Alert.module.css';
import status from '../../styles/status.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../../locales/localeContext';

const ALERT_ICONS: Record<AlertVariant, ReactNode> = {
	info: <IconInformation size={16} />,
	success: <IconCheckmark size={16} />,
	warning: <IconWarning size={16} />,
	error: <IconWrong size={16} />,
};

/**
 * Inline status-блок: info / success / warning / error.
 *
 * @component
 * @example
 * <Alert variant="warning" title="Внимание" onClose={() => {}}>
 *   Проверьте данные.
 * </Alert>
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
	{
		variant = 'info',
		size = 'md',
		layout = 'block',
		className,
		role,
		title,
		icon,
		actions,
		onClose,
		closeLabel: closeLabelProp,
		children,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const closeLabel = closeLabelProp ?? t('common.close');

	return (
		<div
			ref={ref}
			className={cn(
				mediaItem.row,
				mediaItem.wrap,
				styles.alert,
				styles[variant],
				status[variant],
				status.surface,
				size !== 'md' && styles[size],
				layout === 'inline' && styles.inline,
				className,
			)}
			role={role ?? (variant === 'error' ? 'alert' : 'status')}
			{...rest}
		>
			{icon !== null && (
				<div className={cn(mediaItem.media, styles.icon)} aria-hidden>
					{icon ?? ALERT_ICONS[variant]}
				</div>
			)}
			<div className={cn(mediaItem.content, styles.body)}>
				{title != null && title !== '' && (
					<div className={cn(mediaItem.title, styles.title)}>
						{title}
					</div>
				)}
				{children != null && children !== '' && (
					<div className={cn(mediaItem.description, styles.content)}>
						{children}
					</div>
				)}
				{actions != null && (
					<div className={cn(mediaItem.actions, styles.actions)}>
						{actions}
					</div>
				)}
			</div>
			{onClose != null && (
				<ButtonIcon
					appearance='diskClose'
					aria-label={closeLabel}
					icon={(
						<IconCross
							className={overlayClose.icon}
							size={16}
							aria-hidden
						/>
					)}
					onClick={onClose}
				/>
			)}
		</div>
	);
});

Alert.displayName = 'Alert';
