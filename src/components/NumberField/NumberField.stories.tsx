import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {NumberField, NumberFieldProps} from './NumberField';
import {TextField} from '../TextField/TextField';
import {FieldLabel} from '../FieldLabel/FieldLabel';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/NumberField',
	component: NumberField,
	tags: ['autodocs'],
	parameters: componentParameters('Числовое поле с кнопками ± на ButtonGroup и ограничениями min/max.'),
	argTypes: {
		label: {
			control: 'text',
			description: 'Метка поля'
		},
		min: {
			control: 'number',
			description: 'Минимальное значение'
		},
		max: {
			control: 'number',
			description: 'Максимальное значение'
		},
	},
} satisfies Meta<typeof NumberField>;

export const Playground: Story<NumberFieldProps> = {
	render: function PlaygroundRender(args) {
		const [val, setVal] = useState<number | undefined>(10);
		return (
			<NumberField
				{...args}
				value={val}
				onChange={setVal}
				id='story-num'
			/>
		);
	},
	args: {
		label: 'Количество',
		min: 0,
		max: 100,
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const WithClear: Story<NumberFieldProps> = {
	render: function WithClearRender() {
		const [val, setVal] = useState<number | undefined>(10);
		return (
			<div style={{maxWidth: 280}}>
				<NumberField
					label='Количество'
					value={val}
					onChange={setVal}
					onClear={() => setVal(undefined)}
					min={0}
					max={100}
					id='story-num-clear'
					width='full'
				/>
			</div>
		);
	},
	parameters: story('Кнопка очистки при `onClear` — сбрасывает значение в пустое поле.'),
};

export const Disabled: Story<NumberFieldProps> = {
	render: () => (
		<div style={{maxWidth: 280}}>
			<NumberField
				label='Количество'
				value={42}
				onChange={() => {}}
				min={0}
				max={100}
				disabled
				id='story-num-disabled'
				width='full'
			/>
		</div>
	),
	parameters: story('Заблокированное поле — ± недоступны.'),
};

/** Степперы / нативные стрелки никогда не должны уходить ниже min. */
export const BoundedMin: Story<NumberFieldProps> = {
	render: function BoundedMinRender() {
		const [val, setVal] = useState<number | undefined>(1);
		return (
			<div style={{maxWidth: 280}}>
				<NumberField
					label='Минимум 1'
					value={val}
					onChange={setVal}
					min={1}
					max={100}
					id='story-num-bounded'
					width='full'
					helperText='Spam − / ArrowDown — значение ≥ 1'
				/>
			</div>
		);
	},
	parameters: story('`min={1}` — decrement отключён на нижней границе; clamp при blur/change.'),
};

/** NumberField в строке настроек с горизонтальным FieldLabel vs TextField с верхним лейблом. */
export const SettingsRow: Story<NumberFieldProps> = {
	render: function SettingsRowRender() {
		const [name, setName] = useState('Project');
		const [cols, setCols] = useState<number | undefined>(3);
		const [rows, setRows] = useState<number | undefined>(2);
		return (
			<div style={{
				maxWidth: 360,
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-4)',
			}}
			>
				<TextField
					label='Название'
					value={name}
					onChange={(e) => setName(e.target.value)}
					size='sm'
					width='full'
					id='story-nf-name'
				/>
				<FieldLabel
					label='Колонки'
					layout='horizontal'
					htmlFor='story-nf-cols'
					size='sm'
				>
					<NumberField
						label='Колонки'
						labelPlacement='none'
						value={cols}
						onChange={setCols}
						size='sm'
						min={1}
						max={12}
						width='full'
						id='story-nf-cols'
					/>
				</FieldLabel>
				<FieldLabel
					label='Строки'
					layout='horizontal'
					htmlFor='story-nf-rows'
					size='sm'
				>
					<NumberField
						label='Строки'
						labelPlacement='none'
						value={rows}
						onChange={setRows}
						size='sm'
						min={1}
						max={12}
						width='full'
						id='story-nf-rows'
					/>
				</FieldLabel>
			</div>
		);
	},
	parameters: story(
		'TextField top-label + NumberField sm с `labelPlacement="none"` и FieldLabel horizontal; denser spin inset.',
	),
};

