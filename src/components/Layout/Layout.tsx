import type {ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode} from 'react';
import type {
	LayoutContentProps,
	LayoutFooterAlign,
	LayoutFooterProps,
	LayoutHeaderProps,
	LayoutRootProps,
	LayoutSpacing,
} from './Layout.types';
export type {
	LayoutContentProps,
	LayoutFooterAlign,
	LayoutFooterProps,
	LayoutHeaderProps,
	LayoutRootProps,
	LayoutSpacing,
} from './Layout.types';

import {cn} from '../../core/utils/cn';
import styles from './Layout.module.css';

interface SlotProps extends Omit<ComponentPropsWithoutRef<'div'>, 'align'> {
	as?: ElementType;
	sticky?: boolean;
	align?: LayoutFooterAlign;
	padding?: LayoutSpacing;
	gap?: LayoutSpacing;
	rootRef?: LayoutRootProps['rootRef'];
	className?: string;
	style?: CSSProperties;
	children?: ReactNode;
}

function renderSlot(
	slotClass: string,
	{
		as = 'div',
		className,
		sticky,
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
			data-align={align}
			style={style}
		/>
	);
}

/**
 * Корневая колонка панели: `Header` / `Content` / `Footer`.
 * Скролл живёт на корне (`overflow-y: auto`); Content не создаёт свой scrollport.
 * Закрепление шапки/подвала — через `sticky` на `Header` / `Footer`.
 * `padding` — отступ секций (не scrollport: при скролле контент не заезжает в поле).
 * `gap` — промежуток между секциями; у `sticky` он остаётся и при скролле. Оба через data-атрибуты.
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
	...props
}: LayoutHeaderProps) => renderSlot(styles.header, {
	as,
	...props,
});

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
	...props
}: LayoutFooterProps) => renderSlot(styles.footer, {
	as,
	align,
	...props,
});

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
