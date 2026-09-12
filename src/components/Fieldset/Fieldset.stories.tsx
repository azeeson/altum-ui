import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Fieldset, FieldsetProps} from './Fieldset';
import {TextField} from '../TextField/TextField';
import {Select} from '../Select/Select';
import {Button} from '../Button/Button';
import {Text} from '../Text/Text';
import {Inline, Stack} from '../Layout/Layout';
import {Card} from '../Card/Card';
import {FormMessage} from '../FormMessage/FormMessage';
import {componentParameters, story, Story} from '../../storybook/meta';

const ROLE_OPTIONS = [
	{
		label: 'Администратор',
		value: 'admin'
	},
	{
		label: 'Менеджер',
		value: 'manager'
	},
	{
		label: 'Наблюдатель',
		value: 'viewer'
	},
];

export default {
	title: 'altum/Components/Fieldset',
	component: Fieldset,
	tags: ['autodocs'],
	parameters: componentParameters('Секция формы с legend, описанием и единым отступом между полями.'),
	argTypes: {
		legend: {
			control: 'text',
			description: 'Заголовок секции',
		},
		description: {
			control: 'text',
		},
		hint: {
			control: 'text',
		},
		variant: {
			control: 'select',
			options: ['default', 'card', 'plain'],
		},
		disabled: {control: 'boolean'},
		gap: {
			control: 'text',
			description: 'Отступ между полями',
		},
	},
} satisfies Meta<typeof Fieldset>;

export const Playground: Story<FieldsetProps> = {
	render: (args) => (
		<div style={{maxWidth: 420}}>
			<Fieldset
				{...args}
				legend={args.legend ?? 'Контактные данные'}
				description={args.description ?? 'Используются для уведомлений и восстановления доступа.'}
				hint={args.hint ?? 'Эл. почта должна быть рабочей — на неё придёт письмо подтверждения.'}
			>
				<TextField
					label='Имя'
					defaultValue='Алексей'
					width='full'
				/>
				<TextField
					label='Эл. почта'
					defaultValue='alex@example.com'
					width='full'
				/>
			</Fieldset>
		</div>
	),
	args: {
		variant: 'default',
		disabled: false,
		legend: 'Контактные данные',
		description: 'Используются для уведомлений и восстановления доступа.',
		hint: 'Эл. почта должна быть рабочей — на неё придёт письмо подтверждения.',
	},
	parameters: story('Базовая секция с заголовком и полями.'),
};

export const Variants: Story<FieldsetProps> = {
	render: () => (
		<Stack gap='lg' style={{maxWidth: 420}}>
			<Fieldset
				variant='default'
				legend='Default'
				description='Карточка с рамкой — значение по умолчанию.'
			>
				<TextField label='Поле' width='full' />
			</Fieldset>
			<Fieldset
				variant='card'
				legend='Card'
				description='Та же карточка, семантика секции формы.'
			>
				<TextField label='Поле' width='full' />
			</Fieldset>
			<Fieldset
				variant='plain'
				legend='Plain'
				description='Без chrome — только легенда и поля.'
			>
				<TextField label='Поле' width='full' />
			</Fieldset>
		</Stack>
	),
	parameters: story('Варианты chrome: default / card / plain.'),
};

export const FormSections: Story<FieldsetProps> = {
	render: function FormSectionsRender() {
		const [role, setRole] = useState('manager');
		return (
			<Stack
				gap='lg'
				style={{maxWidth: 480}}
			>
				<Fieldset
					legend='Профиль'
					description='Основная информация о пользователе.'
				>
					<TextField
						label='ФИО'
						defaultValue='Иванова Мария Петровна'
						width='full'
					/>
					<TextField
						label='Должность'
						defaultValue='Инженер'
						width='full'
					/>
				</Fieldset>

				<Fieldset
					variant='card'
					legend='Доступ'
					description='Роль определяет набор разрешений в системе.'
					footer={(
						<Text size='xs' style={{opacity: 0.75}}>
							Изменения вступают в силу после сохранения.
						</Text>
					)}
				>
					<Select
						options={ROLE_OPTIONS}
						value={role}
						onChange={(value) => { if (!Array.isArray(value)) setRole(value); }}
						label='Роль'
						width='full'
					/>
				</Fieldset>

				<Fieldset
					variant='plain'
					legend='Действия'
					footer={(
						<Inline gap='sm'>
							<Button variant='primary'>
								Сохранить
							</Button>
							<Button variant='secondary'>
								Отмена
							</Button>
						</Inline>
					)}
				>
					<Text size='sm'>
						Проверьте данные перед отправкой формы.
					</Text>
				</Fieldset>
			</Stack>
		);
	},
	parameters: story('Несколько секций в одной форме: default, card и plain.'),
};

