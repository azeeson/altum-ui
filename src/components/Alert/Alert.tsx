import type {AlertProps, AlertVariant} from './Alert.types';
export type {
	AlertVariant,
	AlertLayout,
	AlertProps,
} from './Alert.types';

import type {ComponentType} from 'react';

import {CloseControl} from '../internal/CloseControl/CloseControl';
import {Title} from '../Title/Title';
import {IconCheckmark} from '../../icons/icons/IconCheckmark';
import {IconInformation} from '../../icons/icons/IconInformation';
import {IconWarning} from '../../icons/icons/IconWarning';
import {IconWrong} from '../../icons/icons/IconWrong';
import type {IconProps} from '../../icons/IconBase';
import mediaItem from '../../styles/MediaItem.module.css';
import styles from './Alert.module.css';
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_common} from '../../locales/slices/common.ru';

const localeFallback = {
	common: ru_common,
};

const ROLE_MAP = {
	info: 'status',
	success: 'status',
	warning: 'status',
	error: 'alert',
} as const;

const VARIANT_ICONS: Record<AlertVariant, ComponentType<IconProps>> = {
	info: IconInformation,
	success: IconCheckmark,
	warning: IconWarning,
	error: IconWrong,
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
export function Alert({
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
	rootRef,
	...rest
}: AlertProps) {
	const {t} = useLocale(localeFallback);
	const closeLabel = closeLabelProp ?? t('common.close');
	const DefaultIcon = VARIANT_ICONS[variant];

	return (
		<div
			ref={rootRef}
			{...rest}
			className={cn(
				mediaItem.row,
				mediaItem.wrap,
				styles.alert,
				className,
			)}
			role={role ?? ROLE_MAP[variant]}
			data-variant={variant}
			data-size={size !== 'md' ? size : undefined}
			data-layout={layout === 'inline' ? 'inline' : undefined}
		>
			{icon !== null && icon !== false && (
				<div
					className={cn(utilities.fCenter, mediaItem.media, styles.icon)}
					aria-hidden
				>
					{icon ?? <DefaultIcon size={16} />}
				</div>
			)}
			<div className={cn(utilities.fColumn, mediaItem.content, styles.body)}>
				{title != null && title !== '' && (
					<Title
						level={4}
						className={cn(mediaItem.title, styles.title)}
					>
						{title}
					</Title>
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
				<CloseControl
					className={styles.dismiss}
					aria-label={closeLabel}
					onClick={onClose}
				/>
			)}
		</div>
	);
}
