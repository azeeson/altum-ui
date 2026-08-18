import type {
	TabsProps,
	TabsListProps,
	TabsTriggerProps,
	TabsPanelProps,
} from './Tabs.types';
export type {
	TabsVariant,
	TabsOrientation,
	TabsProps,
	TabsListProps,
	TabsTriggerProps,
	TabsPanelProps,
} from './Tabs.types';

import React, {createContext, forwardRef, useContext, useId} from 'react';
import styles from './Tabs.module.css';
import {SelectionGroup, useSelectionGroupContext} from '../SelectionGroup/SelectionGroup';
import {cn} from '../../utils/cn';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';

const TabsIdContext = createContext<string>('');

function useTabsId(): string {
	return useContext(TabsIdContext);
}

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
	{className, children, ...rest},
	ref,
) {
	const {orientation} = useSelectionGroupContext('Tabs.List');
	return (
		<SelectionGroup.List
			ref={ref}
			className={cn(styles.tabsHeader, className)}
			{...rest}
			role='tablist'
			aria-orientation={orientation}
		>
			{children}
		</SelectionGroup.List>
	);
});

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
	{
		value,
		badge,
		badgeDot = false,
		disabled = false,
		className,
		children,
		...rest
	},
	ref,
) {
	const {value: activeId} = useSelectionGroupContext('Tabs.Trigger');
	const tabsId = useTabsId();
	const isActive = activeId === value;
	return (
		<SelectionGroup.Item
			ref={ref}
			value={value}
			id={`${tabsId}-tab-${value}`}
			disabled={disabled}
			className={cn(styles.tab, isActive ? styles.active : '', disabled ? styles.disabled : '', className)}
			{...rest}
			role='tab'
			aria-selected={isActive}
			aria-controls={`${tabsId}-tabpanel-${value}`}
		>
			<span className={styles.tabLabel}>
				{children}
			</span>
			{(badgeDot || badge != null) && (
				badgeDot
					? <span className={styles.tabBadgeDot} aria-hidden />
					: <span className={styles.tabBadge}>
						{badge}
					</span>
			)}
		</SelectionGroup.Item>
	);
});

const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(function TabsPanel(
	{
		value,
		className,
		children,
		...rest
	},
	ref,
) {
	const tabsId = useTabsId();
	return (
		<SelectionGroup.Panel
			ref={ref}
			value={value}
			className={cn(styles.tabPanel, className)}
			tabIndex={0}
			{...rest}
			role='tabpanel'
			id={`${tabsId}-tabpanel-${value}`}
			aria-labelledby={`${tabsId}-tab-${value}`}
		>
			{children}
		</SelectionGroup.Panel>
	);
});

/**
 * Вкладки на базе SelectionGroup с декларативными List, Trigger и Panel.
 * Состояние читается из SelectionGroup context (отдельный TabsContext не нужен).
 *
 * @component
 * @example
 * <Tabs defaultValue="info">
 *   <Tabs.List><Tabs.Trigger value="info">Инфо</Tabs.Trigger></Tabs.List>
 *   <Tabs.Panel value="info"><InfoTab /></Tabs.Panel>
 * </Tabs>
 */
function findFirstTriggerValue(children: React.ReactNode): string | undefined {
	let found: string | undefined;
	React.Children.forEach(children, (child) => {
		if (found != null || !React.isValidElement(child)) return;
		const type = child.type as {displayName?: string};
		if (type === TabsTrigger || type?.displayName === 'Tabs.Trigger') {
			found = (child.props as TabsTriggerProps).value;
			return;
		}
		const nested = (child.props as {children?: React.ReactNode}).children;
		if (nested != null) {
			found = findFirstTriggerValue(nested);
		}
	});
	return found;
}

const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(function TabsRoot(
	{
		value: controlledActiveId,
		defaultValue: defaultActiveId,
		onChange,
		variant = 'line',
		orientation = 'horizontal',
		className,
		children,
		...rest
	},
	ref,
) {
	const tabsId = useId();
	const fallbackId = defaultActiveId || findFirstTriggerValue(children) || '';
	const [activeId, setActiveId] = useControlledStateWithCallback(
		controlledActiveId,
		fallbackId,
		onChange,
	);
	return (
		<TabsIdContext.Provider value={tabsId}>
			<SelectionGroup.Root
				ref={ref}
				value={activeId}
				onChange={setActiveId}
				orientation={orientation}
				className={cn(
					styles.tabsContainer,
					variant === 'pill' ? styles.pill : '',
					orientation === 'vertical' ? styles.vertical : '',
					className,
				)}
				{...rest}
			>
				{children}
			</SelectionGroup.Root>
		</TabsIdContext.Provider>
	);
});

TabsRoot.displayName = 'Tabs';
TabsList.displayName = 'Tabs.List';
TabsTrigger.displayName = 'Tabs.Trigger';
TabsPanel.displayName = 'Tabs.Panel';

type TabsComponent = React.ForwardRefExoticComponent<
	TabsProps & React.RefAttributes<HTMLDivElement>
> & {
	Root: typeof TabsRoot;
	List: typeof TabsList;
	Trigger: typeof TabsTrigger;
	Panel: typeof TabsPanel;
};

export const Tabs = Object.assign(TabsRoot, {
	Root: TabsRoot,
	List: TabsList,
	Trigger: TabsTrigger,
	Panel: TabsPanel,
}) as TabsComponent;
