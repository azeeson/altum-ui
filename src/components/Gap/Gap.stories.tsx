import type {Meta} from '@storybook/react';
import React from 'react';
import {Gap, type GapProps} from './Gap';
import {Text} from '../Text/Text';
import {Box} from '../Box/Box';
import {Inline, Stack} from '../Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

const SIZES = [
	'none',
	'xs',
	'sm',
	'md',
	'lg',
	'xl',
] as const;

const mark: React.CSSProperties = {
	background: 'var(--altum-color-option-hover)',
};

function Block({children}: {children: React.ReactNode}) {
	return (
		<Box variant='muted' style={{padding: 'var(--altum-g-space-2)'}}>
			<Text size='sm'>
				{children}
			</Text>
		</Box>
	);
}

export default {
	title: 'altum/Components/Gap',
	component: Gap,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Пустой зазор фиксированного размера. Ритм группы — `gap` у Stack / Inline; Gap — один дополнительный шаг между соседями.',
	),
	argTypes: {
		size: {
			control: {
				type: 'select',
				options: [...SIZES],
			},
		},
		orientation: {
			control: {
				type: 'select',
				options: ['horizontal', 'vertical'],
			},
		},
	},
} satisfies Meta<typeof Gap>;

export const Playground: Story<GapProps> = {
	render: (args) => (
		<div style={{maxWidth: 320}}>
			<Block>
				Верхний блок
			</Block>
			<Gap
				{...args}
				style={mark}
			/>
			<Block>
				Нижний блок
			</Block>
		</div>
	),
	args: {
		orientation: 'horizontal',
		size: 'md',
	},
	parameters: story('Горизонтальный зазор между блоками. Подсветка только в примере.'),
};

export const SizeScale: Story<GapProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 360}}>
			{SIZES.map((size) => (
				<Stack key={size} gap='none'>
					<Text size='xs' color='muted'>
						size=
						{size}
					</Text>
					<Block>
						До
					</Block>
					<Gap
						size={size}
						style={mark}
					/>
					<Block>
						После
					</Block>
				</Stack>
			))}
		</Stack>
	),
	parameters: story('Шкала `size`: токены spacing, как у Stack.'),
};

export const Vertical: Story<GapProps> = {
	render: () => (
		<Inline gap='none' align='center'>
			<Block>
				Профиль
			</Block>
			<Gap
				orientation='vertical'
				size='md'
				style={mark}
			/>
			<Block>
				Настройки
			</Block>
			<Gap
				orientation='vertical'
				size='xl'
				style={mark}
			/>
			<Block>
				Выход
			</Block>
		</Inline>
	),
	parameters: story('Вертикальный зазор задаёт ширину в ряду. У Inline `gap="none"`, шаг даёт только Gap.'),
};
