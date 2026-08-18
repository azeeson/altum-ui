import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {TextField, TextFieldProps} from './TextField';
import {FieldBase} from '../../base/FieldBase';
import {IconUser} from '../../icons/icons/IconUser';
import {IconCamera} from '../../icons/icons/IconCamera';
import {IconPencil} from '../../icons/icons/IconPencil';
import {IconClock} from '../../icons/icons/IconClock';
import {Button} from '../Button/Button';
import {Dropdown} from '../Dropdown/Dropdown';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/TextField',
	component: TextField,
	tags: ['autodocs'],
	parameters: componentParameters('Однострочное текстовое поле с меткой, иконками, очисткой, ошибками и размерами.'),
	argTypes: {
		label: {
			control: 'text',
			description: 'Метка поля'
		},
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg']
			},
			description: 'Размер поля',
		},
		disabled: {
			control: 'boolean',
			description: 'Заблокированное состояние'
		},
		width: {
			control: {
				type: 'select',
				options: [
					'xxs',
					'sm',
					'md',
					'lg',
					'xl',
					'full'
				]
			},
			description: 'Ширина оболочки'
		},
		labelPlacement: {
			control: {
				type: 'select',
				options: ['inline', 'outside', 'none'],
			},
			description: 'Расположение лейбла: inline (floating), outside (над полем), none (без лейбла)',
		},
		error: {
			control: 'text',
			description: 'Текст ошибки валидации'
		},
	},
} satisfies Meta<typeof TextField>;

export const Playground: Story<TextFieldProps> = {
	render: function PlaygroundRender(args) {
		const [val, setVal] = useState('');
		return (
			<TextField
				{...args}
				value={val}
				onChange={(e) => setVal(e.target.value)}
				onClear={args.onClear ? () => setVal('') : undefined}
				id='story-text-playground'
			/>
		);
	},
	args: {
		label: 'Электронная почта',
		width: 'md',
		onClear: () => undefined,
	},
	parameters: story('Используйте панель Controls для настройки. С `onClear` появляется кнопка очистки.'),
};

export const AllVariants: Story<TextFieldProps> = {
	render: function AllVariantsRender() {
		const [val, setVal] = useState('');
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '20px'
			}}
			>
				<TextField
					label='Электронная почта'
					value={val}
					onChange={(e) => setVal(e.target.value)}
					id='story-text-email'
				/>
				<TextField
					label='Электронная почта'
					value={val}
					onChange={(e) => setVal(e.target.value)}
					width='full'
					id='story-text-full'
				/>
				<TextField
					label='Инпут с иконкой вначале'
					prefix={(
						<FieldBase.Icon>
							<IconUser />
						</FieldBase.Icon>
					)}
				/>
				<TextField
					label='Инпут с иконкой вконце'
					postfix={(
						<FieldBase.Icon>
							<IconCamera />
						</FieldBase.Icon>
					)}
				/>
				<TextField
					label='Инпут с кнопкой вначале'
					prefix={(
						<Dropdown>
							<Dropdown.Trigger asChild>
								<FieldBase.Button aria-label='Редактировать' icon={<IconPencil />} />
							</Dropdown.Trigger>
							<Dropdown.Content>
								<div style={{padding: '16px'}}>
									Пример длинного текста в поле: содержимое не обрезается.
								</div>
							</Dropdown.Content>
						</Dropdown>
					)}
				/>
				<TextField
					label='Инпут с кнопкой вконце'
					postfix={(
						<FieldBase.Button aria-label='Время' icon={<IconClock />} />
					)}
				/>
				<TextField
					label='Заблокированный инпут'
					disabled
					value='Защищённые данные'
					id='story-text-disabled'
				/>
				<TextField
					label='Инпут с ошибкой'
					error='Поле заполнено некорректно. Пожалуйста, укажите верный формат.'
					value='неверный_текст'
					id='story-text-error'
				/>
			</div>
		);
	},
	parameters: story('Все варианты: иконки, кнопки, ошибки и состояния.'),
};

export const LabelPlacement: Story<TextFieldProps> = {
	render: function LabelPlacementRender() {
		const [val, setVal] = useState('');
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 16
			}}
			>
				{(['inline', 'outside', 'none'] as const).map((placement) => (
					<div
						key={placement}
						style={{
							display: 'flex',
							gap: 8,
							alignItems: placement === 'outside' ? 'flex-end' : 'center',
						}}
					>
						<TextField
							label='Поиск'
							labelPlacement={placement}
							size='md'
							value={val}
							onChange={(e) => setVal(e.target.value)}
							placeholder='Введите запрос'
							width='md'
						/>
						<Button size='md'>
							Найти
						</Button>
					</div>
				))}
			</div>
		);
	},
	parameters: story('`labelPlacement`: inline (floating, placeholder скрыт) / outside (лейбл сверху) / none (без лейбла). Высота chrome одинакова.'),
};

export const Sizes: Story<TextFieldProps> = {
	render: function SizesRender() {
		const [val, setVal] = useState('');
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 16,
				maxWidth: 360,
			}}
			>
				{(['sm', 'md', 'lg'] as const).map((size) => (
					<div
						key={size}
						style={{
							display: 'flex',
							gap: 8,
							alignItems: 'center',
						}}
					>
						<TextField
							label={`Размер ${size}`}
							size={size}
							value={val}
							onChange={(e) => setVal(e.target.value)}
							width='full'
						/>
						<Button size={size}>
							OK
						</Button>
					</div>
				))}
			</div>
		);
	},
	parameters: story('`ControlSize` `sm`–`lg` рядом с Button того же размера.'),
};

export const WithClear: Story<TextFieldProps> = {
	render: function WithClearRender() {
		const [val, setVal] = useState('user@example.com');
		return (
			<div style={{maxWidth: 360}}>
				<TextField
					label='Электронная почта'
					value={val}
					onChange={(e) => setVal(e.target.value)}
					onClear={() => setVal('')}
					width='full'
					id='story-text-clear'
				/>
			</div>
		);
	},
	parameters: story('Кнопка очистки при `onClear` — сбрасывает значение.'),
};

/** Длинный плавающий лейбл + prefix не должны сталкиваться со значением. */
export const LongFloatingLabelWithPrefix: Story<TextFieldProps> = {
	render: function LongLabelRender() {
		const [val, setVal] = useState('42');
		return (
			<div style={{maxWidth: 320}}>
				<TextField
					label='Очень длинная подпись поля с единицами измерения и уточнениями'
					value={val}
					onChange={(e) => setVal(e.target.value)}
					helperText='Длинные подписи лучше выносить в outside / helperText'
					prefix={(
						<span aria-hidden style={{fontSize: 14}}>
							#
						</span>
					)}
					width='full'
				/>
			</div>
		);
	},
	parameters: story(
		'Floating label ellipsis + prefix gap; value остаётся читаемым.',
	),
};
