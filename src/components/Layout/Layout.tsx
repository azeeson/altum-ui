import {forwardRef, type ElementType} from 'react';
import {Grid, GridItem} from '../Grid/Grid';
import {cn} from '../../utils/cn';
import styles from './Layout.module.css';
import {ControlRow} from './ControlRow';
import {Inline} from './Inline';
import {LayoutItem} from './LayoutItem';
import {Split} from './Split';
import {Stack} from './Stack';
import type {
	LayoutContentProps,
	LayoutFooterProps,
	LayoutHeaderProps,
	LayoutRootProps,
} from './Layout.types';

export type {
	LayoutAlign,
	LayoutContentProps,
	LayoutFooterAlign,
	LayoutFooterProps,
	LayoutGap,
	LayoutHeaderProps,
	LayoutJustify,
	LayoutRootProps,
} from './Layout.types';
export {LayoutItem} from './LayoutItem';
export type {LayoutItemProps} from './Layout.types';
export {Stack} from './Stack';
export type {StackProps} from './Layout.types';
export {Inline} from './Inline';
export type {InlineProps} from './Layout.types';
export {Split} from './Split';
export type {SplitProps} from './Layout.types';
export {ControlRow} from './ControlRow';
export type {ControlRowProps} from './Layout.types';

/**
 * Корневая колонка панели: `Header` / `Content` / `Footer`.
 * Скролл живёт на корне (`overflow-y: auto`); Content не создаёт свой scrollport.
 * Закрепление шапки/подвала — через `sticky` на `Header` / `Footer`.
 *
 * @component
 * @example
 * <Layout>
 *   <Layout.Header sticky>Заголовок</Layout.Header>
 *   <Layout.Content>Контент</Layout.Content>
 *   <Layout.Footer sticky>Действия</Layout.Footer>
 * </Layout>
 */
export const LayoutRoot = forwardRef<HTMLElement, LayoutRootProps>(function LayoutRoot(
	{
		children,
		className,
		as: Component = 'div',
		style,
		...rest
	},
	ref,
) {
	const Element = Component as ElementType;

	return (
		<Element
			ref={ref as never}
			className={cn(styles.root, className)}
			style={style}
			{...rest}
		>
			{children}
		</Element>
	);
});

/**
 * Шапка панели. `sticky` — остаётся у верхнего края при скролле `Layout`.
 *
 * @component
 * @example
 * <Layout.Header sticky as="header">Заголовок</Layout.Header>
 */
export const LayoutHeader = forwardRef<HTMLElement, LayoutHeaderProps>(function LayoutHeader(
	{
		children,
		className,
		sticky = false,
		as: Component = 'header',
		style,
		...rest
	},
	ref,
) {
	const Element = Component as ElementType;

	return (
		<Element
			ref={ref as never}
			className={cn(
				styles.header,
				sticky && styles.headerSticky,
				className,
			)}
			style={style}
			{...rest}
		>
			{children}
		</Element>
	);
});

/**
 * Середина между Header и Footer (без собственного overflow — скролл у `Layout`).
 *
 * @component
 * @example
 * <Layout.Content as="main">…</Layout.Content>
 */
export const LayoutContent = forwardRef<HTMLElement, LayoutContentProps>(function LayoutContent(
	{
		children,
		className,
		as: Component = 'div',
		style,
		...rest
	},
	ref,
) {
	const Element = Component as ElementType;

	return (
		<Element
			ref={ref as never}
			className={cn(styles.content, className)}
			style={style}
			{...rest}
		>
			{children}
		</Element>
	);
});

/**
 * Подвал панели (действия, статус). `sticky` — у нижнего края при скролле `Layout`.
 *
 * @component
 * @example
 * <Layout.Footer sticky align="end" as="footer">
 *   <Button>Сохранить</Button>
 * </Layout.Footer>
 */
export const LayoutFooter = forwardRef<HTMLElement, LayoutFooterProps>(function LayoutFooter(
	{
		children,
		className,
		sticky = false,
		align = 'start',
		as: Component = 'footer',
		style,
		...rest
	},
	ref,
) {
	const Element = Component as ElementType;

	return (
		<Element
			ref={ref as never}
			className={cn(
				styles.footer,
				styles[`footerAlign_${align}`],
				sticky && styles.footerSticky,
				className,
			)}
			style={style}
			{...rest}
		>
			{children}
		</Element>
	);
});

LayoutRoot.displayName = 'Layout';
LayoutHeader.displayName = 'Layout.Header';
LayoutContent.displayName = 'Layout.Content';
LayoutFooter.displayName = 'Layout.Footer';

/**
 * Панель Header / Content / Footer + namespace к layout-примитивам.
 *
 * @component
 * @example
 * <Layout>
 *   <Layout.Header sticky>Заголовок</Layout.Header>
 *   <Layout.Content>
 *     <Layout.Stack gap="md">…</Layout.Stack>
 *   </Layout.Content>
 *   <Layout.Footer sticky>Действия</Layout.Footer>
 * </Layout>
 */
export const Layout = Object.assign(LayoutRoot, {
	Header: LayoutHeader,
	Content: LayoutContent,
	Footer: LayoutFooter,
	Stack,
	Inline,
	Split,
	ControlRow,
	Item: LayoutItem,
	Grid,
	GridItem,
});
