import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {TimePicker, TimePickerField, TimePickerProps} from './TimePicker';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/TimePicker',
	component: TimePicker,
	tags: ['autodocs'],
	parameters: componentParameters('Выбор времени в формате ЧЧ:ММ — отдельный компонент или поле с меткой.'),
	argTypes: {},
} satisfies Meta<typeof TimePicker>;

export const Playground: Story<TimePickerProps> = {
	render: function PlaygroundRender() {
		const [val, setVal] = useState('12:00');
		return <TimePicker value={val} onChange={setVal} />;
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const FieldVariant: Story<TimePickerProps> = {
	render: function FieldVariantRender() {
		const [val, setVal] = useState('14:30');
		return (
			<TimePickerField
				label='Укажите точное время'
				value={val}
				onChange={setVal}
			/>
		);
	},
	parameters: story('TimePickerField с меткой поля.'),
};

export const FieldCustomMinute: Story<TimePickerProps> = {
	render: function FieldCustomMinuteRender() {
		const [val, setVal] = useState('14:32');
		return (
			<TimePickerField
				label='Произвольные минуты'
				value={val}
				onChange={setVal}
			/>
		);
	},
	parameters: story('Минуты вне шага 5: прокрутка к ближайшему значению, без подсветки минут.'),
};

export const FieldWithClear: Story<TimePickerProps> = {
	render: function FieldWithClearRender() {
		const [val, setVal] = useState('09:30');
		return (
			<div style={{maxWidth: 280}}>
				<TimePickerField
					label='Время начала'
					value={val}
					onChange={setVal}
					onClear={() => setVal('')}
				/>
			</div>
		);
	},
	parameters: story('Кнопка очистки при `onClear` — сбрасывает время.'),
};
