import type {CSSProperties} from 'react';
import type {SeparatorProps} from './Separator.types';
export type {SeparatorOrientation, SeparatorSpace, SeparatorProps} from './Separator.types';

import styles from './Separator.module.css';
import {cn} from '../../core/utils/cn';
import {spacingCss} from '../../core/utils/spacing';

/**
 * Разделитель: линия ± текст, horizontal / vertical, отступы `start` / `end`.
 *
 * @component
 */
export const Separator = ({
	orientation = 'horizontal',
	decorative = false,
	children,
	start,
	end,
	className,
	style,
	rootRef,
	...rest
}: SeparatorProps) => (
	<div
		ref={rootRef}
		{...rest}
		className={cn(styles.separator, className)}
		data-orientation={orientation}
		style={{
			...(start !== undefined ? {'--altum-separator-start': spacingCss(start)} : null),
			...(end !== undefined ? {'--altum-separator-end': spacingCss(end)} : null),
			...style,
		} as CSSProperties}
		role={decorative ? 'none' : 'separator'}
		aria-orientation={decorative ? undefined : orientation}
		aria-hidden={decorative || undefined}
	>
		{children != null && children !== false && children !== '' ? (
			<span className={styles.label}>
				{children}
			</span>
		) : null}
	</div>
);