export const Disabled: Story<FieldsetProps> = {
	render: () => (
		<div style={{maxWidth: 420}}>
			<Fieldset
				disabled
				legend='Архивная запись'
				description='Редактирование недоступно.'
			>
				<TextField
					label='Номер'
					defaultValue='WM-1042'
					width='full'
					disabled
				/>
				<TextField
					label='Адрес'
					defaultValue='ул. Примерная, 12'
					width='full'
					disabled
				/>
			</Fieldset>
		</div>
	),
	parameters: story('disabled на fieldset блокирует все вложенные контролы.'),
};

export const Empty: Story<FieldsetProps> = {
	render: () => (
		<div style={{maxWidth: 420}}>
			<Fieldset
				legend='Пустая секция'
				description='Поля ещё не добавлены.'
			/>
		</div>
	),
	parameters: story('Секция без children.'),
};

export const OverflowText: Story<FieldsetProps> = {
	render: () => (
		<div style={{maxWidth: 280}}>
			<Fieldset
				legend='Очень длинный заголовок секции контактных и юридических данных пользователя'
				description='Подробное описание, которое не должно вылезать из карточки и ломать сетку соседних блоков на узкой колонке.'
				hint='Дополнительная юридическая оговорка про обработку персональных данных и согласие на рассылку.'
			>
				<TextField
					label='Комментарий'
					defaultValue='Короткое значение'
					width='full'
				/>
			</Fieldset>
		</div>
	),
	parameters: story('Длинные legend / description / hint в узкой колонке.'),
};

export const UsageExample: Story<FieldsetProps> = {
	render: function UsageExampleRender() {
		const [email, setEmail] = useState('');
		const error = email.includes('@') ? undefined : 'Укажите рабочий email';

		return (
			<Card variant='elevated' style={{maxWidth: 440}}>
				<Fieldset
					variant='plain'
					legend='Регистрация'
					description='Создайте учётную запись для доступа к кабинету.'
					footer={(
						<Inline gap='sm'>
							<Button variant='primary'>
								Продолжить
							</Button>
							<Button variant='ghost'>
								Отмена
							</Button>
						</Inline>
					)}
				>
					<TextField
						label='Эл. почта'
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						error={error}
						width='full'
					/>
					{error ? (
						<FormMessage variant='error'>
							{error}
						</FormMessage>
					) : (
						<FormMessage variant='success'>
							Адрес выглядит корректно
						</FormMessage>
					)}
				</Fieldset>
			</Card>
		);
	},
	parameters: story('Секция внутри карточки с валидацией и кнопками.'),
};

export const Interaction: Story<FieldsetProps> = {
	render: function InteractionRender() {
		const [name, setName] = useState('');
		return (
			<div style={{maxWidth: 420}}>
				<Fieldset legend='Контакт'>
					<TextField
						label='Имя'
						value={name}
						onChange={(event) => setName(event.target.value)}
						width='full'
					/>
				</Fieldset>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		const input = canvasElement.querySelector('input');
		if (!(input instanceof HTMLInputElement)) return;
		input.focus();
		const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
		setter?.call(input, 'Алексей');
		input.dispatchEvent(new Event('input', {bubbles: true}));
	},
	parameters: story('Play: ввод в первое поле секции.'),
};
