import type {
	LinkProps,
} from './Link.types';
export type {
	LinkVariant,
	LinkSize,
	LinkStatus,
	LinkProps,
} from './Link.types';

import {Children, createElement, forwardRef, isValidElement} from 'react';
import unstyled from '../../styles/unstyledControl.module.css';
import textLink from '../../styles/textLink.module.css';
import typeStyles from '../../styles/type.module.css';
import styles from './Link.module.css';
import {cn} from '../../utils/cn';
import {Slot} from '../../utils/slot';

/**
 * Стилизованная текстовая ссылка с вариантами, размерами и hover/focus дизайн-системы.
 * Цвета читают `--altum-color-link-*`.
 *
 * Единственный элемент-child получает стили через Slot (роутерный `Link` / кастомный `<a>`).
 * Текст и смешанные дети рендерятся в нативный `<a>`.
 *
 * @component
 * @example
 * <Link href="/docs" variant="secondary" size="sm">Документация</Link>
 * @example
 * <Link href="/docs">
 *   <RouterLink to="/docs">Документация</RouterLink>
 * </Link>
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
	{
		variant = 'primary',
		status = 'default',
		size,
		weight,
		className,
		children,
		target,
		rel,
		...props
	},
	ref,
) {
	const slotChild = isValidElement(children) && Children.count(children) === 1;
	const resolvedRel = target === '_blank' ? (rel ?? 'noopener noreferrer') : rel;

	return createElement(
		slotChild ? Slot : 'a',
		{
			ref,
			className: cn(
				unstyled.control,
				textLink.link,
				styles.link,
				styles[variant],
				status === 'danger' && styles.danger,
				size && typeStyles[size],
				weight && typeStyles[weight],
				className,
			),
			target,
			rel: resolvedRel,
			...props,
		},
		children,
	);
});

Link.displayName = 'Link';
