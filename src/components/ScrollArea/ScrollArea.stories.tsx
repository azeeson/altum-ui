import type {Meta} from '@storybook/react';
import React from 'react';
import {ScrollArea, ScrollAreaProps} from './ScrollArea';
import {componentParameters, story, Story} from '../../storybook/meta';

const rowStyle: React.CSSProperties = {
	padding: 'var(--altum-g-space-2) var(--altum-g-space-3)',
	borderBottom: '1px solid var(--altum-color-input-border)',
	whiteSpace: 'nowrap',
};

export default {
	title: 'altum/Components/ScrollArea',
	component: ScrollArea,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Область со стилизованным скроллом (панели, меню, списки).',
	),
	argTypes: {
		orientation: {
			control: {
				type: 'select',
				options: ['y', 'x', 'both']
			},
		},
	},
} satisfies Meta<typeof ScrollArea>;

export const Playground: Story<ScrollAreaProps> = {
	render: (args) => (
		<ScrollArea {...args}>
			{Array.from({length: 24}, (_, i) => (
				<div key={i} style={rowStyle}>
					Строка списка
					{' '}
					{i + 1}
				</div>
			))}
		</ScrollArea>
	),
	args: {
		maxHeight: 200,
		orientation: 'y',
	},
	parameters: story('Вертикальный скролл длинного списка.'),
};

export const WithHorizontal: Story<ScrollAreaProps> = {
	render: () => (
		<ScrollArea maxWidth={320} orientation='x'>
			<div style={{
				display: 'flex',
				width: 'max-content'
			}}
			>
				{[
					'Январь',
					'Февраль',
					'Март',
					'Апрель',
					'Май',
					'Июнь',
					'Июль',
					'Август'
				].map((month) => (
					<div
						key={month}
						style={{
							...rowStyle,
							borderBottom: 'none',
							borderRight: '1px solid var(--altum-color-input-border)',
							minWidth: 96,
							textAlign: 'center',
						}}
					>
						{month}
					</div>
				))}
			</div>
		</ScrollArea>
	),
	parameters: story('Горизонтальный скролл (`orientation="x"`).'),
};
