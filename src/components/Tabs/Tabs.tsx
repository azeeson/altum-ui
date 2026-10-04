import type {RefObject} from 'react';
import type {TabsPanelProps, TabsProps} from './Tabs.types';
export type {TabsVariant, TabsOrientation, TabsItem, TabsProps, TabsPanelProps} from './Tabs.types';

import {
	useId,
	useLayoutEffect,
	useMemo,
	useState,
} from 'react';
import styles from './Tabs.module.css';
import utilities from '../../styles/utilities.module.css';
import {SegmentedControl} from '../SegmentedControl/SegmentedControl';
import {cn} from '../../core/utils/cn';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {tabPanelDomId, tabTriggerDomId} from './Tabs.utils';

interface TabsLink {
	value: string;
	id: string;
}

/** Активная вкладка и id списка читаются с DOM-узла `Tabs`, без контекста. */
function useTabsLink(tabsRef: RefObject<HTMLDivElement | null>): TabsLink {
	const [link, setLink] = useState<TabsLink>({
		value: '',
		id: ''
	});

	useLayoutEffect(() => {
		let observer: MutationObserver | undefined;
		let frame = 0;
		const bind = () => {
			const node = tabsRef.current;
			if (!node) {
				frame = requestAnimationFrame(bind);
				return;
			}
			const sync = () => {
				setLink({
					value: node.getAttribute('data-value') ?? '',
					id: node.id,
				});
			};
			sync();
			observer = new MutationObserver(sync);
			observer.observe(node, {
				attributes: true,
				attributeFilter: ['data-value'],
			});
		};
		bind();
		return () => {
			cancelAnimationFrame(frame);
			observer?.disconnect();
		};
	}, [tabsRef]);

	return link;
}

const TabsPanel = ({
	value,
	tabsRef,
	className,
	children,
	forceMount: _forceMount,
	hidden,
	rootRef,
	...rest
}: TabsPanelProps) => {
	const link = useTabsLink(tabsRef);
	const inactive = link.value !== value;

	return (
		<div
			ref={rootRef}
			className={cn(styles.tabPanel, className)}
			tabIndex={0}
			{...rest}
			hidden={hidden != null ? hidden : inactive}
			role='tabpanel'
			id={link.id ? tabPanelDomId(link.id, value) : undefined}
			aria-labelledby={link.id ? tabTriggerDomId(link.id, value) : undefined}
		>
			{children}
		</div>
	);
};

/**
 * Список вкладок. Панели — отдельные `Tabs.Panel` с тем же `rootRef`.
 * `line` — черта у выбранной вкладки, `pill` — заливка сегмента.
 * Активное значение лежит в `data-value` на корне, без контекста.
 *
 * @component
 * @example
 * const tabsRef = useRef<HTMLDivElement>(null);
 * <Tabs rootRef={tabsRef} items={[{value: 'info', label: 'Инфо'}]} />
 * <Tabs.Panel tabsRef={tabsRef} value="info"><InfoTab /></Tabs.Panel>
 */
const TabsRoot = ({
	items,
	value: valueProp,
	defaultValue,
	onChange,
	variant = 'line',
	orientation = 'horizontal',
	className,
	rootRef,
	id: idProp,
	...rest
}: TabsProps) => {
	const autoId = useId();
	const tabsId = idProp ?? autoId;
	const fallback = items.find((item) => !item.disabled)?.value ?? '';
	const [value, setValue] = useControlledStateWithCallback(
		valueProp,
		defaultValue ?? fallback,
		onChange,
	);
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

	return (
		<div
			{...rest}
			ref={rootRef}
			id={tabsId}
			className={cn(styles.tabs, className)}
			data-value={value}
			data-orientation={orientation !== 'horizontal' ? orientation : undefined}
			data-variant={variant !== 'line' ? variant : undefined}
		>
			<SegmentedControl
				className={styles.tabsHeader}
				options={options}
				value={value}
				onChange={setValue}
				orientation={orientation}
				variant={variant === 'pill' ? 'pill' : 'plain'}
				width='auto'
				itemRole='tab'
				aria-orientation={orientation}
			/>
		</div>
	);
};

export const Tabs = Object.assign(TabsRoot, {
	Panel: TabsPanel,
});
