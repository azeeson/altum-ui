import type {Meta} from '@storybook/react';
import React from 'react';
import {Split, type SplitProps} from './Split';
import {Inline} from './Inline';
import {Button} from '../Button/Button';
import {SearchField} from '../SearchField/SearchField';
import {Chip} from '../Chip/Chip';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/Split',
	component: Split,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Ряд с space-between: левый и правый блоки у противоположных краёв. '
		+ 'Для page header, toolbar, строки списка.',
	),
} satisfies Meta<typeof Split>;

export const Playground: Story<SplitProps> = {
	render: () => (
		<Split gap='md'>
			<Inline gap='sm' align='center'>
				<Text size='md'>
					Проекты
				</Text>
				<Chip
					mode='tag'
					variant='tinted'
					size='sm'
				>
					12
				</Chip>
			</Inline>
			<Inline gap='sm'>
				<SearchField label='Фильтр' />
				<Button variant='primary' size='sm'>
					Создать
				</Button>
			</Inline>
		</Split>
	),
	parameters: story('Заголовок слева, поиск и действие справа.'),
};

export const WithListRow: Story<SplitProps> = {
	render: () => (
		<Split
			gap='md'
			style={{
				padding: 'var(--altum-g-space-3)',
				border: '1px solid var(--altum-color-border)',
				borderRadius: 'var(--altum-g-radius)',
			}}
		>
			<div>
				<Text size='sm'>
					Алексей Иванов
				</Text>
				<Text size='xs' color='muted'>
					alex@example.com
				</Text>
			</div>
			<Button size='sm' variant='ghost'>
				Открыть
			</Button>
		</Split>
	),
	parameters: story('Строка списка: контент слева, действие справа.'),
};
