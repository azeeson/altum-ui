import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {Box} from '../components/Box/Box';
import {Button} from '../components/Button/Button';
import {Text} from '../components/Text/Text';
import {Title} from '../components/Title/Title';
import status from '../styles/status.module.css';
import {cn} from '../core/utils/cn';
import styles from './About.stories.module.css';

const SAMPLE = 'Соберите экран из компонентов';

const COLORS = [
	{
		name: 'bg',
		token: '--altum-color-bg',
		className: styles.bg
	},
	{
		name: 'surface',
		token: '--altum-color-surface',
		className: styles.surface
	},
	{
		name: 'elevated',
		token: '--altum-color-surface-elevated',
		className: styles.elevated
	},
	{
		name: 'text',
		token: '--altum-color-text',
		className: styles.text
	},
	{
		name: 'secondary',
		token: '--altum-color-text-secondary',
		className: styles.secondary
	},
	{
		name: 'muted',
		token: '--altum-color-muted',
		className: styles.muted
	},
	{
		name: 'border',
		token: '--altum-color-border',
		className: styles.border
	},
	{
		name: 'brand',
		token: '--altum-color-brand',
		className: styles.brand
	},
	{
		name: 'brand hover',
		token: '--altum-color-brand-hover',
		className: styles.brandHover
	},
	{
		name: 'brand text',
		token: '--altum-color-brand-text',
		className: styles.brandText
	},
	{
		name: 'tint',
		token: '--altum-color-brand-tint',
		className: styles.tint
	},
	{
		name: 'danger',
		token: '--altum-color-danger-bg-solid',
		className: styles.danger
	},
	{
		name: 'danger tint',
		token: '--altum-color-danger-tint-bg',
		className: styles.dangerTint
	},
	{
		name: 'success',
		token: '--altum-color-status-success',
		className: styles.success
	},
	{
		name: 'warning',
		token: '--altum-color-status-warning',
		className: styles.warning
	},
	{
		name: 'info',
		token: '--altum-color-status-info',
		className: styles.info
	},
	{
		name: 'error',
		token: '--altum-color-status-error',
		className: styles.error
	},
	{
		name: 'success bg',
		token: '--altum-status-bg',
		className: cn(status.success, styles.statusBg)
	},
	{
		name: 'warning bg',
		token: '--altum-status-bg',
		className: cn(status.warning, styles.statusBg)
	},
	{
		name: 'info bg',
		token: '--altum-status-bg',
		className: cn(status.info, styles.statusBg)
	},
	{
		name: 'error bg',
		token: '--altum-status-bg',
		className: cn(status.error, styles.statusBg)
	},
	{
		name: 'input',
		token: '--altum-color-input-bg',
		className: styles.input
	},
	{
		name: 'link',
		token: '--altum-color-link-color',
		className: styles.link
	},
	{
		name: 'tooltip',
		token: '--altum-color-tooltip-bg',
		className: styles.tooltip
	},
	{
		name: 'chart 4',
		token: '--altum-color-chart-4',
		className: styles.chart4
	},
	{
		name: 'chart 5',
		token: '--altum-color-chart-5',
		className: styles.chart5
	},
] as const;

const TYPE = [
	{
		name: '4xl / 32',
		className: styles.size4xl
	},
	{
		name: '3xl / 24',
		className: styles.size3xl
	},
	{
		name: '2xl / 20',
		className: styles.size2xl
	},
	{
		name: 'xl / 18',
		className: styles.sizeXl
	},
	{
		name: 'lg / 16',
		className: styles.sizeLg
	},
	{
		name: 'md / 14',
		className: styles.sizeMd
	},
	{
		name: 'sm / 13',
		className: styles.sizeSm
	},
	{
		name: 'xs / 11',
		className: styles.sizeXs
	},
] as const;

const WEIGHTS = [
	{
		name: '400',
		className: styles.weightNormal
	},
	{
		name: '500',
		className: styles.weightMedium
	},
	{
		name: '600',
		className: styles.weightSemibold
	},
	{
		name: '700',
		className: styles.weightBold
	},
] as const;

const SPACE = [
	{
		name: '1 · 4',
		className: styles.space1
	},
	{
		name: '2 · 8',
		className: styles.space2
	},
	{
		name: '3 · 12',
		className: styles.space3
	},
	{
		name: '4 · 16',
		className: styles.space4
	},
	{
		name: '5 · 20',
		className: styles.space5
	},
	{
		name: '6 · 24',
		className: styles.space6
	},
	{
		name: '7 · 28',
		className: styles.space7
	},
	{
		name: '8 · 32',
		className: styles.space8
	},
	{
		name: '9 · 36',
		className: styles.space9
	},
] as const;

