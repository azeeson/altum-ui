import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Radio, RadioGroup, RadioProps} from './Radio';
import {Inline, Stack} from '../Layout/Layout';
import {Card} from '../Card/Card';
import {Text} from '../Text/Text';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Radio',
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
		readOnly: {
			control: 'boolean',
		},
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg'],
			},
		},
		onChange: {
			action: 'change',
		},
	},
} satisfies Meta<typeof Radio>;

export const Playground: Story<RadioProps> = {
	args: {
		label: 'Режим: Ручной',
		checked: true,
		size: 'md',
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
				label='Способ оплаты'
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

export const Horizontal: Story<RadioProps> = {
	render: function HorizontalRender() {
		const [val, setVal] = useState('md');
		return (
			<RadioGroup
				name='size'
				label='Размер'
				orientation='horizontal'
				options={[
					{
						label: 'S',
						value: 'sm'
					},
					{
						label: 'M',
						value: 'md'
					},
					{
						label: 'L',
						value: 'lg'
					},
				]}
				value={val}
				onChange={setVal}
			/>
		);
	},
	parameters: story('`orientation="horizontal"`.'),
};

export const Sizes: Story<RadioProps> = {
	render: () => (
		<Stack gap='md'>
			<Radio
				name='sz'
				label='sm'
				size='sm'
				checked
				onChange={() => {}}
			/>
			<Radio
				name='sz'
				label='md'
				size='md'
				onChange={() => {}}
			/>
			<Radio
				name='sz'
				label='lg'
				size='lg'
				onChange={() => {}}
			/>
		</Stack>
	),
	parameters: story('Размеры sm / md / lg.'),
};

export const Disabled: Story<RadioProps> = {
	render: () => (
		<Stack gap='sm'>
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
		</Stack>
	),
	parameters: story('Отдельная опция с `disabled`.'),
};

export const ReadOnly: Story<RadioProps> = {
	render: () => (
		<RadioGroup
			name='readonly-plan'
			label='Тариф'
			readOnly
			options={[
				{
					label: 'Базовый',
					value: 'basic'
				},
				{
					label: 'Pro',
					value: 'pro'
				},
			]}
			value='pro'
			onChange={() => {}}
		/>
	),
	parameters: story('Группа `readOnly` — выбор виден, клик не меняет значение.'),
};

export const OverflowText: Story<RadioProps> = {
	render: () => (
		<div style={{maxWidth: 240}}>
			<Radio
				name='long'
				label='Соглашаюсь на обработку персональных данных и получение информационных рассылок'
				checked
				onChange={() => {}}
			/>
		</div>
	),
	parameters: story('Длинная подпись в узком контейнере.'),
};

export const Interaction: Story<RadioProps> = {
	render: function InteractionRender() {
		const [val, setVal] = useState('card');
		return (
			<Stack gap='sm'>
				<RadioGroup
					name='pay-play'
					options={[
						{
							label: 'Карта',
							value: 'card'
						},
						{
							label: 'Счёт',
							value: 'invoice'
						},
					]}
					value={val}
					onChange={setVal}
				/>
				<Text size='sm' color='muted'>
					{val}
				</Text>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		const invoice = Array.from(canvasElement.querySelectorAll('input[type="radio"]'))
			.find((input) => (input as HTMLInputElement).value === 'invoice') as HTMLInputElement | undefined;
		invoice?.click();
		invoice?.focus();
	},
	parameters: story('Play выбирает «Счёт» и ставит фокус.'),
};

export const UsageExample: Story<RadioProps> = {
	render: function UsageExampleRender() {
		const [plan, setPlan] = useState('pro');
		return (
			<Card
				style={{maxWidth: 360}}
				header={(
					<Text weight='bold'>
						Тариф
					</Text>
				)}
			>
				<Stack gap='md'>
					<RadioGroup
						name='plan-card'
						options={[
							{
								label: 'Базовый — 0 ₽',
								value: 'free'
							},
							{
								label: 'Pro — 990 ₽ / мес',
								value: 'pro'
							},
							{
								label: 'Корпоративный',
								value: 'enterprise'
							},
						]}
						value={plan}
						onChange={setPlan}
					/>
					<Inline gap='sm'>
						<Button size='sm'>
							Продолжить
						</Button>
						<Button
							size='sm'
							variant='ghost'
						>
							Позже
						</Button>
					</Inline>
				</Stack>
			</Card>
		);
	},
	parameters: story('Выбор тарифа в карточке с кнопками.'),
};
