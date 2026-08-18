import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {TextareaField, TextareaFieldProps} from './TextareaField';
import {TextField} from '../TextField/TextField';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/TextareaField',
	component: TextareaField,
	tags: ['autodocs'],
	parameters: componentParameters('Многострочное текстовое поле с меткой, валидацией и настраиваемым числом строк.'),
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
		error: {
			control: 'text',
			description: 'Текст ошибки валидации'
		},
		minRows: {
			control: 'number',
			description: 'Минимальное число строк (по умолчанию 1 — как у TextField)'
		},
		maxHeight: {
			control: 'number',
			description: 'Максимальная высота в px до появления скролла. Не задано — без ограничения'
		},
		autoResize: {
			control: 'boolean',
			description: 'Автоматически растягивать по содержимому'
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
				onChange={(e) => setValue(e.target.value)}
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

export const Sizes: Story<TextareaFieldProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			gap: '16px',
			maxWidth: '400px'
		}}
		>
			<TextareaField
				label='Маленький'
				size='sm'
				id='textarea-sm'
			/>
			<TextareaField
				label='Средний'
				size='md'
				id='textarea-md'
			/>
			<TextareaField
				label='Большой'
				size='lg'
				id='textarea-lg'
			/>
		</div>
	),
	parameters: story('Три размера многострочного поля: sm, md, lg.'),
};

export const AutoResize: Story<TextareaFieldProps> = {
	render: function AutoResizeRender() {
		const [value, setValue] = useState('');
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '16px',
				maxWidth: 400
			}}
			>
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
			</div>
		);
	},
	parameters: story('Начальная высота как у TextField. Поле растёт при переносе строк.'),
};

export const WithMaxHeight: Story<TextareaFieldProps> = {
	render: function WithMaxHeightRender() {
		const [value, setValue] = useState(
			'Длинный текст, который не помещается в ограниченную высоту.\n'.repeat(6).trim()
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
