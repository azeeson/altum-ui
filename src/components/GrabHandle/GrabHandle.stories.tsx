import type {Meta} from '@storybook/react';
import React from 'react';
import {GrabHandle, GrabHandleProps} from './GrabHandle';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Mobile/GrabHandle',
	component: GrabHandle,
	tags: ['autodocs'],
	parameters: componentParameters(
		'iOS-style grab-handle для bottom sheet (`Sheet`).',
	),
} satisfies Meta<typeof GrabHandle>;

export const Playground: Story<GrabHandleProps> = {
	render: () => (
		<div
			style={{
				maxWidth: 360,
				marginTop: 'var(--altum-g-space-6)',
				background: 'var(--altum-color-bg)',
				border: '1px solid var(--altum-color-input-border)',
				borderRadius: 'var(--altum-g-radius) var(--altum-g-radius) 0 0',
				boxShadow: '0 -4px 24px color-mix(in srgb, var(--altum-color-text) 12%, transparent)',
			}}
		>
			<GrabHandle />
			<div style={{padding: 'var(--altum-g-space-3) var(--altum-g-space-4) var(--altum-g-space-6)'}}>
				<Text size='md' weight='medium'>
					Нижняя панель
				</Text>
				<div style={{marginTop: 'var(--altum-g-space-2)'}}>
					<Text size='sm' color='secondary'>
						Ручка сверху — affordance для перетаскивания sheet.
					</Text>
				</div>
			</div>
		</div>
	),
	parameters: story('Ручка на макете поверхности нижней панели.'),
};

export const WithStandalone: Story<GrabHandleProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			justifyContent: 'center',
			padding: 'var(--altum-g-space-4)',
			background: 'var(--altum-color-surface)',
			borderRadius: 'var(--altum-g-radius)',
			maxWidth: 200,
		}}
		>
			<GrabHandle />
		</div>
	),
	parameters: story('Ручка без контента — только affordance.'),
};
