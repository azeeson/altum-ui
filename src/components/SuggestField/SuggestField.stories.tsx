import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {SuggestField, SuggestFieldProps} from './SuggestField';
import {componentParameters, story, Story} from '../../storybook/meta';

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
	title: 'altum-ui/Components/SuggestField',
	component: SuggestField,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Поле с подсказками: произвольный ввод или только значения из options.',
	),
	argTypes: {
		label: {
			control: 'text',
			description: 'Метка поля',
		},
		allowCustom: {
			control: 'boolean',
			description: 'Разрешить значение вне options',
		},
		disabled: {
			control: 'boolean',
		},
		width: {
			control: {
				type: 'select',
				options: [
					'xxs',
					'sm',
					'md',
					'lg',
					'xl',
					'full'
				]
			},
			description: 'Ширина оболочки',
		},
		labelPlacement: {
			control: {
				type: 'select',
				options: ['inline', 'outside', 'none'],
			},
			description: 'Расположение лейбла',
		},
	},
} satisfies Meta<typeof SuggestField>;

export const Playground: Story<SuggestFieldProps> = {
	render: function PlaygroundRender(args) {
		const [value, setValue] = useState('');
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-3)'
			}}
			>
				<SuggestField
					{...args}
					options={CITY_OPTIONS}
					value={value}
					onChange={setValue}
				/>
				<span style={{
					fontSize: 'var(--altum-g-font-size-sm)',
					color: 'var(--altum-color-muted)'
				}}
				>
					value: 
					{' '}
					{value || '—'}
				</span>
			</div>
		);
	},
	args: {
		label: 'Город',
		allowCustom: true,
	},
	parameters: story('Введите текст или выберите из списка. Controls — режим allowCustom.'),
};

export const AllowCustom: Story<SuggestFieldProps> = {
	render: function AllowCustomRender() {
		const [value, setValue] = useState('');
		return (
			<SuggestField
				label='Тег или своё значение'
				options={CITY_OPTIONS}
				value={value}
				onChange={setValue}
				allowCustom
			/>
		);
	},
	parameters: story('Произвольный ввод; выбор из списка подставляет option.value.'),
};

export const OptionsOnly: Story<SuggestFieldProps> = {
	render: function OptionsOnlyRender() {
		const [value, setValue] = useState('moscow');
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-3)'
			}}
			>
				<SuggestField
					label='Город (только из списка)'
					options={CITY_OPTIONS}
					value={value}
					onChange={setValue}
					allowCustom={false}
				/>
				<span style={{
					fontSize: 'var(--altum-g-font-size-sm)',
					color: 'var(--altum-color-muted)'
				}}
				>
					value: 
					{' '}
					{value || '—'}
				</span>
			</div>
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
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-3)',
				maxWidth: 360,
			}}
			>
				<SuggestField
					label='Город'
					options={CITY_OPTIONS}
					value={value}
					onChange={setValue}
					onClear={() => setValue('')}
					width='full'
				/>
				<span style={{
					fontSize: 'var(--altum-g-font-size-sm)',
					color: 'var(--altum-color-muted)'
				}}
				>
					value:
					{' '}
					{value || '—'}
				</span>
			</div>
		);
	},
	parameters: story('Кнопка очистки сбрасывает ввод и выбранное значение.'),
};

export const LabelPlacement: Story<SuggestFieldProps> = {
	render: function LabelPlacementRender() {
		const [inline, setInline] = useState('');
		const [outside, setOutside] = useState('');
		const [none, setNone] = useState('');
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-4)',
				maxWidth: 360,
			}}
			>
				<SuggestField
					label='Город (inline)'
					options={CITY_OPTIONS}
					value={inline}
					onChange={setInline}
					labelPlacement='inline'
					width='full'
				/>
				<SuggestField
					label='Город (outside)'
					options={CITY_OPTIONS}
					value={outside}
					onChange={setOutside}
					labelPlacement='outside'
					placeholder='Начните вводить'
					width='full'
				/>
				<SuggestField
					label='Город'
					options={CITY_OPTIONS}
					value={none}
					onChange={setNone}
					labelPlacement='none'
					placeholder='Без лейбла'
					width='full'
				/>
			</div>
		);
	},
	parameters: story('`labelPlacement` + видимый placeholder вне `inline`.'),
};
