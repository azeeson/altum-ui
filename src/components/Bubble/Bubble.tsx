import type {
	BubbleProps,
} from './Bubble.types';
export type {
	BubbleVariant,
	BubbleAlign,
	BubbleReaction,
	BubbleProps,
} from './Bubble.types';

import {useRef, useState, type CSSProperties, type MouseEvent} from 'react';
import styles from './Bubble.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import {cn} from '../../core/utils/cn';
import {useFallbackId} from '../../hooks/useFallbackId';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_bubble} from '../../locales/slices/bubble.ru';

const localeFallback = {
	bubble: ru_bubble,
};

/** Атрибут эмодзи на кнопке реакции. Клик читает его с контейнера. */
export const BUBBLE_REACTION_ATTR = 'data-reaction-emoji';

/**
 * Пузырь сообщения в переписке.
 *
 * @component
 * @example
 * <Bubble variant="outgoing">Готово к ревью</Bubble>
 */
export const Bubble = ({
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
	rootRef,
	...rest
}: BubbleProps) => {
	const {t} = useLocale(localeFallback);
	const [expanded, setExpanded] = useState(false);
	const contentId = useFallbackId();
	const reactionsRef = useRef(reactions);
	reactionsRef.current = reactions;
	const resolvedAlign = align ?? (variant === 'outgoing' ? 'end' : 'start');

	const handleReactionClick = (event: MouseEvent<HTMLDivElement>) => {
		const target = (event.target as HTMLElement).closest(`[${BUBBLE_REACTION_ATTR}]`);
		if (target == null) return;
		const emoji = target.getAttribute(BUBBLE_REACTION_ATTR);
		reactionsRef.current?.find((reaction) => reaction.emoji === emoji)?.onClick?.();
	};

	return (
		<div
			ref={rootRef}
			className={cn(styles.wrap, className)}
			data-align={resolvedAlign}
			data-group={group}
			data-collapsible={collapsible ? '' : undefined}
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
			<div
				className={styles.bubble}
				data-variant={variant}
			>
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
					onClick={handleReactionClick}
				>
					{reactions.map((reaction) => {
						const hasCount = reaction.count != null && reaction.count > 0;
						return (
							<button
								key={reaction.emoji}
								type='button'
								className={cn(unstyled.control, styles.reaction)}
								aria-pressed={reaction.active}
								data-active={reaction.active ? '' : undefined}
								aria-label={hasCount ? `${reaction.emoji} ${reaction.count}` : reaction.emoji}
								{...{[BUBBLE_REACTION_ATTR]: reaction.emoji}}
							>
								<span aria-hidden>
									{reaction.emoji}
								</span>
								{hasCount && (
									<span className={styles.reactionCount}>
										{reaction.count}
									</span>
								)}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};
