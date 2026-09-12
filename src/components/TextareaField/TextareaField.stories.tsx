import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {TextareaField, TextareaFieldProps} from './TextareaField';
import {TextField} from '../TextField/TextField';
import {Button} from '../Button/Button';
import {Fieldset} from '../Fieldset/Fieldset';
import {Stack, Inline} from '../Layout/Layout';
import {
	componentParameters,
	fieldArgTypes,
	STORY_OVERFLOW_LABEL,
	story,
	Story,
} from '../../storybook/meta';
import {playFocus, playType} from '../../storybook/play';

export default {
	title: 'altum/Components/FormField/TextareaField',
	component: TextareaField,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Многострочное текстовое поле с меткой, валидацией и настраиваемым числом строк.',
	),
	args: {
		label: 'Описание',
		size: 'md',
		width: 'full',
		labelPlacement: 'inline',
		autoResize: true,
		minRows: 1,
	},
	argTypes: {
		...fieldArgTypes,
		minRows: {
			control: 'number',
			description: 'Минимальное число строк (по умолчанию 1 — как у TextField)',
		},
		maxHeight: {
			control: 'number',
			description: 'Максимальная высота в px до появления скролла',
		},
		autoResize: {
			control: 'boolean',
			description: 'Автоматически растягивать по содержимому',
		},
	},
} satisfies Meta<typeof TextareaField>;

export const Playground: Story<TextareaFieldProps> = {
	render: function PlaygroundRender(args) {
		const [value, setValue] = useState('');
		return (
			<TextareaField
				{...args}
				value={value}
				onChange={(e) => {
					args.onChange?.(e);
					setValue(e.target.value);
				}}
				id='textarea-playground'
			/>
		);
	},
	args: {
		label: 'Описание',
		placeholder: ' ',
		size: 'md',
		width: 'full',
		minRows: 1,
		autoResize: true,
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Sizes: Story<TextareaFieldProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 400}}>
			<TextareaField
				label='Маленький'
				size='sm'
				id='textarea-sm'
				width='full'
			/>
			<TextareaField
				label='Средний'
				size='md'
				id='textarea-md'
				width='full'
			/>
			<TextareaField
				label='Большой'
				size='lg'
				id='textarea-lg'
				width='full'
			/>
		</Stack>
	),
	parameters: story('Три размера многострочного поля: sm, md, lg.'),
};

export const LabelPlacement: Story<TextareaFieldProps> = {
	render: function LabelPlacementRender() {
		const [value, setValue] = useState('');
		return (
			<Stack gap='md' style={{maxWidth: 400}}>
				{(['inline', 'outside', 'none'] as const).map((placement) => (
					<TextareaField
						key={placement}
						label={`Заметки (${placement})`}
						labelPlacement={placement}
						placeholder='Текст заметки'
						value={value}
						onChange={(e) => setValue(e.target.value)}
						width='full'
					/>
				))}
			</Stack>
		);
	},
	parameters: story('`labelPlacement` inline / outside / none.'),
};

export const Disabled: Story<TextareaFieldProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 400}}>
			<TextareaField
				label='Заблокировано'
				disabled
				value='Нельзя изменить'
				width='full'
			/>
			<TextareaField
				label='Только чтение'
				readOnly
				value='Только просмотр'
				width='full'
			/>
		</Stack>
	),
	parameters: story('`disabled` и `readOnly`.'),
};

export const WithValue: Story<TextareaFieldProps> = {
	render: function WithValueRender() {
		const [value, setValue] = useState('Заметки по задаче.');
		return (
			<TextareaField
				label='Заметки'
				value={value}
				onChange={(e) => setValue(e.target.value)}
				width='full'
				id='textarea-value'
			/>
		);
	},
	parameters: story('Контролируемое поле с предзаполненным значением.'),
};

export const WithError: Story<TextareaFieldProps> = {
	args: {
		label: 'Комментарий',
		error: 'Комментарий обязателен',
		width: 'full',
		id: 'textarea-error',
	},
	parameters: story('Поле с ошибкой валидации.'),
};

