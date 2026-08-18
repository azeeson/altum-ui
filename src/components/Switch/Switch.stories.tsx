import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Switch, SwitchProps} from './Switch';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Switch',
	component: Switch,
	tags: ['autodocs'],
	parameters: componentParameters('Переключатель вкл/выкл для булевых настроек.'),
	argTypes: {
		label: {
			control: 'text',
			description: 'Метка переключателя'
		},
		checked: {
			control: 'boolean',
			description: 'Состояние включения'
		},
		disabled: {
			control: 'boolean',
			description: 'Заблокированное состояние'
		},
	},
} satisfies Meta<typeof Switch>;

export const Playground: Story<SwitchProps> = {
	render: function PlaygroundRender(args) {
		const [active, setActive] = useState(false);
		return (
			<Switch
				{...args}
				label={args.label ?? 'Включить тёмный режим'}
				checked={active}
				onChange={setActive}
			/>
		);
	},
	args: {
		label: 'Включить тёмный режим',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Sizes: Story<SwitchProps> = {
	render: function SizesRender() {
		const [sm, setSm] = useState(false);
		const [md, setMd] = useState(true);
		const [lg, setLg] = useState(false);
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-4)',
			}}
			>
				<Switch
					label='Маленький'
					size='sm'
					checked={sm}
					onChange={setSm}
				/>
				<Switch
					label='Средний'
					size='md'
					checked={md}
					onChange={setMd}
				/>
				<Switch
					label='Большой'
					size='lg'
					checked={lg}
					onChange={setLg}
				/>
			</div>
		);
	},
	parameters: story('Размеры sm / md / lg.'),
};

export const LabelSide: Story<SwitchProps> = {
	render: function LabelSideRender() {
		const [end, setEnd] = useState(true);
		const [start, setStart] = useState(false);
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-4)',
			}}
			>
				<Switch
					label='Метка справа (end)'
					labelSide='end'
					checked={end}
					onChange={setEnd}
				/>
				<Switch
					label='Метка слева (start)'
					labelSide='start'
					checked={start}
					onChange={setStart}
				/>
			</div>
		);
	},
	parameters: story('`labelSide`: end (по умолчанию) и start.'),
};
