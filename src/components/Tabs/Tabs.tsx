import type {
	TabsProps,
	TabsListProps,
	TabsPanelProps,
} from './Tabs.types';
export type {
	TabsVariant,
	TabsOrientation,
	TabsItem,
	TabsProps,
	TabsListProps,
	TabsPanelProps,
} from './Tabs.types';

import {
	createContext,
	useContext,
	useId,
	useMemo,
} from 'react';
import styles from './Tabs.module.css';
import utilities from '../../styles/utilities.module.css';
import {SegmentedControl} from '../SegmentedControl/SegmentedControl';
import {cn} from '../../core/utils/cn';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {tabPanelDomId, tabTriggerDomId} from './Tabs.utils';

type TabsContextValue = {
	tabsId: string;
	value: string;
	onChange: (value: string) => void;
	orientation: 'horizontal' | 'vertical';
	variant: 'line' | 'pill';
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(): TabsContextValue | null {
	return useContext(TabsContext);
}

const TabsList = ({
	className,
	items,
	rootRef,
	...rest
}: TabsListProps) => {
	const ctx = useTabsContext();
	const tabsId = ctx?.tabsId ?? '';
	const options = useMemo(() => items.map((item) => ({
		value: item.value,
		disabled: item.disabled,
		id: tabTriggerDomId(tabsId, item.value),
		controls: tabPanelDomId(tabsId, item.value),
		label: (
			<>
				{item.label}
				{item.badgeDot
					? <span className={styles.tabBadgeDot} aria-hidden />
					: null}
				{!item.badgeDot && item.badge != null
					? (
						<span className={cn(utilities.fCenter, styles.tabBadge)}>
							{item.badge}
						</span>
					)
					: null}
			</>
		),
	})), [items, tabsId]);

	if (ctx == null) return null;

	return (
		<SegmentedControl
			{...rest}
			rootRef={rootRef}
			className={cn(styles.tabsHeader, className)}
			options={options}
			value={ctx.value}
			onChange={ctx.onChange}
			orientation={ctx.orientation}
			variant={ctx.variant === 'pill' ? 'pill' : 'plain'}
			width='auto'
			itemRole='tab'
			aria-orientation={ctx.orientation}
		/>
	);
};

const TabsPanel = ({
	value,
	className,
	children,
	forceMount: _forceMount,
	hidden,
	rootRef,
	...rest
}: TabsPanelProps) => {
	const ctx = useTabsContext();
	const tabsId = ctx?.tabsId ?? '';
	const inactive = ctx != null && ctx.value !== value;

	return (
		<div
			ref={rootRef}
			className={cn(styles.tabPanel, className)}
			tabIndex={0}
			{...rest}
			hidden={hidden != null ? hidden : (ctx == null ? undefined : inactive)}
			role='tabpanel'
			id={tabPanelDomId(tabsId, value)}
			aria-labelledby={tabTriggerDomId(tabsId, value)}
		>
			{children}
		</div>
	);
};

/**
 * Вкладки: список — `SegmentedControl`, панели остаются здесь.
 * `line` — черта у выбранной вкладки, `pill` — заливка сегмента.
 * Активная вкладка — CSS `button[aria-selected="true"]` (без JS-трекинга бегунка).
 *
 * @component
 * @example
 * <Tabs defaultValue="info">
 *   <Tabs.List items={[{value: 'info', label: 'Инфо'}]} />
 *   <Tabs.Panel value="info"><InfoTab /></Tabs.Panel>
 * </Tabs>
 */
const TabsRoot = ({
	value: valueProp,
	defaultValue,
	onChange,
	variant = 'line',
	orientation = 'horizontal',
	className,
	children,
	rootRef,
	...rest
}: TabsProps) => {
	const tabsId = useId();
	const [value, setValue] = useControlledStateWithCallback(
		valueProp,
		defaultValue ?? '',
		onChange,
	);

	return (
		<TabsContext.Provider value={{
			tabsId,
			value,
			onChange: setValue,
			orientation,
			variant,
		}}
		>
			<div
				ref={rootRef}
				{...rest}
				className={cn(styles.tabsContainer, className)}
				data-orientation={orientation}
				data-variant={variant}
			>
				{children}
			</div>
		</TabsContext.Provider>
	);
};

export const Tabs = Object.assign(TabsRoot, {
	Root: TabsRoot,
	List: TabsList,
	Panel: TabsPanel,
});
