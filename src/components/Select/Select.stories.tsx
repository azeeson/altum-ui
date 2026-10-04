import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Select} from './Select';
import {Button} from '../Button/Button';
import {Fieldset} from '../Fieldset/Fieldset';
import {TextField} from '../TextField/TextField';
import {Stack, Inline} from '../Layout';
import {
	componentParameters,
	fieldArgTypes,
	STORY_OVERFLOW_LABEL,
	story,
	Story,
} from '../../storybook/meta';
import {playClick, playFocus} from '../../storybook/play';

const options = [
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
];

const LONG_LIST = Array.from({length: 180}, (_, index) => ({
	label: `Пункт ${index + 1}`,
	value: `item-${index + 1}`,
}));

const LONG_OPTIONS = [
	...options,
	{
		label: 'Город с очень длинным официальным названием для проверки переполнения',
		value: 'long',
	},
];

export default {
	title: 'altum/Components/FormField/Select',
	component: Select,
	tags: ['autodocs'],
	parameters: componentParameters('Select с полем и выпадающим списком.'),
	args: {
		label: 'Город',
		size: 'md',
		width: 'md',
		filterable: false,
	},
	argTypes: {
		...fieldArgTypes,
		filterable: {
			control: 'boolean',
			description: 'Поле фильтра в панели',
		},
		filterPlaceholder: {
			control: 'text',
			description: 'Placeholder фильтра',
		},
		loading: {
			control: 'boolean',
			description: 'Состояние загрузки (`aria-busy`)',
		},
		selectionMode: {
			control: {
				type: 'select',
				options: ['single', 'multiple', 'path'],
			},
			description: 'Режим выбора',
		},
		placeholder: {
			control: 'text',
			description: 'Текст пустого триггера',
		},
		options: {control: false},
	},
} satisfies Meta<typeof Select>;

export const Playground: Story<Record<string, never>> = {
	render: function PlaygroundRender() {
		const [value, setValue] = useState('');
		return (
			<Select
				options={options}
				value={value}
				onChange={(next) => setValue(next as string)}
				label='Город'
				onClear={() => setValue('')}
				filterable
				filterPlaceholder='Найти город...'
			/>
		);
	},
	parameters: story('Опции и chrome поля на одном компоненте; `filterable` включает поиск.'),
};

export const Sizes: Story<Record<string, never>> = {
	render: function SizesRender() {
		const [value, setValue] = useState('moscow');
		return (
			<Stack gap='md' style={{maxWidth: 320}}>
				{(['sm', 'md', 'lg'] as const).map((size) => (
					<Select
						key={size}
						options={options}
						value={value}
						onChange={(next) => setValue(next as string)}
						label={`Город (${size})`}
						size={size}
						width='full'
					/>
				))}
			</Stack>
		);
	},
	parameters: story('Размеры триггера `sm`–`lg`.'),
};

export const LabelPlacement: Story<Record<string, never>> = {
	render: () => (
		<Stack gap='sm' style={{maxWidth: 320}}>
			<Select
				options={options}
				label='Город'
				width='full'
			/>
			<Select
				options={options}
				aria-label='Город'
				placeholder='Выберите город'
				width='full'
			/>
		</Stack>
	),
	parameters: story('С `label` — floating-лейбл; без `label` — placeholder и `aria-label`.'),
};

export const Multiple: Story<Record<string, never>> = {
	render: function MultipleRender() {
		const [value, setValue] = useState<string[]>(['moscow']);
		return (
			<Select
				options={options}
				selectionMode='multiple'
				value={value}
				onChange={(next) => setValue(next as string[])}
				label='Города'
				width='full'
				onClear={() => setValue([])}
				filterable
				filterPlaceholder='Найти город...'
			/>
		);
	},
	parameters: story(
		'`selectionMode="multiple"` — подписи через запятую. Chips — у `MultiSelect`.',
	),
};

const GROUPED_OPTIONS = [
	{
		value: 'react',
		label: 'React',
		groupId: 'frontend'
	},
	{
		value: 'vue',
		label: 'Vue',
		groupId: 'frontend'
	},
	{
		value: 'node',
		label: 'Node.js',
		groupId: 'backend'
	},
	{
		value: 'go',
		label: 'Go',
		groupId: 'backend'
	},
];

