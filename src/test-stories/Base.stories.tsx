import type {Meta, StoryObj} from '@storybook/react';
import React, {useId, useState} from 'react';
import {ButtonBase} from '../base/ButtonBase';
import {ChartBase, ChartLegend} from '../base/ChartBase';
import {DialogBase} from '../base/DialogBase';
import {FieldBase} from '../base/FieldBase';
import {ListOptionBase, ListOptionBaseLabel} from '../base/ListOptionBase';
import {MediaRowBase} from '../base/MediaRowBase';
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

export const FieldBaseClear: Story = {
	render: function FieldBaseClearRender() {
		const id = useId();
		const [value, setValue] = useState('');
		return (
			<FieldBase.Root hasValue={Boolean(value)} width='md'>
				<FieldBase.Control>
					<FieldBase.Prefix>
						<FieldBase.Icon>
							<IconClipboard />
						</FieldBase.Icon>
					</FieldBase.Prefix>
					<input
						id={id}
						value={value}
						onChange={(event) => setValue(event.target.value)}
					/>
					<FieldBase.Label htmlFor={id}>
						Сумма
					</FieldBase.Label>
					<FieldBase.Postfix>
						<FieldBase.Clear onClick={() => setValue('')} />
						<span aria-hidden>
							₽
						</span>
					</FieldBase.Postfix>
				</FieldBase.Control>
				<FieldBase.Error error={value ? undefined : 'Введите сумму'} />
			</FieldBase.Root>
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
				label='Согласен'
				controlType='checkbox'
				input={(
					<input
						id={id}
						type='checkbox'
						checked={checked}
						onChange={(event) => setChecked(event.target.checked)}
					/>
				)}
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

export const MediaRowBaseArticle: Story = {
	render: () => (
		<MediaRowBase as='article'>
			<MediaRowBase.Content>
				<MediaRowBase.Title>
					Заголовок строки
				</MediaRowBase.Title>
				<MediaRowBase.Description>
					Описание
				</MediaRowBase.Description>
			</MediaRowBase.Content>
		</MediaRowBase>
	),
};

export const ListOptionBaseSelected: Story = {
	render: () => (
		<ListOptionBase selected aria-selected='true'>
			<ListOptionBaseLabel>
				Выбранная опция
			</ListOptionBaseLabel>
		</ListOptionBase>
	),
};
