import type {
	SeparatorProps,
} from './Separator.types';
export type {
	SeparatorOrientation,
	SeparatorSpace,
	SeparatorProps,
} from './Separator.types';

import {forwardRef, type CSSProperties} from 'react';
import styles from './Separator.module.css';
import {cn} from '../../utils/cn';
import {resolveSpacingCss} from '../../utils/spacing';

/**
 * Разделитель: линия ± текст, horizontal / vertical, отступы `start` / `end`.
 *
 * @component
 * @example
 * <Separator />
 * <Separator orientation="vertical" />
 * <Separator start="md" end="md">или</Separator>
 */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
	{
		orientation = 'horizontal',
		decorative = false,
		children,
		start,
		end,
		className,
		style,
		...rest
	},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.separator, styles[orientation], className)}
			{...rest}
			style={{
				...(start !== undefined ? {'--altum-separator-start': resolveSpacingCss(start)} : null),
				...(end !== undefined ? {'--altum-separator-end': resolveSpacingCss(end)} : null),
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
});

Separator.displayName = 'Separator';
