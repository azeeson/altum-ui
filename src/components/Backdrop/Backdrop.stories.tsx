import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Backdrop, BackdropProps} from './Backdrop';
import {Box} from '../Box/Box';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {Stack, Inline} from '../Layout/Layout';
import {Text} from '../Text/Text';
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
		zIndex: {
			control: 'number',
			description: 'z-index слоя',
		},
		onClick: {
			action: 'onClick',
			description: 'Клик по затемнению (закрытие)',
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
						<Backdrop
							{...args}
							onClick={() => setOpen(false)}
						/>
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
							<Box
								variant='floating'
								padding='md'
								radius='md'
								style={{pointerEvents: 'auto'}}
							>
								<Text size='sm'>
									Клик по затемнению закрывает
								</Text>
							</Box>
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
	parameters: story('Клик по backdrop закрывает демо. Controls: variant / blur / position.'),
};

export const Variants: Story<BackdropProps> = {
	render: () => (
		<Inline gap='md' wrap>
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
		</Inline>
	),
	parameters: story('default и strong внутри контейнера (absolute).'),
};

export const BlurLevels: Story<BackdropProps> = {
	render: () => (
		<Inline gap='md' wrap>
			{(['none', 'sm', 'md'] as const).map((blur) => (
				<div
					key={blur}
					style={{
						position: 'relative',
						width: 180,
						height: 110,
						borderRadius: 8,
						overflow: 'hidden',
						background: 'linear-gradient(135deg, var(--altum-color-brand), var(--altum-color-status-info))',
					}}
				>
					<Text
						size='sm'
						style={{
							padding: 12,
							color: 'var(--altum-color-text-on-brand)'
						}}
					>
						blur=
						{blur}
					</Text>
					<Backdrop
						position='absolute'
						blur={blur}
					/>
				</div>
			))}
		</Inline>
	),
	parameters: story('Уровни размытия: none / sm / md.'),
};

export const Interaction: Story<BackdropProps> = {
	render: Playground.render,
	args: {
		variant: 'default',
		blur: 'sm',
		position: 'fixed',
	},
	play: async ({canvasElement}) => {
		const button = canvasElement.querySelector('button');
		if (!(button instanceof HTMLButtonElement)) {
			throw new Error('Не найдена кнопка открытия Backdrop');
		}
		button.click();
	},
	parameters: story('Play: открывает backdrop поверх страницы.'),
};

export const UsageExample: Story<BackdropProps> = {
	render: function UsageExampleRender() {
		const [open, setOpen] = useState(false);
		return (
			<Stack gap='md' style={{maxWidth: 360}}>
				<Card
					variant='outlined'
					header={(
						<Text weight='bold'>
							Документ
						</Text>
					)}
				>
					<Text size='sm'>
						Черновик отчёта. Backdrop имитирует блокировку экрана на время сохранения.
					</Text>
				</Card>
				<Button
					variant='primary'
					size='sm'
					onClick={() => setOpen(true)}
				>
					Сохранить
				</Button>
				{open && (
					<>
						<Backdrop
							variant='strong'
							blur='sm'
							onClick={() => setOpen(false)}
						/>
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
							<Card
								variant='elevated'
								style={{
									pointerEvents: 'auto',
									maxWidth: 280
								}}
							>
								<Text size='sm'>
									Сохранение…
								</Text>
								<Button
									size='sm'
									variant='secondary'
									onClick={() => setOpen(false)}
									style={{marginTop: 'var(--altum-g-space-3)'}}
								>
									Отмена
								</Button>
							</Card>
						</div>
					</>
				)}
			</Stack>
		);
	},
	parameters: story('Backdrop + Card как упрощённый overlay сохранения.'),
};
