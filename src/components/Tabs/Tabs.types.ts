import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

/** Вариант оформления вкладок. */
export type TabsVariant = 'line' | 'pill';

/** Ориентация списка вкладок. */
export type TabsOrientation = 'horizontal' | 'vertical';

/** Свойства корня `Tabs`. */
export interface TabsProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onChange' | 'defaultValue'> {
	value?: string;
	defaultValue?: string;
	onChange?: (id: string) => void;
	variant?: TabsVariant;
	orientation?: TabsOrientation;
	children: React.ReactNode;
}

/** Свойства списка триггеров `Tabs.List`. */
export type TabsListProps = ComponentPropsWithoutRef<'div'>;

/** Свойства кнопки вкладки `Tabs.Trigger`. */
export interface TabsTriggerProps extends Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	'value'
> {
	value: string;
	badge?: React.ReactNode;
	badgeDot?: boolean;
}

/** Свойства панели `Tabs.Panel`. */
export interface TabsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
	forceMount?: boolean;
}
