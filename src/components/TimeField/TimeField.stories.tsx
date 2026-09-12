import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {TimeField, type TimeFieldProps} from './TimeField';
import {DateField} from '../DateField/DateField';
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
	title: 'altum/Components/FormField/TimeField',
	component: TimeField,
	tags: ['autodocs'],
	parameters: componentParameters('Поле времени с маской ЧЧ:ММ и барабанами часов и минут.'),
	args: {
		label: 'Время',
		size: 'md',
		labelPlacement: 'inline',
	},
	argTypes: {
		...fieldArgTypes,
		value: {
			control: 'text',
			description: 'Строка `ЧЧ:ММ`',
		},
	},
} satisfies Meta<typeof TimeField>;

export const Playground: Story<TimeFieldProps> = {
	render: function PlaygroundRender(args) {
		const [val, setVal] = useState('12:00');
		return (
			<TimeField
				{...args}
				value={val}
				onChange={(next) => {
					args.onChange?.(next);
					setVal(next);
				}}
			/>
		);
	},
	args: {
		label: 'Время',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const CustomMinute: Story<TimeFieldProps> = {
	render: function CustomMinuteRender() {
		const [val, setVal] = useState('14:32');
		return (
			<TimeField
				label='Укажите точное время'
				value={val}
				onChange={setVal}
			/>
		);
	},
	parameters: story('Произвольные минуты в значении поля.'),
};

export const Sizes: Story<TimeFieldProps> = {
	render: function SizesRender() {
		const [val, setVal] = useState('09:30');
		return (
			<Stack gap='md' style={{maxWidth: 280}}>
				{(['sm', 'md', 'lg'] as const).map((size) => (
					<TimeField
						key={size}
						label={`Время (${size})`}
						size={size}
						value={val}
						onChange={setVal}
						width='full'
					/>
				))}
			</Stack>
		);
	},
	parameters: story('Размеры `sm`–`lg`.'),
};

export const LabelPlacement: Story<TimeFieldProps> = {
	render: function LabelPlacementRender() {
		const [inline, setInline] = useState('');
		const [outside, setOutside] = useState('');
		const [none, setNone] = useState('');
		return (
			<Stack gap='md' style={{maxWidth: 280}}>
				<TimeField
					label='Время (inline)'
					value={inline}
					onChange={setInline}
					labelPlacement='inline'
					width='full'
				/>
				<TimeField
					label='Время (outside)'
					value={outside}
					onChange={setOutside}
					labelPlacement='outside'
					maskAsPlaceholder
					width='full'
				/>
				<TimeField
					label='Время'
					value={none}
					onChange={setNone}
					labelPlacement='none'
					maskAsPlaceholder
					width='full'
				/>
			</Stack>
		);
	},
	parameters: story('`labelPlacement` + `maskAsPlaceholder` вне inline.'),
};

export const Disabled: Story<TimeFieldProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 280}}>
			<TimeField
				label='Время'
				value='12:00'
				onChange={() => undefined}
				disabled
			/>
			<TimeField
				label='Время'
				value=''
				onChange={() => undefined}
				error='Укажите время'
			/>
		</Stack>
	),
	parameters: story('`disabled` и ошибка.'),
};

export const Empty: Story<TimeFieldProps> = {
	render: function EmptyRender() {
		const [val, setVal] = useState('');
		return (
			<div style={{maxWidth: 280}}>
				<TimeField
					label='Время'
					value={val}
					onChange={setVal}
					helperText='Формат ЧЧ:ММ'
				/>
			</div>
		);
	},
	parameters: story('Пустое поле с подсказкой.'),
};

export const OverflowText: Story<TimeFieldProps> = {
	render: function OverflowRender() {
		const [val, setVal] = useState('18:45');
		return (
			<div style={{maxWidth: 240}}>
				<TimeField
					label={STORY_OVERFLOW_LABEL}
					value={val}
					onChange={setVal}
					width='full'
				/>
			</div>
		);
	},
	parameters: story('Длинный floating label на узком поле.'),
};

export const WithClear: Story<TimeFieldProps> = {
	render: function WithClearRender() {
		const [val, setVal] = useState('12:00');
		return (
			<div style={{maxWidth: 280}}>
				<TimeField
					label='Время'
					value={val}
					onChange={setVal}
					onClear={() => setVal('')}
					width='full'
				/>
			</div>
		);
	},
	parameters: story('Кнопка очистки сбрасывает время.'),
};

export const Focused: Story<TimeFieldProps> = {
	render: function FocusedRender() {
		const [val, setVal] = useState('12:00');
		return (
			<div style={{maxWidth: 280}}>
				<TimeField
					label='Время'
					value={val}
					onChange={setVal}
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playFocus(canvasElement, 'input');
	},
	parameters: story('Фокус поля открывает барабаны часов и минут.'),
};

export const Interaction: Story<TimeFieldProps> = {
	render: function InteractionRender() {
		const [val, setVal] = useState('12:00');
		return (
			<div style={{maxWidth: 280}}>
				<TimeField
					label='Время'
					value={val}
					onChange={setVal}
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playClick(canvasElement, 'input');
	},
	parameters: story('Play: клик по полю — барабаны часов и минут.'),
};

export const UsageExample: Story<TimeFieldProps> = {
	render: function UsageExampleRender() {
		const [date, setDate] = useState<Date | undefined>(new Date(2026, 8, 8));
		const [start, setStart] = useState('09:00');
		const [end, setEnd] = useState('10:30');
		return (
			<div style={{maxWidth: 400}}>
				<Fieldset
					legend='Слот'
					description='Дата и интервал времени.'
					footer={(
						<Inline gap='sm' justify='end'>
							<Button variant='primary'>
								Забронировать
							</Button>
						</Inline>
					)}
				>
					<DateField
						label='Дата'
						value={date}
						onChange={setDate}
						width='full'
					/>
					<Inline gap='sm' align='end'>
						<TimeField
							label='С'
							value={start}
							onChange={setStart}
							width='full'
						/>
						<TimeField
							label='По'
							value={end}
							onChange={setEnd}
							width='full'
						/>
					</Inline>
				</Fieldset>
			</div>
		);
	},
	parameters: story('Дата и два TimeField в форме бронирования.'),
};
