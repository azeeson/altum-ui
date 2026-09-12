import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {PasswordField, PasswordFieldProps} from './PasswordField';
import {TextField} from '../TextField/TextField';
import {Button} from '../Button/Button';
import {Fieldset} from '../Fieldset/Fieldset';
import {Stack} from '../Layout/Layout';
import {
	componentParameters,
	fieldArgTypes,
	STORY_OVERFLOW_LABEL,
	story,
	Story,
} from '../../storybook/meta';
import {playClick, playFocus, playType} from '../../storybook/play';

export default {
	title: 'altum/Components/FormField/PasswordField',
	component: PasswordField,
	tags: ['autodocs'],
	parameters: componentParameters(
		'TextField для пароля: показать/скрыть и опциональный strength-meter.',
	),
	args: {
		label: 'Пароль',
		size: 'md',
		width: 'full',
		showStrength: true,
	},
	argTypes: {
		...fieldArgTypes,
		showStrength: {
			control: 'boolean',
			description: 'Индикатор сложности',
		},
		defaultVisible: {
			control: 'boolean',
			description: 'Показать пароль сразу',
		},
	},
} satisfies Meta<typeof PasswordField>;

export const Playground: Story<PasswordFieldProps> = {
	render: function PlaygroundRender(args) {
		const [value, setValue] = useState('');
		return (
			<div style={{maxWidth: 360}}>
				<PasswordField
					{...args}
					value={value}
					onChange={(event) => {
						args.onChange?.(event);
						setValue(event.target.value);
					}}
				/>
			</div>
		);
	},
	args: {
		label: 'Пароль',
		width: 'full',
		showStrength: true,
	},
	parameters: story('Пароль с индикатором сложности.'),
};

export const Sizes: Story<PasswordFieldProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 360}}>
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<PasswordField
					key={size}
					label={`Пароль (${size})`}
					size={size}
					width='full'
					showStrength
				/>
			))}
		</Stack>
	),
	parameters: story('Размеры `sm`–`lg`.'),
};

export const WithoutStrength: Story<PasswordFieldProps> = {
	render: () => (
		<div style={{maxWidth: 360}}>
			<PasswordField
				label='Пароль'
				width='full'
				autoComplete='new-password'
			/>
		</div>
	),
	parameters: story('Только переключение видимости.'),
};

export const Disabled: Story<PasswordFieldProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 360}}>
			<PasswordField
				label='Пароль'
				disabled
				value='Secret123!'
				width='full'
			/>
			<PasswordField
				label='Пароль'
				error='Пароль слишком короткий'
				value='123'
				width='full'
				showStrength
			/>
		</Stack>
	),
	parameters: story('Заблокированное поле и ошибка сложности.'),
};

export const Empty: Story<PasswordFieldProps> = {
	args: {
		label: 'Пароль',
		helperText: 'Не менее 8 символов',
		width: 'full',
		showStrength: true,
	},
	parameters: story('Пустое поле — индикатор скрыт, пока нет ввода.'),
};

export const OverflowText: Story<PasswordFieldProps> = {
	render: () => (
		<div style={{maxWidth: 280}}>
			<PasswordField
				label={STORY_OVERFLOW_LABEL}
				defaultValue='VeryLongPasswordValueThatOverflows'
				width='full'
				showStrength
			/>
		</div>
	),
	parameters: story('Длинный лейбл и длинный пароль.'),
};

export const WithClear: Story<PasswordFieldProps> = {
	render: function WithClearRender() {
		const [value, setValue] = useState('Secret123!');
		return (
			<div style={{maxWidth: 360}}>
				<PasswordField
					label='Пароль'
					value={value}
					onChange={(event) => setValue(event.target.value)}
					onClear={() => setValue('')}
					width='full'
					showStrength
				/>
			</div>
		);
	},
	parameters: story('Кнопка очистки перед переключателем видимости.'),
};

export const Focused: Story<PasswordFieldProps> = {
	render: () => (
		<div style={{maxWidth: 360}}>
			<PasswordField
				label='Пароль'
				defaultValue='Secret123!'
				width='full'
				showStrength
			/>
		</div>
	),
	play: async ({canvasElement}) => {
		await playFocus(canvasElement, 'input');
	},
	parameters: story('Программный фокус — chrome `:focus-within`.'),
};

export const Interaction: Story<PasswordFieldProps> = {
	render: function InteractionRender() {
		const [value, setValue] = useState('');
		return (
			<div style={{maxWidth: 360}}>
				<PasswordField
					label='Пароль'
					value={value}
					onChange={(event) => setValue(event.target.value)}
					width='full'
					showStrength
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playType(canvasElement, 'Secret123!', 'input');
		await playClick(canvasElement, 'button[aria-pressed]');
	},
	parameters: story('Play: ввод пароля, strength-meter и «показать пароль».'),
};

export const UsageExample: Story<PasswordFieldProps> = {
	render: function UsageExampleRender() {
		const [email, setEmail] = useState('');
		const [password, setPassword] = useState('');
		return (
			<div style={{maxWidth: 400}}>
				<Fieldset
					legend='Вход'
					description='Рабочая почта и пароль учётной записи.'
					footer={(
						<Button variant='primary' fullWidth>
							Войти
						</Button>
					)}
				>
					<TextField
						label='Эл. почта'
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						width='full'
					/>
					<PasswordField
						label='Пароль'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						width='full'
						showStrength
					/>
				</Fieldset>
			</div>
		);
	},
	parameters: story('Форма входа: TextField + PasswordField.'),
};
