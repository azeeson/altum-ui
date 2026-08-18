import type {Meta} from '@storybook/react';
import React, {useRef, useState} from 'react';
import {Listbox, ListboxHandle, ListboxProps} from './Listbox';
import {componentParameters, story, Story} from '../../storybook/meta';
import {Button} from '../Button/Button';

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

export default {
	title: 'altum-ui/Components/Listbox',
	component: Listbox,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Список опций с клавиатурной навигацией и группами. Используется в Select, CustomSelect, SuggestField, ActionList.',
	),
} satisfies Meta<typeof Listbox>;

export const Single: Story<ListboxProps> = {
	render: function SingleRender() {
		const [value, setValue] = useState<string[]>(['dev']);
		return (
			<div style={{
				maxWidth: 280,
				border: '1px solid var(--altum-color-dropdown-border)',
				borderRadius: 'var(--altum-g-radius)',
				background: 'var(--altum-color-dropdown-bg)',
			}}
			>
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
			<div style={{
				maxWidth: 280,
				border: '1px solid var(--altum-color-dropdown-border)',
				borderRadius: 'var(--altum-g-radius)',
				background: 'var(--altum-color-dropdown-bg)',
			}}
			>
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
				maxWidth: 320,
				border: '1px solid var(--altum-color-dropdown-border)',
				borderRadius: 'var(--altum-g-radius)',
				background: 'var(--altum-color-dropdown-bg)',
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
				maxWidth: 300,
				border: '1px solid var(--altum-color-dropdown-border)',
				borderRadius: 'var(--altum-g-radius)',
				background: 'var(--altum-color-dropdown-bg)',
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
				<div style={{
					maxWidth: 280,
					border: '1px solid var(--altum-color-dropdown-border)',
					borderRadius: 'var(--altum-g-radius)',
					background: 'var(--altum-color-dropdown-bg)',
				}}
				>
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
