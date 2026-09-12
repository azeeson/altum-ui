import type {Meta} from '@storybook/react';
import React from 'react';
import {StatBadge, StatBadgeProps} from './StatBadge';
import {Inline, Stack} from '../Layout/Layout';
import {Card} from '../Card/Card';
import {Text} from '../Text/Text';
import {Title} from '../Title/Title';
import {componentParameters, story, Story} from '../../storybook/meta';

const VARIANTS = [
	'default',
	'success',
	'warning',
	'error'
] as const;

export default {
	title: 'altum/Components/StatBadge',
	component: StatBadge,
	tags: ['autodocs'],
	parameters: componentParameters('Компактный бейдж со статистикой: метка и числовое значение.'),
	argTypes: {
		label: {
			control: 'text',
			description: 'Метка показателя'
		},
		value: {
			control: 'text',
			description: 'Значение (число или строка)'
		},
		variant: {
			control: {
				type: 'select',
				options: VARIANTS
			},
			description: 'Семантический статус',
		},
		size: {
			control: {
				type: 'select',
				options: ['md', 'sm'],
			},
			description: 'md — карточка, sm — inline pill',
		},
	},
} satisfies Meta<typeof StatBadge>;

export const Playground: Story<StatBadgeProps> = {
	args: {
		label: 'Готово',
		value: 12,
		variant: 'success',
		size: 'md',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const AllVariants: Story<StatBadgeProps> = {
	render: () => (
		<Inline gap='md' wrap>
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
		</Inline>
	),
	parameters: story('Все варианты оформления StatBadge.'),
};

export const Sizes: Story<StatBadgeProps> = {
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
	parameters: story('Сравнение `md` (карточка) и `sm` (pill).'),
};

export const EmptyAndZero: Story<StatBadgeProps> = {
	render: () => (
		<Inline gap='md' wrap>
			<StatBadge label='Новых' value={0} />
			<StatBadge
				label='Ошибок'
				value={0}
				variant='error'
			/>
			<StatBadge label='—' value='—' />
		</Inline>
	),
	parameters: story('Нулевые и пустые значения.'),
};

export const OverflowText: Story<StatBadgeProps> = {
	render: () => (
		<Inline
			gap='md'
			wrap
			style={{maxWidth: 420}}
		>
			<StatBadge
				label='Очень длинная подпись показателя за квартал'
				value={12847}
				variant='success'
			/>
			<StatBadge
				label='KPI'
				value='1 284 700 ₽'
				size='sm'
			/>
		</Inline>
	),
	parameters: story('Длинная подпись и форматированная строка вместо числа.'),
};

export const UsageExample: Story<StatBadgeProps> = {
	render: () => (
		<Card
			style={{maxWidth: 420}}
			header={(
				<Title level={4}>
					Профиль спринта
				</Title>
			)}
		>
			<Stack gap='md'>
				<Text size='sm' color='secondary'>
					Сводка по задачам текущей итерации
				</Text>
				<Inline gap='md' wrap>
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
			</Stack>
		</Card>
	),
	parameters: story('Набор метрик в карточке профиля.'),
};
