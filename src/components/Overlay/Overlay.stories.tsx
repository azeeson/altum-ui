import type {Meta, StoryObj} from '@storybook/react';
import React, {useRef, useState} from 'react';
import {
	Overlay,
	type OverlayContentProps,
	type OverlaySheetSide,
	type OverlayWidthMode,
} from './Overlay';
import {Button} from '../Button/Button';
import {Text} from '../Text/Text';
import {componentParameters, story} from '../../storybook/meta';
import type {AnchorAlign, AnchorSide} from '../../types';

const demoPanelStyle: React.CSSProperties = {
	background: 'var(--altum-color-dropdown-bg)',
	border: '1px solid var(--altum-color-dropdown-border)',
	borderRadius: 'var(--altum-g-radius)',
	boxShadow: 'var(--altum-shadow-dropdown)',
	padding: 'var(--altum-g-space-4)',
};

function demoPanel(extraStyle: React.CSSProperties | undefined, body: React.ReactNode) {
	function OverlayDemoPanel(slotProps: OverlayContentProps, contentRef: React.RefCallback<HTMLElement>) {
		return (
			<div
				{...slotProps}
				ref={contentRef}
				style={{
					...demoPanelStyle,
					...extraStyle,
					...slotProps.style,
				}}
			>
				{body}
			</div>
		);
	}
	return OverlayDemoPanel;
}

export default {
	title: 'altum/Components/Overlay',
	component: Overlay,
	tags: ['autodocs'],
	parameters: {
		...componentParameters(
			'Примитив позиционирования без chrome: modal / floating / sheet / popover / dropdown.',
		),
		controls: {
			exclude: ['children', 'onOpenChange', 'targetRef']
		},
	},
	argTypes: {
		variant: {
			control: 'select',
			options: [
				'modal',
				'floating',
				'sheet',
				'popover',
				'dropdown'
			],
		},
		side: {
			control: 'select',
			options: [
				'top',
				'bottom',
				'left',
				'right'
			],
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'end'],
		},
		triggerMode: {
			control: 'select',
			options: ['click', 'hover', 'manual'],
		},
		widthMode: {
			control: 'select',
			options: ['trigger', 'content', 'trigger-fit'],
		},
		backdrop: {control: 'boolean'},
		dismiss: {
			control: 'select',
			options: [
				'all',
				'outside',
				'escape',
				'none'
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
									Backdrop, FocusTrap, Escape и scroll-lock. Контент с max-height окна и прокруткой.
								</Text>
								<div style={{
									marginTop: 'var(--altum-g-space-4)'
								}}
								>
									<Button variant='secondary' onClick={() => setOpen(false)}>
										Закрыть
									</Button>
								</div>
							</>
						)
					)}
				</Overlay>
			</>
		);
	},
	parameters: story('variant="modal": Fade Backdrop + появление children снизу вверх.'),
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
									Свободные left/top без центрирования. Backdrop опционален;
									portal, stack, FocusTrap и Escape — как у modal.
								</Text>
								<div style={{
									marginTop: 'var(--altum-g-space-4)'
								}}
								>
									<Button variant='secondary' onClick={() => setOpen(false)}>
										Закрыть
									</Button>
								</div>
							</>
						)
					)}
				</Overlay>
			</>
		);
	},
	parameters: story('variant="floating": свободное позиционирование; backdrop / lockScroll / trapFocus опциональны.'),
};

function SheetDemo({
	side,
	backdrop = false,
}: {
	side: OverlaySheetSide;
	backdrop?: boolean;
}) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant='secondary' onClick={() => setOpen(true)}>
				Sheet
				{' '}
				{side}
				{backdrop ? ' + затемнение' : ''}
			</Button>
			<Overlay
				variant='sheet'
				side={side}
				open={open}
				onOpenChange={setOpen}
				backdrop={backdrop}
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
								{backdrop
									? 'С Backdrop: Escape и клик по scrim закрывают панель.'
									: 'Выезд с края, без Backdrop. top/bottom — max 95% высоты; left/right — max 95% ширины.'}
							</Text>
							<div style={{
								marginTop: 'var(--altum-g-space-4)'
							}}
							>
								<Button variant='secondary' onClick={() => setOpen(false)}>
									Закрыть
								</Button>
							</div>
						</>
					)
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
			gap: 'var(--altum-g-space-3)'
		}}
		>
			<SheetDemo side='bottom' />
			<SheetDemo side='top' />
			<SheetDemo side='left' />
			<SheetDemo side='right' />
			<SheetDemo side='bottom' backdrop />
		</div>
	),
	parameters: story('variant="sheet": slide с края; опционально backdrop / dismiss.'),
};

