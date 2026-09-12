import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Sidebar, type SidebarProps} from './Sidebar';
import {Button} from '../Button/Button';
import {Text} from '../Text/Text';
import {Card} from '../Card/Card';
import {Stack} from '../Layout/Layout';
import {IconBox} from '../../icons/icons/IconBox';
import {IconCard} from '../../icons/icons/IconCard';
import {IconGear} from '../../icons/icons/IconGear';
import {IconGraphBar} from '../../icons/icons/IconGraphBar';
import {IconUserGroup} from '../../icons/icons/IconUserGroup';
import {componentParameters, story, Story} from '../../storybook/meta';

const NAV_ICON = 18;

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
						icon={<IconGraphBar size={NAV_ICON} />}
					>
						Обзор
					</Sidebar.Item>
					<Sidebar.Item
						value='orders'
						icon={<IconBox size={NAV_ICON} />}
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
						icon={<IconUserGroup size={NAV_ICON} />}
					>
						Команда
					</Sidebar.Item>
					<Sidebar.Item
						value='billing'
						icon={<IconCard size={NAV_ICON} />}
					>
						Биллинг
					</Sidebar.Item>
				</Sidebar.Group>
			</Sidebar.Content>
		</Sidebar>
	);
}

const frameStyle: React.CSSProperties = {
	display: 'flex',
	height: 400,
	background: 'var(--altum-color-bg)',
};

export default {
	title: 'altum/Components/Sidebar',
	component: Sidebar,
	tags: ['autodocs'],
	parameters: componentParameters('Составная боковая навигация с десктопным rail и мобильным Sheet.'),
	argTypes: {
		collapsed: {control: 'boolean'},
		mobileDrawer: {control: 'boolean'},
		onChange: {action: 'onChange'},
		onCollapsedChange: {action: 'onCollapsedChange'},
	},
} satisfies Meta<typeof Sidebar>;

export const Playground: Story<SidebarProps> = {
	render: function PlaygroundRender() {
		const [active, setActive] = useState('overview');
		return (
			<div style={frameStyle}>
				<SidebarNavigation value={active} onChange={setActive} />
			</div>
		);
	},
	parameters: story('Соберите навигацию из Header, Content, Group и Item.'),
};

export const Collapsed: Story<SidebarProps> = {
	render: function CollapsedRender() {
		const [active, setActive] = useState('overview');
		return (
			<div style={frameStyle}>
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
							icon={<IconGraphBar size={NAV_ICON} />}
						>
							Обзор
						</Sidebar.Item>
						<Sidebar.Item
							value='settings'
							icon={<IconGear size={NAV_ICON} />}
						>
							Настройки
						</Sidebar.Item>
					</Sidebar.Content>
				</Sidebar>
			</div>
		);
	},
	parameters: story('Свернутый rail оставляет иконки и tooltip.'),
};

export const WithFooter: Story<SidebarProps> = {
	render: function WithFooterRender() {
		const [active, setActive] = useState('overview');
		return (
			<div style={frameStyle}>
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
			</div>
		);
	},
	parameters: story('Футер — независимый нижний слот составного API.'),
};

export const Disabled: Story<SidebarProps> = {
	render: function DisabledRender() {
		const [active, setActive] = useState('overview');
		return (
			<div style={frameStyle}>
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
						<Sidebar.Item
							value='overview'
							icon={<IconGraphBar size={NAV_ICON} />}
						>
							Обзор
						</Sidebar.Item>
						<Sidebar.Item
							value='billing'
							icon={<IconCard size={NAV_ICON} />}
							disabled
						>
							Биллинг
						</Sidebar.Item>
					</Sidebar.Content>
				</Sidebar>
			</div>
		);
	},
	parameters: story('Пункт с native `disabled` недоступен.'),
};

export const OverflowText: Story<SidebarProps> = {
	render: function OverflowRender() {
		const [active, setActive] = useState('overview');
		return (
			<div style={{
				...frameStyle,
				width: 240,
			}}
			>
				<Sidebar
					value={active}
					onChange={setActive}
					mobileDrawer={false}
				>
					<Sidebar.Header>
						<Sidebar.Title>
							Административная панель водоканала
						</Sidebar.Title>
						<Sidebar.Collapse />
					</Sidebar.Header>
					<Sidebar.Content>
						<Sidebar.Item
							value='overview'
							icon={<IconGraphBar size={NAV_ICON} />}
						>
							Обзор производственных показателей за квартал
						</Sidebar.Item>
					</Sidebar.Content>
				</Sidebar>
			</div>
		);
	},
	parameters: story('Длинные Title и подпись пункта в узком rail.'),
};

export const UsageExample: Story<SidebarProps> = {
	render: function UsageExampleRender() {
		const [active, setActive] = useState('overview');
		const titles: Record<string, string> = {
			overview: 'Обзор',
			orders: 'Заказы',
			team: 'Команда',
		};
		return (
			<div style={{
				display: 'flex',
				height: 360,
				border: '1px solid var(--altum-color-border)',
				borderRadius: 'var(--altum-g-radius)',
				overflow: 'hidden',
			}}
			>
				<Sidebar
					value={active}
					onChange={setActive}
					mobileDrawer={false}
				>
					<Sidebar.Header>
						<Sidebar.Title>
							Кабинет
						</Sidebar.Title>
						<Sidebar.Collapse />
					</Sidebar.Header>
					<Sidebar.Content>
						<Sidebar.Item
							value='overview'
							icon={<IconGraphBar size={NAV_ICON} />}
						>
							Обзор
						</Sidebar.Item>
						<Sidebar.Item
							value='orders'
							icon={<IconBox size={NAV_ICON} />}
							badge={3}
						>
							Заказы
						</Sidebar.Item>
						<Sidebar.Item
							value='team'
							icon={<IconUserGroup size={NAV_ICON} />}
						>
							Команда
						</Sidebar.Item>
					</Sidebar.Content>
				</Sidebar>
				<div style={{
					flex: 1,
					padding: 'var(--altum-g-space-4)',
					background: 'var(--altum-color-bg)',
				}}
				>
					<Card variant='outlined'>
						<Stack gap='sm'>
							<Text weight='bold'>
								{titles[active]}
							</Text>
							<Text size='sm' color='muted'>
								Контент раздела рядом с навигацией.
							</Text>
						</Stack>
					</Card>
				</div>
			</div>
		);
	},
	parameters: story('Сайдбар и карточка контента в каркасе кабинета.'),
};

export const Interaction: Story<SidebarProps> = {
	render: function InteractionRender() {
		const [active, setActive] = useState('overview');
		return (
			<div style={frameStyle}>
				<SidebarNavigation value={active} onChange={setActive} />
			</div>
		);
	},
	play: async ({canvasElement}) => {
		const orders = Array.from(canvasElement.querySelectorAll('button'))
			.find((button) => button.textContent?.includes('Заказы'));
		orders?.click();
	},
	parameters: story('Play: выбор пункта «Заказы».'),
};
