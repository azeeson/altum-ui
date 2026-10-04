import type {Meta, StoryObj} from '@storybook/react';
import React, {useState} from 'react';
import {
	Overlay,
	type OverlaySheetSide,
} from './Overlay';
import {Button} from '../Button/Button';
import {Text} from '../Text/Text';
import {componentParameters, story} from '../../storybook/meta';

const demoPanelStyle: React.CSSProperties = {
	background: 'var(--altum-color-dropdown-bg)',
	border: '1px solid var(--altum-color-dropdown-border)',
	borderRadius: 'var(--altum-g-radius)',
	boxShadow: 'var(--altum-shadow-dropdown)',
	padding: 'var(--altum-g-space-4)',
};

function demoPanel(extraStyle: React.CSSProperties | undefined, body: React.ReactNode) {
	return (
		<div
			style={{
				...demoPanelStyle,
				...extraStyle,
			}}
		>
			{body}
		</div>
	);
}

export default {
	title: 'altum/Components/Overlay',
	component: Overlay,
	tags: ['autodocs'],
	parameters: {
		...componentParameters(
			'Слой без chrome в портале: modal и sheet — нативный dialog (showModal), floating — popover="auto".',
		),
		controls: {
			exclude: ['children', 'onOpenChange'],
		},
	},
	argTypes: {
		variant: {
			control: 'select',
			options: ['modal', 'floating', 'sheet'],
		},
		side: {
			control: 'select',
			options: [
				'top',
				'bottom',
				'left',
				'right',
			],
		},
		onOpenChange: {action: 'onOpenChange'},
	},
} satisfies Meta<typeof Overlay>;

type OverlayStory = StoryObj<typeof Overlay>;

export const ModalVariant: OverlayStory = {
	render: function ModalRender() {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button variant='primary' onClick={() => setOpen(true)}>
					Открыть modal
				</Button>
				<Overlay
					variant='modal'
					open={open}
					onOpenChange={setOpen}
					aria-label='Демо-модалка'
				>
					{demoPanel(
						{width: 360}, (
							<>
								<Text
									as='h3'
									size='lg'
									weight='medium'
								>
									Модальный Overlay
								</Text>
								<Text color='secondary'>
									Нативный dialog: фокус, Escape, scroll lock и клик по подложке.
									Контент с max-height окна.
								</Text>
								<div style={{
									marginTop: 'var(--altum-g-space-4)',
								}}
								>
									<Button variant='secondary' onClick={() => setOpen(false)}>
										Закрыть
									</Button>
								</div>
							</>
						),
					)}
				</Overlay>
			</>
		);
	},
	parameters: story('variant="modal": подложка и появление панели силами CSS.'),
};

export const FloatingVariant: OverlayStory = {
	render: function FloatingRender() {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button variant='primary' onClick={() => setOpen(true)}>
					Открыть floating
				</Button>
				<Overlay
					variant='floating'
					open={open}
					onOpenChange={setOpen}
					style={{
						left: 48,
						top: 96,
						width: 320,
					}}
					aria-label='Демо-плавающая панель'
				>
					{demoPanel(
						undefined, (
							<>
								<Text
									as='h3'
									size='lg'
									weight='medium'
								>
									Плавающий Overlay
								</Text>
								<Text color='secondary'>
									popover=&quot;auto&quot;: свободные left/top, без подложки;
									клик снаружи и Escape закрывают.
								</Text>
								<div style={{
									marginTop: 'var(--altum-g-space-4)',
								}}
								>
									<Button variant='secondary' onClick={() => setOpen(false)}>
										Закрыть
									</Button>
								</div>
							</>
						),
					)}
				</Overlay>
			</>
		);
	},
	parameters: story('variant="floating": позиция через style, показ через showPopover.'),
};

