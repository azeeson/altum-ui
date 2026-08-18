import type {Meta} from '@storybook/react';
import React from 'react';
import {Separator, type SeparatorProps} from './Separator';
import {Text} from '../Text/Text';
import {Inline, Stack} from '../Layout/Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Separator',
	component: Separator,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Разделитель: horizontal / vertical, опциональный текст, отступы start / end. Алиас: Spacer.',
	),
	argTypes: {
		orientation: {
			control: {
				type: 'select',
				options: ['horizontal', 'vertical']
			},
		},
		decorative: {control: 'boolean'},
		start: {control: 'text'},
		end: {control: 'text'},
	},
} satisfies Meta<typeof Separator>;

export const Playground: Story<SeparatorProps> = {
	render: (args) => (
		<div style={{maxWidth: 320}}>
			<Text>
				Верхний блок
			</Text>
			<Separator {...args} />
			<Text>
				Нижний блок
			</Text>
		</div>
	),
	args: {
		orientation: 'horizontal',
		decorative: false,
		start: 'md',
		end: 'md',
	},
	parameters: story('Горизонтальный разделитель с отступами `start` / `end`.'),
};

export const WithLabel: Story<SeparatorProps> = {
	render: () => (
		<Stack gap='none' style={{maxWidth: 360}}>
			<Text>
				Войти через email
			</Text>
			<Separator start='md' end='md'>
				или
			</Separator>
			<Text>
				Продолжить с Google
			</Text>
		</Stack>
	),
	parameters: story('Текст на линии (бывший Spacer).'),
};

export const Vertical: Story<SeparatorProps> = {
	render: () => (
		<Inline
			gap='none'
			align='center'
			style={{height: 40}}
		>
			<Text>
				Профиль
			</Text>
			<Separator
				orientation='vertical'
				start='sm'
				end='sm'
			/>
			<Text>
				Настройки
			</Text>
			<Separator
				orientation='vertical'
				start='sm'
				end='sm'
				decorative
			/>
			<Text>
				Выход
			</Text>
		</Inline>
	),
	parameters: story('Вертикальный разделитель с inline-отступами.'),
};

export const VerticalWithLabel: Story<SeparatorProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			height: 160,
			gap: 'var(--altum-g-space-3)',
		}}
		>
			<Text>
				A
			</Text>
			<Separator
				orientation='vertical'
				start='sm'
				end='sm'
			>
				и
			</Separator>
			<Text>
				B
			</Text>
		</div>
	),
	parameters: story('Вертикаль с подписью на линии.'),
};
