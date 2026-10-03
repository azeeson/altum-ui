import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {PinInput, PinInputProps} from './PinInput';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {Stack, Inline} from '../Layout';
import {Text} from '../Text/Text';
import {
	componentParameters,
	fieldArgTypes,
	story,
	Story,
} from '../../storybook/meta';
import {playFocus, playType} from '../../storybook/play';

export default {
	title: 'altum/Components/FormField/PinInput',
	component: PinInput,
	tags: ['autodocs'],
	parameters: componentParameters('PIN / OTP ввод.'),
	args: {
		length: 6,
		size: 'md',
		numeric: true,
		masked: false,
	},
	argTypes: {
		...fieldArgTypes,
		length: {
			control: 'number',
			description: 'Число ячеек',
		},
		numeric: {
			control: 'boolean',
			description: 'Только цифры',
		},
		masked: {
			control: 'boolean',
			description: 'Скрыть символы (как пароль)',
		},
		autoFocus: {
			control: 'boolean',
			description: 'Фокус первой ячейки',
		},
		size: {
			control: 'inline-radio',
			options: ['sm', 'md', 'lg'],
			description: 'Размер ячеек',
		},
	},
} satisfies Meta<typeof PinInput>;

export const Playground: Story<PinInputProps> = {
	render: function Render(args) {
		const [value, setValue] = useState('');
		return (
			<PinInput
				{...args}
				value={value}
				onChange={(next) => {
					args.onChange?.(next);
					setValue(next);
				}}
			/>
		);
	},
	args: {
		length: 6,
		size: 'md',
		autoFocus: true,
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

export const Sizes: Story<PinInputProps> = {
	render: function SizesRender() {
		const [value, setValue] = useState('12');
		return (
			<Stack gap='lg'>
				{(['sm', 'md', 'lg'] as const).map((size) => (
					<PinInput
						key={size}
						label={`Код (${size})`}
						length={4}
						size={size}
						value={value}
						onChange={setValue}
					/>
				))}
			</Stack>
		);
	},
	parameters: story('Размеры ячеек `sm`–`lg`.'),
};

export const States: Story<PinInputProps> = {
	render: function StatesRender() {
		const [value, setValue] = useState('12');
		return (
			<Stack gap='md'>
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
			</Stack>
		);
	},
	parameters: story('error, disabled и masked.'),
};

export const Empty: Story<PinInputProps> = {
	render: () => (
		<PinInput
			label='Код из SMS'
			length={6}
			description='Придёт в течение минуты'
			value=''
			onChange={() => undefined}
		/>
	),
	parameters: story('Пустые ячейки с подсказкой.'),
};

export const OverflowText: Story<PinInputProps> = {
	render: () => (
		<div style={{maxWidth: 280}}>
			<PinInput
				label='Код подтверждения из письма, которое мы отправили на почту'
				length={6}
				value='12'
				onChange={() => undefined}
			/>
		</div>
	),
	parameters: story('Длинный лейбл над группой ячеек.'),
};

export const Focused: Story<PinInputProps> = {
	render: function FocusedRender() {
		const [value, setValue] = useState('');
		return (
			<PinInput
				length={4}
				value={value}
				onChange={setValue}
			/>
		);
	},
	play: async ({canvasElement}) => {
		await playFocus(canvasElement, 'input');
	},
	parameters: story('Фокус первой ячейки.'),
};

export const Interaction: Story<PinInputProps> = {
	render: function InteractionRender() {
		const [value, setValue] = useState('');
		return (
			<PinInput
				length={4}
				value={value}
				onChange={setValue}
			/>
		);
	},
	play: async ({canvasElement}) => {
		await playType(canvasElement, '1234', 'input');
	},
	parameters: story('Play: ввод 4 цифр в первую ячейку (paste-семантика).'),
};

export const UsageExample: Story<PinInputProps> = {
	render: function UsageExampleRender() {
		const [code, setCode] = useState('');
		const complete = code.length === 6;
		return (
			<Card
				header='Подтверждение'
				style={{maxWidth: 400}}
				actions={(
					<Inline gap='sm' justify='end'>
						<Button
							variant='primary'
							disabled={!complete}
						>
							Продолжить
						</Button>
					</Inline>
				)}
			>
				<Stack gap='md'>
					<Text size='sm' color='secondary'>
						Введите код из SMS, отправленный на +7 ••• ••• 12-34
					</Text>
					<PinInput
						length={6}
						value={code}
						onChange={setCode}
					/>
				</Stack>
			</Card>
		);
	},
	parameters: story('OTP в карточке подтверждения с кнопкой.'),
};
