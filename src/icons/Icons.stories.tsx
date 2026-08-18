import type {Meta} from '@storybook/react';
import React from 'react';
import * as IconExports from './icons';
import {componentParameters, story, Story} from '../storybook/meta';

type IconComponent = React.FC<{size?: number}>;

const ICONS = Object.entries(IconExports)
	.filter(([name]) => name.startsWith('Icon'))
	.map(([name, Icon]) => ({
		fileName: `${name}.tsx`,
		Icon: Icon as IconComponent,
	}))
	.sort((a, b) => a.fileName.localeCompare(b.fileName));

const IconGallery = () => (
	<div
		style={{
			display: 'grid',
			gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
			gap: 'var(--altum-g-space-3)',
			width: '100%',
		}}
	>
		{ICONS.map(({fileName, Icon}) => (
			<div
				key={fileName}
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 'var(--altum-g-space-2)',
					padding: 'var(--altum-g-space-3)',
					borderRadius: 'var(--altum-g-radius)',
					border: '1px solid var(--altum-color-border)',
					background: 'var(--altum-color-input-bg)',
					color: 'var(--altum-color-input-text)',
					textAlign: 'center',
				}}
				title={fileName}
			>
				<Icon size={24} />
				<span
					style={{
						fontSize: 11,
						lineHeight: 1.3,
						wordBreak: 'break-all',
						color: 'var(--altum-color-muted)',
						fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
					}}
				>
					{fileName}
				</span>
			</div>
		))}
	</div>
);

export default {
	title: 'altum/Icons/Gallery',
	component: IconGallery,
	tags: ['autodocs'],
	parameters: componentParameters(`Галерея всех SVG-иконок библиотеки altum (${ICONS.length}).`),
	argTypes: {},
} satisfies Meta<typeof IconGallery>;

export const Playground: Story<typeof IconGallery> = {
	parameters: story('Иконка и имя файла компонента.'),
};
