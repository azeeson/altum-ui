import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {NumberField, NumberFieldProps} from './NumberField';
import {TextField} from '../TextField/TextField';
import {FieldLabel} from '../FieldLabel/FieldLabel';
import {Button} from '../Button/Button';
import {Fieldset} from '../Fieldset/Fieldset';
import {Stack, Inline} from '../Layout/Layout';
import {
	componentParameters,
	fieldArgTypes,
	STORY_OVERFLOW_LABEL,
	story,
	Story,
} from '../../storybook/meta';
import {playClick, playFocus} from '../../storybook/play';

export default {
	title: 'altum/Components/FormField/NumberField',
	component: NumberField,
	tags: ['autodocs'],
	parameters: componentParameters('Числовое поле с кнопками ± и ограничениями min/max.'),
	args: {
		label: 'Количество',
		min: 0,
		max: 100,
		size: 'md',
	},
	argTypes: {
		...fieldArgTypes,
		min: {
			control: 'number',
			description: 'Минимальное значение',
		},
		max: {
			control: 'number',
			description: 'Максимальное значение',
		},
		step: {
			control: 'number',
			description: 'Шаг степпера',
		},
		value: {
			control: 'number',
			description: 'Числовое значение (`undefined` — пустое поле)',
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
				onChange={(next) => {
					args.onChange?.(next);
					setVal(next);
				}}
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

export const Sizes: Story<NumberFieldProps> = {
	render: function SizesRender() {
		const [val, setVal] = useState<number | undefined>(8);
		return (
			<Stack gap='md' style={{maxWidth: 280}}>
				{(['sm', 'md', 'lg'] as const).map((size) => (
					<NumberField
						key={size}
						label={`Количество (${size})`}
						size={size}
						value={val}
						onChange={setVal}
						min={0}
						max={100}
						width='full'
					/>
				))}
			</Stack>
		);
	},
	parameters: story('Размеры `sm`–`lg`.'),
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

export const Error: Story<NumberFieldProps> = {
	render: () => (
		<div style={{maxWidth: 280}}>
			<NumberField
				label='Количество'
				value={0}
				onChange={() => {}}
				min={1}
				max={100}
				error='Минимум 1'
				width='full'
			/>
		</div>
	),
	parameters: story('Ошибка вне допустимого диапазона.'),
};

export const Empty: Story<NumberFieldProps> = {
	render: function EmptyRender() {
		const [val, setVal] = useState<number | undefined>(undefined);
		return (
			<div style={{maxWidth: 280}}>
				<NumberField
					label='Количество'
					value={val}
					onChange={setVal}
					min={0}
					max={100}
					helperText='Не задано — пустое поле'
					width='full'
				/>
			</div>
		);
	},
	parameters: story('Пустое значение (`undefined`).'),
};

export const OverflowText: Story<NumberFieldProps> = {
	render: function OverflowRender() {
		const [val, setVal] = useState<number | undefined>(42);
		return (
			<div style={{maxWidth: 240}}>
				<NumberField
					label={STORY_OVERFLOW_LABEL}
					value={val}
					onChange={setVal}
					min={0}
					max={100}
					width='full'
				/>
			</div>
		);
	},
	parameters: story('Длинный floating label рядом со степперами.'),
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
			<Stack gap='md' style={{maxWidth: 360}}>
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
			</Stack>
		);
	},
	parameters: story(
		'TextField top-label + NumberField sm с `labelPlacement="none"` и FieldLabel horizontal.',
	),
};

export const Focused: Story<NumberFieldProps> = {
	render: function FocusedRender() {
		const [val, setVal] = useState<number | undefined>(10);
		return (
			<div style={{maxWidth: 280}}>
				<NumberField
					label='Количество'
					value={val}
					onChange={setVal}
					min={0}
					max={100}
					width='full'
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playFocus(canvasElement, 'input');
	},
	parameters: story('Программный фокус — chrome `:focus-within`.'),
};

export const Interaction: Story<NumberFieldProps> = {
	render: function InteractionRender() {
		const [val, setVal] = useState<number | undefined>(10);
		return (
			<div style={{maxWidth: 280}}>
				<NumberField
					label='Количество'
					value={val}
					onChange={setVal}
					min={0}
					max={100}
					width='full'
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playClick(canvasElement, 'button[aria-label="Увеличить"]');
	},
	parameters: story('Play: клик «Увеличить» — 10 → 11.'),
};

export const UsageExample: Story<NumberFieldProps> = {
	render: function UsageExampleRender() {
		const [qty, setQty] = useState<number | undefined>(2);
		return (
			<div style={{maxWidth: 400}}>
				<Fieldset
					legend='Позиция заказа'
					footer={(
						<Inline gap='sm' justify='end'>
							<Button variant='primary'>
								В корзину
							</Button>
						</Inline>
					)}
				>
					<TextField
						label='Артикул'
						defaultValue='ALT-204'
						width='full'
					/>
					<NumberField
						label='Количество'
						value={qty}
						onChange={setQty}
						min={1}
						max={99}
						width='full'
					/>
				</Fieldset>
			</div>
		);
	},
	parameters: story('Количество в карточке товара рядом с артикулом.'),
};
