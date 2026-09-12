import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {TextField, TextFieldProps} from './TextField';
import {FieldBaseButton, FieldBaseIcon} from '../../base/FieldBase';
import {IconUser} from '../../icons/icons/IconUser';
import {IconCamera} from '../../icons/icons/IconCamera';
import {IconPencil} from '../../icons/icons/IconPencil';
import {IconClock} from '../../icons/icons/IconClock';
import {Button} from '../Button/Button';
import {Dropdown} from '../Dropdown/Dropdown';
import {Fieldset} from '../Fieldset/Fieldset';
import {Stack, Inline} from '../Layout/Layout';
import {
	componentParameters,
	fieldArgTypes,
	STORY_OVERFLOW_LABEL,
	STORY_OVERFLOW_VALUE,
	story,
	Story,
} from '../../storybook/meta';
import {playFocus, playType} from '../../storybook/play';

export default {
	title: 'altum/Components/FormField/TextField',
	component: TextField,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Однострочное текстовое поле с меткой, иконками, очисткой, ошибками и размерами.',
	),
	args: {
		label: 'Электронная почта',
		size: 'md',
		width: 'md',
		labelPlacement: 'inline',
	},
	argTypes: fieldArgTypes,
} satisfies Meta<typeof TextField>;

export const Playground: Story<TextFieldProps> = {
	render: function PlaygroundRender(args) {
		const [val, setVal] = useState('');
		return (
			<TextField
				{...args}
				value={val}
				onChange={(e) => {
					args.onChange?.(e);
					setVal(e.target.value);
				}}
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

export const Sizes: Story<TextFieldProps> = {
	render: function SizesRender() {
		const [val, setVal] = useState('');
		return (
			<Stack gap='md' style={{maxWidth: 360}}>
				{(['sm', 'md', 'lg'] as const).map((size) => (
					<Inline
						key={size}
						gap='sm'
						align='center'
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
					</Inline>
				))}
			</Stack>
		);
	},
	parameters: story('`ControlSize` `sm`–`lg` рядом с Button того же размера.'),
};

export const LabelPlacement: Story<TextFieldProps> = {
	render: function LabelPlacementRender() {
		const [val, setVal] = useState('');
		return (
			<Stack gap='md'>
				{(['inline', 'outside', 'none'] as const).map((placement) => (
					<Inline
						key={placement}
						gap='sm'
						align={placement === 'outside' ? 'end' : 'center'}
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
					</Inline>
				))}
			</Stack>
		);
	},
	parameters: story('`labelPlacement`: inline (floating) / outside / none. Высота chrome одинакова.'),
};

export const Disabled: Story<TextFieldProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 360}}>
			<TextField
				label='Заблокированный инпут'
				disabled
				value='Защищённые данные'
				width='full'
			/>
			<TextField
				label='Только чтение'
				readOnly
				value='Нельзя изменить'
				width='full'
			/>
		</Stack>
	),
	parameters: story('`disabled` и `readOnly`.'),
};

export const Error: Story<TextFieldProps> = {
	args: {
		label: 'Электронная почта',
		error: 'Поле заполнено некорректно. Пожалуйста, укажите верный формат.',
		value: 'неверный_текст',
		width: 'full',
		id: 'story-text-error',
	},
	parameters: story('Ошибка валидации: рамка и текст `error`.'),
};

export const Empty: Story<TextFieldProps> = {
	args: {
		label: 'Электронная почта',
		helperText: 'Мы не передаём адрес третьим лицам',
		width: 'full',
	},
	parameters: story('Пустое поле с `helperText`.'),
};

export const OverflowText: Story<TextFieldProps> = {
	render: function OverflowRender() {
		const [val, setVal] = useState(STORY_OVERFLOW_VALUE);
		return (
			<Stack gap='md' style={{maxWidth: 320}}>
				<TextField
					label={STORY_OVERFLOW_LABEL}
					value={val}
					onChange={(e) => setVal(e.target.value)}
					helperText='Длинные подписи лучше выносить в outside / helperText'
					prefix={(
						<FieldBaseIcon>
							<IconUser />
						</FieldBaseIcon>
					)}
					width='full'
				/>
			</Stack>
		);
	},
	parameters: story('Длинный floating label + длинное значение + prefix.'),
};

export const AllVariants: Story<TextFieldProps> = {
	render: function AllVariantsRender() {
		const [val, setVal] = useState('');
		return (
			<Stack gap='lg' style={{maxWidth: 420}}>
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
						<FieldBaseIcon>
							<IconUser />
						</FieldBaseIcon>
					)}
				/>
				<TextField
					label='Инпут с иконкой вконце'
					postfix={(
						<FieldBaseIcon>
							<IconCamera />
						</FieldBaseIcon>
					)}
				/>
				<TextField
					label='Инпут с кнопкой вначале'
					prefix={(
						<Dropdown
							renderTrigger={(props, ref) => (
								<FieldBaseButton
									aria-label='Редактировать'
									icon={<IconPencil />}
									{...props}
									ref={ref}
								/>
							)}
						>
							<div style={{padding: '16px'}}>
								Пример длинного текста в поле: содержимое не обрезается.
							</div>
						</Dropdown>
					)}
				/>
				<TextField
					label='Инпут с кнопкой вконце'
					postfix={(
						<FieldBaseButton aria-label='Время' icon={<IconClock />} />
					)}
				/>
			</Stack>
		);
	},
	parameters: story('Иконки, кнопки и ширина `full`.'),
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
					label={STORY_OVERFLOW_LABEL}
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
	parameters: story('Floating label ellipsis + prefix gap; value остаётся читаемым.'),
};

export const Focused: Story<TextFieldProps> = {
	render: () => (
		<div style={{maxWidth: 360}}>
			<TextField
				label='Электронная почта'
				defaultValue='user@example.com'
				width='full'
			/>
		</div>
	),
	play: async ({canvasElement}) => {
		await playFocus(canvasElement);
	},
	parameters: story('Программный фокус — chrome `:focus-within`.'),
};

export const Interaction: Story<TextFieldProps> = {
	render: function InteractionRender() {
		const [val, setVal] = useState('');
		return (
			<div style={{maxWidth: 360}}>
				<TextField
					label='Электронная почта'
					value={val}
					onChange={(e) => setVal(e.target.value)}
					onClear={() => setVal('')}
					width='full'
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playType(canvasElement, 'hello@altum.ui');
	},
	parameters: story('Play: ввод адреса — значение и кнопка очистки.'),
};

export const UsageExample: Story<TextFieldProps> = {
	render: function UsageExampleRender() {
		const [name, setName] = useState('Алексей');
		const [email, setEmail] = useState('');
		return (
			<div style={{maxWidth: 420}}>
				<Fieldset
					legend='Профиль'
					description='Имя и рабочая почта для уведомлений.'
					footer={(
						<Inline gap='sm' justify='end'>
							<Button variant='secondary'>
								Отмена
							</Button>
							<Button variant='primary'>
								Сохранить
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
					<TextField
						label='Эл. почта'
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						onClear={() => setEmail('')}
						helperText='На этот адрес придёт письмо подтверждения'
						width='full'
					/>
				</Fieldset>
			</div>
		);
	},
	parameters: story('Поля внутри Fieldset с кнопками в футере.'),
};
