import type {Meta} from '@storybook/react';
import React from 'react';
import {compose, pattern, required} from '../shared/form/formRules';
import {useForm} from './useForm';
import {useFormContext, useFormProvider} from './useFormProvider';
import {TextField} from '../components/TextField/TextField';
import {Button} from '../components/Button/Button';
import {componentParameters, story, Story} from '../storybook/meta';

const emailRules = {
	validate: compose(
		required('Электронная почта обязательна для заполнения'),
		pattern(
			/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
			'Неверный формат почты. Пример: user@mail.ru',
		),
	),
};

const UseFormDemo = () => {
	const {values, errors, register} = useForm({email: ''});

	const emailRegister = register('email', emailRules);

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

const NestedEmailField = () => {
	const {errors, register} = useFormContext<{email: string}>();

	return (
		<TextField
			label='Электронная почта'
			error={errors.email}
			{...register('email', emailRules)}
		/>
	);
};

const UseFormProviderDemo = () => {
	const {FormProvider, values} = useFormProvider({email: ''});

	return (
		<FormProvider>
			<div
				style={{
					maxWidth: 300,
					display: 'flex',
					flexDirection: 'column',
					gap: 'var(--altum-g-space-4)',
				}}
			>
				<NestedEmailField />
				<Button
					variant='primary'
					size='sm'
					onClick={() => alert(JSON.stringify(values))}
				>
					Зарегистрироваться
				</Button>
			</div>
		</FormProvider>
	);
};

export const Playground: Story<typeof UseFormDemo> = {
	parameters: story('`register` + `compose(required, pattern)`.'),
};

export const Provider: Story<typeof UseFormDemo> = {
	render: () => <UseFormProviderDemo />,
	parameters: story('`FormProvider` и `useFormContext` во вложенном поле.'),
};
