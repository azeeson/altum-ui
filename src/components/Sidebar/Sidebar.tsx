import type {
	SidebarProps,
	SidebarHeaderProps,
	SidebarTitleProps,
	SidebarCollapseProps,
	SidebarContentProps,
	SidebarGroupProps,
	SidebarGroupLabelProps,
	SidebarItemProps,
	SidebarFooterProps,
	SidebarMobileTriggerProps,
} from './Sidebar.types';
export type {
	SidebarProps,
	SidebarHeaderProps,
	SidebarTitleProps,
	SidebarCollapseProps,
	SidebarContentProps,
	SidebarGroupProps,
	SidebarGroupLabelProps,
	SidebarItemProps,
	SidebarFooterProps,
	SidebarMobileTriggerProps,
} from './Sidebar.types';

import {
	Children,
	createContext,
	forwardRef,
	isValidElement,
	useContext,
	useMemo,
} from 'react';
import {Sheet} from '../Sheet/Sheet';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Tooltip} from '../Tooltip/Tooltip';
import {Badge} from '../Badge/Badge';
import {IconMenu} from '../../icons/icons/IconMenu';
import {IconChevronLeft} from '../../icons/icons/IconChevronLeft';
import {MOBILE_MEDIA_QUERY, useMediaQuery} from '../../hooks/useMediaQuery';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import styles from './Sidebar.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useLocale} from '../../locales/localeContext';

