import type {ItemProps, ItemSize} from './Item.types';
export type {
	ItemSize,
	ItemMediaVariant,
	ItemVariant,
	ItemProps,
} from './Item.types';

import {forwardRef} from 'react';
import {Flex} from '../../base/Flex';
import {Box} from '../Box/Box';
import flexChild from '../../styles/flexChild.module.css';
import mediaItem from '../../styles/MediaItem.module.css';
import styles from './Item.module.css';
import {cn} from '../../utils/cn';
import {implicitAs} from '../../utils/implicitAs';
import type {SpacingValue} from '../../types/spacing';

const ROW_GAP = {
	sm: 'sm',
	md: 'md',
	lg: 'md',
} as const satisfies Record<ItemSize, SpacingValue>;

const BODY_GAP = {
	sm: 'none',
	md: 'var(--altum-control-inset)',
	lg: 'var(--altum-control-inset)',
} as const satisfies Record<ItemSize, SpacingValue>;

/**
 * Строка списка: media, title, description, actions.
 *
 * @component
 * @example
 * <Item
 *   size="sm"
 *   interactive
 *   onClick={() => {}}
 *   media="📁"
 *   title="Документы"
 * />
 */
export const Item = forwardRef<HTMLDivElement, ItemProps>(function Item(
	{
		size = 'md',
		variant = 'ghost',
		interactive = false,
		as,
		media,
		mediaVariant = 'icon',
		mediaClassName,
		title,
		titleClassName,
		description,
		descriptionClassName,
		actions,
		actionsClassName,
		className,
		onClick,
		role,
		...rest
	},
	ref,
) {
	const resolvedAs = interactive ? implicitAs(as, onClick, role) : (as ?? 'div');

	if (
		process.env.NODE_ENV !== 'production'
		&& interactive
		&& onClick != null
		&& resolvedAs !== 'button'
		&& resolvedAs !== 'a'
		&& role !== 'button'
	) {
		console.warn(
			'Item: interactive + onClick на корне, который не является кнопкой. '
			+ 'Передайте as="button" или вложите Button вместо onClick на div.',
		);
	}

	return (
		<Box
			ref={ref}
			as={resolvedAs}
			variant={variant}
			padding='none'
			className={cn(
				styles.item,
				size !== 'md' && styles[size],
				interactive && styles.interactive,
				className,
			)}
			onClick={onClick}
			role={role}
			{...rest}
		>
			<Flex
				align='center'
				gap={ROW_GAP[size]}
				wrap={false}
			>
				{media != null ? (
					<div
						className={cn(
							mediaItem.media,
							styles.media,
							styles[`media_${mediaVariant}`],
							mediaClassName,
						)}
					>
						{media}
					</div>
				) : null}
				{title != null || description != null ? (
					<Flex
						direction='column'
						gap={BODY_GAP[size]}
						wrap={false}
						className={cn(flexChild.grow, styles.body)}
					>
						{title != null ? (
							<div className={cn(mediaItem.title, styles.title, titleClassName)}>
								{title}
							</div>
						) : null}
						{description != null ? (
							<div className={cn(mediaItem.description, styles.description, descriptionClassName)}>
								{description}
							</div>
						) : null}
					</Flex>
				) : null}
				{actions != null ? (
					<Flex
						align='center'
						gap='xs'
						wrap={false}
						className={cn(flexChild.noShrink, styles.actions, actionsClassName)}
					>
						{actions}
					</Flex>
				) : null}
			</Flex>
		</Box>
	);
});

Item.displayName = 'Item';
