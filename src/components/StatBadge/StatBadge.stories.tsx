import type {Meta} from '@storybook/react';
import React from 'react';
import {StatBadge, StatBadgeProps} from './StatBadge';
import {Inline, Stack} from '../Layout/Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/StatBadge',
	component: StatBadge,
	tags: ['autodocs'],
	parameters: componentParameters('Компактный бейдж со статистикой: метка и числовое значение.'),
	argTypes: {
		label: {
			control: 'text',
			description: 'Метка показателя'
		},
		value: {
			control: 'number',
			description: 'Числовое значение'
		},
		variant: {
			control: {
				type: 'select',
				options: [
					'default',
					'success',
					'warning',
					'error'
				]
			},
			description: 'Вариант оформления',
		},
		size: {
			control: {
				type: 'select',
				options: ['md', 'sm'],
			},
			description: 'Размер: md — карточка, sm — inline pill',
		},
	},
} satisfies Meta<typeof StatBadge>;

export const Playground: Story<StatBadgeProps> = {
	args: {
		label: 'Готово',
		value: 12,
		variant: 'success',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const ProfileStats: Story<StatBadgeProps> = {
	render: () => (
		<Inline gap='md'>
			<StatBadge
				label='Готово'
				value={12}
				variant='success'
			/>
			<StatBadge label='В ожидании' value={5} />
			<StatBadge
				label='Просрочено'
				value={2}
				variant='error'
			/>
		</Inline>
	),
	parameters: story('Набор статистики профиля задач.'),
};

export const AllVariants: Story<StatBadgeProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			gap: 12
		}}
		>
			<StatBadge label='Обычный' value={42} />
			<StatBadge
				label='Успех'
				value={42}
				variant='success'
			/>
			<StatBadge
				label='Внимание'
				value={3}
				variant='warning'
			/>
			<StatBadge
				label='Опасность'
				value={1}
				variant='error'
			/>
		</div>
	),
	parameters: story('Все варианты оформления StatBadge.'),
};

export const Compact: Story<StatBadgeProps> = {
	render: () => (
		<Inline gap='sm' align='center'>
			<StatBadge
				label='Готово'
				value={12}
				variant='success'
				size='sm'
			/>
			<StatBadge
				label='В ожидании'
				value={5}
				size='sm'
			/>
			<StatBadge
				label='Просрочено'
				value={2}
				variant='error'
				size='sm'
			/>
			<StatBadge
				label='Черновик'
				value={3}
				variant='warning'
				size='sm'
			/>
		</Inline>
	),
	parameters: story('Компактный inline-вариант: value и label в одну строку, высота 15px.'),
};

export const SizeComparison: Story<StatBadgeProps> = {
	render: () => (
		<Stack gap='lg'>
			<Inline gap='md' align='center'>
				<StatBadge
					label='Готово'
					value={12}
					variant='success'
				/>
				<StatBadge label='В ожидании' value={5} />
			</Inline>
			<Inline gap='sm' align='center'>
				<StatBadge
					label='Готово'
					value={12}
					variant='success'
					size='sm'
				/>
				<StatBadge
					label='В ожидании'
					value={5}
					size='sm'
				/>
			</Inline>
		</Stack>
	),
	parameters: story('Сравнение default и compact размеров.'),
};