interface SidebarContextValue {
	activeId: string;
	setActiveId: (id: string) => void;
	collapsed: boolean;
	setCollapsed: (value: boolean) => void;
	mobileOpen: boolean;
	setMobileOpen: (value: boolean) => void;
	ariaLabel: string;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebarContext(component: string): SidebarContextValue {
	const context = useContext(SidebarContext);
	if (!context) throw new Error(`${component} должен использоваться внутри Sidebar.Root`);
	return context;
}

/**
 * Навигационный сайдбар: collapsed, mobile drawer, `value` / `onChange`.
 *
 * @component
 * @example
 * <Sidebar defaultValue="overview">
 *   <Sidebar.Header><Sidebar.Title>Приложение</Sidebar.Title></Sidebar.Header>
 *   <Sidebar.Content>
 *     <Sidebar.Item value="overview">Обзор</Sidebar.Item>
 *   </Sidebar.Content>
 * </Sidebar>
 */
const SidebarRoot = forwardRef<HTMLElement, SidebarProps>(function SidebarRoot(
	{
		children,
		value: controlledActiveId,
		defaultValue: defaultActiveId = '',
		onChange,
		className,
		'aria-label': ariaLabel,
		collapsed: controlledCollapsed,
		defaultCollapsed = false,
		onCollapsedChange,
		mobileDrawer = true,
		mobileOpen: controlledMobileOpen,
		onMobileOpenChange,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const resolvedAriaLabel = ariaLabel ?? t('sidebar.ariaLabel');
	const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
	const [activeId, setActiveId] = useControlledStateWithCallback(controlledActiveId, defaultActiveId, onChange);
	const [collapsed, setCollapsed] = useControlledStateWithCallback(
		controlledCollapsed,
		defaultCollapsed,
		onCollapsedChange,
	);
	const [mobileOpen, setMobileOpen] = useControlledStateWithCallback(
		controlledMobileOpen,
		false,
		onMobileOpenChange,
	);

	const contextValue = useMemo<SidebarContextValue>(() => ({
		activeId,
		setActiveId,
		collapsed,
		setCollapsed,
		mobileOpen,
		setMobileOpen,
		ariaLabel: resolvedAriaLabel,
	}), [
		activeId,
		collapsed,
		mobileOpen,
		resolvedAriaLabel,
		setActiveId,
		setCollapsed,
		setMobileOpen
	]);

	const childArray = Children.toArray(children);
	const trigger = childArray.find(
		(child) => isValidElement(child) && child.type === SidebarMobileTrigger,
	);
	const content = childArray.filter((child) => child !== trigger);

	if (mobileDrawer && isMobile) {
		return (
			<SidebarContext.Provider value={contextValue}>
				{trigger}
				<Sheet
					open={mobileOpen}
					onOpenChange={setMobileOpen}
					mode='sidebar'
					direction='start'
					width={280}
					backdrop
					aria-label={resolvedAriaLabel}
				>
					<aside
						ref={ref}
						className={cn(styles.sidebar, styles.mobileSidebar, className)}
						{...rest}
					>
						{content}
					</aside>
				</Sheet>
			</SidebarContext.Provider>
		);
	}

	return (
		<SidebarContext.Provider value={contextValue}>
			<aside
				ref={ref}
				className={cn(styles.sidebar, collapsed && styles.collapsed, className)}
				{...rest}
				aria-expanded={!collapsed}
			>
				{content}
			</aside>
		</SidebarContext.Provider>
	);
});

const SidebarHeader = forwardRef<HTMLElement, SidebarHeaderProps>(
	function SidebarHeader({children, className = '', ...rest}, ref) {
		return (
			<header
				ref={ref}
				className={cn(styles.sidebarHeader, className)}
				{...rest}
			>
				{children}
			</header>
		);
	},
);
SidebarHeader.displayName = 'Sidebar.Header';

const SidebarTitle = forwardRef<HTMLSpanElement, SidebarTitleProps>(
	function SidebarTitle({children, className = '', ...rest}, ref) {
		const {collapsed} = useSidebarContext('Sidebar.Title');
		if (collapsed) return null;
		return (
			<span
				ref={ref}
				className={cn(styles.sidebarTitle, className)}
				{...rest}
			>
				{children}
			</span>
		);
	},
);
SidebarTitle.displayName = 'Sidebar.Title';

const SidebarCollapse = forwardRef<HTMLButtonElement, SidebarCollapseProps>(
	function SidebarCollapse({className = '', onClick, ...rest}, ref) {
		const {t} = useLocale();
		const {collapsed, setCollapsed} = useSidebarContext('Sidebar.Collapse');
		return (
			<Tooltip
				content={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
				position='right'
				openDelay={150}
			>
				<ButtonIcon
					ref={ref}
					variant='ghost'
					className={cn(styles.toggleBtn, className)}
					aria-label={collapsed ? t('sidebar.expandSidebar') : t('sidebar.collapseSidebar')}
					icon={(
						<IconChevronLeft
							size={16}
							className={cn(styles.toggleIcon, collapsed && styles.toggleIconCollapsed)}
							aria-hidden
						/>
					)}
					onClick={composeEventHandlers(onClick, () => {
						setCollapsed(!collapsed);
					})}
					{...rest}
					aria-expanded={!collapsed}
				/>
			</Tooltip>
		);
	},
);
SidebarCollapse.displayName = 'Sidebar.Collapse';

const SidebarContent = forwardRef<HTMLElement, SidebarContentProps>(
	function SidebarContent({children, className = '', ...rest}, ref) {
		const {ariaLabel} = useSidebarContext('Sidebar.Content');
		return (
			<nav
				ref={ref}
				className={cn(styles.sidebarMenu, styles.sidebarContent, className)}
				aria-label={ariaLabel}
				{...rest}
			>
				{children}
			</nav>
		);
	},
);
SidebarContent.displayName = 'Sidebar.Content';

const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
	function SidebarGroup({children, className = '', ...rest}, ref) {
		return (
			<div
				ref={ref}
				className={cn(styles.group, className)}
				{...rest}
			>
				{children}
			</div>
		);
	},
);
SidebarGroup.displayName = 'Sidebar.Group';

const SidebarGroupLabel = forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
	function SidebarGroupLabel({children, className = '', ...rest}, ref) {
		const {collapsed} = useSidebarContext('Sidebar.GroupLabel');
		if (collapsed) return null;
		return (
			<div
				ref={ref}
				className={cn(styles.groupLabel, className)}
				{...rest}
			>
				{children}
			</div>
		);
	},
);
SidebarGroupLabel.displayName = 'Sidebar.GroupLabel';

const SidebarItem = forwardRef<HTMLButtonElement, SidebarItemProps>(
	function SidebarItem(
		{
			value,
			icon,
			badge,
			badgeDot = false,
			children,
			className = '',
			disabled = false,
			onClick,
			...rest
		},
		ref,
	) {
		const {activeId, setActiveId, collapsed} = useSidebarContext('Sidebar.Item');
		const {'aria-label': ariaLabel, ...itemRest} = rest;
		const isActive = activeId === value;
		const button = (
			<button
				ref={ref}
				type='button'
				className={cn(
					unstyled.control,
					styles.menuItem,
					isActive && styles.active,
					disabled && styles.disabled,
					className,
				)}
				{...itemRest}
				aria-current={isActive ? 'page' : undefined}
				aria-label={collapsed && typeof children === 'string' ? children : ariaLabel}
				disabled={disabled}
				onClick={composeEventHandlers(onClick, () => {
					if (!disabled) setActiveId(value);
				})}
			>
				{icon && (
					<span className={styles.menuIcon} aria-hidden>
						{icon}
					</span>
				)}
				{!collapsed && (
					<>
						<span className={styles.menuLabel}>
							{children}
						</span>
						{(badge != null || badgeDot) && (
							<span className={styles.menuBadge}>
								<Badge
									label={badge}
									dot={badgeDot}
									size='sm'
									position='standalone'
									variant='primary'
								/>
							</span>
						)}
					</>
				)}
			</button>
		);
		return collapsed && typeof children === 'string'
			? (
				<Tooltip
					content={children}
					position='right'
					openDelay={120}
				>
					{button}
				</Tooltip>
			)
			: button;
	},
);
SidebarItem.displayName = 'Sidebar.Item';

const SidebarFooter = forwardRef<HTMLElement, SidebarFooterProps>(
	function SidebarFooter({children, className = '', ...rest}, ref) {
		const {collapsed} = useSidebarContext('Sidebar.Footer');
		if (collapsed) return null;
		return (
			<footer
				ref={ref}
				className={cn(styles.sidebarFooter, className)}
				{...rest}
			>
				{children}
			</footer>
		);
	},
);
SidebarFooter.displayName = 'Sidebar.Footer';

const SidebarMobileTrigger = forwardRef<HTMLButtonElement, SidebarMobileTriggerProps>(
	function SidebarMobileTrigger({label, className = '', onClick, ...rest}, ref) {
		const {t} = useLocale();
		const {mobileOpen, setMobileOpen} = useSidebarContext('Sidebar.MobileTrigger');
		return (
			<ButtonIcon
				ref={ref}
				className={cn(styles.mobileTrigger, className)}
				variant='ghost'
				aria-label={label ?? t('sidebar.openMenu')}
				icon={<IconMenu size={20} aria-hidden />}
				onClick={composeEventHandlers(onClick, () => {
					setMobileOpen(true);
				})}
				{...rest}
				aria-expanded={mobileOpen}
			/>
		);
	},
);
SidebarMobileTrigger.displayName = 'Sidebar.MobileTrigger';

type SidebarComponent = typeof SidebarRoot & {
	Root: typeof SidebarRoot;
	Header: typeof SidebarHeader;
	Title: typeof SidebarTitle;
	Collapse: typeof SidebarCollapse;
	Content: typeof SidebarContent;
	Group: typeof SidebarGroup;
	GroupLabel: typeof SidebarGroupLabel;
	Item: typeof SidebarItem;
	Footer: typeof SidebarFooter;
	MobileTrigger: typeof SidebarMobileTrigger;
};

export const Sidebar = Object.assign(SidebarRoot, {
	Root: SidebarRoot,
	Header: SidebarHeader,
	Title: SidebarTitle,
	Collapse: SidebarCollapse,
	Content: SidebarContent,
	Group: SidebarGroup,
	GroupLabel: SidebarGroupLabel,
	Item: SidebarItem,
	Footer: SidebarFooter,
	MobileTrigger: SidebarMobileTrigger,
}) as SidebarComponent;

SidebarRoot.displayName = 'Sidebar';
