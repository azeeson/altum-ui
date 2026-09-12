import type {Meta, StoryObj} from '@storybook/react';
import React, {useId, useState} from 'react';
import {ButtonBase} from '../base/ButtonBase';
import {ChartBase, ChartLegend} from '../base/ChartBase';
import {DialogBase} from '../base/DialogBase';
import {FieldBase, FieldBaseIcon, fieldSurfaceClassName, useFieldControlAttrs} from '../base/FieldBase';
import listboxStyles from '../components/Listbox/Listbox.module.css';
import unstyled from '../styles/unstyledControl.module.css';
import {ToggleControlBase} from '../base/ToggleControlBase';
import {IconClipboard} from '../icons/icons/IconClipboard';
import {Layout} from '../components/Layout/Layout';

const meta = {
	title: 'altum/Test/Base',
	parameters: {
		layout: 'padded',
		docs: {disable: true},
	},
} satisfies Meta;

export default meta;

type Story = StoryObj;

function FieldBaseStoryInput(props: React.ComponentPropsWithoutRef<'input'>) {
	const attrs = useFieldControlAttrs();
	return (
		<input
			{...props}
			{...attrs}
		/>
	);
}

export const FieldBaseClear: Story = {
	render: function FieldBaseClearRender() {
		const id = useId();
		const [value, setValue] = useState('');
		return (
			<FieldBase
				id={id}
				label='Сумма'
				hasValue={Boolean(value)}
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
				onClear={() => setValue('')}
			>
				<FieldBaseStoryInput
					className={fieldSurfaceClassName()}
					value={value}
					onChange={(event) => setValue(event.target.value)}
				/>
			</FieldBase>
		);
	},
};

export const ButtonBaseStates: Story = {
	render: () => (
		<div style={{
			display: 'flex',
			gap: 12,
			flexWrap: 'wrap',
			alignItems: 'center',
		}}
		>
			<ButtonBase>
				Действие
			</ButtonBase>
			<ButtonBase disabled>
				Недоступно
			</ButtonBase>
			<ButtonBase as='a' href='#base-link'>
				Ссылка
			</ButtonBase>
		</div>
	),
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

export const DialogBaseChrome: Story = {
	render: function DialogBaseChromeRender() {
		const [open, setOpen] = useState(true);
		if (!open) {
			return (
				<p>
					Диалог закрыт
				</p>
			);
		}
		return (
			<DialogBase.Provider
				onClose={() => setOpen(false)}
				titleId='base-dialog-title'
			>
				<Layout>
					<DialogBase.Header>
						<DialogBase.Title>
							Заголовок
						</DialogBase.Title>
					</DialogBase.Header>
					<DialogBase.Body>
						Тело диалога
					</DialogBase.Body>
				</Layout>
			</DialogBase.Provider>
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