function AnchorDemo({
	variant,
	triggerMode,
	side = 'bottom',
	align = 'start',
	widthMode,
}: {
	variant: 'popover' | 'dropdown';
	triggerMode: 'click' | 'hover' | 'manual';
	side?: AnchorSide;
	align?: AnchorAlign;
	widthMode?: OverlayWidthMode;
}) {
	const targetRef = useRef<HTMLButtonElement>(null);
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button
				ref={targetRef}
				variant='secondary'
				onClick={triggerMode === 'manual' ? () => setOpen((v) => !v) : undefined}
			>
				{variant}
				{' '}
				·
				{triggerMode}
				{' '}
				·
				{side}
				/
				{align}
			</Button>
			{variant === 'popover' ? (
				<Overlay
					variant='popover'
					open={open}
					onOpenChange={setOpen}
					targetRef={targetRef}
					triggerMode={triggerMode}
					side={side}
					align={align}
				>
					{demoPanel(
						{minWidth: 200}, (
							<Text>
								Содержимое popover
							</Text>
						)
					)}
				</Overlay>
			) : (
				<Overlay
					variant='dropdown'
					open={open}
					onOpenChange={setOpen}
					targetRef={targetRef}
					triggerMode={triggerMode}
					side={side}
					align={align}
					widthMode={widthMode ?? 'trigger-fit'}
				>
					{demoPanel(
						undefined, (
							<>
								<Text>
									Dropdown (
									{widthMode ?? 'trigger-fit'}
									)
								</Text>
								<Text color='secondary' size='sm'>
									Раскрытие от якоря с transform-origin по стороне.
								</Text>
							</>
						)
					)}
				</Overlay>
			)}
		</>
	);
}

export const PopoverVariant: OverlayStory = {
	render: () => (
		<div style={{
			display: 'flex',
			flexWrap: 'wrap',
			gap: 'var(--altum-g-space-3)',
			padding: 'var(--altum-g-space-8)',
			justifyContent: 'center',
		}}
		>
			<AnchorDemo
				variant='popover'
				triggerMode='click'
				side='bottom'
				align='start'
			/>
			<AnchorDemo
				variant='popover'
				triggerMode='click'
				side='bottom'
				align='end'
			/>
			<AnchorDemo
				variant='popover'
				triggerMode='hover'
				side='top'
				align='center'
			/>
			<AnchorDemo
				variant='popover'
				triggerMode='manual'
				side='right'
				align='start'
			/>
		</div>
	),
	parameters: story('variant="popover": Fade + flip side/align относительно targetRef.'),
};

export const DropdownVariant: OverlayStory = {
	render: () => (
		<div style={{
			display: 'flex',
			flexWrap: 'wrap',
			gap: 'var(--altum-g-space-3)',
			padding: 'var(--altum-g-space-8)',
			justifyContent: 'center',
		}}
		>
			<AnchorDemo
				variant='dropdown'
				triggerMode='click'
				widthMode='trigger-fit'
			/>
			<AnchorDemo
				variant='dropdown'
				triggerMode='click'
				widthMode='trigger'
			/>
			<AnchorDemo
				variant='dropdown'
				triggerMode='click'
				widthMode='content'
				side='top'
			/>
		</div>
	),
	parameters: story('variant="dropdown": как popover + widthMode + expand-анимация.'),
};

export const RenderProp: OverlayStory = {
	render: function RenderPropDemo() {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button variant='primary' onClick={() => setOpen(true)}>
					Модалка, render-prop
				</Button>
				<Overlay
					variant='modal'
					open={open}
					onOpenChange={setOpen}
					aria-label='Модалка через render-prop'
				>
					{(slotProps, contentRef) => (
						<div
							{...slotProps}
							ref={contentRef}
							style={{
								...demoPanelStyle,
								...slotProps.style,
								width: 320,
							}}
						>
							<Text>
								Render-prop: пропсы и contentRef применяются вручную.
							</Text>
							<div style={{
								marginTop: 'var(--altum-g-space-4)'
							}}
							>
								<Button variant='secondary' onClick={() => setOpen(false)}>
									Закрыть
								</Button>
							</div>
						</div>
					)}
				</Overlay>
			</>
		);
	},
	parameters: story('`children` — функция `(props, contentRef) => ReactNode`.'),
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
									marginTop: 'var(--altum-g-space-4)'
								}}
								>
									<Button variant='secondary' onClick={() => setOpen(false)}>
										Закрыть
									</Button>
								</div>
							</>
						)
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
								marginTop: 'var(--altum-g-space-4)'
							}}
							>
								<Button variant='secondary' onClick={() => setOpen(false)}>
									Закрыть
								</Button>
							</div>
						</>
					)
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
						)
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
