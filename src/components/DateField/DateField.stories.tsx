import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {DateField, DateFieldProps} from './DateField';
import {TimeField} from '../TimeField/TimeField';
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

const STORY_DATE = new Date(2026, 8, 8);

export default {
	title: 'altum/Components/FormField/DateField',
	component: DateField,
	tags: ['autodocs'],
	parameters: componentParameters('Поле выбора даты с выпадающим календарём.'),
	args: {
		label: 'Укажите дату',
		size: 'md',
	},
	argTypes: {
		...fieldArgTypes,
		maskAsPlaceholder: {
			control: 'boolean',
			description: 'Маска как placeholder вне inline',
		},
		value: {control: false},
	},
} satisfies Meta<typeof DateField>;

export const Playground: Story<DateFieldProps> = {
	render: function PlaygroundRender(args) {
		const [date, setDate] = useState<Date | undefined>(STORY_DATE);
		return (
			<DateField
				{...args}
				value={date}
				onChange={(next) => {
					args.onChange?.(next);
					setDate(next);
				}}
			/>
		);
	},
	args: {
		label: 'Укажите дату',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Sizes: Story<DateFieldProps> = {
	render: function SizesRender() {
		const [date, setDate] = useState<Date | undefined>();
		return (
			<Stack gap='sm' style={{maxWidth: 280}}>
				{(['sm', 'md', 'lg'] as const).map((size) => (
					<DateField
						key={size}
						label={`Размер ${size}`}
						value={date}
						onChange={setDate}
						size={size}
					/>
				))}
			</Stack>
		);
	},
	parameters: story('Размеры `ControlSize`: `sm`–`lg`.'),
};

export const LabelPlacement: Story<DateFieldProps> = {
	render: function LabelPlacementRender() {
		const [withLabel, setWithLabel] = useState<Date | undefined>();
		const [withoutLabel, setWithoutLabel] = useState<Date | undefined>();
		return (
			<Stack gap='md' style={{maxWidth: 280}}>
				<DateField
					label='Дата'
					value={withLabel}
					onChange={setWithLabel}
				/>
				<DateField
					aria-label='Дата'
					value={withoutLabel}
					onChange={setWithoutLabel}
					maskAsPlaceholder
				/>
			</Stack>
		);
	},
	parameters: story('С `label` — floating-лейбл; без `label` маска видна как placeholder.'),
};

export const Disabled: Story<DateFieldProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 280}}>
			<DateField
				label='Дата'
				value={STORY_DATE}
				onChange={() => undefined}
				disabled
			/>
			<DateField
				label='Дата'
				value={undefined}
				onChange={() => undefined}
				error='Укажите дату'
			/>
		</Stack>
	),
	parameters: story('`disabled` и ошибка.'),
};

export const Empty: Story<DateFieldProps> = {
	render: function EmptyRender() {
		const [date, setDate] = useState<Date | undefined>();
		return (
			<div style={{maxWidth: 280}}>
				<DateField
					label='Дата'
					value={date}
					onChange={setDate}
					description='Формат ДД.ММ.ГГГГ'
				/>
			</div>
		);
	},
	parameters: story('Пустое поле с подсказкой.'),
};

export const OverflowText: Story<DateFieldProps> = {
	render: function OverflowRender() {
		const [date, setDate] = useState<Date | undefined>(STORY_DATE);
		return (
			<div style={{maxWidth: 240}}>
				<DateField
					label={STORY_OVERFLOW_LABEL}
					value={date}
					onChange={setDate}
					width='full'
				/>
			</div>
		);
	},
	parameters: story('Длинный floating label на узком поле.'),
};

export const WithClear: Story<DateFieldProps> = {
	render: function WithClearRender() {
		const [date, setDate] = useState<Date | undefined>(STORY_DATE);
		return (
			<div style={{maxWidth: 280}}>
				<DateField
					label='Дата'
					value={date}
					onChange={setDate}
					onClear={() => setDate(undefined)}
				/>
			</div>
		);
	},
	parameters: story('Кнопка очистки при `onClear` — сбрасывает дату в `undefined`.'),
};

export const Focused: Story<DateFieldProps> = {
	render: function FocusedRender() {
		const [date, setDate] = useState<Date | undefined>(STORY_DATE);
		return (
			<div style={{maxWidth: 280}}>
				<DateField
					label='Дата'
					value={date}
					onChange={setDate}
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playFocus(canvasElement, 'input');
	},
	parameters: story('Фокус поля открывает календарь.'),
};

export const Interaction: Story<DateFieldProps> = {
	render: function InteractionRender() {
		const [date, setDate] = useState<Date | undefined>(STORY_DATE);
		return (
			<div style={{maxWidth: 280}}>
				<DateField
					label='Дата'
					value={date}
					onChange={setDate}
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playClick(canvasElement, 'input');
	},
	parameters: story('Play: клик по полю — сетка календаря.'),
};

export const UsageExample: Story<DateFieldProps> = {
	render: function UsageExampleRender() {
		const [date, setDate] = useState<Date | undefined>(STORY_DATE);
		const [time, setTime] = useState('09:30');
		return (
			<div style={{maxWidth: 400}}>
				<Fieldset
					legend='Встреча'
					description='Дата и время начала.'
					footer={(
						<Inline gap='sm' justify='end'>
							<Button variant='primary'>
								Создать
							</Button>
						</Inline>
					)}
				>
					<DateField
						label='Дата'
						value={date}
						onChange={setDate}
						onClear={() => setDate(undefined)}
						width='full'
					/>
					<TimeField
						label='Время'
						value={time}
						onChange={setTime}
						width='full'
					/>
				</Fieldset>
			</div>
		);
	},
	parameters: story('Связка DateField + TimeField в форме встречи.'),
};