const RADII = [
	{
		name: 'sm · 4',
		className: styles.radiusSm
	},
	{
		name: 'md · 8',
		className: styles.radiusMd
	},
	{
		name: 'lg · 12',
		className: styles.radiusLg
	},
	{
		name: 'pill',
		className: styles.radiusPill
	},
] as const;

function BrandPage() {
	return (
		<div className={styles.page}>
			<header className={styles.lead}>
				<Title level={1}>
					Altum UI
				</Title>
				<Text
					as='p'
					size='sm'
					color='secondary'
				>
					Компоненты библиотеки для сборки экранов. Берите инстанс, меняйте вариант и текстовые свойства.
				</Text>
				<Text
					as='p'
					size='sm'
					color='secondary'
				>
					Цвета ниже — токены компонентов. Light и Dark переключаются в тулбаре.
				</Text>
				<Text
					as='p'
					size='sm'
					color='secondary'
				>
					Разделы: Components, Examples. Имена совпадают с кодом: Button, TextField, Modal, Tabs.
				</Text>
			</header>

			<section className={styles.section} aria-labelledby='about-color'>
				<Text
					as='h2'
					id='about-color'
					size='lg'
					weight='semibold'
				>
					Color
				</Text>
				<ul className={styles.swatches}>
					{COLORS.map((color) => (
						<li key={color.name} className={styles.swatchItem}>
							<div className={cn(styles.swatch, color.className)} />
							<div className={styles.caption}>
								<Text size='xs' weight='medium'>
									{color.name}
								</Text>
								<Text size='xs' color='secondary'>
									{color.token}
								</Text>
							</div>
						</li>
					))}
				</ul>
			</section>

			<section className={styles.section} aria-labelledby='about-type'>
				<Text
					as='h2'
					id='about-type'
					size='lg'
					weight='semibold'
				>
					Типографика
				</Text>
				<Text size='sm' color='secondary'>
					<span className={styles.sample}>
						UI · system-ui
					</span>
					{' · '}
					<span className={styles.mono}>
						mono · ui-monospace
					</span>
				</Text>
				<Box
					variant='outlined'
					radius='lg'
					style={{padding: 'var(--altum-g-space-3)'}}
				>
					<div className={styles.typeList}>
						{TYPE.map((step) => (
							<div key={step.name} className={styles.typeRow}>
								<p className={cn(styles.sample, step.className)}>
									{SAMPLE}
								</p>
								<Text size='xs' color='secondary'>
									{step.name}
								</Text>
							</div>
						))}
					</div>
					<div className={styles.weightRow}>
						{WEIGHTS.map((weight) => (
							<Text
								key={weight.name}
								as='p'
								size='sm'
								className={weight.className}
							>
								{weight.name}
							</Text>
						))}
					</div>
				</Box>
			</section>

			<section className={styles.section} aria-labelledby='about-space'>
				<Text
					as='h2'
					id='about-space'
					size='lg'
					weight='semibold'
				>
					Отступы и контролы
				</Text>
				<div className={styles.scale}>
					{SPACE.map((step) => (
						<div key={step.name} className={styles.scaleItem}>
							<div className={cn(styles.mark, step.className)} />
							<Text size='xs' color='secondary'>
								{step.name}
							</Text>
						</div>
					))}
				</div>
				<div className={styles.controls}>
					<Button
						type='button'
						size='sm'
						variant='secondary'
					>
						sm
					</Button>
					<Button
						type='button'
						size='md'
						variant='secondary'
					>
						md
					</Button>
					<Button
						type='button'
						size='lg'
						variant='secondary'
					>
						lg
					</Button>
				</div>
				<Text size='xs' color='secondary'>
					Высота контрола: sm 32, md 44, lg 52
				</Text>
			</section>

			<section className={styles.section} aria-labelledby='about-radius'>
				<Text
					as='h2'
					id='about-radius'
					size='lg'
					weight='semibold'
				>
					Радиус
				</Text>
				<div className={styles.radii}>
					{RADII.map((step) => (
						<div key={step.name} className={styles.radius}>
							<div className={cn(styles.radiusBox, step.className)} />
							<Text size='xs' color='secondary'>
								{step.name}
							</Text>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}

const meta = {
	title: 'altum/About',
	parameters: {
		layout: 'fullscreen',
		controls: {disable: true},
		docs: {
			description: {
				component: 'Бренд-страница: цвет, типографика, отступы и радиусы из токенов ThemeProvider.',
			},
		},
	},
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Brand: Story = {
	render: () => <BrandPage />,
};
