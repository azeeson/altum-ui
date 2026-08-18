import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {PullToRefresh, PullToRefreshProps} from './PullToRefresh';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

const listItems = (count: number, prefix = 'Элемент') => (
	Array.from({length: count}, (_, i) => (
		<div
			key={i}
			style={{
				padding: 'var(--altum-g-space-3) var(--altum-g-space-4)',
				borderBottom: '1px solid var(--altum-color-input-border)',
			}}
		>
			{prefix}
			{' '}
			{i + 1}
		</div>
	))
);

export default {
	title: 'altum-ui/Mobile/PullToRefresh',
	component: PullToRefresh,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Pull-to-refresh для mobile-first списков (touch-жест сверху).',
	),
} satisfies Meta<typeof PullToRefresh>;

export const Playground: Story<PullToRefreshProps> = {
	render: function PlaygroundRender() {
		const [refreshCount, setRefreshCount] = useState(0);
		const [items, setItems] = useState(() => listItems(12));

		return (
			<div style={{maxWidth: 360}}>
				<div style={{marginBottom: 'var(--altum-g-space-2)'}}>
					<Text size='sm' color='secondary'>
						Потяните список вниз на touch-устройстве (или эмуляторе).
						{' '}
						Обновлений:
						{' '}
						{refreshCount}
					</Text>
				</div>
				<div style={{
					height: 280,
					border: '1px solid var(--altum-color-input-border)',
					borderRadius: 'var(--altum-g-radius)'
				}}
				>
					<PullToRefresh
						onRefresh={async () => {
							await new Promise((resolve) => setTimeout(resolve, 800));
							setRefreshCount((c) => c + 1);
							setItems(listItems(12, `Обновлено #${refreshCount + 1}`));
						}}
					>
						{items}
					</PullToRefresh>
				</div>
			</div>
		);
	},
	parameters: story('Симулированный список с async-обновлением по жесту.'),
};

export const States: Story<PullToRefreshProps> = {
	render: () => (
		<div style={{maxWidth: 360}}>
			<div style={{marginBottom: 'var(--altum-g-space-2)'}}>
				<Text size='sm' color='secondary'>
					Pull-to-refresh отключён (`disabled`).
				</Text>
			</div>
			<div style={{
				height: 200,
				border: '1px solid var(--altum-color-input-border)',
				borderRadius: 'var(--altum-g-radius)'
			}}
			>
				<PullToRefresh disabled onRefresh={() => {}}>
					{listItems(8)}
				</PullToRefresh>
			</div>
		</div>
	),
	parameters: story('Отключённый режим — жест не срабатывает.'),
};
