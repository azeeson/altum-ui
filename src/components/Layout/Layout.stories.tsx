import type {Meta} from '@storybook/react';
import React from 'react';
import {Layout, type LayoutRootProps} from './Layout';
import {Stack} from './Stack';
import {Button} from '../Button/Button';
import {TextField} from '../TextField/TextField';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

const panelShellStyle: React.CSSProperties = {
	height: 280,
	border: '1px solid var(--altum-color-border)',
	borderRadius: 'var(--altum-g-radius)',
	overflow: 'hidden',
	background: 'var(--altum-color-surface)',
};

const headerStyle: React.CSSProperties = {
	padding: 'var(--altum-g-space-3)',
	borderBottom: '1px solid var(--altum-color-border)',
	background: 'var(--altum-color-surface)',
};

const footerStyle: React.CSSProperties = {
	padding: 'var(--altum-g-space-3)',
	borderTop: '1px solid var(--altum-color-border)',
	background: 'var(--altum-color-surface)',
};

const contentLines = (count: number) => (
	<Stack gap='sm'>
		{Array.from({length: count}, (_, index) => (
			<Text key={index} size='sm'>
				Строка контента
				{' '}
				{index + 1}
			</Text>
		))}
	</Stack>
);

export default {
	title: 'altum/Components/Layout',
	component: Layout,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Каркас панели: скролл на `Layout`, Header / Footer опционально `sticky`. '
		+ 'Слоты Header / Content / Footer; примитивы Stack / Inline / Split / Grid — отдельные экспорты.',
	),
	argTypes: {
		as: {
			control: {
				type: 'select',
				options: [
					'div',
					'section',
					'article',
					'main'
				],
			},
			description: 'HTML-тег корня панели',
		},
	},
} satisfies Meta<typeof Layout>;

export const StickyChrome: Story<LayoutRootProps> = {
	name: 'Sticky Header / Footer',
	render: () => (
		<div style={panelShellStyle}>
			<Layout>
				<Layout.Header sticky style={headerStyle}>
					<Text size='md'>
						Header (sticky)
					</Text>
				</Layout.Header>
				<Layout.Content style={{padding: 'var(--altum-g-space-3)'}}>
					{contentLines(16)}
				</Layout.Content>
				<Layout.Footer
					sticky
					align='end'
					style={footerStyle}
				>
					<Button size='sm' variant='secondary'>
						Отмена
					</Button>
					<Button size='sm' variant='primary'>
						OK
					</Button>
				</Layout.Footer>
			</Layout>
		</div>
	),
	parameters: story(
		'Скролл у `Layout`. `Header` / `Footer` с `sticky` остаются у краёв viewport панели.',
	),
};

export const FlowScroll: Story<LayoutRootProps> = {
	name: 'Header / Footer скроллятся с контентом',
	render: () => (
		<div style={panelShellStyle}>
			<Layout>
				<Layout.Header style={headerStyle}>
					<Text size='md'>
						Header (в потоке)
					</Text>
				</Layout.Header>
				<Layout.Content style={{padding: 'var(--altum-g-space-3)'}}>
					{contentLines(16)}
				</Layout.Content>
				<Layout.Footer
					align='end'
					style={footerStyle}
				>
					<Button size='sm' variant='secondary'>
						Отмена
					</Button>
					<Button size='sm' variant='primary'>
						OK
					</Button>
				</Layout.Footer>
			</Layout>
		</div>
	),
	parameters: story(
		'Скролл у `Layout`. Без `sticky` шапка и футер уезжают вместе с контентом.',
	),
};

export const Playground: Story<LayoutRootProps> = {
	render: StickyChrome.render,
	parameters: story('По умолчанию — sticky chrome (см. также Flow scroll).'),
};

export const FooterAlign: Story<LayoutRootProps> = {
	render: () => (
		<Stack gap='md'>
			{([
				'start',
				'center',
				'end',
				'space-between'
			] as const).map((align) => (
				<div
					key={align}
					style={{
						...panelShellStyle,
						height: 160
					}}
				>
					<Layout>
						<Layout.Header style={headerStyle}>
							<Text size='sm'>
								align=
								{align}
							</Text>
						</Layout.Header>
						<Layout.Content style={{padding: 'var(--altum-g-space-3)'}}>
							<Text size='sm'>
								Контент
							</Text>
						</Layout.Content>
						<Layout.Footer
							align={align}
							style={footerStyle}
						>
							<Button size='sm' variant='secondary'>
								Отмена
							</Button>
							<Button size='sm' variant='primary'>
								OK
							</Button>
						</Layout.Footer>
					</Layout>
				</div>
			))}
		</Stack>
	),
	parameters: story('Выравнивание действий в `Layout.Footer`.'),
};

export const Empty: Story<LayoutRootProps> = {
	render: () => (
		<div style={{
			...panelShellStyle,
			height: 140
		}}
		>
			<Layout>
				<Layout.Content style={{padding: 'var(--altum-g-space-3)'}}>
					<Text size='sm' color='muted'>
						Только Content, без Header / Footer.
					</Text>
				</Layout.Content>
			</Layout>
		</div>
	),
	parameters: story('Минимальная панель без chrome.'),
};

export const CompoundLayout: Story<LayoutRootProps> = {
	render: () => (
		<Stack gap='md'>
			<Text size='sm' color='muted'>
				Примитивы `Stack` / `Layout.Inline` рядом с панелью.
			</Text>
			<Layout.Inline gap='sm'>
				<Button variant='primary' size='sm'>
					A
				</Button>
				<Button variant='tinted' size='sm'>
					B
				</Button>
				<Button variant='secondary' size='sm'>
					C
				</Button>
			</Layout.Inline>
			<Layout.ControlRow>
				<Layout.Item grow>
					<TextField label='Заметка' width='full' />
				</Layout.Item>
				<Button variant='tinted'>
					Сохранить
				</Button>
			</Layout.ControlRow>
		</Stack>
	),
	parameters: story('`Stack` отдельно; `Layout.Inline` / `ControlRow` / `Item` — слоты панели.'),
};

export const UsageExample: Story<LayoutRootProps> = {
	render: StickyChrome.render,
	parameters: story('Панель настроек со sticky chrome и кнопками в футере.'),
};
