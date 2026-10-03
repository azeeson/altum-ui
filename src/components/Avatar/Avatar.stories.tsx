import type {Meta} from '@storybook/react';
import React from 'react';
import {Avatar, AvatarGroup, AvatarProps} from './Avatar';
import {Card} from '../Card/Card';
import {Inline, Stack} from '../Layout';
import {Text} from '../Text/Text';
import {Title} from '../Title/Title';
import {demoThumb} from '../../storybook/demoImages';
import {componentParameters, story, Story} from '../../storybook/meta';

const SIZES = [
	'xs',
	'sm',
	'md',
	'lg',
	'xl'
] as const;

const STATUSES = [
	'online',
	'offline',
	'busy',
	'away'
] as const;

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
			control: {
				type: 'select',
				options: [...SIZES],
			},
			description: 'Именованный размер (или число px в коде)',
		},
		src: {
			control: 'text',
			description: 'URL изображения'
		},
		status: {
			control: {
				type: 'select',
				options: [undefined, ...STATUSES],
			},
			description: 'Кольцо статуса',
		},
	},
} satisfies Meta<typeof Avatar>;

export const Playground: Story<AvatarProps> = {
	args: {
		name: 'Алексей Иванов',
		size: 'md',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const AllVariants: Story<AvatarProps> = {
	render: () => (
		<Inline gap='md' align='center'>
			<Avatar name='Алексей Иванов' />
			<Avatar name='Мария Сидорова' size='lg' />
			<Avatar src={demoThumb(1)} name='Фото' />
		</Inline>
	),
	parameters: story('Инициалы, увеличенный размер и изображение.'),
};

export const Sizes: Story<AvatarProps> = {
	render: () => (
		<Inline gap='md' align='center'>
			{SIZES.map((size) => (
				<Avatar
					key={size}
					name={size.toUpperCase()}
					size={size}
				/>
			))}
		</Inline>
	),
	parameters: story('Именованные размеры xs … xl.'),
};

export const NumericSize: Story<AvatarProps> = {
	render: () => (
		<Inline gap='md' align='center'>
			<Avatar name='64' size={64} />
			<Avatar name='80' size={80} />
		</Inline>
	),
	parameters: story('Произвольный размер в пикселях (`size={64}`).'),
};

export const StatusRing: Story<AvatarProps> = {
	render: () => (
		<Inline
			gap='md'
			align='center'
			wrap
		>
			{STATUSES.map((status) => (
				<Avatar
					key={status}
					name={status}
					status={status}
				/>
			))}
		</Inline>
	),
	parameters: story('Кольцо статуса: online / offline / busy / away.'),
};

export const Fallback: Story<AvatarProps> = {
	render: () => (
		<Inline gap='md' align='center'>
			<Avatar />
			<Avatar name='ЕдинственноеИмя' />
			<Avatar src='/missing-avatar.png' name='Битый URL' />
		</Inline>
	),
	parameters: story('Иконка без имени, инициалы из одного слова, fallback при битом src.'),
};

export const OverflowName: Story<AvatarProps> = {
	render: () => (
		<Inline gap='md' align='center'>
			<Avatar name='Анна-Мария Константинопольская' />
			<Avatar name='🚀' />
		</Inline>
	),
	parameters: story('Длинное составное имя (первые две части) и нестандартный глиф.'),
};

export const AvatarPile: Story<AvatarProps> = {
	render: () => (
		<AvatarGroup>
			<Avatar name='Алексей Иванов' />
			<Avatar name='Мария Сидорова' />
			<Avatar name='Иван Петров' />
			<Avatar name='Ольга К.' />
		</AvatarGroup>
	),
	parameters: story('Группа перекрывающихся аватаров.'),
};

export const UsageExample: Story<AvatarProps> = {
	render: () => (
		<div style={{maxWidth: 360}}>
			<Card>
				<Inline gap='md' align='center'>
					<Avatar
						name='Алексей Иванов'
						size='lg'
						status='online'
					/>
					<Stack gap='none'>
						<Title level={4}>
							Алексей Иванов
						</Title>
						<Text size='sm' color='secondary'>
							Продуктовый дизайнер
						</Text>
					</Stack>
				</Inline>
			</Card>
		</div>
	),
	parameters: story('Карточка профиля: аватар, статус и текстовый блок.'),
};
