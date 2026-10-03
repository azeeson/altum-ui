import type {ItemProps} from './Item.types';
export type {
	ItemSize,
	ItemMediaVariant,
	ItemVariant,
	ItemProps,
} from './Item.types';

import {Box} from '../Box/Box';
import {Text} from '../Text/Text';
import flexChild from '../../styles/flexChild.module.css';
import mediaItem from '../../styles/MediaItem.module.css';
import styles from './Item.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';
import {implicitAs} from '../../core/utils/implicitAs';

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
export function Item({
	size = 'md',
	variant = 'ghost',
	interactive = false,
	wrap = false,
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
	rootRef,
	...rest
}: ItemProps) {
	const resolvedAs = interactive ? implicitAs(as, onClick, role) : (as ?? 'div');
	const isButton = resolvedAs === 'button';

	return (
		<Box
			rootRef={rootRef}
			as={resolvedAs}
			variant={variant}
			className={cn(isButton && unstyled.control, styles.item, wrap && mediaItem.wrap, className)}
			onClick={onClick}
			role={role}
			data-size={size !== 'md' ? size : undefined}
			data-interactive={interactive ? '' : undefined}
			{...rest}
		>
			<div className={styles.rowLayout}>
				{media != null ? (
					<div
						className={cn(utilities.fCenter, mediaItem.media, styles.media, mediaClassName)}
						data-media-variant={mediaVariant}
					>
						{media}
					</div>
				) : null}
				{title != null || description != null ? (
					<div className={cn(utilities.fColumn, flexChild.grow, styles.body)}>
						{title != null ? (
							<Text
								as='div'
								weight='medium'
								className={cn(mediaItem.title, styles.title, titleClassName)}
							>
								{title}
							</Text>
						) : null}
						{description != null ? (
							<Text
								as='div'
								className={cn(mediaItem.description, styles.description, descriptionClassName)}
							>
								{description}
							</Text>
						) : null}
					</div>
				) : null}
				{actions != null ? (
					<div className={cn(flexChild.noShrink, styles.actions, actionsClassName)}>
						{actions}
					</div>
				) : null}
			</div>
		</Box>
	);
}
