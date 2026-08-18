import type {
	LinkProps,
} from './Link.types';
export type {
	LinkVariant,
	LinkSize,
	LinkStatus,
	LinkProps,
} from './Link.types';

import {forwardRef} from 'react';
import styles from './Link.module.css';
import {cn} from '../../utils/cn';
import {Slot} from '../../utils/slot';

/**
 * Стилизованная текстовая ссылка с вариантами, размерами и hover/focus дизайн-системы.
 * Цвета читают `--altum-color-link-*` (Box на адаптивных поверхностях переопределяет их).
 *
 * @component
 * @example
 * <Link href="/docs" variant="secondary" size="sm">Документация</Link>
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
	{
		variant = 'primary',
		status = 'default',
		size,
		weight,
		className,
		children,
		asChild = false,
		target,
		rel,
		...props
	},
	ref,
) {
	const linkClassName = cn(
		styles.link,
		styles[variant],
		status === 'danger' ? styles.danger : '',
		size && styles[size],
		weight && styles[weight],
		className,
	);
	const resolvedRel = target === '_blank' ? (rel ?? 'noopener noreferrer') : rel;

	if (asChild) {
		return (
			<Slot
				ref={ref}
				className={linkClassName}
				target={target}
				rel={resolvedRel}
				{...props}
			>
				{children}
			</Slot>
		);
	}

	return (
		<a
			ref={ref}
			className={linkClassName}
			target={target}
			rel={resolvedRel}
			{...props}
		>
			{children}
		</a>
	);
});

Link.displayName = 'Link';
