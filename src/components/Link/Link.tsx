import type {
	LinkProps,
} from './Link.types';
export type {
	LinkVariant,
	LinkSize,
	LinkStatus,
	LinkProps,
} from './Link.types';

import {cloneElement, isValidElement} from 'react';
import {Typography} from '../../base/Typography';
import {mergeSlotProps} from '../../core/utils/slot';
import unstyled from '../../styles/unstyledControl.module.css';
import textLink from '../../styles/textLink.module.css';
import styles from './Link.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Стилизованная текстовая ссылка с вариантами, размерами и hover/focus дизайн-системы.
 * Цвета читают `--altum-color-link-*`.
 *
 * Единственный элемент-child — Slot: пропсы проксируются на роутерный `Link` / кастомный `<a>`.
 * Текст и смешанные дети рендерятся в нативный `<a>` через Typography.
 *
 * @component
 * @example
 * <Link href="/docs" variant="secondary" size="sm">Документация</Link>
 * @example
 * <Link href="/docs">
 *   <RouterLink to="/docs">Документация</RouterLink>
 * </Link>
 */
export const Link = ({
	variant = 'primary',
	status = 'default',
	size,
	weight,
	className,
	children,
	target,
	rel,
	rootRef,
	...props
}: LinkProps) => {
	const resolvedRel = target === '_blank' ? (rel ?? 'noopener noreferrer') : rel;

	const slotProps = {
		className: cn(unstyled.control, textLink.link, styles.link, className),
		target,
		rel: resolvedRel,
		'data-variant': variant,
		'data-status': status === 'danger' ? 'danger' as const : undefined,
		'data-size': size || undefined,
		'data-weight': weight || undefined,
		...props,
	};

	if (isValidElement(children)) {
		return cloneElement(
			children,
			mergeSlotProps(slotProps, children, rootRef),
		);
	}

	return (
		<Typography
			as='a'
			rootRef={rootRef}
			{...slotProps}
		>
			{children}
		</Typography>
	);
};
