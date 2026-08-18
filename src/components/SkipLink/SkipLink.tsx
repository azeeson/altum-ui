import type {
	SkipLinkProps,
} from './SkipLink.types';
export type {
	SkipLinkProps,
} from './SkipLink.types';

import {forwardRef} from 'react';
import styles from './SkipLink.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../LocaleProvider/LocaleProvider';

/**
 * «Перейти к содержимому» — появляется при фокусе (a11y-база).
 *
 * @component
 * @example
 * <SkipLink href="#main">К содержимому</SkipLink>
 * ...
 * <main id="main">...</main>
 */
export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(function SkipLink(
	{
		href = '#main',
		children,
		className,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	return (
		<a
			ref={ref}
			href={href}
			className={cn(styles.skipLink, className)}
			{...rest}
		>
			{children ?? t('skipLink.label')}
		</a>
	);
});

SkipLink.displayName = 'SkipLink';
