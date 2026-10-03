import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {MaskedField, MaskedFieldProps} from './MaskedField';
import {Stack, Inline} from '../Layout';
import {Button} from '../Button/Button';
import {Fieldset} from '../Fieldset/Fieldset';
import {TextField} from '../TextField/TextField';
import {
	componentParameters,
	fieldArgTypes,
	STORY_OVERFLOW_LABEL,
	story,
	Story,
} from '../../storybook/meta';
import {playFocus, playType} from '../../storybook/play';

export default {
	title: 'altum/Components/FormField/MaskedField',
	component: MaskedField,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Текстовое поле с маской ввода для дат, телефонов и других форматов.',
	),
	args: {
		label: 'Дата рождения (ДД.ММ.ГГГГ)',
		mask: '99.99.9999',
		size: 'md',
	},
	argTypes: {
		...fieldArgTypes,
		mask: {
			control: 'text',
			description: 'Шаблон маски (`9` — цифра)',
		},
		maskAsPlaceholder: {
			control: 'boolean',
			description: 'Маска (`9` → `_`) как placeholder без `label`',
		},
	},
} satisfies Meta<typeof MaskedField>;

export const Playground: Story<MaskedFieldProps> = {
	render: function PlaygroundRender(args) {
		const [val, setVal] = useState('');
		return (
			<div style={{maxWidth: '300px'}}>
				<MaskedField
					{...args}
					value={val}
					onChange={(next) => {
						args.onChange?.(next);
						setVal(next);
					}}
					id='story-mask-playground'
				/>
			</div>
		);
	},
	args: {
		label: 'Дата рождения (ДД.ММ.ГГГГ)',
		mask: '99.99.9999',
		size: 'md',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const PhoneMask: Story<MaskedFieldProps> = {
	render: function PhoneMaskRender() {
		const [val, setVal] = useState('');
		return (
			<div style={{maxWidth: '300px'}}>
				<MaskedField
					label='Номер телефона (+7 (999) 999-99-99)'
					mask='+7 (999) 999-99-99'
					value={val}
					onChange={setVal}
					id='story-mask-phone'
				/>
			</div>
		);
	},
	parameters: story('Маска для российского номера телефона.'),
};

export const TimeMask: Story<MaskedFieldProps> = {
	render: function TimeMaskRender() {
		const [val, setVal] = useState('');
		return (
			<div style={{maxWidth: '300px'}}>
				<MaskedField
					label='Время (ЧЧ:ММ)'
					mask='99:99'
					value={val}
					onChange={setVal}
					id='story-mask-time'
				/>
			</div>
		);
	},
	parameters: story('Маска для ввода времени.'),
};

export const SizesAndPlacement: Story<MaskedFieldProps> = {
	render: function SizesAndPlacementRender() {
		const [phone, setPhone] = useState('900');
		const [date, setDate] = useState('1507');
		return (
			<Stack gap='lg' style={{maxWidth: 360}}>
				{(['sm', 'md', 'lg'] as const).map((size) => (
					<MaskedField
						key={size}
						label={`Телефон (${size})`}
						mask='+7 (999) 999-99-99'
						size={size}
						value={phone}
						onChange={setPhone}
						id={`story-mask-size-${size}`}
						width='full'
					/>
				))}
				{(['sm', 'md', 'lg'] as const).map((size) => (
					<Inline
						key={`c-${size}`}
						gap='sm'
						align='center'
					>
						<MaskedField
							aria-label='Дата'
							mask='99.99.9999'
							size={size}
							maskAsPlaceholder
							value={date}
							onChange={setDate}
							id={`story-mask-none-${size}`}
							width='full'
						/>
						<Button size={size}>
							OK
						</Button>
					</Inline>
				))}
			</Stack>
		);
	},
	parameters: story('`size` `sm`–`lg` и поле без `label` — `maskOverlay` совпадает с текстом инпута.'),
};

export const LabelPlacement: Story<MaskedFieldProps> = {
	render: function LabelPlacementRender() {
		const [withLabel, setWithLabel] = useState('');
		const [withoutLabel, setWithoutLabel] = useState('');
		return (
			<Stack gap='lg' style={{maxWidth: 320}}>
				<MaskedField
					label='Дата'
					mask='99.99.9999'
					value={withLabel}
					onChange={setWithLabel}
					width='full'
					id='story-mask-lp-inline'
				/>
				<MaskedField
					aria-label='Дата'
					mask='99.99.9999'
					value={withoutLabel}
					onChange={setWithoutLabel}
					maskAsPlaceholder
					width='full'
					id='story-mask-lp-none'
				/>
			</Stack>
		);
	},
	parameters: story('С `label` — floating-лейбл; без `label` маска видна как placeholder.'),
};

export const Disabled: Story<MaskedFieldProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 300}}>
			<MaskedField
				label='Телефон'
				mask='+7 (999) 999-99-99'
				value='9123456789'
				onChange={() => undefined}
				disabled
				width='full'
			/>
			<MaskedField
				label='Телефон'
				mask='+7 (999) 999-99-99'
				value='912'
				onChange={() => undefined}
				error='Неполный номер'
				width='full'
			/>
		</Stack>
	),
	parameters: story('`disabled` и ошибка незавершённой маски.'),
};

