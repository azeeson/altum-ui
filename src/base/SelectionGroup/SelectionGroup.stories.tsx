import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {
	SelectionGroup,
	type SelectionGroupCheckboxProps,
	type SelectionGroupRadioProps,
	type SelectionOption,
} from './SelectionGroup';
import {Stack} from '../../components/Layout';
import {Text} from '../../components/Text/Text';
import {Card} from '../../components/Card/Card';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Base/SelectionGroup',
	component: SelectionGroup,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Выбор по `options` на треке `ButtonGroup`: кнопки — `Button`. `type` `radio` / `checkbox`. Бегунок — SegmentedControl.',
	),
	argTypes: {
		orientation: {
			control: {
				type: 'select',
				options: ['horizontal', 'vertical'],
			},
		},
		disabled: {
			control: 'boolean',
		},
		readOnly: {
			control: 'boolean',
		},
		activateOnFocus: {
			control: 'boolean',
			description: 'Менять value стрелками',
		},
		onChange: {
			action: 'change',
		},
		type: {
			control: {
				type: 'select',
				options: ['radio', 'checkbox'],
			},
		},
	},
} satisfies Meta<typeof SelectionGroup>;

const PERIODS: SelectionOption[] = [
	{
		value: 'day',
		label: 'День',
	},
	{
		value: 'week',
		label: 'Неделя',
	},
	{
		value: 'month',
		label: 'Месяц',
	},
];

export const Playground: Story<SelectionGroupRadioProps> = {
	render: function RadiogroupRender(args) {
		const [value, setValue] = useState('day');

		return (
			<SelectionGroup
				{...args}
				options={PERIODS}
				value={value}
				onChange={(next) => {
					setValue(next);
					args.onChange?.(next);
				}}
				aria-label='Период'
			/>
		);
	},
	args: {
		orientation: 'horizontal',
		disabled: false,
		readOnly: false,
		activateOnFocus: true,
	},
	parameters: story('Один выбранный пункт из `options`.'),
};

export const Vertical: Story<SelectionGroupRadioProps> = {
	render: function VerticalRender() {
		const [value, setValue] = useState('week');

		return (
			<SelectionGroup
				options={PERIODS}
				value={value}
				onChange={setValue}
				orientation='vertical'
				aria-label='Период'
			/>
		);
	},
	parameters: story('`orientation="vertical"`.'),
};

export const Disabled: Story<SelectionGroupRadioProps> = {
	render: () => (
		<SelectionGroup
			options={PERIODS}
			value='week'
			disabled
			aria-label='Период'
		/>
	),
	parameters: story('`disabled` на группе — все пункты недоступны.'),
};

export const Interaction: Story<SelectionGroupRadioProps> = {
	render: function InteractionRender() {
		const [value, setValue] = useState('day');
		return (
			<Stack gap='sm'>
				<SelectionGroup
					options={PERIODS}
					value={value}
					onChange={setValue}
					aria-label='Период'
				/>
				<Text size='sm' color='muted'>
					{value}
				</Text>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		const month = Array.from(canvasElement.querySelectorAll('[role="radio"]'))
			.find((item) => item.textContent?.includes('Месяц')) as HTMLButtonElement | undefined;
		month?.click();
		month?.focus();
	},
	parameters: story('Play выбирает «Месяц».'),
};

export const UsageExample: Story<SelectionGroupRadioProps> = {
	render: function UsageExampleRender() {
		const [value, setValue] = useState('week');
		return (
			<Card
				style={{maxWidth: 360}}
				header={(
					<Text weight='bold'>
						Период отчёта
					</Text>
				)}
			>
				<Stack gap='md'>
					<SelectionGroup
						options={PERIODS}
						value={value}
						onChange={setValue}
						aria-label='Период'
					/>
					<Text size='sm'>
						Показаны данные за
						{' '}
						{value === 'day' ? 'день' : value === 'week' ? 'неделю' : 'месяц'}
						.
					</Text>
				</Stack>
			</Card>
		);
	},
	parameters: story('Выбор периода в карточке отчёта.'),
};

const MARKS: SelectionOption[] = [
	{
		value: 'bold',
		label: 'Жирный',
	},
	{
		value: 'italic',
		label: 'Курсив',
	},
];

export const CheckboxButtons: Story<SelectionGroupCheckboxProps> = {
	render: function CheckboxButtonsRender() {
		const [marks, setMarks] = useState<string[]>(['italic']);

		return (
			<Stack gap='sm'>
				<SelectionGroup
					type='checkbox'
					options={MARKS}
					value={marks}
					onChange={setMarks}
					aria-label='Форматирование'
				/>
				<Text size='sm' color='muted'>
					{marks.join(', ') || 'ничего'}
				</Text>
			</Stack>
		);
	},
	parameters: story('`type="checkbox"`: несколько пунктов, без бегунка.'),
};
