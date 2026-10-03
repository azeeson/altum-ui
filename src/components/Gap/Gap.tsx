import type {CSSProperties} from 'react';
import type {GapProps} from './Gap.types';
export type {GapOrientation, GapProps} from './Gap.types';

import styles from './Gap.module.css';
import {cn} from '../../core/utils/cn';
import {spacingCss} from '../../core/utils/spacing';

/**
 * Пустой зазор фиксированного размера. Ритм группы задаёт `gap` у Stack / Inline;
 * Gap — один дополнительный шаг между двумя соседями.
 *
 * @component
 */
export const Gap = ({
	size = 'md',
	orientation = 'horizontal',
	className,
	style,
	rootRef,
	...rest
}: GapProps) => (
	<div
		ref={rootRef}
		{...rest}
		className={cn(styles.root, className)}
		data-orientation={orientation}
		style={{
			'--altum-gap-size': spacingCss(size),
			...style,
		} as CSSProperties}
		aria-hidden
	/>
);
