import type {Meta} from '@storybook/react';
import React, {useRef, useState} from 'react';
import type {RefObject} from 'react';
import {Tabs, type TabsItem, type TabsProps} from './Tabs';
import {Text} from '../Text/Text';
import {Inline, Stack} from '../Layout';
import {Card} from '../Card/Card';
import {Button} from '../Button/Button';
import {TextField} from '../TextField/TextField';
import {componentParameters, story, Story} from '../../storybook/meta';

const PROFILE_ITEMS: TabsItem[] = [
	{
		value: 'profile',
		label: 'Профиль',
	},
	{
		value: 'application',
		label: 'Приложение',
	},
	{
		value: 'notifications',
		label: 'Уведомления',
		badge: 3,
	},
];

function ProfilePanels({tabsRef}: {tabsRef: RefObject<HTMLDivElement | null>}) {
	return (
		<>
			<Tabs.Panel tabsRef={tabsRef} value='profile'>
				<Text size='md'>
					Контент вкладки профиля
				</Text>
			</Tabs.Panel>
			<Tabs.Panel tabsRef={tabsRef} value='application'>
				<Text size='md'>
					Контент вкладки приложения
				</Text>
			</Tabs.Panel>
			<Tabs.Panel tabsRef={tabsRef} value='notifications'>
				<Text size='md'>
					Контент вкладки уведомлений
				</Text>
			</Tabs.Panel>
		</>
	);
}

const TabExample: React.FC<Pick<TabsProps, 'variant' | 'orientation' | 'defaultValue'>> = (props) => {
	const tabsRef = useRef<HTMLDivElement>(null);
	return (
		<Stack gap='md'>
			<Tabs
				rootRef={tabsRef}
				items={PROFILE_ITEMS}
				defaultValue='profile'
				{...props}
			/>
			<ProfilePanels tabsRef={tabsRef} />
		</Stack>
	);
};

export default {
	title: 'altum/Components/Tabs',
	component: Tabs,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Список вкладок и панели рядом. Связь через `rootRef` / `tabsRef`, без контекста.',
	),
	argTypes: {
		variant: {
			control: {type: 'select'},
			options: ['line', 'pill'],
			description: 'line — подчёркивание; pill — segmented-трек',
		},
		orientation: {
			control: {type: 'select'},
			options: ['horizontal', 'vertical'],
		},
		defaultValue: {
			control: 'text',
			description: 'Начальная вкладка. Без value и defaultValue выбирается первый доступный пункт.',
		},
		onChange: {
			action: 'change',
			description: 'Смена активной вкладки',
		},
	},
} satisfies Meta<typeof Tabs>;

