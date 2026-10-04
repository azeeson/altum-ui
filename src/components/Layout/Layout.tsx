import type {ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode, Ref} from 'react';
import {useRef} from 'react';
import type {
	LayoutChromeVariant,
	LayoutContentProps,
	LayoutFooterAlign,
	LayoutFooterProps,
	LayoutHeaderProps,
	LayoutRootProps,
	LayoutSpacing,
} from './Layout.types';
export type {
	LayoutChromeVariant,
	LayoutContentProps,
	LayoutFooterAlign,
	LayoutFooterProps,
	LayoutHeaderProps,
	LayoutRootProps,
	LayoutSpacing,
} from './Layout.types';

import {cn} from '../../core/utils/cn';
import {uRef} from '../../core/utils/bundle';
import {useStickyChrome} from '../../hooks/useStickyChrome';
import styles from './Layout.module.css';

interface SlotProps extends Omit<ComponentPropsWithoutRef<'div'>, 'align'> {
	as?: ElementType;
	sticky?: boolean;
	variant?: LayoutChromeVariant;
	align?: LayoutFooterAlign;
	padding?: LayoutSpacing;
	gap?: LayoutSpacing;
	rootRef?: LayoutRootProps['rootRef'];
	className?: string;
	style?: CSSProperties;
	children?: ReactNode;
}

function useChromeRef(
	rootRef: LayoutRootProps['rootRef'],
	enabled: boolean,
	edge: 'start' | 'end',
) {
	const localRef = useRef<HTMLElement>(null);
	useStickyChrome(localRef, {
		enabled,
		edge,
		offset: edge === 'start' ? 0 : 1,
	});
	return uRef(localRef, rootRef as Ref<HTMLElement> | undefined);
}

function renderSlot(
	slotClass: string,
	{
		as = 'div',
		className,
		sticky,
		variant,
		align,
		padding,
		gap,
		style,
		rootRef,
		...rest
	}: SlotProps,
) {
	const Component = as as ElementType;
	return (
		<Component
			ref={rootRef}
			{...rest}
			className={cn(slotClass, className)}
			data-padding={padding}
			data-gap={gap}
			data-sticky={sticky ? '' : undefined}
			data-variant={variant}
			data-align={align}
			style={style}
		/>
	);
}

/**
 * Корневая колонка панели: `Header` / `Content` / `Footer`.
 * Скролл живёт на корне (`overflow-y: auto`); Content не создаёт свой scrollport.
 * Закрепление шапки/подвала — через `sticky` на `Header` / `Footer`.
 * `padding` — поле секций снаружи (не scrollport: при скролле контент не заезжает в поле).
 * `gap` делится пополам: нижнее поле шапки и верхнее поле подвала, вторая половина — зазор между секциями.
 *
 * @component
 *
 * @example
 * <Layout padding="md" gap="md">
 *   <Layout.Header sticky>Заголовок</Layout.Header>
 *   <Layout.Content>Контент</Layout.Content>
 *   <Layout.Footer sticky>Действия</Layout.Footer>
 * </Layout>
 */
export const LayoutRoot = (props: LayoutRootProps) => renderSlot(styles.root, props);

/**
 * Шапка панели. `sticky` — остаётся у верхнего края при скролле `Layout`.
 *
 * @component
 * @example
 * <Layout.Header sticky as="header">Заголовок</Layout.Header>
 */
export const LayoutHeader = ({
	as = 'header',
	sticky,
	variant,
	rootRef,
	...props
}: LayoutHeaderProps) => {
	const ref = useChromeRef(rootRef, Boolean(sticky && variant), 'start');
	return renderSlot(styles.header, {
		as,
		sticky,
		variant,
		rootRef: ref,
		...props,
	});
};

/**
 * Середина между Header и Footer (без собственного overflow — скролл у `Layout`).
 *
 * @component
 * @example
 * <Layout.Content as="main">…</Layout.Content>
 */
export const LayoutContent = (props: LayoutContentProps) => renderSlot(styles.content, props);

/**
 * Подвал панели (действия, статус). `sticky` — у нижнем края при скролле `Layout`.
 *
 * @component
 * @example
 * <Layout.Footer sticky align="end" as="footer">
 *   <Button>Сохранить</Button>
 * </Layout.Footer>
 */
export const LayoutFooter = ({
	as = 'footer',
	align = 'start',
	sticky,
	variant,
	rootRef,
	...props
}: LayoutFooterProps) => {
	const ref = useChromeRef(rootRef, Boolean(sticky && variant), 'end');
	return renderSlot(styles.footer, {
		as,
		align,
		sticky,
		variant,
		rootRef: ref,
		...props,
	});
};

/**
 * Панель Header / Content / Footer.
 * `Stack`, `Inline`, `Split`, `ControlRow`, `LayoutItem` — отдельные компоненты.
 *
 * @component
 * @example
 * <Layout>
 *   <Layout.Header sticky>Заголовок</Layout.Header>
 *   <Layout.Content>Контент</Layout.Content>
 *   <Layout.Footer sticky>Действия</Layout.Footer>
 * </Layout>
 */
export const Layout = Object.assign(LayoutRoot, {
	Header: LayoutHeader,
	Content: LayoutContent,
	Footer: LayoutFooter,
});
