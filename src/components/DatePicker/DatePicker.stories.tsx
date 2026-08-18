import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {DatePicker, DatePickerProps} from './DatePicker';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/DatePicker',
	component: DatePicker,
	tags: ['autodocs'],
	parameters: componentParameters('Поле выбора даты с выпадающим календарём.'),
	argTypes: {
		label: {
			control: 'text',
			description: 'Метка поля'
		},
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg'],
			},
		},
		labelPlacement: {
			control: {
				type: 'select',
				options: ['inline', 'outside', 'none'],
			},
		},
		disabled: {
			control: 'boolean',
			description: 'Заблокированное состояние'
		},
	},
} satisfies Meta<typeof DatePicker>;

export const Playground: Story<DatePickerProps> = {
	render: function PlaygroundRender(args) {
		const [date, setDate] = useState<Date | undefined>(new Date());
		return (
			<DatePicker
				{...args}
				value={date}
				onChange={setDate}
			/>
		);
	},
	args: {
		label: 'Укажите дату',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const LabelPlacement: Story<DatePickerProps> = {
	render: function LabelPlacementRender() {
		const [inline, setInline] = useState<Date | undefined>();
		const [outside, setOutside] = useState<Date | undefined>();
		const [none, setNone] = useState<Date | undefined>();
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 16,
				maxWidth: 280,
			}}
			>
				<DatePicker
					label='Дата (inline)'
					value={inline}
					onChange={setInline}
					labelPlacement='inline'
				/>
				<DatePicker
					label='Дата (outside)'
					value={outside}
					onChange={setOutside}
					labelPlacement='outside'
					maskAsPlaceholder
				/>
				<DatePicker
					label='Дата'
					value={none}
					onChange={setNone}
					labelPlacement='none'
					maskAsPlaceholder
				/>
			</div>
		);
	},
	parameters: story('`labelPlacement` + `maskAsPlaceholder` вне inline.'),
};

export const Sizes: Story<DatePickerProps> = {
	render: function SizesRender() {
		const [date, setDate] = useState<Date | undefined>();
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 12,
				maxWidth: 280,
			}}
			>
				{(['sm', 'md', 'lg'] as const).map((size) => (
					<DatePicker
						key={size}
						label={`Размер ${size}`}
						value={date}
						onChange={setDate}
						size={size}
					/>
				))}
			</div>
		);
	},
	parameters: story('Размеры `ControlSize`: `sm`–`lg`.'),
};

export const WithClear: Story<DatePickerProps> = {
	render: function WithClearRender() {
		const [date, setDate] = useState<Date | undefined>(new Date());
		return (
			<div style={{maxWidth: 280}}>
				<DatePicker
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
