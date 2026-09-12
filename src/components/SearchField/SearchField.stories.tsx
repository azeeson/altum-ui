import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {SearchField, SearchFieldProps} from './SearchField';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {Stack, Inline} from '../Layout/Layout';
import {Text} from '../Text/Text';
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
	title: 'altum/Components/FormField/SearchField',
	component: SearchField,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Поле поиска с иконкой лупы; по умолчанию `labelPlacement="none"`.',
	),
	args: {
		label: 'Поиск задач',
		placeholder: 'Поиск…',
		size: 'md',
		width: 'md',
		labelPlacement: 'none',
	},
	argTypes: fieldArgTypes,
} satisfies Meta<typeof SearchField>;

export const Playground: Story<SearchFieldProps> = {
	render: function PlaygroundRender(args) {
		const [val, setVal] = useState('');
		return (
			<SearchField
				{...args}
				value={val}
				onChange={(e) => {
					args.onChange?.(e);
					setVal(e.target.value);
				}}
				onClear={args.onClear ? () => setVal('') : undefined}
			/>
		);
	},
	args: {
		label: 'Поиск задач',
		placeholder: 'Поиск…',
	},
	parameters: story('Используйте панель Controls для настройки. Default: `labelPlacement="none"`.'),
};

export const Sizes: Story<SearchFieldProps> = {
	render: function SizesRender() {
		const [val, setVal] = useState('');
		return (
			<Stack gap='sm' style={{maxWidth: 320}}>
				{(['sm', 'md', 'lg'] as const).map((size) => (
					<Inline
						key={size}
						gap='sm'
						align='center'
					>
						<SearchField
							label='Поиск'
							size={size}
							value={val}
							onChange={(e) => setVal(e.target.value)}
							placeholder={`size=${size}`}
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
	parameters: story('`sm`–`lg` рядом с Button.'),
};

export const LabelPlacement: Story<SearchFieldProps> = {
	render: function LabelPlacementRender() {
		const [val, setVal] = useState('');
		return (
			<Stack gap='md' style={{maxWidth: 320}}>
				{(['none', 'outside', 'inline'] as const).map((placement) => (
					<SearchField
						key={placement}
						label={`Поиск (${placement})`}
						labelPlacement={placement}
						value={val}
						onChange={(e) => setVal(e.target.value)}
						placeholder='Введите запрос'
						width='full'
					/>
				))}
			</Stack>
		);
	},
	parameters: story('По умолчанию — `none`; можно переключить на outside / inline.'),
};

export const Disabled: Story<SearchFieldProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 360}}>
			<SearchField
				label='Поиск'
				disabled
				value='дизайн-система'
				placeholder='Поиск…'
				width='full'
			/>
			<SearchField
				label='Поиск'
				error='Ничего не найдено по запросу'
				value='xyz'
				width='full'
			/>
		</Stack>
	),
	parameters: story('Заблокированное поле и ошибка поиска.'),
};

export const Empty: Story<SearchFieldProps> = {
	args: {
		label: 'Поиск',
		placeholder: 'Поиск…',
		width: 'full',
	},
	parameters: story('Пустой запрос.'),
};

export const OverflowText: Story<SearchFieldProps> = {
	render: function OverflowRender() {
		const [val, setVal] = useState(STORY_OVERFLOW_VALUE);
		return (
			<div style={{maxWidth: 280}}>
				<SearchField
					label={STORY_OVERFLOW_LABEL}
					labelPlacement='outside'
					value={val}
					onChange={(e) => setVal(e.target.value)}
					width='full'
				/>
			</div>
		);
	},
	parameters: story('Длинный запрос в узком поле.'),
};

export const FullWidth: Story<SearchFieldProps> = {
	args: {
		label: 'Поиск',
		width: 'full',
		placeholder: 'Поиск…',
	},
	parameters: story('Поле поиска на всю ширину контейнера.'),
};

export const WithClear: Story<SearchFieldProps> = {
	render: function WithClearRender() {
		const [val, setVal] = useState('дизайн-система');
		return (
			<div style={{maxWidth: 360}}>
				<SearchField
					label='Поиск'
					value={val}
					onChange={(e) => setVal(e.target.value)}
					onClear={() => setVal('')}
					width='full'
					placeholder='Поиск…'
				/>
			</div>
		);
	},
	parameters: story('Кнопка очистки при `onClear` — сбрасывает запрос.'),
};

export const Focused: Story<SearchFieldProps> = {
	render: () => (
		<div style={{maxWidth: 360}}>
			<SearchField
				label='Поиск'
				defaultValue='задачи'
				placeholder='Поиск…'
				width='full'
			/>
		</div>
	),
	play: async ({canvasElement}) => {
		await playFocus(canvasElement);
	},
	parameters: story('Программный фокус — chrome `:focus-within`.'),
};

export const Interaction: Story<SearchFieldProps> = {
	render: function InteractionRender() {
		const [val, setVal] = useState('');
		return (
			<div style={{maxWidth: 360}}>
				<SearchField
					label='Поиск'
					value={val}
					onChange={(e) => setVal(e.target.value)}
					onClear={() => setVal('')}
					placeholder='Поиск…'
					width='full'
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playType(canvasElement, 'дизайн');
	},
	parameters: story('Play: ввод поискового запроса.'),
};

export const UsageExample: Story<SearchFieldProps> = {
	render: function UsageExampleRender() {
		const [query, setQuery] = useState('');
		return (
			<Card
				header='Задачи'
				style={{maxWidth: 480}}
			>
				<Stack gap='md'>
					<Inline gap='sm' align='center'>
						<SearchField
							label='Поиск задач'
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onClear={() => setQuery('')}
							placeholder='Название или исполнитель'
							width='full'
						/>
						<Button variant='primary'>
							Найти
						</Button>
					</Inline>
					<Text size='sm' color='muted'>
						{query ? `Фильтр: ${query}` : 'Введите запрос, чтобы отфильтровать список'}
					</Text>
				</Stack>
			</Card>
		);
	},
	parameters: story('Поиск в шапке карточки со списком задач.'),
};
