import type {
	CollapseProps,
} from './Collapse.types';
export type {
	CollapseProps,
} from './Collapse.types';

import type {ComponentPropsWithoutRef, Ref} from 'react';
import styles from './Collapse.module.css';
import {cn} from '../../core/utils/cn';

type CollapseRootProps = ComponentPropsWithoutRef<'div'> & {
	ref?: Ref<HTMLDivElement>;
	inert?: boolean;
};

/**
 * Плавное раскрытие и сворачивание блока по высоте.
 * Анимация гасится системным `prefers-reduced-motion`.
 * Закрытый блок исключается из Tab и скринридеров атрибутом `inert`.
 *
 * @component
 * @example
 * <Collapse open={expanded}>
 *   <p>Дополнительные детали секции</p>
 * </Collapse>
 */
export function Collapse({
	open,
	children,
	className,
	rootRef,
	...rest
}: CollapseProps) {
	const rootProps: CollapseRootProps = {
		...rest,
		ref: rootRef,
		className: cn(styles.root, className),
		'aria-hidden': !open,
		inert: !open || undefined,
	};

	return (
		<div
			{...rootProps}
			data-expanded={open ? '' : undefined}
		>
			<div className={styles.inner}>
				{children}
			</div>
		</div>
	);
}
