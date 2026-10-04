import type {HeaderProps} from './Header.types';
export type {HeaderProps} from './Header.types';

import type {TextProps} from '../Text/Text.types';
import type {TitleProps} from '../Title/Title.types';
import type {TabsProps} from '../Tabs/Tabs.types';
import {Text} from '../Text/Text';
import {Title} from '../Title/Title';
import {Tabs} from '../Tabs/Tabs';
import {cn} from '../../core/utils/cn';
import styles from './Header.module.css';

/**
 * Шапка страницы: заголовок, подзаголовок и вкладки в одной колонке.
 * Корень — `div`, чтобы вставать внутрь `Layout.Header`.
 * Внутри `Layout` черта вкладок на всю ширину панели, подписи на линии заголовка.
 *
 * @component
 * @example
 * <Header>
 *   <Header.Title>Настройки</Header.Title>
 *   <Header.Subtitle>Профиль и доступ</Header.Subtitle>
 *   <Header.Tabs items={[{value: 'profile', label: 'Профиль'}]} />
 * </Header>
 */
export const HeaderRoot = ({
	className,
	rootRef,
	...rest
}: HeaderProps) => (
	<div
		ref={rootRef}
		data-page-header=''
		className={cn(styles.header, className)}
		{...rest}
	/>
);

/** Заголовок шапки. Семантика `h1`, кегль плотнее отдельного `Title`. */
export const HeaderTitle = ({
	className,
	level = 3,
	...rest
}: TitleProps) => (
	<Title
		level={level}
		className={cn(styles.title, className)}
		{...rest}
	/>
);

/** Подзаголовок под `Header.Title`. */
export const HeaderSubtitle = ({
	className,
	size = 'sm',
	color = 'secondary',
	...rest
}: TextProps) => (
	<Text
		size={size}
		color={color}
		className={className}
		{...rest}
	/>
);

/** Вкладки `line` на всю ширину шапки, без нижнего отступа списка. */
export const HeaderTabs = ({
	className,
	variant = 'line',
	...rest
}: TabsProps) => (
	<Tabs
		{...rest}
		variant={variant}
		className={cn(styles.tabs, className)}
		data-chrome=''
	/>
);

export const Header = Object.assign(HeaderRoot, {
	Title: HeaderTitle,
	Subtitle: HeaderSubtitle,
	Tabs: HeaderTabs,
});
