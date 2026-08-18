import type {
	AlertVariant,
	AlertRootProps,
	AlertIconProps,
	AlertBodyProps,
	AlertTitleProps,
	AlertContentProps,
	AlertActionsProps,
	AlertCloseProps,
} from './Alert.types';
export type {
	AlertVariant,
	AlertLayout,
	AlertRootProps,
	AlertIconProps,
	AlertBodyProps,
	AlertTitleProps,
	AlertContentProps,
	AlertActionsProps,
	AlertCloseProps,
	AlertProps,
} from './Alert.types';

import React, {forwardRef} from 'react';
import {IconBell} from '../../icons/icons/IconBell';
import {IconCheckmark} from '../../icons/icons/IconCheckmark';
import {IconCross} from '../../icons/icons/IconCross';
import {IconFlag} from '../../icons/icons/IconFlag';
import {IconQuestion} from '../../icons/icons/IconQuestion';
import {MediaRowBase} from '../../base/MediaRowBase';
import {Box} from '../Box/Box';
import styles from './Alert.module.css';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useLocale} from '../LocaleProvider/LocaleProvider';

const DEFAULT_ICONS: Record<AlertVariant, React.ReactNode> = {
	info: <IconQuestion size={16} aria-hidden />,
	success: <IconCheckmark size={16} aria-hidden />,
	warning: <IconFlag size={16} aria-hidden />,
	error: <IconBell size={16} aria-hidden />,
};

function injectAlertVariant(
	node: React.ReactNode,
	variant: AlertVariant,
): React.ReactNode {
	return React.Children.map(node, (child) => {
		if (!React.isValidElement(child)) return child;
		if (child.type === AlertIcon) {
			return React.cloneElement(
				child as React.ReactElement<AlertIconProps>,
				{variant},
			);
		}
		const nested = (child.props as {children?: React.ReactNode}).children;
		if (nested == null) return child;
		return React.cloneElement(
			child as React.ReactElement<{children?: React.ReactNode}>,
			{children: injectAlertVariant(nested, variant)},
		);
	});
}

const AlertRoot = forwardRef<HTMLDivElement, AlertRootProps>(function AlertRoot(
	{
		variant = 'info',
		size: sizeProp,
		layout = 'block',
		className,
		style,
		role,
		children,
		...rest
	},
	ref,
) {
	const size = sizeProp ?? 'md';
	const resolvedRole = role ?? (variant === 'error' ? 'alert' : 'status');

	return (
		<MediaRowBase
			ref={ref}
			as={Box}
			variant='outlined'
			border
			shadow='none'
			padding='sm'
			radius='md'
			className={cn(
				styles.alert,
				styles[variant],
				size !== 'md' ? styles[size] : '',
				styles[layout],
				className,
			)}
			style={style}
			data-variant={variant}
			data-size={size}
			data-layout={layout}
			{...rest}
			role={resolvedRole}
		>
			{injectAlertVariant(children, variant)}
		</MediaRowBase>
	);
});

const AlertIcon = forwardRef<HTMLDivElement, AlertIconProps>(function AlertIcon(
	{
		children,
		className,
		style,
		variant = 'info',
		...rest
	},
	ref,
) {
	const resolved = children === null
		? null
		: (children ?? DEFAULT_ICONS[variant]);
	if (resolved == null) return null;
	return (
		<MediaRowBase.Media
			ref={ref}
			className={cn(styles.icon, className)}
			style={style}
			{...rest}
			aria-hidden
		>
			{resolved}
		</MediaRowBase.Media>
	);
});

const AlertBody = forwardRef<HTMLDivElement, AlertBodyProps>(function AlertBody(
	{children, className, style, ...rest},
	ref,
) {
	return (
		<MediaRowBase.Content
			ref={ref}
			className={cn(styles.body, className)}
			style={style}
			{...rest}
		>
			{children}
		</MediaRowBase.Content>
	);
});

const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>(function AlertTitle(
	{children, className, style, ...rest},
	ref,
) {
	if (children == null || children === '') return null;
	return (
		<MediaRowBase.Title
			ref={ref}
			className={cn(styles.title, className)}
			style={style}
			{...rest}
		>
			{children}
		</MediaRowBase.Title>
	);
});

const AlertContent = forwardRef<HTMLDivElement, AlertContentProps>(function AlertContent(
	{children, className, style, ...rest},
	ref,
) {
	if (children == null || children === '') return null;
	return (
		<MediaRowBase.Description
			ref={ref}
			className={cn(styles.content, className)}
			style={style}
			{...rest}
		>
			{children}
		</MediaRowBase.Description>
	);
});

const AlertActions = forwardRef<HTMLDivElement, AlertActionsProps>(function AlertActions(
	{children, className, style, ...rest},
	ref,
) {
	if (children == null) return null;
	return (
		<MediaRowBase.Actions
			ref={ref}
			className={cn(styles.actions, className)}
			style={style}
			{...rest}
		>
			{children}
		</MediaRowBase.Actions>
	);
});

const AlertClose = forwardRef<HTMLButtonElement, AlertCloseProps>(function AlertClose(
	{
		onClose,
		closeLabel: closeLabelProp,
		className,
		style,
		onClick,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const closeLabel = closeLabelProp ?? t('common.close');
	return (
		<button
			ref={ref}
			type='button'
			className={cn(styles.close, className)}
			style={style}
			{...rest}
			aria-label={closeLabel}
			onClick={composeEventHandlers(onClick, () => onClose())}
		>
			<IconCross size={12} aria-hidden />
		</button>
	);
});

AlertRoot.displayName = 'Alert';
AlertIcon.displayName = 'Alert.Icon';
AlertBody.displayName = 'Alert.Body';
AlertTitle.displayName = 'Alert.Title';
AlertContent.displayName = 'Alert.Content';
AlertActions.displayName = 'Alert.Actions';
AlertClose.displayName = 'Alert.Close';

/**
 * Inline status-блок: info / success / warning / error.
 *
 * @component
 * @example
 * <Alert variant="warning">
 *   <Alert.Icon />
 *   <Alert.Body>
 *     <Alert.Title>Внимание</Alert.Title>
 *     <Alert.Content>Проверьте данные.</Alert.Content>
 *   </Alert.Body>
 *   <Alert.Close onClose={() => {}} />
 * </Alert>
 */
export const Alert = Object.assign(AlertRoot, {
	Icon: AlertIcon,
	Body: AlertBody,
	Title: AlertTitle,
	Content: AlertContent,
	Actions: AlertActions,
	Close: AlertClose,
});
