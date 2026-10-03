import type {ReactElement} from 'react';
import type {ControlRowProps} from './Layout.types';
export type {LayoutAlign, LayoutGap, LayoutJustify, ControlRowProps} from './Layout.types';

import {Inline} from './Inline';
import {LayoutItem} from './LayoutItem';

type ControlRowComponent = {
	(props: ControlRowProps): ReactElement;
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
export const ControlRow: ControlRowComponent = Object.assign(
	function ControlRow({
		role,
		rootRef,
		...props
	}: ControlRowProps) {
		return (
			<Inline
				rootRef={rootRef}
				{...props}
				role={role ?? 'group'}
			/>
		);
	},
	{Item: LayoutItem},
);
