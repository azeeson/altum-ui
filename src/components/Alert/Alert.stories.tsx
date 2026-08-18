import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Alert, type AlertProps} from './Alert';
import {Button} from '../Button/Button';
import {Stack} from '../Layout/Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

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
		},
	},
} satisfies Meta<typeof Alert>;

export const Playground: Story<AlertProps> = {
	render: (args) => (
		<div style={{maxWidth: 480}}>
			<Alert {...args}>
				<Alert.Icon />
				<Alert.Body>
					<Alert.Title>
						Информация
					</Alert.Title>
					<Alert.Content>
						Сообщение остаётся на странице, в отличие от toast.
					</Alert.Content>
				</Alert.Body>
			</Alert>
		</div>
	),
	args: {
		variant: 'info',
	},
	parameters: story('Базовый Alert с заголовком и текстом.'),
};

export const Variants: Story<AlertProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 480}}>
			<Alert variant='info'>
				<Alert.Icon />
				<Alert.Body>
					<Alert.Title>
						Информация
					</Alert.Title>
					<Alert.Content>
						Подсказка или нейтральный статус.
					</Alert.Content>
				</Alert.Body>
			</Alert>
			<Alert variant='success'>
				<Alert.Icon />
				<Alert.Body>
					<Alert.Title>
						Готово
					</Alert.Title>
					<Alert.Content>
						Изменения сохранены.
					</Alert.Content>
				</Alert.Body>
			</Alert>
			<Alert variant='warning'>
				<Alert.Icon />
				<Alert.Body>
					<Alert.Title>
						Внимание
					</Alert.Title>
					<Alert.Content>
						Проверьте введённые данные.
					</Alert.Content>
				</Alert.Body>
			</Alert>
			<Alert variant='error'>
				<Alert.Icon />
				<Alert.Body>
					<Alert.Title>
						Ошибка
					</Alert.Title>
					<Alert.Content>
						Не удалось отправить форму.
					</Alert.Content>
				</Alert.Body>
			</Alert>
		</Stack>
	),
	parameters: story('Все четыре варианта статуса.'),
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
				<Alert variant='warning'>
					<Alert.Icon />
					<Alert.Body>
						<Alert.Title>
							Можно закрыть
						</Alert.Title>
						<Alert.Content>
							После закрытия блок пропадает из layout.
						</Alert.Content>
					</Alert.Body>
					<Alert.Close onClose={() => setVisible(false)} />
				</Alert>
			</div>
		);
	},
	parameters: story('Закрываемый Alert с `Alert.Close`.'),
};

export const SizesCompact: Story<AlertProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 480}}>
			<Alert variant='info' size='sm'>
				<Alert.Icon />
				<Alert.Body>
					<Alert.Title>
						Компактный
					</Alert.Title>
					<Alert.Content>
						Размер sm.
					</Alert.Content>
				</Alert.Body>
			</Alert>
			<Alert variant='warning' size='lg'>
				<Alert.Icon />
				<Alert.Body>
					<Alert.Title>
						Крупный
					</Alert.Title>
					<Alert.Content>
						Явный size=«lg».
					</Alert.Content>
				</Alert.Body>
			</Alert>
		</Stack>
	),
	parameters: story('Компактный и крупный размеры.'),
};

export const WithActions: Story<AlertProps> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<Alert variant='warning'>
				<Alert.Icon />
				<Alert.Body>
					<Alert.Title>
						Требуется действие
					</Alert.Title>
					<Alert.Content>
						Сумма платежа не совпадает с заказом.
					</Alert.Content>
					<Alert.Actions>
						<Button size='sm' variant='secondary'>
							Позже
						</Button>
						<Button size='sm'>
							Исправить
						</Button>
					</Alert.Actions>
				</Alert.Body>
			</Alert>
		</div>
	),
	parameters: story('`Alert.Actions` для кнопок под текстом.'),
};

export const LayoutBlock: Story<AlertProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 480}}>
			<Alert variant='info' layout='block'>
				<Alert.Icon />
				<Alert.Body>
					<Alert.Title>
						Блок
					</Alert.Title>
					<Alert.Content>
						Блочный layout — иконка и текст в колонке.
					</Alert.Content>
				</Alert.Body>
			</Alert>
			<Alert variant='success' layout='inline'>
				<Alert.Icon />
				<Alert.Body>
					<Alert.Title>
						Строка
					</Alert.Title>
					<Alert.Content>
						Inline — компактная строка.
					</Alert.Content>
				</Alert.Body>
			</Alert>
		</Stack>
	),
	parameters: story('`layout`: block (по умолчанию) и inline.'),
};
