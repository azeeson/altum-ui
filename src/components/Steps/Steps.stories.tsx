import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Steps, StepsProps} from './Steps';
import {Button} from '../Button/Button';
import {Inline, Stack} from '../Layout';
import {Text} from '../Text/Text';
import {TextField} from '../TextField/TextField';
import {Card} from '../Card/Card';
import {IconUser} from '../../icons/icons/IconUser';
import {componentParameters, story, Story} from '../../storybook/meta';

const STEPS = [{title: 'Авторизация'}, {title: 'Загрузка документов'}, {title: 'Подписание договора'},];

export default {
	title: 'altum/Components/Steps',
	component: Steps,
	tags: ['autodocs'],
	parameters: componentParameters('Пошаговый индикатор прогресса для многоэтапных процессов.'),
	argTypes: {
		currentStep: {
			control: {
				type: 'number',
				min: 0,
				max: 2,
			},
			description: 'Индекс текущего шага',
		},
		orientation: {
			control: {
				type: 'select',
				options: ['horizontal', 'vertical'],
			},
		},
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg'],
			},
		},
		showConnectors: {
			control: 'boolean',
			description: 'Линии между шагами',
		},
		onStepClick: {
			action: 'stepClick',
			description: 'Клик по шагу (индекс)',
		},
	},
} satisfies Meta<typeof Steps>;

export const Playground: Story<StepsProps> = {
	args: {
		currentStep: 1,
		items: STEPS,
		orientation: 'horizontal',
		size: 'md',
		showConnectors: true,
	},
	parameters: story('Controls: шаг, ориентация, размер, соединители.'),
};

export const Interactive: Story<StepsProps> = {
	render: function InteractiveRender() {
		const [current, setCurrent] = useState(0);
		return (
			<Stack gap='lg' style={{maxWidth: 600}}>
				<Steps
					currentStep={current}
					items={STEPS}
					onStepClick={setCurrent}
				/>
				<Inline gap='sm'>
					<Button
						variant='secondary'
						size='sm'
						disabled={current === 0}
						onClick={() => setCurrent(current - 1)}
					>
						Назад
					</Button>
					<Button
						variant='primary'
						size='sm'
						disabled={current === STEPS.length - 1}
						onClick={() => setCurrent(current + 1)}
					>
						Далее
					</Button>
				</Inline>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		const next = Array.from(canvasElement.querySelectorAll('button'))
			.find((button) => button.textContent?.includes('Далее'));
		next?.click();
	},
	parameters: story('Кликабельные шаги и кнопки Назад / Далее. Play кликает «Далее».'),
};

export const Vertical: Story<StepsProps> = {
	render: function VerticalRender() {
		const [current, setCurrent] = useState(1);
		return (
			<div style={{maxWidth: 320}}>
				<Steps
					orientation='vertical'
					currentStep={current}
					onStepClick={setCurrent}
					items={[
						{
							title: 'Контакты',
							description: 'Email и телефон'
						},
						{
							title: 'Адрес доставки',
							description: 'Город и индекс'
						},
						{
							title: 'Оплата',
							description: 'Карта или счёт'
						},
					]}
				/>
			</div>
		);
	},
	parameters: story('Вертикальная ориентация с описаниями.'),
};

export const WithIcons: Story<StepsProps> = {
	render: () => (
		<div style={{maxWidth: 640}}>
			<Steps
				currentStep={1}
				items={[
					{
						title: 'Профиль',
						status: 'complete',
					},
					{
						title: 'Подтверждение',
						status: 'current',
					},
					{
						title: 'Готово',
						icon: <IconUser size={14} aria-hidden />,
						status: 'pending'
					},
				]}
			/>
		</div>
	),
	parameters: story('Кастомные иконки в круге вместо номера.'),
};

export const ErrorStatus: Story<StepsProps> = {
	render: () => (
		<div style={{maxWidth: 640}}>
			<Steps
				currentStep={1}
				items={[
					{
						title: 'Контакты',
						status: 'complete'
					},
					{
						title: 'Оплата',
						status: 'error',
						description: 'Карта отклонена'
					},
					{
						title: 'Подтверждение',
						status: 'pending'
					},
				]}
			/>
		</div>
	),
	parameters: story('Явный `status="error"` на шаге.'),
};

export const DisabledStep: Story<StepsProps> = {
	render: function DisabledStepRender() {
		const [current, setCurrent] = useState(0);
		return (
			<div style={{maxWidth: 640}}>
				<Steps
					currentStep={current}
					onStepClick={setCurrent}
					items={[
						{title: 'Старт'},
						{
							title: 'Недоступно',
							disabled: true
						},
						{title: 'Финиш'},
					]}
				/>
			</div>
		);
	},
	parameters: story('Шаг с `disabled` не кликается.'),
};

export const CompactSizes: Story<StepsProps> = {
	render: () => (
		<Stack gap='lg' style={{maxWidth: 640}}>
			<Steps
				size='sm'
				currentStep={0}
				items={STEPS}
			/>
			<Steps
				size='md'
				currentStep={1}
				items={STEPS}
			/>
			<Steps
				size='lg'
				currentStep={2}
				items={STEPS}
			/>
		</Stack>
	),
	parameters: story('Размеры sm / md / lg.'),
};

export const NoConnectors: Story<StepsProps> = {
	args: {
		currentStep: 1,
		items: STEPS,
		showConnectors: false,
	},
	parameters: story('`showConnectors={false}` — без линий между шагами.'),
};

export const OverflowText: Story<StepsProps> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<Steps
				currentStep={1}
				size='sm'
				items={[
					{
						title: 'Очень длинное название первого шага регистрации',
						description: 'Подтверждение электронной почты и телефона'
					},
					{
						title: 'Загрузка комплекта документов',
					},
					{
						title: 'Подписание',
					},
				]}
			/>
		</div>
	),
	parameters: story('Длинные заголовки в узком контейнере.'),
};

export const UsageExample: Story<StepsProps> = {
	render: function UsageExampleRender() {
		const [current, setCurrent] = useState(0);
		return (
			<Card style={{maxWidth: 480}}>
				<Stack gap='lg'>
					<Steps
						currentStep={current}
						onStepClick={setCurrent}
						size='sm'
						items={[{title: 'Контакты'}, {title: 'Адрес'}, {title: 'Оплата'},]}
					/>
					{current === 0 && (
						<TextField
							label='Email'
							defaultValue='alex@example.com'
						/>
					)}
					{current === 1 && (
						<TextField
							label='Город'
							defaultValue='Москва'
						/>
					)}
					{current === 2 && (
						<Text size='sm'>
							Проверьте данные и подтвердите оплату.
						</Text>
					)}
					<Inline gap='sm'>
						<Button
							variant='secondary'
							size='sm'
							disabled={current === 0}
							onClick={() => setCurrent((step) => step - 1)}
						>
							Назад
						</Button>
						<Button
							size='sm'
							disabled={current === 2}
							onClick={() => setCurrent((step) => step + 1)}
						>
							Далее
						</Button>
					</Inline>
				</Stack>
			</Card>
		);
	},
	parameters: story('Мастер в карточке: шаги переключают поля формы.'),
};
