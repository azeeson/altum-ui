import type {LiveRegionProps} from './LiveRegion.types';
export type {LiveRegionProps} from './LiveRegion.types';

import {VisuallyHidden} from '../VisuallyHidden/VisuallyHidden';

/**
 * Скрытая область, которая озвучивает сообщение скринридером.
 * Пустой `message` ничего не рендерит.
 *
 * @component
 * @example
 * <LiveRegion message={saved ? 'Черновик сохранён' : ''} />
 */
export const LiveRegion = ({
	message,
	politeness = 'polite',
	rootRef,
	...rest
}: LiveRegionProps) => {
	if (!message) return null;

	const assertive = politeness === 'assertive';

	return (
		<VisuallyHidden
			rootRef={rootRef}
			as='div'
			{...rest}
			role={assertive ? 'alert' : 'status'}
			aria-live={politeness}
			aria-atomic
		>
			{message}
		</VisuallyHidden>
	);
};