export const Playground: Story<TabsProps> = {
	render: (args) => <TabExample {...args} />,
	args: {
		variant: 'line',
		orientation: 'horizontal',
		defaultValue: 'profile',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Variants: Story<TabsProps> = {
	render: () => (
		<Stack gap='lg'>
			<Stack gap='xs'>
				<Text size='sm' color='muted'>
					variant=line
				</Text>
				<TabExample variant='line' />
			</Stack>
			<Stack gap='xs'>
				<Text size='sm' color='muted'>
					variant=pill
				</Text>
				<TabExample variant='pill' />
			</Stack>
		</Stack>
	),
	parameters: story('Сравнение `line` и `pill`.'),
};

export const Vertical: Story<TabsProps> = {
	render: function VerticalRender() {
		const tabsRef = useRef<HTMLDivElement>(null);
		return (
			<div style={{
				display: 'flex',
				alignItems: 'flex-start',
				gap: 'var(--altum-g-space-4)',
				maxWidth: 480,
			}}
			>
				<Tabs
					rootRef={tabsRef}
					items={PROFILE_ITEMS}
					defaultValue='profile'
					orientation='vertical'
				/>
				<ProfilePanels tabsRef={tabsRef} />
			</div>
		);
	},
	parameters: story('Вертикальный список. Панели ставит вызывающий код, не сам `Tabs`.'),
};

export const DisabledTab: Story<TabsProps> = {
	render: function DisabledTabRender() {
		const tabsRef = useRef<HTMLDivElement>(null);
		return (
			<Stack gap='md'>
				<Tabs
					rootRef={tabsRef}
					defaultValue='profile'
					items={[
						{
							value: 'profile',
							label: 'Профиль',
						},
						{
							value: 'billing',
							label: 'Оплата',
							disabled: true,
						},
						{
							value: 'team',
							label: 'Команда',
						},
					]}
				/>
				<Tabs.Panel tabsRef={tabsRef} value='profile'>
					<Text size='sm'>
						Доступный раздел
					</Text>
				</Tabs.Panel>
				<Tabs.Panel tabsRef={tabsRef} value='billing'>
					<Text size='sm'>
						Недоступно
					</Text>
				</Tabs.Panel>
				<Tabs.Panel tabsRef={tabsRef} value='team'>
					<Text size='sm'>
						Участники
					</Text>
				</Tabs.Panel>
			</Stack>
		);
	},
	parameters: story('Вкладка с `disabled` не выбирается.'),
};

export const BadgeDot: Story<TabsProps> = {
	render: function BadgeDotRender() {
		const tabsRef = useRef<HTMLDivElement>(null);
		return (
			<Stack gap='md'>
				<Tabs
					rootRef={tabsRef}
					defaultValue='inbox'
					items={[
						{
							value: 'inbox',
							label: 'Входящие',
							badgeDot: true,
						},
						{
							value: 'sent',
							label: 'Отправленные',
							badge: 12,
						},
					]}
				/>
				<Tabs.Panel tabsRef={tabsRef} value='inbox'>
					<Text size='sm'>
						Новые письма
					</Text>
				</Tabs.Panel>
				<Tabs.Panel tabsRef={tabsRef} value='sent'>
					<Text size='sm'>
						Исходящие
					</Text>
				</Tabs.Panel>
			</Stack>
		);
	},
	parameters: story('`badgeDot` и `badge` на пункте списка.'),
};

export const OverflowTabs: Story<TabsProps> = {
	render: function OverflowTabsRender() {
		const tabsRef = useRef<HTMLDivElement>(null);
		return (
			<div style={{maxWidth: 280}}>
				<Stack gap='md'>
					<Tabs
						rootRef={tabsRef}
						defaultValue='0'
						items={[
							'Обзор',
							'Настройки безопасности',
							'Интеграции и API',
							'Журнал аудита',
							'Биллинг',
						].map((label, index) => ({
							value: String(index),
							label,
						}))}
					/>
					<Tabs.Panel tabsRef={tabsRef} value='0'>
						<Text size='sm'>
							Первая вкладка
						</Text>
					</Tabs.Panel>
				</Stack>
			</div>
		);
	},
	parameters: story('Длинные подписи в узком контейнере — горизонтальный скролл списка.'),
};

export const Interaction: Story<TabsProps> = {
	render: function InteractionRender() {
		const tabsRef = useRef<HTMLDivElement>(null);
		const [value, setValue] = useState('profile');
		return (
			<Stack gap='md'>
				<Tabs
					rootRef={tabsRef}
					value={value}
					onChange={setValue}
					items={[
						{
							value: 'profile',
							label: 'Профиль',
						},
						{
							value: 'app',
							label: 'Приложение',
						},
					]}
				/>
				<Tabs.Panel tabsRef={tabsRef} value='profile'>
					<Text size='sm'>
						Профиль
					</Text>
				</Tabs.Panel>
				<Tabs.Panel tabsRef={tabsRef} value='app'>
					<Text size='sm'>
						Приложение
					</Text>
				</Tabs.Panel>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		const app = Array.from(canvasElement.querySelectorAll('[role="tab"]'))
			.find((tab) => tab.textContent?.includes('Приложение')) as HTMLButtonElement | undefined;
		app?.click();
		app?.focus();
	},
	parameters: story('Play выбирает вкладку «Приложение» и ставит фокус.'),
};

export const UsageExample: Story<TabsProps> = {
	render: function UsageExampleRender() {
		const tabsRef = useRef<HTMLDivElement>(null);
		const [tab, setTab] = useState('profile');
		return (
			<Card
				style={{maxWidth: 420}}
				header={(
					<Text weight='bold'>
						Настройки аккаунта
					</Text>
				)}
			>
				<Stack gap='md'>
					<Tabs
						rootRef={tabsRef}
						value={tab}
						onChange={setTab}
						variant='pill'
						items={[
							{
								value: 'profile',
								label: 'Профиль',
							},
							{
								value: 'notify',
								label: 'Уведомления',
							},
						]}
					/>
					<Tabs.Panel tabsRef={tabsRef} value='profile'>
						<Stack gap='sm'>
							<TextField
								label='Имя'
								defaultValue='Алексей'
							/>
							<Inline gap='sm'>
								<Button size='sm'>
									Сохранить
								</Button>
								<Button
									size='sm'
									variant='ghost'
								>
									Отмена
								</Button>
							</Inline>
						</Stack>
					</Tabs.Panel>
					<Tabs.Panel tabsRef={tabsRef} value='notify'>
						<Text size='sm'>
							Каналы уведомлений настраиваются отдельно.
						</Text>
					</Tabs.Panel>
				</Stack>
			</Card>
		);
	},
	parameters: story('Вкладки pill внутри карточки с полем и кнопками.'),
};
