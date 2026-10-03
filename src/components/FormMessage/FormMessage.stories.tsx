import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {FormMessage, FormMessageProps} from './FormMessage';
import {TextField} from '../TextField/TextField';
import {Stack} from '../Layout';
import {Card} from '../Card/Card';
import {Button} from '../Button/Button';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/FormMessage',
	component: FormMessage,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Inline hint / error / success под полем.',
	),
	argTypes: {
		variant: {
			control: 'radio',
			options: ['hint', 'success', 'error'],
			description: 'Семантика сообщения',
		},
		children: {
			control: 'text',
			description: 'Текст сообщения',
		},
	},
} satisfies Meta<typeof FormMessage>;

export const Playground: Story<FormMessageProps> = {
	render: (args) => (
		<div style={{maxWidth: 360}}>
			<TextField label='Эл. почта' width='full' />
			<FormMessage {...args} />
		</div>
	),
	args: {
		variant: 'hint',
		children: 'Мы не передаём email третьим лицам',
	},
	parameters: story('Подсказка под полем.'),
};

export const Types: Story<FormMessageProps> = {
	render: () => (
		<Stack gap='sm' style={{maxWidth: 360}}>
			<FormMessage variant='hint'>
				Подсказка к полю
			</FormMessage>
			<FormMessage variant='success'>
				Пароль надёжный
			</FormMessage>
			<FormMessage variant='error'>
				Обязательное поле
			</FormMessage>
		</Stack>
	),
	parameters: story('Подсказка / успех / ошибка.'),
};

export const WithError: Story<FormMessageProps> = {
	render: function WithErrorRender() {
		const [email, setEmail] = useState('');
		const error = email.trim() ? undefined : 'Укажите email';

		return (
			<div style={{maxWidth: 360}}>
				<TextField
					label='Эл. почта'
					width='full'
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					error={!!error}
				/>
				{error ? (
					<FormMessage variant='error'>
						{error}
					</FormMessage>
				) : (
					<FormMessage variant='hint'>
						Введите рабочий email
					</FormMessage>
				)}
			</div>
		);
	},
	parameters: story('Связка поля с FormMessage variant="error".'),
};

export const OverflowText: Story<FormMessageProps> = {
	render: () => (
		<div style={{maxWidth: 240}}>
			<FormMessage variant='error'>
				Не удалось сохранить черновик: превышена допустимая длина комментария,
				проверьте формулировку и повторите отправку.
			</FormMessage>
		</div>
	),
	parameters: story('Длинный текст ошибки переносится, не обрезая смысл.'),
};

export const UsageExample: Story<FormMessageProps> = {
	render: function UsageExampleRender() {
		const [password, setPassword] = useState('');
		const tooShort = password.length > 0 && password.length < 8;

		return (
			<Card
				variant='outlined'
				header={(
					<Text weight='bold'>
						Новый пароль
					</Text>
				)}
				style={{maxWidth: 360}}
			>
				<Stack gap='sm'>
					<TextField
						label='Пароль'
						type='password'
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						error={tooShort ? 'Минимум 8 символов' : undefined}
						width='full'
					/>
					{tooShort ? (
						<FormMessage variant='error'>
							Минимум 8 символов
						</FormMessage>
					) : password ? (
						<FormMessage variant='success'>
							Пароль достаточно длинный
						</FormMessage>
					) : (
						<FormMessage variant='hint'>
							Используйте буквы, цифры и символ
						</FormMessage>
					)}
					<Button variant='primary' disabled={tooShort || !password}>
						Сохранить
					</Button>
				</Stack>
			</Card>
		);
	},
	parameters: story('Поле пароля с живой подсказкой hint / success / error.'),
};

export const Interaction: Story<FormMessageProps> = {
	render: function InteractionRender() {
		const [email, setEmail] = useState('');
		const error = email.includes('@') ? undefined : 'Укажите email';

		return (
			<div style={{maxWidth: 360}}>
				<TextField
					label='Эл. почта'
					width='full'
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					error={!!error}
				/>
				{error ? (
					<FormMessage variant='error'>
						{error}
					</FormMessage>
				) : (
					<FormMessage variant='success'>
						Адрес принят
					</FormMessage>
				)}
			</div>
		);
	},
	play: async ({canvasElement}) => {
		const input = canvasElement.querySelector('input');
		if (!(input instanceof HTMLInputElement)) return;
		input.focus();
		const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
		setter?.call(input, 'alex@example.com');
		input.dispatchEvent(new Event('input', {bubbles: true}));
	},
	parameters: story('Play: ввод валидного email снимает ошибку.'),
};
