import type {Meta} from '@storybook/react';
import React from 'react';
import {Avatar, AvatarGroup, AvatarProps} from './Avatar';
import {demoThumb} from '../../storybook/demoImages';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Avatar',
	component: Avatar,
	tags: ['autodocs'],
	parameters: componentParameters('Аватар пользователя с инициалами или изображением, а также группа аватаров.'),
	argTypes: {
		name: {
			control: 'text',
			description: 'Имя для генерации инициалов'
		},
		size: {
			control: 'number',
			description: 'Размер в пикселях'
		},
		src: {
			control: 'text',
			description: 'URL изображения'
		},
	},
} satisfies Meta<typeof Avatar>;

export const Playground: Story<AvatarProps> = {
	args: {
		name: 'Алексей Иванов',
		size: 44,
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const AllVariants: Story<AvatarProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			gap: '16px',
			alignItems: 'center'
		}}
		>
			<Avatar name='Алексей Иванов' />
			<Avatar name='Мария Сидорова' size={56} />
			<Avatar src={demoThumb(1)} />
		</div>
	),
	parameters: story('Инициалы, увеличенный размер и изображение.'),
};

export const AvatarPile: Story<AvatarProps> = {
	render: () => (
		<AvatarGroup>
			<Avatar name='Алексей Иванов' />
			<Avatar name='Мария Сидорова' />
			<Avatar name='Иван Петров' />
		</AvatarGroup>
	),
	parameters: story('Группа перекрывающихся аватаров.'),
};

export const StatusRing: Story<AvatarProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			gap: 'var(--altum-g-space-4)',
			alignItems: 'center',
			flexWrap: 'wrap',
		}}
		>
			<Avatar name='Алексей Иванов' status='online' />
			<Avatar name='Мария Сидорова' status='offline' />
			<Avatar name='Иван Петров' status='busy' />
			<Avatar name='Ольга К.' status='away' />
		</div>
	),
	parameters: story('Кольцо статуса: online / offline / busy / away.'),
};

export const Sizes: Story<AvatarProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			gap: 'var(--altum-g-space-4)',
			alignItems: 'center',
		}}
		>
			<Avatar name='XS' size='xs' />
			<Avatar name='SM' size='sm' />
			<Avatar name='MD' size='md' />
			<Avatar name='LG' size='lg' />
			<Avatar name='XL' size='xl' />
		</div>
	),
	parameters: story('Именованные размеры xs … xl.'),
};
