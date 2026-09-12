import type {Meta} from '@storybook/react';
import React, {useRef, useState} from 'react';
import {Listbox, ListboxHandle, ListboxProps} from './Listbox';
import {componentParameters, story, Story} from '../../storybook/meta';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {Text} from '../Text/Text';
import {Stack} from '../Layout/Layout';
import {SearchField} from '../SearchField/SearchField';

const OPTIONS = [
	{
		value: 'design',
		label: 'Дизайн'
	},
	{
		value: 'dev',
		label: 'Разработка'
	},
	{
		value: 'qa',
		label: 'Тестирование'
	},
	{
		value: 'docs',
		label: 'Документация'
	},
	{
		value: 'ops',
		label: 'DevOps'
	},
];

const JSX_OPTIONS = [
	{
		value: 'moscow',
		label: (
			<span>
				<strong>
					Москва
				</strong>
				{' '}
				<span style={{opacity: 0.6}}>
					— столица
				</span>
			</span>
		),
		textValue: 'Москва',
	},
	{
		value: 'spb',
		label: (
			<span>
				<strong>
					Санкт-Петербург
				</strong>
				{' '}
				<span style={{opacity: 0.6}}>
					— СПб
				</span>
			</span>
		),
		textValue: 'Санкт-Петербург',
	},
	{
		value: 'kazan',
		label: 'Казань'
	},
];

const LONG_OPTIONS = [
	{
		value: 'a',
		label: 'Очень длинное название опции которое не должно вылезать из панели списка',
	},
	{
		value: 'b',
		label: 'Ещё одна строка с уточнениями, юридическими оговорками и полным юридическим именем сущности',
	},
];

const frameStyle: React.CSSProperties = {
	maxWidth: 280,
	border: '1px solid var(--altum-color-dropdown-border)',
	borderRadius: 'var(--altum-g-radius)',
	background: 'var(--altum-color-dropdown-bg)',
};

export default {
	title: 'altum/Components/Listbox',
	component: Listbox,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Список опций с клавиатурной навигацией и группами. Используется в Select, CustomSelect, SuggestField, ActionList.',
	),
	argTypes: {
		multiple: {control: 'boolean'},
		showCheck: {control: 'boolean'},
		disabled: {control: 'boolean'},
		loading: {control: 'boolean'},
		multiline: {control: 'boolean'},
		navigation: {
			control: 'select',
			options: ['roving', 'highlight'],
		},
		noOptionsText: {control: 'text'},
		onSelect: {action: 'onSelect'},
		onHighlightChange: {action: 'onHighlightChange'},
	},
} satisfies Meta<typeof Listbox>;

export const Playground: Story<ListboxProps> = {
	render: function PlaygroundRender({multiple, showCheck, disabled, loading, navigation}) {
		const [value, setValue] = useState<string[]>(['dev']);
		return (
			<div style={frameStyle}>
				<Listbox
					aria-label='Роль'
					options={OPTIONS}
					value={value}
					multiple={multiple}
					showCheck={showCheck}
					disabled={disabled}
					loading={loading}
					navigation={navigation}
					onSelect={(optionValue) => {
						setValue((current) => {
							if (!multiple) return [optionValue];
							return current.includes(optionValue)
								? current.filter((item) => item !== optionValue)
								: [...current, optionValue];
						});
					}}
				/>
			</div>
		);
	},
	args: {
		multiple: false,
		showCheck: false,
		disabled: false,
		loading: false,
		navigation: 'roving',
	},
	parameters: story('Controls: multiple, showCheck, disabled, loading, navigation.'),
};

export const Single: Story<ListboxProps> = {
	render: function SingleRender() {
		const [value, setValue] = useState<string[]>(['dev']);
		return (
			<div style={frameStyle}>
				<Listbox
					aria-label='Роль'
					options={OPTIONS}
					value={value}
					onSelect={(optionValue) => setValue([optionValue])}
				/>
			</div>
		);
	},
	parameters: story('Одиночный выбор. Стрелки / Home / End / Enter.'),
};

export const Multiple: Story<ListboxProps> = {
	render: function MultipleRender() {
		const [value, setValue] = useState<string[]>(['design', 'qa']);
		return (
			<div style={frameStyle}>
				<Listbox
					aria-label='Команда'
					options={OPTIONS}
					value={value}
					multiple
					showCheck
					onSelect={(optionValue) => {
						setValue((current) => (
							current.includes(optionValue)
								? current.filter((item) => item !== optionValue)
								: [...current, optionValue]
						));
					}}
				/>
			</div>
		);
	},
	parameters: story('Множественный выбор с галочками.'),
};

export const WithJsxLabels: Story<ListboxProps> = {
	render: function JsxRender() {
		const [value, setValue] = useState<string[]>([]);
		return (
			<div style={{
				...frameStyle,
				maxWidth: 320,
			}}
			>
				<Listbox
					aria-label='Город'
					options={JSX_OPTIONS}
					value={value}
					onSelect={(optionValue) => setValue([optionValue])}
				/>
			</div>
		);
	},
	parameters: story('label может быть JSX; для поиска/aria — textValue.'),
};

