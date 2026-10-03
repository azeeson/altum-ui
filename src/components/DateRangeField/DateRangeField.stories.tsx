import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {DateRangeField, DateRangeFieldProps, type DateRangeValue} from './DateRangeField';
import {Text} from '../Text/Text';
import {Button} from '../Button/Button';
import {Fieldset} from '../Fieldset/Fieldset';
import {Stack, Inline} from '../Layout';
import {
	componentParameters,
	fieldArgTypes,
	STORY_OVERFLOW_LABEL,
	story,
	Story,
} from '../../storybook/meta';
import {playClick, playFocus} from '../../storybook/play';

const STORY_RANGE: DateRangeValue = {
	start: new Date(2026, 8, 1),
	end: new Date(2026, 8, 8),
};

export default {
	title: 'altum/Components/FormField/DateRangeField',
	component: DateRangeField,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Выбор диапазона дат: поле + календарь в режиме range.',
	),
	args: {
		label: 'Период отчёта',
		layout: 'single',
		size: 'md',
	},
	argTypes: {
		...fieldArgTypes,
		layout: {
			control: {
				type: 'inline-radio',
				options: ['single', 'split'],
			},
			description: 'Одно поле или два поля «С» / «По»',
		},
		startLabel: {
			control: 'text',
			description: 'Лейбл начала (split)',
		},
		endLabel: {
			control: 'text',
			description: 'Лейбл конца (split)',
		},
		value: {control: false},
	},
} satisfies Meta<typeof DateRangeField>;

export const Playground: Story<DateRangeFieldProps> = {
	render: function PlaygroundRender(args) {
		const [range, setRange] = useState<DateRangeValue>({});
		return (
			<Stack gap='md' style={{maxWidth: 360}}>
				<DateRangeField
					{...args}
					value={range}
					onChange={(next) => {
						args.onChange?.(next);
						setRange(next);
					}}
				/>
				<Text size='sm' color='secondary'>
					{range.start?.toLocaleDateString('ru-RU') ?? '—'}
					{' — '}
					{range.end?.toLocaleDateString('ru-RU') ?? '—'}
				</Text>
			</Stack>
		);
	},
	args: {
		label: 'Период отчёта',
		layout: 'single',
	},
	parameters: story('Одно поле диапазона и календарь. Playground пустой — лейбл не приподнят.'),
};

export const Variants: Story<DateRangeFieldProps> = {
	render: function VariantsRender() {
		const [single, setSingle] = useState<DateRangeValue>({});
		const [split, setSplit] = useState<DateRangeValue>({});

		return (
			<Stack gap='lg' style={{maxWidth: 420}}>
				<div>
					<Text size='sm' color='muted'>
						layout=&quot;single&quot;
					</Text>
					<DateRangeField
						label='Период'
						layout='single'
						value={single}
						onChange={setSingle}
					/>
				</div>
				<div>
					<Text size='sm' color='muted'>
						layout=&quot;split&quot;
					</Text>
					<DateRangeField
						layout='split'
						value={split}
						onChange={setSplit}
					/>
				</div>
			</Stack>
		);
	},
	parameters: story('Одно поле (`single`) и два поля «С» / «По» (`split`).'),
};

export const Sizes: Story<DateRangeFieldProps> = {
	render: function SizesRender() {
		const [range, setRange] = useState<DateRangeValue>(STORY_RANGE);
		return (
			<Stack gap='md' style={{maxWidth: 360}}>
				{(['sm', 'md', 'lg'] as const).map((size) => (
					<DateRangeField
						key={size}
						label={`Период (${size})`}
						size={size}
						value={range}
						onChange={setRange}
						width='full'
					/>
				))}
			</Stack>
		);
	},
	parameters: story('Размеры `sm`–`lg`.'),
};

export const Disabled: Story<DateRangeFieldProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 360}}>
			<DateRangeField
				label='Период'
				value={STORY_RANGE}
				onChange={() => undefined}
				disabled
			/>
			<DateRangeField
				label='Период'
				value={{}}
				onChange={() => undefined}
				error='Укажите обе границы'
			/>
		</Stack>
	),
	parameters: story('`disabled` и ошибка.'),
};

export const Empty: Story<DateRangeFieldProps> = {
	render: function EmptyRender() {
		const [range, setRange] = useState<DateRangeValue>({});
		return (
			<div style={{maxWidth: 360}}>
				<DateRangeField
					label='Период отчёта'
					value={range}
					onChange={setRange}
					description='Выберите начало и конец'
				/>
			</div>
		);
	},
	parameters: story('Пустой диапазон — лейбл не приподнят.'),
};

export const OverflowText: Story<DateRangeFieldProps> = {
	render: function OverflowRender() {
		const [range, setRange] = useState<DateRangeValue>(STORY_RANGE);
		return (
			<div style={{maxWidth: 260}}>
				<DateRangeField
					label={STORY_OVERFLOW_LABEL}
					value={range}
					onChange={setRange}
					width='full'
				/>
			</div>
		);
	},
	parameters: story('Длинный лейбл на узком поле диапазона.'),
};

export const Focused: Story<DateRangeFieldProps> = {
	render: function FocusedRender() {
		const [range, setRange] = useState<DateRangeValue>({});
		return (
			<div style={{maxWidth: 360}}>
				<DateRangeField
					label='Период отчёта'
					value={range}
					onChange={setRange}
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playFocus(canvasElement, 'input');
	},
	parameters: story('Фокус поля открывает календарь диапазона.'),
};

export const Interaction: Story<DateRangeFieldProps> = {
	render: function InteractionRender() {
		const [range, setRange] = useState<DateRangeValue>({});
		return (
			<div style={{maxWidth: 360}}>
				<DateRangeField
					label='Период отчёта'
					value={range}
					onChange={setRange}
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playClick(canvasElement, 'input');
	},
	parameters: story('Play: клик по полю — сетка календаря.'),
};

export const UsageExample: Story<DateRangeFieldProps> = {
	render: function UsageExampleRender() {
		const [range, setRange] = useState<DateRangeValue>({});
		return (
			<div style={{maxWidth: 440}}>
				<Fieldset
					legend='Отчёт'
					description='Период, за который нужно выгрузить данные.'
					footer={(
						<Inline gap='sm' justify='end'>
							<Button variant='secondary'>
								Сбросить
							</Button>
							<Button variant='primary'>
								Скачать
							</Button>
						</Inline>
					)}
				>
					<DateRangeField
						label='Период отчёта'
						value={range}
						onChange={setRange}
						onClear={() => setRange({})}
						width='full'
					/>
				</Fieldset>
			</div>
		);
	},
	parameters: story('Диапазон дат в форме выгрузки отчёта.'),
};
