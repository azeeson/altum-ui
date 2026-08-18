import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {Tooltip} from './Tooltip';
import {Button} from '../Button/Button';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconHome} from '../../icons/icons/IconHome';
import {IconSearch} from '../../icons/icons/IconSearch';
import {IconGear} from '../../icons/icons/IconGear';
import {componentParameters, story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Tooltip',
	component: Tooltip,
	tags: ['autodocs'],
	parameters: componentParameters('Всплывающая подсказка при наведении на дочерний элемент.'),
	argTypes: {
		content: {
			control: 'text',
			description: 'Текст подсказки'
		},
		position: {
			control: {
				type: 'select',
				options: [
					'top',
					'bottom',
					'left',
					'right'
				]
			},
			description: 'Позиция подсказки',
		},
	},
} satisfies Meta<typeof Tooltip>;

type TooltipStory = StoryObj<typeof Tooltip>;

export const Playground: TooltipStory = {
	render: (args) => (
		<div style={{
			display: 'flex',
			justifyContent: 'center',
			padding: '40px'
		}}
		>
			<Tooltip
				content={args.content}
				position={args.position}
				asChild
			>
				<Button variant='secondary'>
					Наведи на меня
				</Button>
			</Tooltip>
		</div>
	),
	args: {
		content: 'Полезная подсказка сверху',
		position: 'top',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Variants: TooltipStory = {
	render: () => (
		<div style={{
			display: 'flex',
			gap: '24px',
			justifyContent: 'center',
			padding: '40px'
		}}
		>
			<Tooltip
				content='Подсказка сверху'
				position='top'
				asChild
			>
				<Button variant='secondary' size='sm'>
					Верх
				</Button>
			</Tooltip>
			<Tooltip
				content='Подсказка справа'
				position='right'
				asChild
			>
				<Button variant='secondary' size='sm'>
					Право
				</Button>
			</Tooltip>
			<Tooltip
				content='Подсказка снизу'
				position='bottom'
				asChild
			>
				<Button variant='secondary' size='sm'>
					Низ
				</Button>
			</Tooltip>
			<Tooltip
				content='Подсказка слева'
				position='left'
				asChild
			>
				<Button variant='secondary' size='sm'>
					Лево
				</Button>
			</Tooltip>
		</div>
	),
	parameters: story('Подсказки во всех четырёх позициях.'),
};

/** Tooltip в портале; не должен обрезаться внутри предков с overflow:auto. */
export const InsideOverflowCard: TooltipStory = {
	render: () => (
		<div
			style={{
				overflow: 'auto',
				maxHeight: 120,
				maxWidth: 280,
				padding: 'var(--altum-g-space-4)',
				border: '1px solid var(--altum-color-border)',
				borderRadius: 'var(--altum-g-radius)',
			}}
		>
			<p
				style={{
					margin: '0 0 var(--altum-g-space-3)',
					color: 'var(--altum-color-ink-muted)',
				}}
			>
				Прокручиваемая карточка с overflow:auto.
			</p>
			<Tooltip
				content='Полный текст подсказки должен быть виден целиком, без обрезки середины слова.'
				position='top'
				asChild
			>
				<Button variant='secondary' size='sm'>
					Наведи на меня
				</Button>
			</Tooltip>
		</div>
	),
	parameters: story('Tooltip в portal; `.anchorTooltip { overflow: visible }`.'),
};

/** Не больше одной подсказки при наведении на плотный вертикальный стек иконок. */
export const IconStackMutex: TooltipStory = {
	render: () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-2)',
				padding: 'var(--altum-g-space-6)',
				width: 'fit-content',
			}}
			data-testid='tooltip-icon-stack'
		>
			{(
				[['Главная', IconHome] as const, ['Поиск', IconSearch] as const, ['Настройки', IconGear] as const,]
			).map(([label, Icon]) => (
				<Tooltip
					key={label}
					content={label}
					position='right'
					openDelay={200}
					asChild
				>
					<ButtonIcon
						variant='ghost'
						size='sm'
						icon={<Icon size={18} />}
						aria-label={label}
					/>
				</Tooltip>
			))}
		</div>
	),
	parameters: story(
		'Быстрый hover по стеку — не больше одной подсказки одновременно (hover mutex).',
	),
};

