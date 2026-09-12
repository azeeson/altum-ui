import {forwardRef} from 'react';
import {Inline} from './Inline';
import {LayoutItem} from './LayoutItem';
import type {ControlRowProps} from './Layout.types';

export type {LayoutAlign, LayoutGap, LayoutJustify, ControlRowProps} from './Layout.types';

type ControlRowComponent = typeof ControlRowInner & {
	Item: typeof LayoutItem;
};

/**
 * Ряд для смешивания контролов: TextField + Chip + Button + Select и т.п.
 *
 * @component
 * @example
 * <ControlRow align="end">
 *   <ControlRow.Item grow>
 *     <TextField label="Поиск" />
 *   </ControlRow.Item>
 *   <Button variant="primary">Найти</Button>
 * </ControlRow>
 */
const ControlRowInner = forwardRef<HTMLDivElement, ControlRowProps>(function ControlRow(props, ref) {
	return (
		<Inline
			ref={ref}
			{...props}
			role={props.role ?? 'group'}
		/>
	);
});

export const ControlRow = ControlRowInner as ControlRowComponent;

ControlRow.Item = LayoutItem;
ControlRow.displayName = 'ControlRow';
