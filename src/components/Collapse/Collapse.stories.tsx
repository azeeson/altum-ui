import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Collapse, CollapseProps} from './Collapse';
import {Button} from '../Button/Button';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Collapse',
	component: Collapse,
	tags: ['autodocs'],
	parameters: componentParameters('Плавное раскрытие и сворачивание по высоте (`open`).'),
	argTypes: {
		open: {
			control: 'boolean',
			description: 'Состояние раскрытия'
		},
	},
} satisfies Meta<typeof Collapse>;

export const Playground: Story<CollapseProps> = {
	render: function PlaygroundRender() {
		const [open, setOpen] = useState(false);
		return (
			<div style={{maxWidth: '300px'}}>
				<Button variant='secondary' onClick={() => setOpen(!open)}>
					Показать спойлер
				</Button>
				<div style={{marginTop: '12px'}}>
					<Collapse open={open}>
						<div style={{
							background: '#f1f5f9',
							padding: '16px',
							borderRadius: '8px'
						}}
						>
							<Text size='sm'>
								Плавный раскрывающийся текст под спойлером!
							</Text>
						</div>
					</Collapse>
				</div>
			</div>
		);
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const WithOpenState: Story<CollapseProps> = {
	render: () => (
		<div style={{maxWidth: 320}}>
			<Collapse open>
				<div style={{
					padding: 'var(--altum-g-space-4)',
					borderRadius: 'var(--altum-g-radius)',
					background: 'var(--altum-color-surface)',
					border: '1px solid var(--altum-color-border)',
				}}
				>
					<Text size='sm'>
						Контент виден сразу при `open`
						{' '}
						без анимации переключения.
					</Text>
				</div>
			</Collapse>
		</div>
	),
	parameters: story('Статически раскрытый блок.'),
};
