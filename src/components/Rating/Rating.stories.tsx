import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Rating, RatingProps} from './Rating';
import {Card} from '../Card/Card';
import {Inline, Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {Title} from '../Title/Title';
import {Avatar} from '../Avatar/Avatar';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';
import {playClick} from '../../storybook/play';

export default {
	title: 'altum/Components/Rating',
	component: Rating,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Оценка звёздами для отзывов и рейтингов.',
	),
	argTypes: {
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg']
			},
		},
		max: {
			control: 'number',
			description: 'Число звёзд',
		},
		disabled: {control: 'boolean'},
		readOnly: {control: 'boolean'},
		allowClear: {
			control: 'boolean',
			description: 'Сброс повторным кликом',
		},
		defaultValue: {control: 'number'},
		onChange: {action: 'change'},
	},
} satisfies Meta<typeof Rating>;

export const Playground: Story<RatingProps> = {
	render: function PlaygroundRender({
		defaultValue = 3,
		max = 5,
		onChange,
		...rest
	}) {
		const [value, setValue] = useState(defaultValue);

		return (
			<Stack gap='sm'>
				<Rating
					{...rest}
					max={max}
					value={value}
					onChange={(next) => {
						setValue(next);
						onChange?.(next);
					}}
				/>
				<Text size='sm'>
					Выбрано:
					{' '}
					{value}
					{' '}
					из
					{' '}
					{max}
				</Text>
			</Stack>
		);
	},
	args: {
		size: 'md',
		max: 5,
		defaultValue: 3,
		allowClear: true,
		disabled: false,
		readOnly: false,
		'aria-label': 'Оценка',
	},
	parameters: story('Контролируемый рейтинг с повторным кликом для сброса. Controls: size, max, disabled, readOnly.'),
};

export const Sizes: Story<RatingProps> = {
	render: () => (
		<Stack gap='md'>
			<Rating
				size='sm'
				defaultValue={4}
				aria-label='Малый'
			/>
			<Rating
				size='md'
				defaultValue={4}
				aria-label='Средний'
			/>
			<Rating
				size='lg'
				defaultValue={4}
				aria-label='Крупный'
			/>
		</Stack>
	),
	parameters: story('Размеры звёзд: `sm`, `md`, `lg`.'),
};

export const Empty: Story<RatingProps> = {
	render: () => (
		<Rating defaultValue={0} aria-label='Без оценки' />
	),
	parameters: story('Пустое значение — ни одна звезда не выбрана.'),
};

export const CustomMax: Story<RatingProps> = {
	render: () => (
		<Rating
			max={10}
			defaultValue={7}
			aria-label='Оценка из 10'
		/>
	),
	parameters: story('`max={10}` — шкала из десяти звёзд.'),
};

export const ReadOnly: Story<RatingProps> = {
	render: () => (
		<Rating
			value={4}
			readOnly
			aria-label='Только просмотр'
		/>
	),
	parameters: story('Только отображение без взаимодействия.'),
};

export const Disabled: Story<RatingProps> = {
	render: () => (
		<Rating
			value={2}
			disabled
			aria-label='Недоступно'
		/>
	),
	parameters: story('Недоступное состояние.'),
};

export const NoClear: Story<RatingProps> = {
	render: () => (
		<Rating
			defaultValue={3}
			allowClear={false}
			aria-label='Без сброса'
		/>
	),
	parameters: story('`allowClear={false}` — повторный клик не сбрасывает значение.'),
};

export const Interaction: Story<RatingProps> = {
	render: function InteractionRender() {
		const [value, setValue] = useState(0);
		return (
			<Stack gap='sm'>
				<Rating
					value={value}
					onChange={setValue}
					aria-label='Интерактивная оценка'
				/>
				<Text size='sm' data-testid='rating-value'>
					{value}
				</Text>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		await playClick(canvasElement, 'input[value="4"]');
	},
	parameters: story('Play: клик по 4-й звезде.'),
};

export const UsageExample: Story<RatingProps> = {
	render: function UsageExampleRender() {
		const [value, setValue] = useState(5);
		return (
			<div style={{maxWidth: 400}}>
				<Card>
					<Stack gap='md'>
						<Inline gap='sm' align='center'>
							<Avatar name='Мария Сидорова' size='sm' />
							<Stack gap='none'>
								<Title level={4}>
									Мария Сидорова
								</Title>
								<Text size='xs' color='muted'>
									Отзыв о доставке
								</Text>
							</Stack>
						</Inline>
						<Rating
							value={value}
							onChange={setValue}
							size='sm'
							aria-label='Оценка доставки'
						/>
						<Text
							as='p'
							size='sm'
							color='secondary'
						>
							Курьер приехал вовремя, заказ целый. Рекомендую.
						</Text>
						<Button size='sm' variant='secondary'>
							Ответить
						</Button>
					</Stack>
				</Card>
			</div>
		);
	},
	parameters: story('Карточка отзыва: аватар, рейтинг, текст и действие.'),
};
