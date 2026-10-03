import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {AutocompleteField, AutocompleteFieldProps} from './AutocompleteField';
import {Stack} from '../Layout';
import {Text} from '../Text/Text';
import {
	componentParameters,
	fieldArgTypes,
	story,
	Story,
} from '../../storybook/meta';

const TAG_OPTIONS = [
	{
		label: 'React',
		value: 'react'
	},
	{
		label: 'TypeScript',
		value: 'typescript'
	},
	{
		label: 'CSS Modules',
		value: 'css-modules'
	},
	{
		label: 'Accessibility',
		value: 'a11y'
	},
];

export default {
	title: 'altum/Components/FormField/AutocompleteField',
	component: AutocompleteField,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Freestyle-комбобокс: произвольный ввод или выбор из options.',
	),
	args: {
		label: 'Тег',
		size: 'md',
		width: 'md',
	},
	argTypes: {
		...fieldArgTypes,
		options: {control: false},
	},
} satisfies Meta<typeof AutocompleteField>;

export const Playground: Story<AutocompleteFieldProps> = {
	render: function PlaygroundRender(args) {
		const [value, setValue] = useState('');
		return (
			<Stack gap='sm'>
				<AutocompleteField
					{...args}
					options={TAG_OPTIONS}
					value={value}
					onChange={(next) => {
						args.onChange?.(next);
						setValue(next);
					}}
				/>
				<Text size='sm' color='muted'>
					value:
					{' '}
					{value || '—'}
				</Text>
			</Stack>
		);
	},
	parameters: story('Произвольный ввод; выбор из списка подставляет option.value.'),
};

export const PickFromList: Story<AutocompleteFieldProps> = {
	render: function PickFromListRender() {
		const [value, setValue] = useState('react');
		return (
			<div style={{maxWidth: 360}}>
				<AutocompleteField
					label='Стек'
					options={TAG_OPTIONS}
					value={value}
					onChange={setValue}
					width='full'
					onClear={() => setValue('')}
				/>
			</div>
		);
	},
	parameters: story('Выбор из списка; можно дописать своё значение.'),
};
