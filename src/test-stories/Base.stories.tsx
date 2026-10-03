import type {Meta, StoryObj} from '@storybook/react';
import {useId, useState} from 'react';
import {ChartBase, ChartLegend} from '../base/ChartBase';
import {FieldBaseIcon, TextField} from '../components/TextField/TextField';
import listboxStyles from '../components/Listbox/Listbox.module.css';
import unstyled from '../styles/unstyledControl.module.css';
import {ToggleControlBase} from '../base/ToggleControlBase';
import {IconClipboard} from '../icons/icons/IconClipboard';

const meta = {
	title: 'altum/Test/Base',
	parameters: {
		layout: 'padded',
		docs: {disable: true},
	},
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const FieldBaseClear: Story = {
	render: function FieldBaseClearRender() {
		const [value, setValue] = useState('');
		return (
			<TextField
				label='Сумма'
				width='md'
				error={value ? undefined : 'Введите сумму'}
				prefix={(
					<FieldBaseIcon>
						<IconClipboard />
					</FieldBaseIcon>
				)}
				postfix={(
					<span aria-hidden>
						₽
					</span>
				)}
				value={value}
				onChange={(event) => setValue(event.target.value)}
				onClear={() => setValue('')}
			/>
		);
	},
};

export const ToggleControlBaseLabel: Story = {
	render: function ToggleControlBaseLabelRender() {
		const id = useId();
		const [checked, setChecked] = useState(false);
		return (
			<ToggleControlBase
				id={id}
				type='checkbox'
				label='Согласен'
				checked={checked}
				onChange={(event) => setChecked(event.target.checked)}
				boxContent={checked ? '✓' : ''}
			/>
		);
	},
};

export const ChartBaseLegend: Story = {
	render: () => (
		<ChartBase>
			<svg
				width={200}
				height={48}
				role='img'
				aria-label='Демо-график'
			/>
			<ChartLegend
				showWhenSingle
				items={[
					{
						name: 'Серия A',
						color: 'var(--altum-color-brand)',
					},
					{
						name: 'Серия B',
						color: 'var(--altum-color-status-info)',
					},
				]}
			/>
		</ChartBase>
	),
};

export const ListOptionBaseSelected: Story = {
	render: () => (
		<button
			className={`${unstyled.control} ${listboxStyles.option} ${listboxStyles.selected}`}
			aria-selected='true'
		>
			<span className={listboxStyles.label}>
				Выбранная опция
			</span>
		</button>
	),
};
