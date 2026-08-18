import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {SearchField, SearchFieldProps} from './SearchField';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/SearchField',
	component: SearchField,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Поле поиска с иконкой лупы; по умолчанию `labelPlacement="none"`.',
	),
	argTypes: {
		label: {
			control: 'text',
			description: 'Метка поля'
		},
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg']
			},
			description: 'Размер поля',
		},
		labelPlacement: {
			control: {
				type: 'select',
				options: ['inline', 'outside', 'none'],
			},
			description: 'По умолчанию none',
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
				],
			},
			description: 'Ширина оболочки',
		},
		placeholder: {
			control: 'text',
			description: 'Подсказка в поле'
		},
	},
} satisfies Meta<typeof SearchField>;

export const Playground: Story<SearchFieldProps> = {
	args: {
		label: 'Поиск задач',
		placeholder: 'Поиск…',
	},
	parameters: story('Используйте панель Controls для настройки. Default: `labelPlacement="none"`.'),
};

export const Sizes: Story<SearchFieldProps> = {
	render: function SizesRender() {
		const [val, setVal] = useState('');
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 12,
				maxWidth: 320,
			}}
			>
				{(['sm', 'md', 'lg'] as const).map((size) => (
					<div
						key={size}
						style={{
							display: 'flex',
							gap: 8,
							alignItems: 'center',
						}}
					>
						<SearchField
							label='Поиск'
							size={size}
							value={val}
							onChange={(e) => setVal(e.target.value)}
							placeholder={`size=${size}`}
							width='full'
						/>
						<Button size={size}>
							OK
						</Button>
					</div>
				))}
			</div>
		);
	},
	parameters: story('`sm`–`lg` рядом с Button.'),
};

export const LabelPlacement: Story<SearchFieldProps> = {
	render: function LabelPlacementRender() {
		const [val, setVal] = useState('');
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 16,
				maxWidth: 320,
			}}
			>
				{(['none', 'outside', 'inline'] as const).map((placement) => (
					<SearchField
						key={placement}
						label={`Поиск (${placement})`}
						labelPlacement={placement}
						value={val}
						onChange={(e) => setVal(e.target.value)}
						placeholder='Введите запрос'
						width='full'
					/>
				))}
			</div>
		);
	},
	parameters: story('По умолчанию — `none`; можно переключить на outside / inline.'),
};

export const FullWidth: Story<SearchFieldProps> = {
	args: {
		label: 'Поиск',
		width: 'full',
		placeholder: 'Поиск…',
	},
	parameters: story('Поле поиска на всю ширину контейнера.'),
};

export const WithClear: Story<SearchFieldProps> = {
	render: function WithClearRender() {
		const [val, setVal] = useState('дизайн-система');
		return (
			<div style={{maxWidth: 360}}>
				<SearchField
					label='Поиск'
					value={val}
					onChange={(e) => setVal(e.target.value)}
					onClear={() => setVal('')}
					width='full'
					placeholder='Поиск…'
				/>
			</div>
		);
	},
	parameters: story('Кнопка очистки при `onClear` — сбрасывает запрос.'),
};
