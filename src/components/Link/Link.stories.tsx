import type {Meta} from '@storybook/react';
import React from 'react';
import {Link, LinkProps} from './Link';
import {Text} from '../Text/Text';
import {Stack, Inline} from '../Layout/Layout';
import {Box} from '../Box/Box';
import {Card} from '../Card/Card';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Link',
	component: Link,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Ссылка с вариантами, размерами и цветами `--altum-color-link-*`.',
	),
	argTypes: {
		href: {
			control: 'text',
			description: 'URL ссылки',
		},
		variant: {
			control: {
				type: 'select',
				options: ['primary', 'secondary', 'muted'],
			},
			description: 'Визуальный вариант',
		},
		status: {
			control: {
				type: 'select',
				options: ['default', 'danger'],
			},
			description: 'Деструктивное действие',
		},
		size: {
			control: {
				type: 'select',
				options: [
					'xs',
					'sm',
					'md',
					'lg',
					'xl'
				],
			},
			description: 'Размер (без значения — inherit)',
		},
		weight: {
			control: {
				type: 'select',
				options: ['normal', 'medium', 'bold'],
			},
			description: 'Начертание',
		},
		children: {
			control: 'text',
			description: 'Текст ссылки',
		},
		onClick: {
			action: 'click',
		},
	},
} satisfies Meta<typeof Link>;

export const Playground: Story<LinkProps> = {
	render: (args) => (
		<Link href='#' {...args}>
			{args.children ?? 'Нажмите сюда для перехода по ссылке'}
		</Link>
	),
	args: {
		children: 'Нажмите сюда для перехода по ссылке',
		variant: 'primary',
		status: 'default',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Variants: Story<LinkProps> = {
	render: () => (
		<Stack gap='sm'>
			<Link href='#' variant='primary'>
				Primary — основное действие / навигация
			</Link>
			<Link href='#' variant='secondary'>
				Secondary — более тихая ссылка
			</Link>
			<Link href='#' variant='muted'>
				Muted — вспомогательная ссылка
			</Link>
			<Link href='#' status='danger'>
				Danger — удалить / отменить
			</Link>
		</Stack>
	),
	parameters: story('Варианты `primary` / `secondary` / `muted`; опасность — `status="danger"`.'),
};

export const Sizes: Story<LinkProps> = {
	render: () => (
		<Stack gap='sm'>
			{([
				'xs',
				'sm',
				'md',
				'lg',
				'xl'
			] as const).map((size) => (
				<Link
					key={size}
					href='#'
					size={size}
				>
					Link size=
					{size}
				</Link>
			))}
			<Text size='md'>
				Inline
				{' '}
				<Link href='#'>
					без size (inherit)
				</Link>
				{' '}
				в тексте
			</Text>
		</Stack>
	),
	parameters: story('Размеры `xs`–`xl`; без `size` — наследование от родителя.'),
};

export const OverflowText: Story<LinkProps> = {
	render: () => (
		<div style={{maxWidth: 200}}>
			<Link href='#'>
				Очень длинный текст ссылки, который переносится на несколько строк
			</Link>
		</div>
	),
	parameters: story('Длинный текст ссылки в узком контейнере.'),
};

export const OnBox: Story<LinkProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 480}}>
			<Inline gap='md' wrap>
				{(['outlined', 'tinted', 'overlay'] as const).map((variant) => {
					const box = (
						<Box
							variant={variant}
							padding='md'
							border
						>
							<Stack gap='xs'>
								<Text size='sm' weight='bold'>
									Box
									{' '}
									{variant}
								</Text>
								<Inline gap='sm' wrap>
									<Link
										href='#'
										variant='primary'
										size='sm'
									>
										Primary
									</Link>
									<Link
										href='#'
										variant='secondary'
										size='sm'
									>
										Secondary
									</Link>
									<Link
										href='#'
										variant='muted'
										size='sm'
									>
										Muted
									</Link>
									<Link
										href='#'
										status='danger'
										size='sm'
									>
										Danger
									</Link>
								</Inline>
							</Stack>
						</Box>
					);
					if (variant === 'overlay') {
						return (
							<div
								key={variant}
								style={{
									padding: 12,
									borderRadius: 12,
									background: 'linear-gradient(135deg, #0f172a, #334155)',
								}}
							>
								{box}
							</div>
						);
					}
					return (
						<React.Fragment key={variant}>
							{box}
						</React.Fragment>
					);
				})}
			</Inline>
		</Stack>
	),
	parameters: story('Ссылки на заливках Box — те же `--altum-color-link-*`, без ремапа.'),
};

export const Interaction: Story<LinkProps> = {
	render: () => (
		<Link href='#docs'>
			Документация
		</Link>
	),
	play: async ({canvasElement}) => {
		canvasElement.querySelector('a')?.focus();
	},
	parameters: story('Play ставит фокус на ссылку (focus-visible).'),
};

export const UsageExample: Story<LinkProps> = {
	render: () => (
		<Card
			style={{maxWidth: 400}}
			header={(
				<Text weight='bold'>
					Нет аккаунта?
				</Text>
			)}
		>
			<Stack gap='md'>
				<Text size='sm'>
					Создайте учётную запись или
					{' '}
					<Link href='#' size='sm'>
						восстановите доступ
					</Link>
					.
				</Text>
				<Inline gap='sm' align='center'>
					<Button size='sm'>
						Зарегистрироваться
					</Button>
					<Link
						href='#'
						variant='muted'
						size='sm'
					>
						Узнать больше
					</Link>
				</Inline>
			</Stack>
		</Card>
	),
	parameters: story('Ссылка в тексте карточки рядом с кнопкой.'),
};
