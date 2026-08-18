import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {PasswordField, PasswordFieldProps} from './PasswordField';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/PasswordField',
	component: PasswordField,
	tags: ['autodocs'],
	parameters: componentParameters(
		'TextField для пароля: показать/скрыть и опциональный strength-meter.',
	),
} satisfies Meta<typeof PasswordField>;

export const Playground: Story<PasswordFieldProps> = {
	render: function PlaygroundRender(args) {
		const [value, setValue] = useState('');
		return (
			<div style={{maxWidth: 360}}>
				<PasswordField
					{...args}
					value={value}
					onChange={(event) => setValue(event.target.value)}
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
