import type {Meta} from '@storybook/react';
import React from 'react';
import {SafeArea, SafeAreaProps} from './SafeArea';
import {Stack} from '../Layout';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

const demoSurface: React.CSSProperties = {
	background: 'var(--altum-color-option-hover)',
	border: '1px dashed var(--altum-color-input-border)',
	borderRadius: 'var(--altum-g-radius)',
	minHeight: 80,
};

export default {
	title: 'altum/Mobile/SafeArea',
	component: SafeArea,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Отступы под notch / home-indicator через `env(safe-area-inset-*)`. '
		+ 'Для mobile / PWA / WebView с `viewport-fit=cover`: шапки, футеры, полноэкранные экраны. '
		+ 'На десктопе insets = 0. Не оборачивайте bleed-фон — только интерактивный контент.',
	),
} satisfies Meta<typeof SafeArea>;

export const Playground: Story<SafeAreaProps> = {
	render: (args) => (
		<div style={{
			maxWidth: 360,
			...demoSurface
		}}
		>
			<SafeArea {...args} padding='var(--altum-g-space-3)'>
				<Text size='sm'>
					Контент с отступами safe-area со всех сторон.
				</Text>
			</SafeArea>
		</div>
	),
	args: {
		edges: 'all',
	},
	parameters: story('Все края (`edges="all"`) + доп. padding.'),
};

export const WithEdges: Story<SafeAreaProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 360}}>
			<div style={demoSurface}>
				<SafeArea edges='top' padding='var(--altum-g-space-3)'>
					<Text size='sm'>
						Только верх (edges=«top»)
					</Text>
				</SafeArea>
			</div>
			<div style={demoSurface}>
				<SafeArea edges='bottom' padding='var(--altum-g-space-3)'>
					<Text size='sm'>
						Только низ (edges=«bottom»)
					</Text>
				</SafeArea>
			</div>
			<div style={demoSurface}>
				<SafeArea edges='x' padding='var(--altum-g-space-3)'>
					<Text size='sm'>
						Горизонталь (edges=«x»)
					</Text>
				</SafeArea>
			</div>
			<div style={demoSurface}>
				<SafeArea edges={['top', 'left', 'right']} padding='var(--altum-g-space-3)'>
					<Text size='sm'>
						Массив краёв: top, left, right
					</Text>
				</SafeArea>
			</div>
		</Stack>
	),
	parameters: story('Разные комбинации `edges` для mobile-first layout.'),
};
