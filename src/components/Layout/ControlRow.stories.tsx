import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {ControlRow, type ControlRowProps} from './ControlRow';
import {Stack} from './Stack';
import {Button} from '../Button/Button';
import {Chip} from '../Chip/Chip';
import {TextField} from '../TextField/TextField';
import {Select} from '../Select/Select';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/ControlRow',
	component: ControlRow,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Ряд контролов формы и фильтров: TextField, Chip, Button, Select с общим выравниванием и токенным gap. '
		+ 'Используйте вместо Inline, когда в линии есть поля; align="end" — рядом с floating-label.',
	),
	argTypes: {
		gap: {
			control: {
				type: 'select',
				options: [
					'none',
					'xs',
					'sm',
					'md',
					'lg',
					'xl'
				],
			},
			description: 'Промежуток между контролами',
		},
		align: {
			control: {
				type: 'select',
				options: [
					'start',
					'center',
					'end',
					'baseline',
					'stretch'
				],
			},
			description: 'Выравнивание по высоте',
		},
		justify: {
			control: {
				type: 'select',
				options: [
					'start',
					'center',
					'end',
					'between',
					'around',
					'evenly'
				],
			},
			description: 'Распределение по главной оси',
		},
		wrap: {
			control: 'boolean',
			description: 'Перенос на следующую строку',
		},
	},
} satisfies Meta<typeof ControlRow>;

const CITY_OPTIONS = [
	{
		label: 'Москва',
		value: 'msk'
	},
	{
		label: 'Казань',
		value: 'kzn'
	},
];

export const Playground: Story<ControlRowProps> = {
	render: function FiltersWithSearchRender(args) {
		const [query, setQuery] = useState('');
		const [active, setActive] = useState('all');
		return (
			<Stack gap='lg'>
				<Text size='sm' color='muted'>
					Chip + поле + кнопка. Поле растягивается через
					{' '}
					<code>
						ControlRow.Item grow
					</code>
					.
				</Text>
				<ControlRow {...args}>
					<Chip
						variant={active === 'all' ? 'tinted' : 'secondary'}
						mode={active === 'all' ? 'toggle' : 'chip'}
						onClick={() => setActive('all')}
					>
						Все
					</Chip>
					<Chip
						variant={active === 'mine' ? 'tinted' : 'secondary'}
						mode={active === 'mine' ? 'toggle' : 'chip'}
						onClick={() => setActive('mine')}
					>
						Мои
					</Chip>
					<ControlRow.Item grow>
						<TextField
							label='Поиск'
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							width='full'
						/>
					</ControlRow.Item>
					<Button variant='tinted'>
						Найти
					</Button>
				</ControlRow>
			</Stack>
		);
	},
	args: {
		gap: 'sm',
		align: 'center',
		wrap: true,
	},
	parameters: story('Фильтры-чипы + поиск + действие в одном ряду.'),
};

export const WithAlignEnd: Story<ControlRowProps> = {
	render: function AlignEndWithFieldsRender() {
		const [city, setCity] = useState('');
		return (
			<Stack
				gap='md'
				style={{maxWidth: 480}}
			>
				<Text size='sm' color='muted'>
					align=«end» — кнопка по низу рядом с полями с плавающим label.
				</Text>
				<ControlRow gap='sm' align='end'>
					<ControlRow.Item grow>
						<Select
							options={CITY_OPTIONS}
							value={city}
							onChange={(value) => { if (!Array.isArray(value)) setCity(value); }}
							label='Город'
							width='full'
						/>
					</ControlRow.Item>
					<Button variant='secondary'>
						Сброс
					</Button>
				</ControlRow>
			</Stack>
		);
	},
	parameters: story('Select + кнопка с выравниванием по низу полей.'),
};

export const Wrap: Story<ControlRowProps> = {
	render: () => (
		<div style={{maxWidth: 280}}>
			<ControlRow gap='sm'>
				<Button size='sm' variant='secondary'>
					Фильтр
				</Button>
				<Button size='sm' variant='secondary'>
					Сортировка
				</Button>
				<Button size='sm' variant='tinted'>
					Применить очень длинное действие
				</Button>
			</ControlRow>
		</div>
	),
	parameters: story('Перенос контролов на узкой ширине.'),
};

export const Interaction: Story<ControlRowProps> = {
	render: Playground.render,
	args: {
		gap: 'sm',
		align: 'center',
	},
	play: async ({canvasElement}) => {
		const input = canvasElement.querySelector('input');
		if (!(input instanceof HTMLInputElement)) {
			throw new Error('Не найдено поле поиска в ControlRow');
		}
		input.focus();
		input.value = 'отчёт';
		input.dispatchEvent(new Event('input', {bubbles: true}));
		const find = Array.from(canvasElement.querySelectorAll('button'))
			.find((el) => el.textContent?.includes('Найти'));
		find?.click();
	},
	parameters: story('Play: ввод в поле и клик «Найти».'),
};

export const UsageExample: Story<ControlRowProps> = {
	render: WithAlignEnd.render,
	parameters: story('Типовой ряд фильтра: Select + сброс.'),
};
