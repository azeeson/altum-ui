import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {MultiSelect, MultiSelectProps} from './MultiSelect';
import {Stack} from '../Layout';
import {Text} from '../Text/Text';
import {
	componentParameters,
	fieldArgTypes,
	story,
	Story,
} from '../../storybook/meta';

const CITY_OPTIONS = [
	{
		label: 'Москва',
		value: 'moscow'
	},
	{
		label: 'Санкт-Петербург',
		value: 'spb'
	},
	{
		label: 'Казань',
		value: 'kazan'
	},
	{
		label: 'Новосибирск',
		value: 'novosibirsk'
	},
];

export default {
	title: 'altum/Components/FormField/MultiSelect',
	component: MultiSelect,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Multiple-выбор с chips в триггере (декоратор над Select).',
	),
	args: {
		label: 'Города',
		size: 'md',
		width: 'md',
	},
	argTypes: {
		...fieldArgTypes,
		filterable: {
			control: 'boolean',
			description: 'Поле фильтра в панели',
		},
		options: {control: false},
	},
} satisfies Meta<typeof MultiSelect>;

export const Playground: Story<MultiSelectProps> = {
	render: function PlaygroundRender(args) {
		const [value, setValue] = useState<string[]>(['moscow']);
		return (
			<Stack gap='sm'>
				<MultiSelect
					{...args}
					options={CITY_OPTIONS}
					value={value}
					onChange={(next) => {
						args.onChange?.(next);
						setValue(next);
					}}
					onClear={() => setValue([])}
				/>
				<Text size='sm' color='muted'>
					value:
					{' '}
					{value.join(', ') || '—'}
				</Text>
			</Stack>
		);
	},
	parameters: story('Chips выбранных значений; remove через крестик на чипе.'),
};

export const WithFilter: Story<MultiSelectProps> = {
	render: function WithFilterRender() {
		const [value, setValue] = useState<string[]>(['moscow', 'kazan']);
		return (
			<div style={{maxWidth: 360}}>
				<MultiSelect
					options={CITY_OPTIONS}
					value={value}
					onChange={setValue}
					label='Города'
					width='full'
					filterable
					filterPlaceholder='Найти город...'
					onClear={() => setValue([])}
				/>
			</div>
		);
	},
	parameters: story('`filterable` — поиск в панели списка.'),
};
