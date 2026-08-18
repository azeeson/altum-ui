import type {Meta} from '@storybook/react';
import React from 'react';
import {Item, ItemProps} from './Item';
import {Button} from '../Button/Button';
import {IconGear} from '../../icons/icons/IconGear';
import {componentParameters, story, Story} from '../../storybook/meta';

const BOX_VARIANTS = [
	'ghost',
	'plain',
	'outlined',
	'elevated',
	'floating',
	'tinted',
	'secondary',
	'muted',
	'glass',
	'overlay',
] as const;

export default {
	title: 'altum-ui/Components/Item',
	component: Item,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Универсальная строка контента: media + title/description + actions. Поверхность — Box (`variant`).',
	),
	argTypes: {
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg'],
			},
			description: 'Плотность строки',
		},
		variant: {
			control: {
				type: 'select',
				options: [...BOX_VARIANTS],
			},
			description: 'Вариант поверхности (Box)',
		},
		interactive: {
			control: 'boolean',
			description: 'Интерактивная строка (hover / курсор)',
		},
	},
} satisfies Meta<typeof Item>;

export const Playground: Story<ItemProps> = {
	render: (args) => (
		<div style={{maxWidth: 420}}>
			<Item {...args}>
				<Item.Media variant='icon'>
					<IconGear size={20} />
				</Item.Media>
				<Item.Content>
					<Item.Title>
						Настройки
					</Item.Title>
					<Item.Description>
						Профиль, уведомления и предпочтения
					</Item.Description>
				</Item.Content>
				<Item.Actions>
					<Button size='sm' variant='secondary'>
						Открыть
					</Button>
				</Item.Actions>
			</Item>
		</div>
	),
	args: {
		size: 'md',
		variant: 'ghost',
		interactive: false,
	},
	parameters: story('Строка с иконкой, заголовком, описанием и действием.'),
};

export const Sizes: Story<ItemProps> = {
	render: () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-3)',
				maxWidth: 420,
			}}
		>
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<Item
					key={size}
					size={size}
					variant='outlined'
					interactive
				>
					<Item.Media variant='icon'>
						<IconGear size={size === 'lg' ? 24 : size === 'md' ? 20 : 16} />
					</Item.Media>
					<Item.Content>
						<Item.Title>
							Размер 
							{' '}
							{size}
						</Item.Title>
						<Item.Description>
							Плотность строки — 
							{' '}
							{size}
						</Item.Description>
					</Item.Content>
					<Item.Actions>
						<Button size='sm' variant='secondary'>
							Открыть
						</Button>
					</Item.Actions>
				</Item>
			))}
		</div>
	),
	parameters: story('Варианты плотности sm / md / lg.'),
};

export const Variants: Story<ItemProps> = {
	render: () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-3)',
				maxWidth: 420,
			}}
		>
			{BOX_VARIANTS.map((variant) => (
				<Item
					key={variant}
					variant={variant}
					interactive
				>
					<Item.Media variant='icon'>
						<IconGear size={20} />
					</Item.Media>
					<Item.Content>
						<Item.Title>
							variant=
							{variant}
						</Item.Title>
						<Item.Description>
							Поверхность через Box
						</Item.Description>
					</Item.Content>
				</Item>
			))}
		</div>
	),
	parameters: story('Варианты поверхности Box (`variant`).'),
};
