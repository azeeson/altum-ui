import type {OverflowProps} from './Overflow.types';
export type {
	OverflowProps,
	OverflowItemProps,
	OverflowDisplay,
	OverflowFit,
	OverflowGap,
} from './Overflow.types';

import React, {forwardRef} from 'react';
import {OverflowItem, OverflowMode} from './OverflowActionsMode';
import {OverflowMeasure} from './OverflowMeasure';
import {ActionSheetTrigger} from '../ActionSheetTrigger/ActionSheetTrigger';

function splitOverflowChildren(children: React.ReactNode): {
	items: React.ReactNode[];
	extra: React.ReactNode[];
} {
	const items: React.ReactNode[] = [];
	const extra: React.ReactNode[] = [];
	React.Children.forEach(children, (child) => {
		if (React.isValidElement(child) && child.type === OverflowItem) {
			items.push(child);
		} else if (child != null && child !== false) {
			extra.push(child);
		}
	});
	return {
		items,
		extra
	};
}

type OverflowComponent = React.ForwardRefExoticComponent<
	OverflowProps & React.RefAttributes<HTMLDivElement>
> & {
	Item: typeof OverflowItem;
};

/**
 * Overflow: лишние пункты уходят за ⋯.
 *
 * - дети `Overflow.Item` — панель действий (`visibleCount`, `display`);
 * - произвольные дети — измерение ширины (`fit`, `maxVisible`, `gap`).
 * - `longPress` — long-press по хосту открывает меню (лишние дети — контент строки).
 *
 * @component
 * @example
 * <Overflow visibleCount={2}>
 *   <Overflow.Item label="Изменить" onSelect={…} />
 *   <Overflow.Item label="Удалить" onSelect={…} />
 * </Overflow>
 * @example
 * <Overflow fit="container" gap="sm">
 *   <Chip>React</Chip>
 *   <Chip>TypeScript</Chip>
 * </Overflow>
 */
export const Overflow = Object.assign(
	forwardRef<HTMLDivElement, OverflowProps>(function Overflow(props, ref) {
		const {
			longPress = false,
			longPressMs,
			moveThreshold,
			showOverflowTrigger,
			children,
			className,
			...rest
		} = props;
		const {items, extra} = splitOverflowChildren(children);
		const hasItems = items.length > 0;
		const resolvedShowTrigger = showOverflowTrigger ?? !longPress;

		const inner = hasItems
			? (
				<OverflowMode
					ref={longPress ? undefined : ref}
					{...rest}
					showOverflowTrigger={resolvedShowTrigger}
					className={longPress ? undefined : className}
				>
					{items}
				</OverflowMode>
			)
			: (
				<OverflowMeasure
					ref={longPress ? undefined : ref}
					{...rest}
					showOverflowTrigger={resolvedShowTrigger}
					className={longPress ? undefined : className}
				>
					{children}
				</OverflowMeasure>
			);

		if (!longPress) {
			return inner;
		}

		return (
			<ActionSheetTrigger
				ref={ref}
				className={className}
				showOverflowTrigger={resolvedShowTrigger}
				longPressMs={longPressMs}
				moveThreshold={moveThreshold}
			>
				{hasItems ? extra : null}
				{inner}
			</ActionSheetTrigger>
		);
	}),
	{Item: OverflowItem},
) as OverflowComponent;

Overflow.displayName = 'Overflow';
