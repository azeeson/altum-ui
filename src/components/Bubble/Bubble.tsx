import type {
	BubbleProps,
} from './Bubble.types';
export type {
	BubbleVariant,
	BubbleAlign,
	BubbleReaction,
	BubbleProps,
} from './Bubble.types';

import {forwardRef, useId, useState, type CSSProperties} from 'react';
import unstyled from '../../styles/unstyledControl.module.css';
import styles from './Bubble.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../../locales/localeContext';

/**
 * Пузырь сообщения в переписке.
 *
 * @component
 * @example
 * <Bubble variant="outgoing">Готово к ревью</Bubble>
 */
export const Bubble = forwardRef<HTMLDivElement, BubbleProps>(function Bubble(
	{
		children,
		variant = 'default',
		align,
		group = 'single',
		meta,
		reactions,
		collapsible = false,
		collapsedLines = 4,
		expandLabel,
		collapseLabel,
		className,
		style,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const [expanded, setExpanded] = useState(false);
	const contentId = useId();
	const resolvedAlign = align ?? (variant === 'outgoing' ? 'end' : 'start');

	return (
		<div
			ref={ref}
			className={cn(
				styles.wrap,
				resolvedAlign === 'end' ? styles.alignEnd : '',
				collapsible ? styles.collapsible : '',
				className,
			)}
			style={collapsible
				? {
					['--altum-bubble-lines' as string]: collapsedLines,
					...style,
				} as CSSProperties
				: style}
			{...rest}
		>
			{meta && (
				<div className={styles.meta}>
					{meta}
				</div>
			)}
			<div className={cn(styles.bubble, styles[variant], styles[`group_${group}`])}>
				<div id={contentId} className={styles.body}>
					{children}
				</div>
				{collapsible && (
					<button
						type='button'
						className={cn(unstyled.control, styles.toggle)}
						aria-expanded={expanded}
						aria-controls={contentId}
						onClick={() => setExpanded((value) => !value)}
					>
						{expanded ? collapseLabel ?? t('bubble.collapse') : expandLabel ?? t('bubble.expand')}
					</button>
				)}
			</div>
			{reactions && reactions.length > 0 && (
				<div
					className={styles.reactions}
					role='group'
					aria-label={t('bubble.reactions')}
				>
					{reactions.map((reaction) => (
						<button
							key={reaction.emoji}
							type='button'
							className={cn(
								unstyled.control,
								styles.reaction,
								reaction.active ? styles.reactionActive : '',
							)}
							onClick={reaction.onClick}
							aria-pressed={reaction.active}
							aria-label={
								reaction.count != null && reaction.count > 0
									? `${reaction.emoji} ${reaction.count}`
									: reaction.emoji
							}
						>
							<span aria-hidden>
								{reaction.emoji}
							</span>
							{reaction.count != null && reaction.count > 0 && (
								<span className={styles.reactionCount}>
									{reaction.count}
								</span>
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
});

Bubble.displayName = 'Bubble';
