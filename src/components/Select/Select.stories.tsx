import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Select} from './Select';
import {componentParameters, story, Story} from '../../storybook/meta';

const options = [
	{
		label: 'Москва',
		value: 'moscow'
	},
	{
		label: 'Санкт-Петербург',
		value: 'spb'
	},
	{
		label: 'Казань',
		value: 'kazan'
	},
];

export default {
	title: 'altum-ui/Components/Select',
	component: Select.Root,
	tags: ['autodocs'],
	parameters: componentParameters('Составной Select с явными Trigger и Panel.'),
} satisfies Meta<typeof Select.Root>;

export const Playground: Story<Record<string, never>> = {
	render: function PlaygroundRender() {
		const [value, setValue] = useState('');
		return (
			<Select.Root
				options={options}
				value={value}
				onChange={(next) => setValue(next as string)}
			>
				<Select.Trigger
					label='Город'
					width='full'
					onClear={() => setValue('')}
				/>
				<Select.Panel>
					<Select.Filter placeholder='Найти город...' />
					<Select.List />
				</Select.Panel>
			</Select.Root>
		);
	},
	parameters: story('Опции и состояние принадлежат Root; Trigger и Panel можно компонировать независимо.'),
};

export const LabelPlacement: Story<Record<string, never>> = {
	render: () => (
		<div style={{
			display: 'grid',
			gap: 'var(--altum-g-space-3)',
			maxWidth: 320
		}}
		>
			<Select.Root options={options}>
				<Select.Trigger label='Встроенный' width='full' />
				<Select.Panel>
					<Select.List />
				</Select.Panel>
			</Select.Root>
			<Select.Root options={options}>
				<Select.Trigger
					label='Снаружи'
					labelPlacement='outside'
					width='full'
				/>
				<Select.Panel>
					<Select.List />
				</Select.Panel>
			</Select.Root>
		</div>
	),
};

export const Multiple: Story<Record<string, never>> = {
	render: function MultipleRender() {
		const [value, setValue] = useState<string[]>(['moscow']);
		return (
			<Select.Root
				options={options}
				selectionMode='multiple'
				value={value}
				onChange={(next) => setValue(next as string[])}
			>
				<Select.Trigger
					label='Города'
					width='full'
					onClear={() => setValue([])}
				>
					<Select.Chips />
				</Select.Trigger>
				<Select.Panel>
					<Select.Filter placeholder='Найти город...' />
					<Select.List />
				</Select.Panel>
			</Select.Root>
		);
	},
	parameters: story('Для множественного выбора задайте `selectionMode="multiple"` и добавьте `Select.Chips` в Trigger.'),
};

const GROUPED_OPTIONS = [
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
		value: 'node',
		label: 'Node.js',
		groupId: 'backend'
	},
	{
		value: 'go',
		label: 'Go',
		groupId: 'backend'
	},
];

export const WithGroups: Story<Record<string, never>> = {
	render: function GroupsRender() {
		const [value, setValue] = useState('react');
		return (
			<Select.Root
				options={GROUPED_OPTIONS}
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
				onChange={(next) => setValue(next as string)}
			>
				<Select.Trigger
					label='Стек'
					width='full'
					onClear={() => setValue('')}
				/>
				<Select.Panel>
					<Select.List />
				</Select.Panel>
			</Select.Root>
		);
	},
	parameters: story('Группы: `options` + `groups` + `groupId`.'),
};
