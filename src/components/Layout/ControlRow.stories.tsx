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
	title: 'altum-ui/Components/ControlRow',
	component: ControlRow,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Ряд контролов формы и фильтров: TextField, Chip, Button, Select с общим выравниванием и токенным gap. '
		+ 'Используйте вместо Inline, когда в линии есть поля; align="end" — рядом с floating-label.',
	),
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
	render: function FiltersWithSearchRender() {
		const [query, setQuery] = useState('');
		const [active, setActive] = useState('all');
		return (
			<Stack gap='lg'>
				<Text size='sm' color='muted'>
					Chip + поле + кнопка (align=«center»). Поле растягивается через
					{' '}
					<code>
						ControlRow.Item grow
					</code>
					.
				</Text>
				<ControlRow gap='sm'>
					<Chip
						variant={active === 'all' ? 'tinted' : 'secondary'}
						active={active === 'all'}
						onClick={() => setActive('all')}
					>
						Все
					</Chip>
					<Chip
						variant={active === 'mine' ? 'tinted' : 'secondary'}
						active={active === 'mine'}
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
						<Select.Root
							options={CITY_OPTIONS}
							value={city}
							onChange={(value) => { if (!Array.isArray(value)) setCity(value); }}
						>
							<Select.Trigger label='Город' width='full' />
							<Select.Panel>
								<Select.List />
							</Select.Panel>
						</Select.Root>
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
