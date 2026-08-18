import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {MaskedField, MaskedFieldProps} from './MaskedField';
import {Stack} from '../Layout/Layout';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/MaskedField',
	component: MaskedField,
	tags: ['autodocs'],
	parameters: componentParameters('Текстовое поле с маской ввода для дат, телефонов и других форматов.'),
	argTypes: {
		label: {
			control: 'text',
			description: 'Метка поля',
		},
		mask: {
			control: 'text',
			description: 'Шаблон маски (9 — цифра)',
		},
		size: {
			control: 'inline-radio',
			options: ['sm', 'md', 'lg'],
		},
		labelPlacement: {
			control: 'inline-radio',
			options: ['inline', 'outside', 'none'],
		},
		maskAsPlaceholder: {
			control: 'boolean',
			description: 'Маска (`9` → `_`) как placeholder вне inline',
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
					onChange={setVal}
					id='story-mask-playground'
				/>
			</div>
		);
	},
	args: {
		label: 'Дата рождения (ДД.ММ.ГГГГ)',
		mask: '99.99.9999',
		size: 'md',
		labelPlacement: 'inline',
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
			<Stack
				gap='lg'
			
				style={{maxWidth: 360}}
			>
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
					<div
						key={`c-${size}`}
						style={{
							display: 'flex',
							gap: 'var(--altum-g-space-2)',
							alignItems: 'center',
						}}
					>
						<MaskedField
							label='Дата'
							mask='99.99.9999'
							size={size}
							labelPlacement='none'
							maskAsPlaceholder
							value={date}
							onChange={setDate}
							id={`story-mask-none-${size}`}
							width='full'
						/>
						<Button size={size}>
							OK
						</Button>
					</div>
				))}
			</Stack>
		);
	},
	parameters: story('`size` `sm`–`lg` и `labelPlacement="none"` — `maskOverlay` совпадает с текстом инпута.'),
};

export const LabelPlacement: Story<MaskedFieldProps> = {
	render: function LabelPlacementRender() {
		const [inline, setInline] = useState('');
		const [outside, setOutside] = useState('');
		const [none, setNone] = useState('');
		return (
			<Stack gap='lg' style={{maxWidth: 320}}>
				<MaskedField
					label='Дата (inline)'
					mask='99.99.9999'
					value={inline}
					onChange={setInline}
					labelPlacement='inline'
					width='full'
					id='story-mask-lp-inline'
				/>
				<MaskedField
					label='Дата (outside)'
					mask='99.99.9999'
					value={outside}
					onChange={setOutside}
					labelPlacement='outside'
					maskAsPlaceholder
					width='full'
					id='story-mask-lp-outside'
				/>
				<MaskedField
					label='Дата'
					mask='99.99.9999'
					value={none}
					onChange={setNone}
					labelPlacement='none'
					maskAsPlaceholder
					width='full'
					id='story-mask-lp-none'
				/>
			</Stack>
		);
	},
	parameters: story('`labelPlacement` + `maskAsPlaceholder` вне inline.'),
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
