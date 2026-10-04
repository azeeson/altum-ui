import type {Meta} from '@storybook/react';
import React, {useRef, useState} from 'react';
import {Header, type HeaderProps} from './Header';
import {Tabs} from '../Tabs/Tabs';
import {Text} from '../Text/Text';
import {Stack} from '../Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

const ITEMS = [
	{
		value: 'profile',
		label: 'Профиль',
	},
	{
		value: 'app',
		label: 'Приложение',
	},
	{
		value: 'notifications',
		label: 'Уведомления',
	},
];

export default {
	title: 'altum/Components/Header',
	component: Header,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Шапка страницы: `Title`, подзаголовок и вкладки `line` в одной колонке.',
	),
} satisfies Meta<typeof Header>;

export const Playground: Story<HeaderProps> = {
	render: function PlaygroundRender() {
		const tabsRef = useRef<HTMLDivElement>(null);
		const [value, setValue] = useState('profile');
		return (
			<Stack gap='md'>
				<Header>
					<Header.Title>
						Настройки
					</Header.Title>
					<Header.Subtitle>
						Профиль и доступ
					</Header.Subtitle>
					<Header.Tabs
						rootRef={tabsRef}
						items={ITEMS}
						value={value}
						onChange={setValue}
					/>
				</Header>
				<Tabs.Panel tabsRef={tabsRef} value='profile'>
					<Text size='sm'>
						Имя, почта и язык интерфейса.
					</Text>
				</Tabs.Panel>
				<Tabs.Panel tabsRef={tabsRef} value='app'>
					<Text size='sm'>
						Тема и плотность интерфейса.
					</Text>
				</Tabs.Panel>
				<Tabs.Panel tabsRef={tabsRef} value='notifications'>
					<Text size='sm'>
						Почта и пуши.
					</Text>
				</Tabs.Panel>
			</Stack>
		);
	},
	parameters: story('Заголовок, подзаголовок и вкладки. Панели снаружи, через `rootRef`.'),
};
