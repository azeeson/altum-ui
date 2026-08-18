import type {
	ComponentPropsWithoutRef,
	ReactNode,
} from 'react';

export type {ActionListGroup as CommandPaletteGroup, ActionListItem as CommandPaletteItem} from '../ActionList/ActionList.types';

/** Свойства корня `CommandPalette`. */
export interface CommandPaletteRootProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'title'> {
	open: boolean;
	onClose: () => void;
	onOpenChange?: (open: boolean) => void;
	children: ReactNode;
	title?: string;
	className?: string;
}

/** Свойства поля поиска `CommandPalette.Input`. */
export interface CommandPaletteInputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'children'> {
	placeholder?: string;
}

/** Свойства списка результатов `CommandPalette.List`. */
export interface CommandPaletteListProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children: ReactNode;
}

/** Свойства слота `CommandPalette.Empty`. */
export interface CommandPaletteEmptyProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children?: ReactNode;
}

/** Свойства слота `CommandPalette.Footer`. */
export interface CommandPaletteFooterProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children: ReactNode;
}
