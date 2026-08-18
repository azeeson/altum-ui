import type {Meta, StoryObj} from '@storybook/react';
import React, {useRef, useState} from 'react';
import {
	Overlay,
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

export default {
	title: 'altum-ui/Components/Overlay',
	component: Overlay,
	tags: ['autodocs'],
	parameters: {
		...componentParameters(
			'Примитив позиционирования без chrome: modal / floating / sheet / popover / dropdown.',
		),
		controls: {
			exclude: [
				'children',
				'onClose',
				'onOpenChange',
				'targetRef'
			]
		},
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
					onClose={() => setOpen(false)}
					aria-label='Демо-модалка'
				>
					<div style={{
						...demoPanelStyle,
						width: 360
					}}
					>
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
					</div>
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
					onClose={() => setOpen(false)}
					style={{
						left: 48,
						top: 96,
						width: 320,
					}}
					aria-label='Демо-плавающая панель'
				>
					<div style={demoPanelStyle}>
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
					</div>
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
				onClose={() => setOpen(false)}
				backdrop={backdrop}
				aria-label={`Sheet ${side}`}
			>
				<div style={{
					...demoPanelStyle,
					height: side === 'left' || side === 'right' ? '100%' : undefined,
					minHeight: side === 'top' || side === 'bottom' ? 200 : undefined,
					minWidth: side === 'left' || side === 'right' ? 280 : undefined,
				}}
				>
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
				</div>
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
	parameters: story('variant="sheet": slide с края; опционально backdrop / closeOnOutsideClick / closeOnEscape.'),
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
					onClose={() => setOpen(false)}
					onOpenChange={setOpen}
					targetRef={targetRef}
					triggerMode={triggerMode}
					side={side}
					align={align}
				>
					<div style={{
						...demoPanelStyle,
						minWidth: 200
					}}
					>
						<Text>
							Содержимое popover
						</Text>
					</div>
				</Overlay>
			) : (
				<Overlay
					variant='dropdown'
					open={open}
					onClose={() => setOpen(false)}
					onOpenChange={setOpen}
					targetRef={targetRef}
					triggerMode={triggerMode}
					side={side}
					align={align}
					widthMode={widthMode ?? 'trigger-fit'}
				>
					<div style={demoPanelStyle}>
						<Text>
							Dropdown (
							{widthMode ?? 'trigger-fit'}
							)
						</Text>
						<Text color='secondary' size='sm'>
							Раскрытие от якоря с transform-origin по стороне.
						</Text>
					</div>
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
					Модалка, asChild=false
				</Button>
				<Overlay
					variant='modal'
					open={open}
					onClose={() => setOpen(false)}
					asChild={false}
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
	parameters: story('`asChild={false}`: children — функция `(props, contentRef) => ReactNode`.'),
};
