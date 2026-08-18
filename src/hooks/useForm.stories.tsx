import type {Meta} from '@storybook/react';
import React from 'react';
import {useForm} from './useForm';
import {TextField} from '../components/TextField/TextField';
import {Button} from '../components/Button/Button';
import {componentParameters, story, Story} from '../storybook/meta';

const UseFormDemo = () => {
	const {values, errors, register} = useForm({email: ''});

	const emailRegister = register('email', {
		required: 'Электронная почта обязательна для заполнения',
		pattern: {
			value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
			message: 'Неверный формат почты. Пример: user@mail.ru',
		},
	});

	return (
		<div
			style={{
				maxWidth: 300,
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-4)',
			}}
		>
			<TextField
				label='Электронная почта'
				error={errors.email}
				{...emailRegister}
			/>
			<Button
				variant='primary'
				size='sm'
				onClick={() => alert(JSON.stringify(values))}
			>
				Зарегистрироваться
			</Button>
		</div>
	);
};

export default {
	title: 'altum/Hooks/useForm',
	component: UseFormDemo,
	tags: ['autodocs'],
	parameters: componentParameters('Хук простой валидации полей формы.'),
} satisfies Meta<typeof UseFormDemo>;

export const Playground: Story<typeof UseFormDemo> = {
	parameters: story('`register` + `required` / `pattern`.'),
};
