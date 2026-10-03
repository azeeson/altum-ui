import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {SuggestField, SuggestFieldProps} from './SuggestField';
import {Button} from '../Button/Button';
import {Fieldset} from '../Fieldset/Fieldset';
import {TextField} from '../TextField/TextField';
import {Stack, Inline} from '../Layout';
import {Text} from '../Text/Text';
import {
	componentParameters,
	fieldArgTypes,
	STORY_OVERFLOW_LABEL,
	story,
	Story,
} from '../../storybook/meta';
import {playFocus, playType} from '../../storybook/play';

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
		label: 'Новосибирск',
		value: 'novosibirsk'
	},
	{
		label: 'Екатеринбург',
		value: 'ekaterinburg'
	},
	{
		label: 'Казань',
		value: 'kazan'
	},
	{
		label: 'Нижний Новгород',
		value: 'nizhny-novgorod'
	},
	{
		label: 'Красноярск',
		value: 'krasnoyarsk'
	},
	{
		label: 'Челябинск',
		value: 'chelyabinsk'
	},
	{
		label: 'Самара',
		value: 'samara'
	},
	{
		label: 'Уфа',
		value: 'ufa'
	},
];

export default {
	title: 'altum/Components/FormField/SuggestField',
	component: SuggestField,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Поле с подсказками: ввод фильтрует список, значение — только из options (blur match/restore). Freestyle — AutocompleteField.',
	),
	args: {
		label: 'Город',
		size: 'md',
		width: 'md',
	},
	argTypes: {
		...fieldArgTypes,
		noOptionsText: {
			control: 'text',
			description: 'Текст пустого списка',
		},
		options: {control: false},
	},
} satisfies Meta<typeof SuggestField>;

export const Playground: Story<SuggestFieldProps> = {
	render: function PlaygroundRender(args) {
		const [value, setValue] = useState('');
		return (
			<Stack gap='sm'>
				<SuggestField
					{...args}
					options={CITY_OPTIONS}
					value={value}
					onChange={(next) => {
						args.onChange?.(next);
						setValue(next);
					}}
				/>
				<Text size='sm' color='muted'>
					value:
					{' '}
					{value || '—'}
				</Text>
			</Stack>
		);
	},
	args: {
		label: 'Город',
	},
	parameters: story('Ввод фильтрует список; onChange при выборе. На blur — матч или откат.'),
};

export const Sizes: Story<SuggestFieldProps> = {
	render: function SizesRender() {
		const [value, setValue] = useState('');
		return (
			<Stack gap='md' style={{maxWidth: 360}}>
				{(['sm', 'md', 'lg'] as const).map((size) => (
					<SuggestField
						key={size}
						label={`Город (${size})`}
						options={CITY_OPTIONS}
						value={value}
						onChange={setValue}
						size={size}
						width='full'
					/>
				))}
			</Stack>
		);
	},
	parameters: story('Размеры `sm`–`lg`.'),
};

export const OptionsOnly: Story<SuggestFieldProps> = {
	render: function OptionsOnlyRender() {
		const [value, setValue] = useState('moscow');
		return (
			<Stack gap='sm'>
				<SuggestField
					label='Город (только из списка)'
					options={CITY_OPTIONS}
					value={value}
					onChange={setValue}
				/>
				<Text size='sm' color='muted'>
					value:
					{' '}
					{value || '—'}
				</Text>
			</Stack>
		);
	},
	parameters: story(
		'Ввод фильтрует список; onChange только при выборе. На blur — точное совпадение или откат.',
	),
};

export const FullWidth: Story<SuggestFieldProps> = {
	render: function FullWidthRender() {
		const [value, setValue] = useState('');
		return (
			<div style={{width: 420}}>
				<SuggestField
					label='Город'
					options={CITY_OPTIONS}
					value={value}
					onChange={setValue}
					width='full'
				/>
			</div>
		);
	},
	parameters: story('Растягивание на ширину контейнера.'),
};