export const Groups: Story<ListboxProps> = {
	render: function GroupsRender() {
		const [value, setValue] = useState<string[]>(['react']);
		return (
			<div style={{
				...frameStyle,
				maxWidth: 300,
			}}
			>
				<Listbox
					aria-label='Стек'
					options={[
						{
							value: 'react',
							label: 'React',
							groupId: 'frontend'
						},
						{
							value: 'vue',
							label: 'Vue',
							groupId: 'frontend'
						},
						{
							value: 'svelte',
							label: 'Svelte',
							groupId: 'frontend',
							disabled: true
						},
						{
							value: 'node',
							label: 'Node.js',
							groupId: 'backend'
						},
						{
							value: 'go',
							label: 'Go',
							groupId: 'backend'
						},
					]}
					groups={[
						{
							id: 'frontend',
							label: 'Фронтенд'
						},
						{
							id: 'backend',
							label: 'Бэкенд'
						},
					]}
					value={value}
					onSelect={(optionValue) => setValue([optionValue])}
				/>
			</div>
		);
	},
	parameters: story('Группы: плоский `options` + `groups` + `groupId`; навигация по flat-индексу.'),
};

export const HighlightNavigation: Story<ListboxProps> = {
	render: function HighlightRender() {
		const listRef = useRef<ListboxHandle>(null);
		const [value, setValue] = useState<string[]>([]);
		const [activeId, setActiveId] = useState<string | undefined>();

		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-3)'
			}}
			>
				<div style={{
					display: 'flex',
					gap: 'var(--altum-g-space-2)'
				}}
				>
					<Button
						size='sm'
						variant='secondary'
						onClick={() => {
							listRef.current?.highlightPrev();
							setActiveId(listRef.current?.getActiveDescendantId());
						}}
					>
						↑
					</Button>
					<Button
						size='sm'
						variant='secondary'
						onClick={() => {
							listRef.current?.highlightNext();
							setActiveId(listRef.current?.getActiveDescendantId());
						}}
					>
						↓
					</Button>
					<Button
						size='sm'
						variant='primary'
						onClick={() => listRef.current?.selectHighlighted()}
					>
						Выбрать
					</Button>
				</div>
				<span style={{
					fontSize: 12,
					color: 'var(--altum-color-muted)'
				}}
				>
					aria-activedescendant: 
					{' '}
					{activeId ?? '—'}
				</span>
				<div style={frameStyle}>
					<Listbox
						ref={listRef}
						aria-label='Опции'
						options={OPTIONS}
						value={value}
						navigation='highlight'
						defaultHighlightedIndex={0}
						onHighlightChange={() => {
							setActiveId(listRef.current?.getActiveDescendantId());
						}}
						onSelect={(optionValue) => setValue([optionValue])}
					/>
				</div>
			</div>
		);
	},
	parameters: story('Режим highlight + imperative handle (как у SuggestField).'),
};

export const Empty: Story<ListboxProps> = {
	render: () => (
		<div style={frameStyle}>
			<Listbox
				aria-label='Пусто'
				options={[]}
				noOptionsText='Ничего не найдено'
			/>
		</div>
	),
	parameters: story('Пустой список с `noOptionsText`.'),
};

export const Loading: Story<ListboxProps> = {
	render: () => (
		<div style={frameStyle}>
			<Listbox
				aria-label='Загрузка'
				options={OPTIONS}
				loading
				value={['dev']}
			/>
		</div>
	),
	parameters: story('`loading` выставляет `aria-busy` на listbox.'),
};

export const Disabled: Story<ListboxProps> = {
	render: () => (
		<div style={frameStyle}>
			<Listbox
				aria-label='Заблокирован'
				options={OPTIONS}
				value={['qa']}
				disabled
			/>
		</div>
	),
	parameters: story('Весь список недоступен для выбора.'),
};

export const OverflowText: Story<ListboxProps> = {
	render: function OverflowRender() {
		const [value, setValue] = useState<string[]>([]);
		return (
			<div style={{
				...frameStyle,
				maxWidth: 220,
			}}
			>
				<Listbox
					aria-label='Длинные подписи'
					options={LONG_OPTIONS}
					value={value}
					onSelect={(optionValue) => setValue([optionValue])}
				/>
			</div>
		);
	},
	parameters: story('Длинные подписи опций в узкой панели.'),
};

export const UsageExample: Story<ListboxProps> = {
	render: function UsageExampleRender() {
		const [query, setQuery] = useState('');
		const [value, setValue] = useState<string[]>(['dev']);
		const filtered = OPTIONS.filter((option) => (
			option.label.toLowerCase().includes(query.trim().toLowerCase())
		));

		return (
			<Card
				variant='elevated'
				header={(
					<Text weight='bold'>
						Назначить роль
					</Text>
				)}
				style={{maxWidth: 320}}
			>
				<Stack gap='sm'>
					<SearchField
						label='Фильтр'
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						width='full'
					/>
					<div style={frameStyle}>
						<Listbox
							aria-label='Роль'
							options={filtered}
							value={value}
							noOptionsText='Нет совпадений'
							onSelect={(optionValue) => setValue([optionValue])}
						/>
					</div>
				</Stack>
			</Card>
		);
	},
	parameters: story('Фильтр SearchField + Listbox внутри карточки.'),
};

export const Interaction: Story<ListboxProps> = {
	render: function InteractionRender() {
		const [value, setValue] = useState<string[]>(['dev']);
		return (
			<div style={frameStyle}>
				<Listbox
					aria-label='Роль'
					options={OPTIONS}
					value={value}
					onSelect={(optionValue) => setValue([optionValue])}
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		const option = canvasElement.querySelector('[role="option"]');
		if (option instanceof HTMLElement) option.click();
	},
	parameters: story('Play: клик по первой опции.'),
};
