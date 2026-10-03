import type {Meta} from '@storybook/react';
import React from 'react';
import {AspectRatio, AspectRatioProps} from './AspectRatio';
import {Card} from '../Card/Card';
import {Inline, Stack} from '../Layout';
import {Text} from '../Text/Text';
import {Title} from '../Title/Title';
import {demoImage} from '../../storybook/demoImages';
import {componentParameters, story, Story} from '../../storybook/meta';

const placeholder: React.CSSProperties = {
	display: 'grid',
	placeItems: 'center',
	height: '100%',
	width: '100%',
	background: 'var(--altum-color-option-hover)',
};

export default {
	title: 'altum/Components/AspectRatio',
	component: AspectRatio,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Обёртка с фиксированным `aspect-ratio` (16:9 / 1:1 без магии в CSS).',
	),
	argTypes: {
		ratio: {
			control: 'text',
			description: 'Число (шир./выс.) или строка `"16 / 9"`',
		},
	},
} satisfies Meta<typeof AspectRatio>;

export const Playground: Story<AspectRatioProps> = {
	render: (args) => (
		<div style={{maxWidth: 480}}>
			<AspectRatio {...args}>
				<div style={placeholder}>
					<Text size='sm'>
						{String(args.ratio ?? '16 / 9')}
					</Text>
				</div>
			</AspectRatio>
		</div>
	),
	args: {
		ratio: 16 / 9,
	},
	parameters: story('Стандартное соотношение 16:9. Controls: `ratio`.'),
};

export const Square: Story<AspectRatioProps> = {
	render: () => (
		<div style={{maxWidth: 240}}>
			<AspectRatio ratio={1}>
				<div style={placeholder}>
					<Text size='sm'>
						1:1
					</Text>
				</div>
			</AspectRatio>
		</div>
	),
	parameters: story('Квадратное превью (`ratio={1}`).'),
};

export const Portrait: Story<AspectRatioProps> = {
	render: () => (
		<div style={{maxWidth: 200}}>
			<AspectRatio ratio={3 / 4}>
				<div style={placeholder}>
					<Text size='sm'>
						3:4
					</Text>
				</div>
			</AspectRatio>
		</div>
	),
	parameters: story('Портретное соотношение 3:4.'),
};

export const Ratios: Story<AspectRatioProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 480}}>
			{([['21 / 9', 21 / 9], ['16 / 9', 16 / 9], ['4 / 3', 4 / 3],] as const).map(([label, ratio]) => (
				<AspectRatio key={label} ratio={ratio}>
					<div style={placeholder}>
						<Text size='sm'>
							{label}
						</Text>
					</div>
				</AspectRatio>
			))}
		</Stack>
	),
	parameters: story('Широкий, стандартный и классический кадры.'),
};

export const Empty: Story<AspectRatioProps> = {
	render: () => (
		<div style={{maxWidth: 320}}>
			<AspectRatio ratio={16 / 9} />
		</div>
	),
	parameters: story('Пустая рамка без детей — сохраняет пропорцию.'),
};

export const UsageExample: Story<AspectRatioProps> = {
	render: () => (
		<div style={{maxWidth: 360}}>
			<Card
				media={(
					<AspectRatio ratio={16 / 9}>
						<img
							src={demoImage(1)}
							alt='Обложка статьи'
							style={{
								width: '100%',
								height: '100%',
								objectFit: 'cover',
								display: 'block',
							}}
						/>
					</AspectRatio>
				)}
				header={(
					<Title level={4}>
						Обложка статьи
					</Title>
				)}
			>
				<Stack gap='sm'>
					<Text
						as='p'
						size='sm'
						color='secondary'
					>
						Превью 16:9 внутри карточки: картинка растягивается по grid-слою.
					</Text>
					<Inline gap='sm'>
						<Text size='xs' color='muted'>
							8 мин чтения
						</Text>
					</Inline>
				</Stack>
			</Card>
		</div>
	),
	parameters: story('Карточка со слотом media: фото в фиксированном кадре.'),
};
