import type {
	SidebarProps,
	SidebarHeaderProps,
	SidebarTitleProps,
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
	SidebarContentProps,
	SidebarGroupProps,
	SidebarGroupLabelProps,
	SidebarItemProps,
	SidebarFooterProps,
	SidebarMobileTriggerProps,
} from './Sidebar.types';

import {
	createContext,
	isValidElement,
	type MouseEvent,
	type ReactNode,
} from 'react';
import {useRequiredContext} from '../../hooks/useRequiredContext';
import {Layout} from '../Layout/Layout';
import {Sheet} from '../Sheet/Sheet';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Tooltip} from '../Tooltip/Tooltip';
import {Badge} from '../Badge/Badge';
import {IconMenu} from '../../icons/icons/IconMenu';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import styles from './Sidebar.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_sidebar} from '../../locales/slices/sidebar.ru';

const localeFallback = {
	sidebar: ru_sidebar,
};

const panelIcon = (
	<svg
		viewBox='0 0 16 16'
		fill='none'
		aria-hidden
	>
		<rect
			x='1.75'
			y='2.25'
			width='12.5'
			height='11.5'
			rx='1.5'
			stroke='currentColor'
			strokeWidth='1.5'
		/>
		<path
			d='M6 2.25v11.5'
			stroke='currentColor'
			strokeWidth='1.5'
		/>
	</svg>
);

