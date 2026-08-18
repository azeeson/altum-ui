import type {
	SeparatorProps,
	SpacerProps,
} from './Separator.types';
export type {
	SeparatorOrientation,
	SeparatorSpace,
	SeparatorProps,
	SpacerProps,
} from './Separator.types';

import {forwardRef} from 'react';
import styles from './Separator.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';
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
	const hasLabel = children != null && children !== false && children !== '';
	const startCss = start !== undefined ? resolveSpacingCss(start) : undefined;
	const endCss = end !== undefined ? resolveSpacingCss(end) : undefined;

	const marginStyle: React.CSSProperties = {};
	if (orientation === 'horizontal') {
		if (startCss !== undefined) marginStyle.marginBlockStart = startCss;
		if (endCss !== undefined) marginStyle.marginBlockEnd = endCss;
	} else {
		if (startCss !== undefined) marginStyle.marginInlineStart = startCss;
		if (endCss !== undefined) marginStyle.marginInlineEnd = endCss;
	}

	return (
		<div
			ref={ref}
			className={cn(
				styles.separator,
				orientation === 'vertical' ? styles.vertical : styles.horizontal,
				hasLabel ? styles.withLabel : styles.line,
				className,
			)}
			{...rest}
			style={mergeStyles(marginStyle, style)}
			role={decorative ? 'none' : 'separator'}
			aria-orientation={decorative ? undefined : orientation}
			aria-hidden={decorative ? true : undefined}
		>
			{hasLabel ? (
				<span className={styles.label}>
					{children}
				</span>
			) : null}
		</div>
	);
});

Separator.displayName = 'Separator';

/**
 * Алиас: горизонтальный разделитель с отступами `md` (бывший `Spacer`).
 *
 * @component
 * @example
 * <Spacer>или</Spacer>
 */
export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(function Spacer(
	{
		children,
		className,
		start = 'md',
		end = 'md',
		decorative = true,
		style,
	},
	ref,
) {
	return (
		<Separator
			ref={ref}
			className={className}
			start={start}
			end={end}
			decorative={decorative}
			style={style}
		>
			{children}
		</Separator>
	);
});

Spacer.displayName = 'Spacer';