function SheetDemo({side}: {side: OverlaySheetSide}) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant='secondary' onClick={() => setOpen(true)}>
				Sheet
				{' '}
				{side}
			</Button>
			<Overlay
				variant='sheet'
				side={side}
				open={open}
				onOpenChange={setOpen}
				aria-label={`Sheet ${side}`}
			>
				{demoPanel(
					{
						height: side === 'left' || side === 'right' ? '100%' : undefined,
						minHeight: side === 'top' || side === 'bottom' ? 200 : undefined,
						minWidth: side === 'left' || side === 'right' ? 280 : undefined,
					}, (
						<>
							<Text
								as='h3'
								size='lg'
								weight='medium'
							>
								Sheet ·
								{' '}
								{side}
							</Text>
							<Text color='secondary'>
								Выезд с края внутри dialog. Escape и клик по подложке закрывают панель.
								top/bottom — max 95% высоты; left/right — max 95% ширины.
							</Text>
							<div style={{
								marginTop: 'var(--altum-g-space-4)',
							}}
							>
								<Button variant='secondary' onClick={() => setOpen(false)}>
									Закрыть
								</Button>
							</div>
						</>
					),
				)}
			</Overlay>
		</>
	);
}

export const SheetVariant: OverlayStory = {
	render: () => (
		<div style={{
			display: 'flex',
			flexWrap: 'wrap',
			gap: 'var(--altum-g-space-3)',
		}}
		>
			<SheetDemo side='bottom' />
			<SheetDemo side='top' />
			<SheetDemo side='left' />
			<SheetDemo side='right' />
		</div>
	),
	parameters: story('variant="sheet": выезд с края, подложка — ::backdrop.'),
};

export const Playground: OverlayStory = {
	render: function PlaygroundRender() {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button variant='primary' onClick={() => setOpen(true)}>
					Открыть overlay
				</Button>
				<Overlay
					variant='modal'
					open={open}
					onOpenChange={setOpen}
					aria-label='Playground overlay'
				>
					{demoPanel(
						{width: 360}, (
							<>
								<Text
									as='h3'
									size='lg'
									weight='medium'
								>
									Playground
								</Text>
								<Text color='secondary'>
									Базовый modal Overlay. Остальные варианты — в отдельных историях.
								</Text>
								<div style={{
									marginTop: 'var(--altum-g-space-4)',
								}}
								>
									<Button variant='secondary' onClick={() => setOpen(false)}>
										Закрыть
									</Button>
								</div>
							</>
						),
					)}
				</Overlay>
			</>
		);
	},
	parameters: story('Интерактивный modal Overlay. Variants — в историях ниже.'),
};

export const OverflowText: OverlayStory = {
	render: function OverflowRender() {
		const [open, setOpen] = useState(true);
		return (
			<Overlay
				variant='modal'
				open={open}
				onOpenChange={setOpen}
				aria-label='Длинный overlay'
			>
				{demoPanel(
					{width: 320}, (
						<>
							<Text
								as='h3'
								size='lg'
								weight='medium'
							>
								Очень длинный заголовок слоя без собственного chrome
							</Text>
							<Text color='secondary'>
								Текст проверяет перенос внутри панели: Overlay не режет контент,
								если панель сама не задаёт overflow.
							</Text>
							<div style={{
								marginTop: 'var(--altum-g-space-4)',
							}}
							>
								<Button variant='secondary' onClick={() => setOpen(false)}>
									Закрыть
								</Button>
							</div>
						</>
					),
				)}
			</Overlay>
		);
	},
	parameters: story('Длинный заголовок в открытом modal Overlay.'),
};

export const Interaction: OverlayStory = {
	render: function InteractionRender() {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button variant='primary' onClick={() => setOpen(true)}>
					Открыть modal
				</Button>
				<Overlay
					variant='modal'
					open={open}
					onOpenChange={setOpen}
					aria-label='Демо-модалка'
				>
					{demoPanel(
						{width: 360}, (
							<>
								<Text
									as='h3'
									size='lg'
									weight='medium'
								>
									Модальный Overlay
								</Text>
								<Button variant='secondary' onClick={() => setOpen(false)}>
									Закрыть
								</Button>
							</>
						),
					)}
				</Overlay>
			</>
		);
	},
	play: async ({canvasElement}) => {
		const trigger = canvasElement.querySelector('button');
		trigger?.click();
	},
	parameters: story('Play: клик открывает modal Overlay.'),
};
