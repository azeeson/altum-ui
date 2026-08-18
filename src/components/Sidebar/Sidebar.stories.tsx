/* eslint-disable @stylistic/indent -- Существующий отступ фикстуры Storybook сохранён для вложенного JSX. */
import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Sidebar, type SidebarProps} from './Sidebar';
import {Button} from '../Button/Button';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

function SidebarNavigation({value, onChange}: Pick<SidebarProps, 'value' | 'onChange'>) {
	return (
		<Sidebar
			value={value}
			onChange={onChange}
			mobileDrawer={false}
		>
			<Sidebar.Header>
				<Sidebar.Title>
					Админка
				</Sidebar.Title>
				<Sidebar.Collapse />
			</Sidebar.Header>
			<Sidebar.Content>
				<Sidebar.Group>
					<Sidebar.GroupLabel>
						Основное
					</Sidebar.GroupLabel>
					<Sidebar.Item
						value='overview'
						icon={(
							<span aria-hidden>
								📊
							</span>
						)}
					>
						Обзор
					</Sidebar.Item>
					<Sidebar.Item
						value='orders'
						icon={(
							<span aria-hidden>
								📦
							</span>
						)}
						badge={12}
					>
						Заказы
					</Sidebar.Item>
				</Sidebar.Group>
				<Sidebar.Group>
					<Sidebar.GroupLabel>
						Настройки
					</Sidebar.GroupLabel>
					<Sidebar.Item
						value='team'
						icon={(
							<span aria-hidden>
								👥
							</span>
						)}
					>
						Команда
					</Sidebar.Item>
					<Sidebar.Item
						value='billing'
						icon={(
							<span aria-hidden>
								💳
							</span>
						)}
					>
						Биллинг
					</Sidebar.Item>
				</Sidebar.Group>
			</Sidebar.Content>
		</Sidebar>
	);
}

export default {
	title: 'altum/Components/Sidebar',
	component: Sidebar,
	tags: ['autodocs'],
	parameters: componentParameters('Составная боковая навигация с десктопным rail и мобильным Sheet.'),
} satisfies Meta<typeof Sidebar>;

export const Playground: Story<SidebarProps> = {
	render: function PlaygroundRender() {
		const [active, setActive] = useState('overview');
		return (<div style={{
			display: 'flex',
			height: 400,
			background: 'var(--altum-color-bg)'
		}}
		        >
			<SidebarNavigation value={active} onChange={setActive} />
		</div>);
	},
	parameters: story('Соберите навигацию из Header, Content, Group и Item.'),
};

export const Collapsed: Story<SidebarProps> = {
	render: function CollapsedRender() {
		const [active, setActive] = useState('overview');
		return (<div style={{
			display: 'flex',
			height: 400,
			background: 'var(--altum-color-bg)'
		}}
		        >
			<Sidebar
				defaultCollapsed
				value={active}
				onChange={setActive}
				mobileDrawer={false}
			>
				<Sidebar.Header>
					<Sidebar.Title>
						Админка
					</Sidebar.Title>
					<Sidebar.Collapse />
				</Sidebar.Header>
				<Sidebar.Content>
					<Sidebar.Item
						value='overview'
						icon={(
							<span aria-hidden>
								📊
							</span>
						)}
					>
						Обзор
					</Sidebar.Item>
					<Sidebar.Item
						value='settings'
						icon={(
							<span aria-hidden>
								⚙️
							</span>
						)}
					>
						Настройки
					</Sidebar.Item>
				</Sidebar.Content>
			</Sidebar>
		</div>);
	},
	parameters: story('Свернутый rail оставляет иконки и tooltip.'),
};

export const WithFooter: Story<SidebarProps> = {
	render: function WithFooterRender() {
		const [active, setActive] = useState('overview');
		return (<div style={{
			display: 'flex',
			height: 400,
			background: 'var(--altum-color-bg)'
		}}
		        >
			<Sidebar
				value={active}
				onChange={setActive}
				mobileDrawer={false}
			>
				<Sidebar.Header>
					<Sidebar.Title>
						Админка
					</Sidebar.Title>
					<Sidebar.Collapse />
				</Sidebar.Header>
				<Sidebar.Content>
					<Sidebar.Item value='overview'>
						Обзор
					</Sidebar.Item>
				</Sidebar.Content>
				<Sidebar.Footer>
					<Text size='sm' color='secondary'>
						alex@example.com
					</Text>
					<Button
						variant='ghost'
						size='sm'
						fullWidth
					>
						Выйти
					</Button>
				</Sidebar.Footer>
			</Sidebar>
		</div>);
	},
	parameters: story('Футер — независимый нижний слот составного API.'),
};
