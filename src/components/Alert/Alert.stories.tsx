import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Alert, type AlertProps} from './Alert';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {Stack} from '../Layout';
import {Text} from '../Text/Text';
import {TextField} from '../TextField/TextField';
import {componentParameters, story, Story} from '../../storybook/meta';

const LONG_TITLE = 'Не удалось сохранить изменения в профиле из‑за конфликта с уже существующей записью';
const LONG_BODY = 'Проверьте уникальность email, повторите отправку и убедитесь, что сессия не истекла. '.repeat(3);

export default {
	title: 'altum/Components/Alert',
	component: Alert,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Inline status-блок (`info` / `success` / `warning` / `error`).',
	),
	argTypes: {
		variant: {
			control: {
				type: 'select',
				options: [
					'info',
					'success',
					'warning',
					'error'
				],
			},
			description: 'Семантический статус',
		},
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg'],
			},
			description: 'Плотность блока',
		},
		layout: {
			control: {
				type: 'radio',
				options: ['block', 'inline'],
			},
			description: 'Компоновка иконки и текста',
		},
		title: {
			control: 'text',
			description: 'Заголовок',
		},
		children: {
			control: 'text',
			description: 'Текст сообщения',
		},
		closeLabel: {
			control: 'text',
			description: 'aria-label кнопки закрытия',
		},
		onClose: {
			action: 'onClose',
			description: 'Закрытие блока',
		},
	},
} satisfies Meta<typeof Alert>;

export const Playground: Story<AlertProps> = {
	render: (args) => (
		<div style={{maxWidth: 480}}>
			<Alert {...args} />
		</div>
	),
	args: {
		variant: 'info',
		size: 'md',
		layout: 'block',
		title: 'Информация',
		children: 'Сообщение остаётся на странице, в отличие от toast.',
	},
	parameters: story('Базовый Alert с заголовком и текстом. Controls меняют все пропсы.'),
};

export const Variants: Story<AlertProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 480}}>
			<Alert variant='info' title='Информация'>
				Подсказка или нейтральный статус.
			</Alert>
			<Alert variant='success' title='Готово'>
				Изменения сохранены.
			</Alert>
			<Alert variant='warning' title='Внимание'>
				Проверьте введённые данные.
			</Alert>
			<Alert variant='error' title='Ошибка'>
				Не удалось отправить форму.
			</Alert>
		</Stack>
	),
	parameters: story('Все четыре варианта статуса.'),
};

export const Sizes: Story<AlertProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 480}}>
			<Alert
				variant='info'
				size='sm'
				title='Компактный'
			>
				Размер sm.
			</Alert>
			<Alert
				variant='info'
				size='md'
				title='Средний'
			>
				Размер md — по умолчанию.
			</Alert>
			<Alert
				variant='warning'
				size='lg'
				title='Крупный'
			>
				Явный size=«lg».
			</Alert>
		</Stack>
	),
	parameters: story('Размеры sm / md / lg.'),
};

export const SizesCompact: Story<AlertProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 480}}>
			<Alert
				variant='info'
				size='sm'
				title='Компактный'
			>
				Размер sm.
			</Alert>
			<Alert
				variant='warning'
				size='lg'
				title='Крупный'
			>
				Явный size=«lg».
			</Alert>
		</Stack>
	),
	parameters: story('Компактный и крупный размеры.'),
};

export const Layouts: Story<AlertProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 480}}>
			<Alert
				variant='info'
				layout='block'
				title='Блок'
			>
				Блочный layout — иконка и текст в колонке.
			</Alert>
			<Alert
				variant='success'
				layout='inline'
				title='Строка'
			>
				Inline — компактная строка.
			</Alert>
		</Stack>
	),
	parameters: story('`layout`: block (по умолчанию) и inline.'),
};

export const LayoutBlock: Story<AlertProps> = {
	render: Layouts.render,
	parameters: story('`layout`: block (по умолчанию) и inline.'),
};

export const WithoutIcon: Story<AlertProps> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<Alert
				variant='info'
				icon={null}
				title='Без иконки'
			>
				{'Слот иконки скрыт через icon={null}.'}
			</Alert>
		</div>
	),
	parameters: story('`icon={null}` убирает статусную иконку.'),
};

export const TitleOnly: Story<AlertProps> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<Alert variant='success' title='Сохранено' />
		</div>
	),
	parameters: story('Только заголовок, без тела.'),
};

export const BodyOnly: Story<AlertProps> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<Alert variant='warning'>
				Проверьте введённые данные перед отправкой.
			</Alert>
		</div>
	),
	parameters: story('Только текст, без title.'),
};

export const OverflowText: Story<AlertProps> = {
	render: () => (
		<div style={{maxWidth: 360}}>
			<Alert
				variant='error'
				title={LONG_TITLE}
			>
				{LONG_BODY}
			</Alert>
		</div>
	),
	parameters: story('Длинный заголовок и текст в узком контейнере.'),
};

export const Dismissible: Story<AlertProps> = {
	render: function DismissibleRender() {
		const [visible, setVisible] = useState(true);
		if (!visible) {
			return (
				<button type='button' onClick={() => setVisible(true)}>
					Показать снова
				</button>
			);
		}
		return (
			<div style={{maxWidth: 480}}>
				<Alert
					variant='warning'
					title='Можно закрыть'
					onClose={() => setVisible(false)}
				>
					После закрытия блок пропадает из layout.
				</Alert>
			</div>
		);
	},
	parameters: story('Закрываемый Alert с `onClose`.'),
};

export const WithActions: Story<AlertProps> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<Alert
				variant='warning'
				title='Требуется действие'
				actions={(
					<>
						<Button size='sm' variant='secondary'>
							Позже
						</Button>
						<Button size='sm'>
							Исправить
						</Button>
					</>
				)}
			>
				Сумма платежа не совпадает с заказом.
			</Alert>
		</div>
	),
	parameters: story('`actions` для кнопок под текстом.'),
};

export const Interaction: Story<AlertProps> = {
	render: Dismissible.render,
	play: async ({canvasElement}) => {
		const close = canvasElement.querySelector('button[aria-label]');
		if (!(close instanceof HTMLButtonElement)) {
			throw new Error('Не найдена кнопка закрытия Alert');
		}
		close.click();
	},
	parameters: story('Play: клик по закрытию скрывает Alert.'),
};

export const UsageExample: Story<AlertProps> = {
	render: function UsageExampleRender() {
		const [email, setEmail] = useState('');
		const [error, setError] = useState(true);
		return (
			<Card
				variant='outlined'
				header={(
					<Text weight='bold'>
						Профиль
					</Text>
				)}
				style={{maxWidth: 420}}
			>
				<Stack gap='md'>
					{error && (
						<Alert
							variant='error'
							size='sm'
							title='Некорректный email'
							onClose={() => setError(false)}
						>
							Укажите адрес в формате name@domain.com.
						</Alert>
					)}
					<TextField
						label='Email'
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						width='full'
					/>
					<Button
						size='sm'
						onClick={() => setError(email.length > 0 && !email.includes('@'))}
					>
						Сохранить
					</Button>
				</Stack>
			</Card>
		);
	},
	parameters: story('Alert ошибки над полем формы в Card.'),
};