export const WithClear: Story<SuggestFieldProps> = {
	render: function WithClearRender() {
		const [value, setValue] = useState('moscow');
		return (
			<Stack gap='sm' style={{maxWidth: 360}}>
				<SuggestField
					label='Город'
					options={CITY_OPTIONS}
					value={value}
					onChange={setValue}
					onClear={() => setValue('')}
					width='full'
				/>
				<Text size='sm' color='muted'>
					value:
					{' '}
					{value || '—'}
				</Text>
			</Stack>
		);
	},
	parameters: story('Кнопка очистки сбрасывает ввод и выбранное значение.'),
};

export const LabelPlacement: Story<SuggestFieldProps> = {
	render: function LabelPlacementRender() {
		const [withLabel, setWithLabel] = useState('');
		const [withoutLabel, setWithoutLabel] = useState('');
		return (
			<Stack gap='md' style={{maxWidth: 360}}>
				<SuggestField
					label='Город'
					options={CITY_OPTIONS}
					value={withLabel}
					onChange={setWithLabel}
					width='full'
				/>
				<SuggestField
					aria-label='Город'
					options={CITY_OPTIONS}
					value={withoutLabel}
					onChange={setWithoutLabel}
					placeholder='Начните вводить'
					width='full'
				/>
			</Stack>
		);
	},
	parameters: story('С `label` — floating-лейбл; без `label` виден placeholder.'),
};

export const Disabled: Story<SuggestFieldProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 360}}>
			<SuggestField
				label='Город'
				options={CITY_OPTIONS}
				value='moscow'
				disabled
				width='full'
			/>
			<SuggestField
				label='Город'
				options={CITY_OPTIONS}
				error='Выберите город из списка'
				width='full'
			/>
		</Stack>
	),
	parameters: story('`disabled` и ошибка.'),
};

export const Empty: Story<SuggestFieldProps> = {
	render: () => (
		<div style={{maxWidth: 360}}>
			<SuggestField
				label='Город'
				options={CITY_OPTIONS}
				description='Начните вводить название'
				width='full'
			/>
		</div>
	),
	parameters: story('Пустое поле с подсказкой.'),
};

export const OverflowText: Story<SuggestFieldProps> = {
	render: function OverflowRender() {
		const [value, setValue] = useState('nizhny-novgorod');
		return (
			<div style={{maxWidth: 260}}>
				<SuggestField
					label={STORY_OVERFLOW_LABEL}
					options={CITY_OPTIONS}
					value={value}
					onChange={setValue}
					width='full'
				/>
			</div>
		);
	},
	parameters: story('Длинный лейбл и длинное выбранное значение.'),
};

export const Focused: Story<SuggestFieldProps> = {
	render: function FocusedRender() {
		const [value, setValue] = useState('');
		return (
			<div style={{maxWidth: 360}}>
				<SuggestField
					label='Город'
					options={CITY_OPTIONS}
					value={value}
					onChange={setValue}
					width='full'
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playFocus(canvasElement, 'input');
	},
	parameters: story('Фокус открывает список подсказок.'),
};

export const Interaction: Story<SuggestFieldProps> = {
	render: function InteractionRender() {
		const [value, setValue] = useState('');
		return (
			<div style={{maxWidth: 360}}>
				<SuggestField
					label='Город'
					options={CITY_OPTIONS}
					value={value}
					onChange={setValue}
					width='full'
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playType(canvasElement, 'Каз', 'input');
	},
	parameters: story('Play: фильтр «Каз» — в списке Казань.'),
};

export const UsageExample: Story<SuggestFieldProps> = {
	render: function UsageExampleRender() {
		const [org, setOrg] = useState('');
		const [city, setCity] = useState('moscow');
		return (
			<div style={{maxWidth: 420}}>
				<Fieldset
					legend='Компания'
					description='Город выбирается из справочника.'
					footer={(
						<Inline gap='sm' justify='end'>
							<Button variant='primary'>
								Сохранить
							</Button>
						</Inline>
					)}
				>
					<TextField
						label='Название'
						value={org}
						onChange={(e) => setOrg(e.target.value)}
						width='full'
					/>
					<SuggestField
						label='Город'
						options={CITY_OPTIONS}
						value={city}
						onChange={setCity}
						width='full'
						onClear={() => setCity('')}
					/>
				</Fieldset>
			</div>
		);
	},
	parameters: story('SuggestField в форме компании рядом с TextField.'),
};
