import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Backdrop, BackdropProps} from './Backdrop';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Backdrop',
	component: Backdrop,
	tags: ['autodocs'],
	parameters: componentParameters('Затемнение фона для модалок, лайтбоксов и других overlay-слоёв.'),
	argTypes: {
		variant: {
			control: {
				type: 'select',
				options: ['default', 'strong']
			},
			description: 'Интенсивность затемнения',
		},
		blur: {
			control: {
				type: 'select',
				options: ['none', 'sm', 'md']
			},
			description: 'Размытие фона',
		},
		position: {
			control: {
				type: 'select',
				options: ['fixed', 'absolute']
			},
			description: 'fixed — на весь viewport; absolute — внутри родителя',
		},
	},
} satisfies Meta<typeof Backdrop>;

export const Playground: Story<BackdropProps> = {
	render: function PlaygroundRender(args) {
		const [open, setOpen] = useState(false);

		return (
			<>
				<Button variant='primary' onClick={() => setOpen(true)}>
					Показать backdrop
				</Button>
				{open && (
					<>
						<Backdrop {...args} onClick={() => setOpen(false)} />
						<div
							style={{
								position: 'fixed',
								inset: 0,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								zIndex: 1101,
								pointerEvents: 'none',
							}}
						>
							<div
								style={{
									pointerEvents: 'auto',
									padding: 24,
									background: 'var(--altum-color-dropdown-bg)',
									borderRadius: 8,
									border: '1px solid var(--altum-color-dropdown-border)',
								}}
							>
								Клик по затемнению закрывает
							</div>
						</div>
					</>
				)}
			</>
		);
	},
	args: {
		variant: 'default',
		blur: 'sm',
		position: 'fixed',
	},
	parameters: story('Клик по backdrop закрывает демо.'),
};

export const Variants: Story<BackdropProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			gap: 16,
			flexWrap: 'wrap'
		}}
		>
			<div style={{
				position: 'relative',
				width: 200,
				height: 120,
				borderRadius: 8,
				overflow: 'hidden'
			}}
			>
				<div style={{padding: 12}}>
					Контент под слоем
				</div>
				<Backdrop
					position='absolute'
					variant='default'
					blur='sm'
				/>
			</div>
			<div style={{
				position: 'relative',
				width: 200,
				height: 120,
				borderRadius: 8,
				overflow: 'hidden'
			}}
			>
				<div style={{padding: 12}}>
					Strong + md размытие
				</div>
				<Backdrop
					position='absolute'
					variant='strong'
					blur='md'
				/>
			</div>
		</div>
	),
	parameters: story('default и strong внутри контейнера (absolute).'),
};
