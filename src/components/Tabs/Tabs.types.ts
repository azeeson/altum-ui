import type {
	ComponentPropsWithoutRef,
	ReactNode,
	Ref,
	RefObject,
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

/** Свойства списка `Tabs`. Панели к нему не вложены: связь через `rootRef`. */
export interface TabsProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
	items: TabsItem[];
	value?: string;
	defaultValue?: string;
	onChange?: (id: string) => void;
	variant?: TabsVariant;
	orientation?: TabsOrientation;
	/** Узел списка. На нём `data-value` — его читает `Tabs.Panel`. */
	rootRef?: Ref<HTMLDivElement>;
}

/** Свойства панели `Tabs.Panel`. */
export interface TabsPanelProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children?: ReactNode;
	value: string;
	/** Тот же ref, что `rootRef` у `Tabs`. */
	tabsRef: RefObject<HTMLDivElement | null>;
	forceMount?: boolean;
	/** Корень панели. */
	rootRef?: Ref<HTMLDivElement>;
}
