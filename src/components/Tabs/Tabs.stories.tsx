import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Tabs, TabsProps} from './Tabs';
import {Text} from '../Text/Text';
import {Inline, Stack} from '../Layout';
import {Card} from '../Card/Card';
import {Button} from '../Button/Button';
import {TextField} from '../TextField/TextField';
import {componentParameters, story, Story} from '../../storybook/meta';

const TabExample: React.FC<Pick<TabsProps, 'variant' | 'orientation' | 'defaultValue'>> = (props) => (
	<Tabs defaultValue='profile' {...props}>
		<Tabs.List items={[
			{
				value: 'profile',
				label: 'Профиль'
			},
			{
				value: 'application',
				label: 'Приложение'
			},
			{
				value: 'notifications',
				label: 'Уведомления',
				badge: 3
			},
		]}
		/>
		<Tabs.Panel value='profile'>
			<Text size='md'>
				Контент вкладки профиля
			</Text>
		</Tabs.Panel>
		<Tabs.Panel value='application'>
			<Text size='md'>
				Контент вкладки приложения
			</Text>
		</Tabs.Panel>
		<Tabs.Panel value='notifications'>
			<Text size='md'>
				Контент вкладки уведомлений
			</Text>
		</Tabs.Panel>
	</Tabs>
);

export default {
	title: 'altum/Components/Tabs',
	component: Tabs,
	tags: ['autodocs'],
	parameters: componentParameters('Вкладки для переключения между связанными разделами контента.'),
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
			description: 'Начальная вкладка (без value не автовыбирается)',
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
	render: () => (
		<div style={{maxWidth: 480}}>
			<TabExample orientation='vertical' />
		</div>
	),
	parameters: story('Вертикальный список вкладок.'),
};

export const DisabledTab: Story<TabsProps> = {
	render: () => (
		<Tabs defaultValue='profile'>
			<Tabs.List items={[
				{
					value: 'profile',
					label: 'Профиль'
				},
				{
					value: 'billing',
					label: 'Оплата',
					disabled: true
				},
				{
					value: 'team',
					label: 'Команда'
				},
			]}
			/>
			<Tabs.Panel value='profile'>
				<Text size='sm'>
					Доступный раздел
				</Text>
			</Tabs.Panel>
			<Tabs.Panel value='billing'>
				<Text size='sm'>
					Недоступно
				</Text>
			</Tabs.Panel>
			<Tabs.Panel value='team'>
				<Text size='sm'>
					Участники
				</Text>
			</Tabs.Panel>
		</Tabs>
	),
	parameters: story('Вкладка с `disabled` не выбирается.'),
};

export const BadgeDot: Story<TabsProps> = {
	render: () => (
		<Tabs defaultValue='inbox'>
			<Tabs.List items={[
				{
					value: 'inbox',
					label: 'Входящие',
					badgeDot: true
				},
				{
					value: 'sent',
					label: 'Отправленные',
					badge: 12
				},
			]}
			/>
			<Tabs.Panel value='inbox'>
				<Text size='sm'>
					Новые письма
				</Text>
			</Tabs.Panel>
			<Tabs.Panel value='sent'>
				<Text size='sm'>
					Исходящие
				</Text>
			</Tabs.Panel>
		</Tabs>
	),
	parameters: story('`badgeDot` и `badge` на пункте списка.'),
};

export const OverflowTabs: Story<TabsProps> = {
	render: () => (
		<div style={{maxWidth: 280}}>
			<Tabs defaultValue='one'>
				<Tabs.List items={[
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
				<Tabs.Panel value='0'>
					<Text size='sm'>
						Первая вкладка
					</Text>
				</Tabs.Panel>
			</Tabs>
		</div>
	),
	parameters: story('Длинные подписи в узком контейнере — горизонтальный скролл списка.'),
};

export const Interaction: Story<TabsProps> = {
	render: function InteractionRender() {
		const [value, setValue] = useState('profile');
		return (
			<Tabs
				value={value}
				onChange={setValue}
			>
				<Tabs.List items={[
					{
						value: 'profile',
						label: 'Профиль'
					},
					{
						value: 'app',
						label: 'Приложение'
					},
				]}
				/>
				<Tabs.Panel value='profile'>
					<Text size='sm'>
						Профиль
					</Text>
				</Tabs.Panel>
				<Tabs.Panel value='app'>
					<Text size='sm'>
						Приложение
					</Text>
				</Tabs.Panel>
			</Tabs>
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
						value={tab}
						onChange={setTab}
						variant='pill'
					>
						<Tabs.List items={[
							{
								value: 'profile',
								label: 'Профиль'
							},
							{
								value: 'notify',
								label: 'Уведомления'
							},
						]}
						/>
						<Tabs.Panel value='profile'>
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
						<Tabs.Panel value='notify'>
							<Text size='sm'>
								Каналы уведомлений настраиваются отдельно.
							</Text>
						</Tabs.Panel>
					</Tabs>
				</Stack>
			</Card>
		);
	},
	parameters: story('Вкладки pill внутри карточки с полем и кнопками.'),
};
