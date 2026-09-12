import {forwardRef, type CSSProperties} from 'react';
import {As} from '../../base/As';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';
import styles from './Layout.module.css';
import {ControlRow} from './ControlRow';
import {Inline} from './Inline';
import {LayoutItem} from './LayoutItem';
import {Split} from './Split';
import type {
	LayoutContentProps,
	LayoutFooterAlign,
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

const FOOTER_JUSTIFY: Record<LayoutFooterAlign, CSSProperties['justifyContent']> = {
	start: 'flex-start',
	center: 'center',
	end: 'flex-end',
	'space-between': 'space-between',
};

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
	{as = 'div', className, ...rest},
	ref,
) {
	return (
		<As
			ref={ref}
			as={as}
			className={cn(styles.root, className)}
			{...rest}
		/>
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
	{as = 'header', className, sticky = false, ...rest},
	ref,
) {
	return (
		<As
			ref={ref}
			as={as}
			className={cn(styles.header, sticky && styles.sticky, className)}
			{...rest}
		/>
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
	{as = 'div', className, ...rest},
	ref,
) {
	return (
		<As
			ref={ref}
			as={as}
			className={cn(styles.content, className)}
			{...rest}
		/>
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
		as = 'footer',
		className,
		sticky = false,
		align = 'start',
		style,
		...rest
	},
	ref,
) {
	return (
		<As
			ref={ref}
			as={as}
			className={cn(styles.footer, sticky && styles.sticky, className)}
			style={mergeStyles({justifyContent: FOOTER_JUSTIFY[align]}, style)}
			{...rest}
		/>
	);
});

LayoutRoot.displayName = 'Layout';
LayoutHeader.displayName = 'Layout.Header';
LayoutContent.displayName = 'Layout.Content';
LayoutFooter.displayName = 'Layout.Footer';

/**
 * Панель Header / Content / Footer. Примитивы `Stack` / `Grid` — отдельные экспорты.
 *
 * @component
 * @example
 * <Layout>
 *   <Layout.Header sticky>Заголовок</Layout.Header>
 *   <Layout.Content>
 *     <Stack gap="md">…</Stack>
 *   </Layout.Content>
 *   <Layout.Footer sticky>Действия</Layout.Footer>
 * </Layout>
 */
export const Layout = Object.assign(LayoutRoot, {
	Header: LayoutHeader,
	Content: LayoutContent,
	Footer: LayoutFooter,
	Inline,
	Split,
	ControlRow,
	Item: LayoutItem,
});