interface SidebarContextValue {
	activeId: string;
	setActiveId: (id: string) => void;
	collapsed: boolean;
	mobileOpen: boolean;
	setMobileOpen: (value: boolean) => void;
	ariaLabel: string;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebarContext(component: string): SidebarContextValue {
	return useRequiredContext(
		SidebarContext,
		`${component} должен использоваться внутри Sidebar.Root`,
	);
}

/**
 * Навигационный сайдбар: collapsed, mobile drawer, `value` / `onChange`.
 * Шапка, меню и футер — `Layout`. Скролл живёт на этой колонке.
 * Кнопка сворачивания — у верхнего края правой границы (рядом с шапкой).
 * На узком экране доковую колонку прячет CSS, меню открывает `Sheet`.
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
const SidebarRoot = ({
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
	rootRef,
	...rest
}: SidebarProps) => {
	const {t} = useLocale(localeFallback);
	const resolvedAriaLabel = ariaLabel ?? t('sidebar.ariaLabel');
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
	const parts: ReactNode[] = Array.isArray(children)
		? children
		: children == null
			? []
			: [children];
	const trigger = parts.find(
		(child) => isValidElement(child) && child.type === SidebarMobileTrigger,
	);
	const content = trigger ? parts.filter((child) => child !== trigger) : parts;

	const renderAside = (placement: 'dock' | 'drawer') => (
		<aside
			ref={placement === 'dock' ? rootRef : undefined}
			className={cn(styles.sidebar, className)}
			{...rest}
			data-collapsed={collapsed ? '' : undefined}
			data-mobile-drawer={mobileDrawer ? '' : undefined}
			data-placement={placement === 'drawer' ? 'drawer' : undefined}
			{...(placement === 'dock' ? {'aria-expanded': !collapsed} : null)}
		>
			<Layout>
				{content}
			</Layout>
			<div className={styles.edgeToggle}>
				<Tooltip
					content={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
					side='right'
					openDelay={150}
				>
					<ButtonIcon
						variant='secondary'
						size='sm'
						data-shape='circle'
						aria-label={collapsed ? t('sidebar.expandSidebar') : t('sidebar.collapseSidebar')}
						aria-expanded={!collapsed}
						icon={panelIcon}
						onClick={() => {
							setCollapsed(!collapsed);
						}}
					/>
				</Tooltip>
			</div>
		</aside>
	);

	return (
		<SidebarContext.Provider value={{
			activeId,
			setActiveId,
			collapsed,
			mobileOpen,
			setMobileOpen,
			ariaLabel: resolvedAriaLabel,
		}}
		>
			{mobileDrawer ? (
				<>
					{trigger}
					<Sheet
						open={mobileOpen}
						onOpenChange={setMobileOpen}
						mode='sidebar'
						direction='start'
						width={280}
						aria-label={resolvedAriaLabel}
					>
						{renderAside('drawer')}
					</Sheet>
				</>
			) : null}
			{renderAside('dock')}
		</SidebarContext.Provider>
	);
};

const SidebarHeader = ({
	className,
	rootRef,
	...rest
}: SidebarHeaderProps) => {
	return (
		<Layout.Header
			rootRef={rootRef}
			sticky
			className={cn(styles.sidebarHeader, className)}
			{...rest}
		/>
	);
};

const SidebarTitle = ({
	className,
	rootRef,
	...rest
}: SidebarTitleProps) => {
	return (
		<span
			ref={rootRef}
			className={cn(styles.sidebarTitle, className)}
			{...rest}
		/>
	);
};

const SidebarContent = ({
	className,
	rootRef,
	...rest
}: SidebarContentProps) => {
	const {ariaLabel} = useSidebarContext('Sidebar.Content');
	return (
		<Layout.Content
			rootRef={rootRef}
			as='nav'
			className={cn(styles.sidebarMenu, className)}
			aria-label={ariaLabel}
			{...rest}
		/>
	);
};

const SidebarGroup = ({
	className,
	rootRef,
	...rest
}: SidebarGroupProps) => {
	return (
		<div
			ref={rootRef}
			className={cn(styles.group, className)}
			{...rest}
		/>
	);
};

const SidebarGroupLabel = ({
	className,
	rootRef,
	...rest
}: SidebarGroupLabelProps) => {
	return (
		<div
			ref={rootRef}
			className={cn(styles.groupLabel, className)}
			{...rest}
		/>
	);
};

const SidebarItem = ({
	value,
	icon,
	badge,
	badgeDot = false,
	children,
	className,
	disabled = false,
	onClick,
	rootRef,
	...rest
}: SidebarItemProps) => {
	const {activeId, setActiveId, collapsed} = useSidebarContext('Sidebar.Item');
	const {'aria-label': ariaLabel, ...itemRest} = rest;
	const isActive = activeId === value;
	const button = (
		<button
			ref={rootRef}
			type='button'
			className={cn(unstyled.control, styles.menuItem, className)}
			{...itemRest}
			aria-current={isActive ? 'page' : undefined}
			aria-label={collapsed && typeof children === 'string' ? children : ariaLabel}
			disabled={disabled}
			onClick={(event) => {
				onClick?.(event);
				if (event.defaultPrevented || disabled) return;
				setActiveId(value);
			}}
		>
			{icon && (
				<span className={styles.menuIcon} aria-hidden>
					{icon}
				</span>
			)}
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
		</button>
	);
	return collapsed && typeof children === 'string'
		? (
			<Tooltip
				content={children}
				side='right'
				openDelay={120}
			>
				{button}
			</Tooltip>
		)
		: button;
};

const SidebarFooter = ({
	className,
	rootRef,
	...rest
}: SidebarFooterProps) => {
	return (
		<Layout.Footer
			rootRef={rootRef}
			sticky
			className={cn(styles.sidebarFooter, className)}
			{...rest}
		/>
	);
};

const SidebarMobileTrigger = ({
	label,
	onClick,
	rootRef,
	className,
	...rest
}: SidebarMobileTriggerProps) => {
	const {t} = useLocale(localeFallback);
	const {mobileOpen, setMobileOpen} = useSidebarContext('Sidebar.MobileTrigger');
	return (
		<span className={styles.mobileTrigger}>
			<ButtonIcon
				rootRef={rootRef}
				variant='ghost'
				className={className}
				aria-label={label ?? t('sidebar.openMenu')}
				icon={<IconMenu size={20} aria-hidden />}
				{...rest}
				aria-expanded={mobileOpen}
				onClick={(event: MouseEvent<HTMLButtonElement>) => {
					onClick?.(event);
					if (!event.defaultPrevented) setMobileOpen(true);
				}}
			/>
		</span>
	);
};

/**
 * Навигационная колонка: `Header` / `Content` / `Item` / `Footer`.
 */
export const Sidebar = Object.assign(SidebarRoot, {
	Root: SidebarRoot,
	Header: SidebarHeader,
	Title: SidebarTitle,
	Content: SidebarContent,
	Group: SidebarGroup,
	GroupLabel: SidebarGroupLabel,
	Item: SidebarItem,
	Footer: SidebarFooter,
	MobileTrigger: SidebarMobileTrigger,
});