export const Empty: Story<TextareaFieldProps> = {
	args: {
		label: 'Комментарий',
		helperText: 'Кратко опишите задачу',
		width: 'full',
	},
	parameters: story('Пустое поле с подсказкой.'),
};

export const OverflowText: Story<TextareaFieldProps> = {
	render: function OverflowRender() {
		const [value, setValue] = useState(
			`${STORY_OVERFLOW_LABEL}. `.repeat(8).trim(),
		);
		return (
			<TextareaField
				label={STORY_OVERFLOW_LABEL}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				width='full'
				maxHeight={120}
			/>
		);
	},
	parameters: story('Длинный лейбл и длинный текст — скролл после maxHeight.'),
};

export const AutoResize: Story<TextareaFieldProps> = {
	render: function AutoResizeRender() {
		const [value, setValue] = useState('');
		return (
			<Stack gap='md' style={{maxWidth: 400}}>
				<TextField
					label='TextField'
					width='full'
					id='textarea-compare-textfield'
				/>
				<TextareaField
					label='TextareaField'
					value={value}
					onChange={(e) => setValue(e.target.value)}
					width='full'
					id='textarea-auto-resize'
				/>
			</Stack>
		);
	},
	parameters: story('Начальная высота как у TextField. Поле растёт при переносе строк.'),
};

export const WithMaxHeight: Story<TextareaFieldProps> = {
	render: function WithMaxHeightRender() {
		const [value, setValue] = useState(
			'Длинный текст, который не помещается в ограниченную высоту.\n'.repeat(6).trim(),
		);
		return (
			<TextareaField
				label='Ограниченная высота'
				value={value}
				onChange={(e) => setValue(e.target.value)}
				width='full'
				maxHeight={120}
				id='textarea-max-height'
			/>
		);
	},
	parameters: story('maxHeight=120 — дальше появляется вертикальный скролл.'),
};

export const UnlimitedGrowth: Story<TextareaFieldProps> = {
	render: function UnlimitedGrowthRender() {
		const [value, setValue] = useState('Строка 1\nСтрока 2\nСтрока 3');
		return (
			<TextareaField
				label='Без лимита высоты'
				value={value}
				onChange={(e) => setValue(e.target.value)}
				width='full'
				id='textarea-unlimited'
			/>
		);
	},
	parameters: story('Без maxHeight поле растёт сколько нужно для текста.'),
};

export const Focused: Story<TextareaFieldProps> = {
	render: () => (
		<div style={{maxWidth: 400}}>
			<TextareaField
				label='Заметки'
				defaultValue='Черновик'
				width='full'
			/>
		</div>
	),
	play: async ({canvasElement}) => {
		await playFocus(canvasElement, 'textarea');
	},
	parameters: story('Программный фокус — chrome `:focus-within`.'),
};

export const Interaction: Story<TextareaFieldProps> = {
	render: function InteractionRender() {
		const [value, setValue] = useState('');
		return (
			<div style={{maxWidth: 400}}>
				<TextareaField
					label='Комментарий'
					value={value}
					onChange={(e) => setValue(e.target.value)}
					width='full'
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playType(canvasElement, 'Первая строка\nВторая строка', 'textarea');
	},
	parameters: story('Play: многострочный ввод, авто-рост.'),
};

export const UsageExample: Story<TextareaFieldProps> = {
	render: function UsageExampleRender() {
		const [title, setTitle] = useState('');
		const [body, setBody] = useState('');
		return (
			<div style={{maxWidth: 440}}>
				<Fieldset
					legend='Новая задача'
					description='Краткое название и подробности.'
					footer={(
						<Inline gap='sm' justify='end'>
							<Button variant='secondary'>
								Отмена
							</Button>
							<Button variant='primary'>
								Создать
							</Button>
						</Inline>
					)}
				>
					<TextField
						label='Название'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						width='full'
					/>
					<TextareaField
						label='Описание'
						value={body}
						onChange={(e) => setBody(e.target.value)}
						helperText='Можно несколько абзацев'
						width='full'
						maxHeight={160}
					/>
				</Fieldset>
			</div>
		);
	},
	parameters: story('TextField + TextareaField в форме задачи.'),
};
