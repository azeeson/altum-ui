import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {
	CustomSelect,
	type CustomSelectOption,
	type CustomSelectRenderTargetContext,
	type CustomSelectRootProps,
} from './CustomSelect';
import {Button} from '../Button/Button';
import {Chip} from '../Chip/Chip';
import {componentParameters, story, Story} from '../../storybook/meta';
import styles from './CustomSelect.stories.module.css';

const CITY_OPTIONS: CustomSelectOption[] = [
	{
		label: 'Москва',
		value: 'moscow'
	},
	{
		label: 'Санкт-Петербург',
		value: 'spb'
	},
	{
		label: 'Новосибирск',
		value: 'novosibirsk'
	},
	{
		label: 'Екатеринбург',
		value: 'ekaterinburg'
	},
	{
		label: 'Казань',
		value: 'kazan'
	},
	{
		label: 'Нижний Новгород',
		value: 'nizhny-novgorod'
	},
];

export default {
	title: 'altum/Components/CustomSelect',
	component: CustomSelect.Root,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Составной примитив для select/combobox: Dropdown + Listbox, кастомный trigger через renderTarget.',
	),
} satisfies Meta<typeof CustomSelect.Root>;

export const Playground: Story<CustomSelectRootProps> = {
	render: function ButtonTargetRender() {
		const [value, setValue] = useState('moscow');

		const renderTarget = (ctx: CustomSelectRenderTargetContext) => {
			const label = ctx.selectedOptions[0]?.label ?? 'Выберите город';
			return (
				<div
					ref={ctx.triggerRef}
					className={styles.triggerWrap}
				>
					<Button
						{...ctx.triggerAttrs}
						variant='secondary'
						disabled={ctx.disabled}
						aria-haspopup='listbox'
					>
						{typeof label === 'string' ? label : 'Выбрано'}
					</Button>
				</div>
			);
		};

		return (
			<CustomSelect.Root
				options={CITY_OPTIONS}
				value={value}
				onChange={(next) => setValue(typeof next === 'string' ? next : next[0] ?? '')}
				renderTarget={renderTarget}
				widthMode='trigger'
				mobileTitle='Город'
			>
				<CustomSelect.Filter placeholder='Поиск города...' />
				<CustomSelect.List aria-label='Города' />
			</CustomSelect.Root>
		);
	},
	parameters: story('Триггер — Button; поиск через CustomSelect.Filter.'),
};

export const CompoundMultiple: Story<CustomSelectRootProps> = {
	render: function ChipTargetRender() {
		const [value, setValue] = useState<string[]>(['moscow', 'kazan']);

		const renderTarget = (ctx: CustomSelectRenderTargetContext) => (
			<div
				{...ctx.triggerAttrs}
				ref={ctx.triggerRef}
				className={styles.chipTrigger}
				role='combobox'
				tabIndex={ctx.disabled ? -1 : 0}
				aria-disabled={ctx.disabled || undefined}
			>
				{ctx.selectedOptions.length === 0 && (
					<span className={styles.placeholder}>
						Выберите города
					</span>
				)}
				{ctx.selectedOptions.map((option) => {
					const text = typeof option.label === 'string' ? option.label : option.value;
					return (
						<Chip
							key={option.value}
							variant='secondary'
							size='sm'
							removeLabel={`Удалить ${text}`}
							onRemove={ctx.readOnly ? undefined : () => ctx.removeOption(option.value)}
						>
							{text}
						</Chip>
					);
				})}
			</div>
		);

		return (
			<CustomSelect.Root
				options={CITY_OPTIONS}
				selectionMode='multiple'
				value={value}
				onChange={(next) => setValue(Array.isArray(next) ? next : [])}
				renderTarget={renderTarget}
				widthMode='trigger'
				triggerMode='combobox'
				mobileTitle='Города'
			>
				<CustomSelect.Filter />
				<CustomSelect.List aria-label='Города' showCheck />
			</CustomSelect.Root>
		);
	},
	parameters: story('Множественный выбор: chips в renderTarget + removeOption из контекста.'),
};

const GROUPED_OPTIONS: CustomSelectOption[] = [
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

export const WithGroups: Story<CustomSelectRootProps> = {
	render: function GroupsRender() {
		const [value, setValue] = useState('react');
		const renderTarget = (ctx: CustomSelectRenderTargetContext) => {
			const label = ctx.selectedOptions[0]?.label ?? 'Стек';
			return (
				<div ref={ctx.triggerRef} className={styles.triggerWrap}>
					<Button
						{...ctx.triggerAttrs}
						variant='secondary'
						disabled={ctx.disabled}
						aria-haspopup='listbox'
					>
						{typeof label === 'string' ? label : 'Выбрано'}
					</Button>
				</div>
			);
		};
		return (
			<CustomSelect.Root
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
				onChange={(next) => setValue(typeof next === 'string' ? next : next[0] ?? '')}
				renderTarget={renderTarget}
			>
				<CustomSelect.List aria-label='Стек' />
			</CustomSelect.Root>
		);
	},
	parameters: story('Группы: плоский `options` + `groups` + `groupId`.'),
};
