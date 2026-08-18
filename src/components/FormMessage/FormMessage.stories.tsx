import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {FieldError, FormMessage, FormMessageProps} from './FormMessage';
import {TextField} from '../TextField/TextField';
import {Stack} from '../Layout/Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/FormMessage',
	component: FormMessage,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Inline hint / error / success под полем. FieldError — алиас variant="error".',
	),
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
			<FieldError>
				Обязательное поле
			</FieldError>
		</Stack>
	),
	parameters: story('Подсказка / успех / `FieldError`.'),
};

export const WithFieldError: Story<FormMessageProps> = {
	render: function WithFieldErrorRender() {
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
					<FieldError>
						{error}
					</FieldError>
				) : (
					<FormMessage variant='hint'>
						Введите рабочий email
					</FormMessage>
				)}
			</div>
		);
	},
	parameters: story('Связка поля с FieldError через локальный стейт.'),
};
