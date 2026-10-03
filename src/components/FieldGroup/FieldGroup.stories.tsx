import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {FieldGroup, type FieldGroupProps} from './FieldGroup';
import {TextField} from '../TextField/TextField';
import {Button} from '../Button/Button';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {ButtonGroup} from '../ButtonGroup/ButtonGroup';
import {Select} from '../Select/Select';
import {NumberField} from '../NumberField/NumberField';
import {PopupSwitch} from '../PopupSwitch/PopupSwitch';
import {IconPlus} from '../../icons/icons/IconPlus';
import {Stack} from '../Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

const CITIES = [
	{
		label: 'Москва',
		value: 'msk',
	},
	{
		label: 'Казань',
		value: 'kzn',
	},
];

const DISTRICTS = [
	{
		label: 'Центр',
		value: 'center',
	},
	{
		label: 'Север',
		value: 'north',
	},
];

const PERIODS = [
	{
		label: 'День',
		value: 'day',
	},
	{
		label: 'Неделя',
		value: 'week',
	},
	{
		label: 'Месяц',
		value: 'month',
	},
];

export default {
	title: 'altum/Components/FieldGroup',
	component: FieldGroup,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Ряд без своего визуала: TextField, Select и другие поля на TextField, а также Button, icon-only Button, ButtonGroup и PopupSwitch встают вплотную. На стыке пропадает скругление и двойная рамка.',
	),
	argTypes: {
		width: {
			control: {
				type: 'select',
				options: ['auto', 'full'],
			},
			description: 'auto — по содержимому; full — поля делят ширину родителя',
		},
		children: {control: false},
	},
} satisfies Meta<typeof FieldGroup>;

export const Playground: Story<FieldGroupProps> = {
	args: {
		width: 'auto',
	},
	render: function PlaygroundRender(args) {
		return (
			<FieldGroup {...args}>
				<TextField
					aria-label='Сумма'
					placeholder='Сумма'
				/>
				<Button variant='secondary'>
					OK
				</Button>
			</FieldGroup>
		);
	},
};

export const SelectWithIconButton: Story<FieldGroupProps> = {
	render: () => (
		<FieldGroup>
			<Select
				aria-label='Город'
				options={CITIES}
				defaultValue='msk'
			/>
			<ButtonIcon
				variant='secondary'
				aria-label='Добавить'
				icon={<IconPlus/>}
			/>
		</FieldGroup>
	),
	parameters: story('Select и icon-only Button: внешние углы скруглены, стык прямой.'),
};

export const NumberWithPopupSwitch: Story<FieldGroupProps> = {
	render: function NumberWithPopupSwitchRender() {
		const [qty, setQty] = useState(2);
		const [period, setPeriod] = useState('week');

		return (
			<FieldGroup>
				<NumberField
					aria-label='Количество'
					value={qty}
					min={1}
					max={99}
					onChange={(next) => {
						if (next !== undefined) setQty(next);
					}}
				/>
				<PopupSwitch
					aria-label='Период'
					options={PERIODS}
					value={period}
					onChange={setPeriod}
				/>
			</FieldGroup>
		);
	},
	parameters: story('NumberField и PopupSwitch. Панель периода не входит в ряд.'),
};

export const TwoSelects: Story<FieldGroupProps> = {
	render: () => (
		<FieldGroup>
			<Select
				aria-label='Город'
				options={CITIES}
				defaultValue='msk'
			/>
			<Select
				aria-label='Район'
				options={DISTRICTS}
				defaultValue='center'
			/>
		</FieldGroup>
	),
	parameters: story('Два Select делят одну линию рамки.'),
};

export const WithButtonGroup: Story<FieldGroupProps> = {
	render: () => (
		<FieldGroup>
			<TextField
				aria-label='Поиск'
				placeholder='Поиск'
			/>
			<ButtonGroup aria-label='Вид'>
				<Button>
					Список
				</Button>
				<Button>
					Сетка
				</Button>
			</ButtonGroup>
		</FieldGroup>
	),
	parameters: story('Скругляется внешний контур ButtonGroup, не пункты внутри.'),
};

export const FullWidth: Story<FieldGroupProps> = {
	render: () => (
		<FieldGroup width='full'>
			<TextField
				aria-label='Запрос'
				placeholder='Запрос'
			/>
			<Button variant='primary'>
				Найти
			</Button>
		</FieldGroup>
	),
	parameters: story('`width="full"`: поле забирает свободную ширину, кнопка остаётся по тексту.'),
};

export const ThreeSegments: Story<FieldGroupProps> = {
	render: () => (
		<FieldGroup>
			<TextField
				aria-label='Название'
				placeholder='Название'
			/>
			<Button variant='secondary'>
				Проверить
			</Button>
			<ButtonIcon
				variant='secondary'
				aria-label='Добавить'
				icon={<IconPlus/>}
			/>
		</FieldGroup>
	),
	parameters: story('Средний сегмент без скругления с обеих сторон.'),
};

export const Circle: Story<FieldGroupProps> = {
	render: () => (
		<FieldGroup>
			<TextField
				aria-label='Тег'
				placeholder='Тег'
			/>
			<ButtonIcon
				variant='secondary'
				data-shape='circle'
				aria-label='Добавить'
				icon={<IconPlus/>}
			/>
		</FieldGroup>
	),
	parameters: story('Круглый icon-only Button на стыке прямой, снаружи остаётся полукругом.'),
};

export const Interaction: Story<FieldGroupProps> = {
	render: function InteractionRender() {
		const [query, setQuery] = useState('');
		const [city, setCity] = useState('msk');
		const [period, setPeriod] = useState('day');

		return (
			<Stack gap='md'>
				<FieldGroup>
					<TextField
						aria-label='Запрос'
						placeholder='Запрос'
						value={query}
						onChange={(event) => {
							setQuery(event.target.value);
						}}
					/>
					<Button variant='secondary'>
						Найти
					</Button>
				</FieldGroup>
				<FieldGroup>
					<Select
						aria-label='Город'
						options={CITIES}
						value={city}
						onChange={(next) => {
							if (typeof next === 'string') setCity(next);
						}}
					/>
					<ButtonIcon
						variant='secondary'
						aria-label='Добавить'
						icon={<IconPlus/>}
					/>
				</FieldGroup>
				<FieldGroup>
					<PopupSwitch
						aria-label='Период'
						options={PERIODS}
						value={period}
						onChange={setPeriod}
					/>
					<Button variant='primary'>
						Применить
					</Button>
				</FieldGroup>
			</Stack>
		);
	},
	parameters: story('Ввод, список Select и панель PopupSwitch не ломают стык ряда.'),
};
