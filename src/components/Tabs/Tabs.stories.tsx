import type {Meta} from '@storybook/react';
import React from 'react';
import {Tabs, TabsProps} from './Tabs';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

const TabExample: React.FC<Pick<TabsProps, 'variant' | 'orientation'>> = (props) => (
	<Tabs defaultValue='profile' {...props}>
		<Tabs.List>
			<Tabs.Trigger value='profile'>
				Профиль
			</Tabs.Trigger>
			<Tabs.Trigger value='application'>
				Приложение
			</Tabs.Trigger>
			<Tabs.Trigger value='notifications' badge={3}>
				Уведомления
			</Tabs.Trigger>
		</Tabs.List>
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
	title: 'altum-ui/Components/Tabs',
	component: Tabs,
	tags: ['autodocs'],
	parameters: componentParameters('Вкладки для переключения между связанными разделами контента.'),
	argTypes: {
		variant: {
			control: {type: 'select'},
			options: ['line', 'pill'],
			description: 'line — подчёркивание; pill — segmented-трек',
		},
	},
} satisfies Meta<typeof Tabs>;

export const Playground: Story<TabsProps> = {
	render: (args) => <TabExample {...args} />,
	args: {variant: 'line'},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Variants: Story<TabsProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			gap: 'var(--altum-g-space-6)',
		}}
		>
			<div>
				<Text size='sm' color='muted'>
					variant=line
				</Text>
				<TabExample variant='line' />
			</div>
			<div>
				<Text size='sm' color='muted'>
					variant=pill
				</Text>
				<TabExample variant='pill' />
			</div>
		</div>
	),
	parameters: story('Сравнение `line` и `pill`.'),
};
