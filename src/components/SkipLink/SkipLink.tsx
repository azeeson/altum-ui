import type {
	SkipLinkProps,
} from './SkipLink.types';
export type {
	SkipLinkProps,
} from './SkipLink.types';

import {Link} from '../Link/Link';
import styles from './SkipLink.module.css';
import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_skipLink} from '../../locales/slices/skipLink.ru';

const localeFallback = {
	skipLink: ru_skipLink,
};

/**
 * «Перейти к содержимому» — появляется при фокусе (a11y-база).
 * На базе {@link Link}.
 *
 * @component
 * @example
 * <SkipLink href="#main">К содержимому</SkipLink>
 * ...
 * <main id="main">...</main>
 */
export const SkipLink = ({
	href = '#main',
	children,
	className,
	rootRef,
	...rest
}: SkipLinkProps) => {
	const {t} = useLocale(localeFallback);
	return (
		<Link
			rootRef={rootRef}
			href={href}
			className={cn(styles.skipLink, className)}
			{...rest}
		>
			{children ?? t('skipLink.label')}
		</Link>
	);
};