export const Empty: Story<MaskedFieldProps> = {
	render: () => (
		<div style={{maxWidth: 300}}>
			<MaskedField
				label='Дата'
				mask='99.99.9999'
				value=''
				onChange={() => undefined}
				description='Формат ДД.ММ.ГГГГ'
				width='full'
			/>
		</div>
	),
	parameters: story('Пустая маска с подсказкой.'),
};

export const OverflowText: Story<MaskedFieldProps> = {
	render: function OverflowRender() {
		const [val, setVal] = useState('15071990');
		return (
			<div style={{maxWidth: 240}}>
				<MaskedField
					label={STORY_OVERFLOW_LABEL}
					mask='99.99.9999'
					value={val}
					onChange={setVal}
					width='full'
				/>
			</div>
		);
	},
	parameters: story('Длинный floating label на узком поле.'),
};

export const WithClear: Story<MaskedFieldProps> = {
	render: function WithClearRender() {
		const [val, setVal] = useState('9123456789');
		return (
			<div style={{maxWidth: 300}}>
				<MaskedField
					label='Номер телефона'
					mask='+7 (999) 999-99-99'
					value={val}
					onChange={setVal}
					onClear={() => setVal('')}
					id='story-mask-clear'
					width='full'
				/>
			</div>
		);
	},
	parameters: story('Кнопка очистки при `onClear` — сбрасывает цифры маски.'),
};

export const Focused: Story<MaskedFieldProps> = {
	render: function FocusedRender() {
		const [val, setVal] = useState('1507');
		return (
			<div style={{maxWidth: 300}}>
				<MaskedField
					label='Дата'
					mask='99.99.9999'
					value={val}
					onChange={setVal}
					width='full'
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playFocus(canvasElement);
	},
	parameters: story('Программный фокус — chrome и оверлей маски.'),
};

export const Interaction: Story<MaskedFieldProps> = {
	render: function InteractionRender() {
		const [val, setVal] = useState('');
		return (
			<div style={{maxWidth: 300}}>
				<MaskedField
					label='Телефон'
					mask='+7 (999) 999-99-99'
					value={val}
					onChange={setVal}
					width='full'
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playType(canvasElement, '9123456789');
	},
	parameters: story('Play: набор цифр по маске телефона.'),
};

export const UsageExample: Story<MaskedFieldProps> = {
	render: function UsageExampleRender() {
		const [name, setName] = useState('');
		const [phone, setPhone] = useState('');
		const [birth, setBirth] = useState('');
		return (
			<div style={{maxWidth: 400}}>
				<Fieldset
					legend='Контакты'
					description='Телефон и дата рождения по маске.'
					footer={(
						<Inline gap='sm' justify='end'>
							<Button variant='primary'>
								Продолжить
							</Button>
						</Inline>
					)}
				>
					<TextField
						label='Имя'
						value={name}
						onChange={(e) => setName(e.target.value)}
						width='full'
					/>
					<MaskedField
						label='Телефон'
						mask='+7 (999) 999-99-99'
						value={phone}
						onChange={setPhone}
						width='full'
					/>
					<MaskedField
						label='Дата рождения'
						mask='99.99.9999'
						value={birth}
						onChange={setBirth}
						width='full'
					/>
				</Fieldset>
			</div>
		);
	},
	parameters: story('Контактная форма: TextField + две маски.'),
};
