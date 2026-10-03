import type {
	VisuallyHiddenProps,
} from './VisuallyHidden.types';
export type {
	VisuallyHiddenProps,
} from './VisuallyHidden.types';

import type {ElementType} from 'react';
import styles from '../../styles/visuallyHidden.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Контент скрыт визуально, но доступен скринридерам.
 *
 * @component
 * @example
 * <button type="button">
 *   <IconClose />
 *   <VisuallyHidden>Закрыть</VisuallyHidden>
 * </button>
 */
export const VisuallyHidden = ({
	children,
	as: Component = 'span',
	className,
	rootRef,
	...rest
}: VisuallyHiddenProps) => {
	const Element = Component as ElementType;
	return (
		<Element
			ref={rootRef}
			className={cn(styles.root, className)}
			{...rest}
		>
			{children}
		</Element>
	);
};
