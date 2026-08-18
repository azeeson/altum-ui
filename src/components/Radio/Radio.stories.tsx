import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Radio, RadioGroup, RadioProps} from './Radio';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/Radio',
	component: Radio,
	tags: ['autodocs'],
	parameters: componentParameters('Переключатель для выбора одного значения из группы опций.'),
	argTypes: {
		label: {
			control: 'text',
			description: 'Метка переключателя'
		},
		checked: {
			control: 'boolean',
			description: 'Состояние выбора'
		},
		disabled: {
			control: 'boolean',
			description: 'Заблокированное состояние'
		},
	},
} satisfies Meta<typeof Radio>;

export const Playground: Story<RadioProps> = {
	args: {
		label: 'Режим: Ручной',
		checked: true,
		onChange: () => {},
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Group: Story<RadioProps> = {
	render: function GroupRender() {
		const [val, setVal] = useState('card');
		return (
			<RadioGroup
				name='payment'
				options={[
					{
						label: 'Кредитная карта',
						value: 'card'
					},
					{
						label: 'PayPal',
						value: 'paypal'
					},
					{
						label: 'ЮKassa',
						value: 'yandex'
					},
				]}
				value={val}
				onChange={setVal}
			/>
		);
	},
	parameters: story('Группа переключателей для выбора способа оплаты.'),
};

export const Disabled: Story<RadioProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			gap: 'var(--altum-g-space-2)',
		}}
		>
			<Radio
				name='plan'
				label='Бесплатный'
				value='free'
				checked
				onChange={() => {}}
			/>
			<Radio
				name='plan'
				label='Pro (недоступно)'
				value='pro'
				disabled
				onChange={() => {}}
			/>
			<Radio
				name='plan'
				label='Корпоративный'
				value='enterprise'
				onChange={() => {}}
			/>
		</div>
	),
	parameters: story('Отдельная опция с `disabled`.'),
};
