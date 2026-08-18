import type {Meta} from '@storybook/react';
import React from 'react';
import {Badge, BadgeProps} from './Badge';
import {Button} from '../Button/Button';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Inline, Stack} from '../Layout/Layout';
import {IconBell} from '../../icons/icons/IconBell';
import {IconMail} from '../../icons/icons/IconMail';
import {IconMessage} from '../../icons/icons/IconMessage';
import {componentParameters, story, Story} from '../../storybook/meta';

const VARIANTS = [
	'error',
	'success',
	'info',
	'warning',
	'primary',
	'secondary',
] as const;

export default {
	title: 'altum/Components/Badge',
	component: Badge,
	tags: ['autodocs'],
	parameters: componentParameters('Индикатор уведомлений в виде счётчика или точки поверх дочернего элемента.'),
	argTypes: {
		content: {
			control: 'number',
			description: 'Числовое значение счётчика',
		},
		dot: {
			control: 'boolean',
			description: 'Показать точку вместо числа',
		},
		variant: {
			control: {
				type: 'select',
				options: [...VARIANTS]
			},
		},
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md']
			},
		},
		position: {
			control: {
				type: 'select',
				options: ['overlay', 'standalone']
			},
		},
	},
} satisfies Meta<typeof Badge>;

export const Playground: Story<BadgeProps> = {
	render: (args) => (
		<Badge {...args}>
			<Button variant='secondary'>
				Входящие
			</Button>
		</Badge>
	),
	args: {label: 9},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Variants: Story<BadgeProps> = {
	render: () => (
		<Inline gap='md' wrap>
			{VARIANTS.map((variant) => (
				<Badge
					key={variant}
					label={3}
					variant={variant}
					position='standalone'
				/>
			))}
		</Inline>
	),
	parameters: story('Цветовые варианты (standalone).'),
};

export const Sizes: Story<BadgeProps> = {
	render: () => (
		<Inline gap='md' align='center'>
			{(['sm', 'md'] as const).map((size) => (
				<Badge
					key={size}
					label={5}
					size={size}
					position='standalone'
				/>
			))}
		</Inline>
	),
	parameters: story('Размеры `sm` / `md`. `sm` — 1–2 цифры; длинные `99+` лучше на `md`.'),
};

/** Standalone-цифры sm остаются читаемыми при масштабе 100%. */
export const SmStandaloneCounts: Story<BadgeProps> = {
	render: () => (
		<Inline gap='md' align='center'>
			{[1, 9, 99].map((n) => (
				<Badge
					key={n}
					label={n}
					size='sm'
					variant='secondary'
					position='standalone'
				/>
			))}
			<Badge
				label='9+'
				size='sm'
				variant='warning'
				position='standalone'
			/>
		</Inline>
	),
	parameters: story('`size="sm"` standalone — 1 / 9 / 99 читаемы.'),
};

export const DotBadge: Story<BadgeProps> = {
	render: () => (
		<Stack gap='sm'>
			<Inline gap='md'>
				{VARIANTS.map((variant) => (
					<Badge
						key={variant}
						dot
						variant={variant}
					>
						<Button variant='secondary' size='sm'>
							{variant}
						</Button>
					</Badge>
				))}
			</Inline>
		</Stack>
	),
	parameters: story('Точечный индикатор без числового значения.'),
};

export const Standalone: Story<BadgeProps> = {
	render: () => (
		<Inline gap='sm' wrap>
			<Badge
				label='Бета'
				variant='info'
				position='standalone'
			/>
			<Badge
				label={12}
				variant='primary'
				position='standalone'
				size='sm'
			/>
			<Badge
				label='99+'
				variant='error'
				position='standalone'
			/>
		</Inline>
	),
	parameters: story('`position="standalone"` — inline без overlay.'),
};

/** Числовой ноль должен рисовать глиф «0», а не пустую пилюлю. */
export const ZeroContent: Story<BadgeProps> = {
	render: () => (
		<Inline gap='md' align='center'>
			<Badge
				label={0}
				variant='secondary'
				position='standalone'
			/>
			<Badge
				label={5}
				variant='secondary'
				position='standalone'
			/>
			<Badge
				label={0}
				size='sm'
				variant='info'
				position='standalone'
			/>
		</Inline>
	),
	parameters: story('`label={0}` рядом с `label={5}` — глиф «0» виден.'),
};

/** Overlay-бейдж должен полностью оставаться видимым у краёв / overflow-родителей. */
export const OverlayNearEdge: Story<BadgeProps> = {
	render: () => (
		<div
			style={{
				overflow: 'hidden',
				padding: 'var(--altum-g-space-2)',
				border: '1px solid var(--altum-color-border)',
				borderRadius: 'var(--altum-g-radius)',
				maxWidth: 200,
			}}
		>
			<Inline gap='md' style={{justifyContent: 'flex-end'}}>
				<Badge label={9} variant='error'>
					<Button variant='secondary' size='sm'>
						Входящие
					</Button>
				</Badge>
				<Badge
					label={3}
					size='sm'
					variant='info'
				>
					<Button variant='ghost' size='sm'>
						Алерты
					</Button>
				</Badge>
			</Inline>
		</div>
	),
	parameters: story(
		'Overlay Badge + запас `--altum-badge-overhang`; родительский `overflow: hidden` не должен обрезать цифры.',
	),
};

/** Плотный icon-rail — бейджи sm + числовой max → 9+. */
export const DenseIconRail: Story<BadgeProps> = {
	render: () => (
		<Stack gap='md'>
			<p style={{
				margin: 0,
				color: 'var(--altum-color-ink-muted)',
				fontSize: 'var(--altum-g-font-size-sm)'
			}}
			>
				gap ≥ --altum-g-space-3; content 31 → 9+; prefer size=&quot;sm&quot; on ButtonIcon sm.
			</p>
			<Stack gap='md' style={{width: 'fit-content'}}>
				{(
					[[1, IconBell, 'Алерты'], [6, IconMail, 'Почта'], [31, IconMessage, 'Чат'],] as const
				).map(([count, Icon, label]) => (
					<Badge
						key={label}
						label={count}
						size='sm'
						max={9}
						variant='error'
					>
						<ButtonIcon
							variant='ghost'
							size='sm'
							icon={<Icon size={18} />}
							aria-label={label}
						/>
					</Badge>
				))}
			</Stack>
		</Stack>
	),
	parameters: story(
		'Вертикальный rail ButtonIcon sm + Badge sm; `max={9}` для двухзначных счётчиков.',
	),
};

