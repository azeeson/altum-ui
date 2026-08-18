import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {PinInput, PinInputProps} from './PinInput';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/PinInput',
	component: PinInput,
	tags: ['autodocs'],
	parameters: componentParameters('PIN / OTP ввод.'),
} satisfies Meta<typeof PinInput>;

export const Playground: Story<PinInputProps> = {
	render: function Render(args) {
		const [value, setValue] = useState('');
		return (
			<PinInput
				{...args}
				value={value}
				onChange={setValue}
			/>
		);
	},
	args: {
		length: 6,
		size: 'md',
		autoFocus: true
	},
	argTypes: {
		size: {
			control: 'inline-radio',
			options: ['sm', 'md', 'lg'],
		},
	},
	parameters: story('Шесть цифр, paste поддерживается. `size` = `--altum-control-height-*`.'),
};

export const FourDigits: Story<PinInputProps> = {
	render: function Render() {
		const [value, setValue] = useState('');
		return (
			<PinInput
				length={4}
				value={value}
				onChange={setValue}
			/>
		);
	},
	parameters: story('Короткий код из 4 цифр.'),
};

export const States: Story<PinInputProps> = {
	render: function StatesRender() {
		const [value, setValue] = useState('12');
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-4)',
			}}
			>
				<PinInput
					length={4}
					value={value}
					onChange={setValue}
					error='Неверный код'
				/>
				<PinInput
					length={4}
					value='1234'
					onChange={() => {}}
					disabled
				/>
				<PinInput
					length={4}
					value='1234'
					onChange={() => {}}
					masked
				/>
			</div>
		);
	},
	parameters: story('error, disabled и masked.'),
};