export const WithGroups: Story<Record<string, never>> = {
	render: function GroupsRender() {
		const [value, setValue] = useState('react');
		return (
			<Select
				options={GROUPED_OPTIONS}
				groups={[
					{
						id: 'frontend',
						label: 'Фронтенд'
					},
					{
						id: 'backend',
						label: 'Бэкенд'
					},
				]}
				value={value}
				onChange={(next) => setValue(next as string)}
				label='Стек'
				width='full'
				onClear={() => setValue('')}
			/>
		);
	},
	parameters: story('Группы: `options` + `groups` + `groupId`.'),
};

export const Disabled: Story<Record<string, never>> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 320}}>
			<Select
				options={options}
				value='moscow'
				label='Город'
				disabled
				width='full'
			/>
			<Select
				options={options}
				label='Город'
				error='Выберите город из списка'
				width='full'
			/>
			<Select
				options={options}
				label='Город'
				loading
				width='full'
			/>
		</Stack>
	),
	parameters: story('`disabled`, ошибка и `loading`.'),
};

export const Empty: Story<Record<string, never>> = {
	render: () => (
		<div style={{maxWidth: 320}}>
			<Select
				options={options}
				label='Город'
				description='Можно начать вводить в фильтре'
				filterable
				width='full'
			/>
		</div>
	),
	parameters: story('Пустой триггер с подсказкой.'),
};

export const OverflowText: Story<Record<string, never>> = {
	render: function OverflowRender() {
		const [value, setValue] = useState('long');
		return (
			<div style={{maxWidth: 260}}>
				<Select
					options={LONG_OPTIONS}
					value={value}
					onChange={(next) => setValue(next as string)}
					label={STORY_OVERFLOW_LABEL}
					width='full'
				/>
			</div>
		);
	},
	parameters: story('Длинный лейбл и длинный пункт в триггере.'),
};

export const LongList: Story<Record<string, never>> = {
	name: 'Длинный список',
	render: function LongListRender() {
		const [value, setValue] = useState('item-1');
		return (
			<div style={{maxWidth: 320}}>
				<Select
					options={LONG_LIST}
					value={value}
					onChange={(next) => setValue(next as string)}
					label='Список'
					width='full'
				/>
			</div>
		);
	},
	parameters: story('Больше 100 пунктов: окно виртуального списка заполнено до скролла.'),
};

export const Focused: Story<Record<string, never>> = {
	render: () => (
		<div style={{maxWidth: 320}}>
			<Select
				options={options}
				value='moscow'
				label='Город'
				width='full'
			/>
		</div>
	),
	play: async ({canvasElement}) => {
		await playFocus(canvasElement, 'button');
	},
	parameters: story('Фокус триггера.'),
};

export const Interaction: Story<Record<string, never>> = {
	render: function InteractionRender() {
		const [value, setValue] = useState('');
		return (
			<div style={{maxWidth: 320}}>
				<Select
					options={options}
					value={value}
					onChange={(next) => setValue(next as string)}
					label='Город'
					width='full'
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playClick(canvasElement, 'button');
	},
	parameters: story('Play: открытие listbox по клику на триггер.'),
};

export const UsageExample: Story<Record<string, never>> = {
	render: function UsageExampleRender() {
		const [name, setName] = useState('');
		const [city, setCity] = useState('');
		return (
			<div style={{maxWidth: 420}}>
				<Fieldset
					legend='Адрес доставки'
					description='Город из справочника и имя получателя.'
					footer={(
						<Inline gap='sm' justify='end'>
							<Button variant='secondary'>
								Отмена
							</Button>
							<Button variant='primary'>
								Сохранить
							</Button>
						</Inline>
					)}
				>
					<TextField
						label='Получатель'
						value={name}
						onChange={(e) => setName(e.target.value)}
						width='full'
					/>
					<Select
						options={options}
						value={city}
						onChange={(next) => setCity(next as string)}
						label='Город'
						filterable
						filterPlaceholder='Найти город...'
						width='full'
						onClear={() => setCity('')}
					/>
				</Fieldset>
			</div>
		);
	},
	parameters: story('Select в форме адреса рядом с TextField.'),
};
