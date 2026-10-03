import type {Meta, StoryObj} from '@storybook/react';
import React, {useState} from 'react';
import {Modal} from '../components/Modal/Modal';
import {Button} from '../components/Button/Button';
import {Checkbox} from '../components/Checkbox/Checkbox';
import {Text} from '../components/Text/Text';
import {Title} from '../components/Title/Title';

const meta = {
	title: 'altum/Test/Interaction',
	parameters: {
		layout: 'padded',
		docs: {disable: true},
	},
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const ModalBlocksBackground: Story = {
	render: function ModalBlocksBackgroundRender() {
		const [open, setOpen] = useState(false);
		const [bgClicks, setBgClicks] = useState(0);

		return (
			<div>
				<Button
					data-testid='bg-button'
					variant='secondary'
					onClick={() => setBgClicks((n) => n + 1)}
				>
					Кнопка под модалкой
				</Button>
				<span data-testid='bg-clicks'>
					{bgClicks}
				</span>
				<div style={{marginTop: 16}}>
					<Button
						data-testid='open-modal'
						variant='primary'
						onClick={() => setOpen(true)}
					>
						Открыть модалку
					</Button>
				</div>
				<Modal open={open} onOpenChange={setOpen}>
					<Modal.Header>
						<Title level={3}>
							Тестовая модалка
						</Title>
					</Modal.Header>
					<Modal.Body>
						<Text>
							Контент модального окна
						</Text>
					</Modal.Body>
				</Modal>
			</div>
		);
	},
};

export const CheckboxControlled: Story = {
	render: function CheckboxControlledRender() {
		const [checked, setChecked] = useState(false);

		return (
			<div>
				<Checkbox
					label='Тестовый флажок'
					checked={checked}
					onChange={(event) => setChecked(event.target.checked)}
					data-testid='test-checkbox'
				/>
				<output
					data-testid='checkbox-state'
					style={{
						display: 'block',
						marginTop: 8
					}}
				>
					{checked ? 'checked' : 'unchecked'}
				</output>
			</div>
		);
	},
};

export const CheckboxForcedChecked: Story = {
	render: () => (
		<Checkbox
			label='Принудительно включён'
			checked
			onChange={() => undefined}
			data-testid='forced-checkbox'
		/>
	),
};
