import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	ReactNode,
	Ref,
} from 'react';

/** Вариант оформления вкладок. */
export type TabsVariant = 'line' | 'pill';

/** Ориентация списка вкладок. */
export type TabsOrientation = 'horizontal' | 'vertical';

/** Пункт списка вкладок. */
export interface TabsItem {
	value: string;
	label: ReactNode;
	disabled?: boolean;
	badge?: ReactNode;
	badgeDot?: boolean;
}

/** Свойства корня `Tabs`. */
export interface TabsProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onChange' | 'defaultValue'> {
	value?: string;
	defaultValue?: string;
	onChange?: (id: string) => void;
	variant?: TabsVariant;
	orientation?: TabsOrientation;
	children: React.ReactNode;
	/** Корень вкладок. */
	rootRef?: Ref<HTMLDivElement>;
}

/** Свойства списка триггеров `Tabs.List`. */
export interface TabsListProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	items: TabsItem[];
	/** Корень списка. */
	rootRef?: Ref<HTMLDivElement>;
}

/** Свойства кнопки вкладки `Tabs.Trigger`. Список задаётся `items` у `Tabs.List`. */
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
	/** Корень панели. */
	rootRef?: Ref<HTMLDivElement>;
}
