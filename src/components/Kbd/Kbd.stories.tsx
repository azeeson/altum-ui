import type {Meta} from '@storybook/react';
import React from 'react';
import {Kbd, KbdGroup, KbdProps} from './Kbd';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/Kbd',
	component: Kbd,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Отображение клавиш и сочетаний клавиатуры. Группировка — KbdGroup.',
	),
	argTypes: {
		children: {
			control: 'text',
			description: 'Текст клавиши',
		},
	},
} satisfies Meta<typeof Kbd>;

export const Playground: Story<KbdProps> = {
	render: () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-4)',
			}}
		>
			<KbdGroup>
				<Kbd>
					⌘
				</Kbd>
				<Kbd>
					⇧
				</Kbd>
				<Kbd>
					⌥
				</Kbd>
				<Kbd>
					⌃
				</Kbd>
			</KbdGroup>
			<KbdGroup>
				<Kbd>
					Ctrl
				</Kbd>
				<span aria-hidden>
					+
				</span>
				<Kbd>
					B
				</Kbd>
			</KbdGroup>
		</div>
	),
	parameters: story('Модификаторы в группе и сочетание Ctrl + B.'),
};

export const WithCommonShortcuts: Story<KbdProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			gap: 'var(--altum-g-space-3)',
		}}
		>
			<KbdGroup>
				<Kbd>
					⌘
				</Kbd>
				<Kbd>
					K
				</Kbd>
				<span aria-hidden>
					— палитра команд
				</span>
			</KbdGroup>
			<KbdGroup>
				<Kbd>
					⌘
				</Kbd>
				<Kbd>
					⇧
				</Kbd>
				<Kbd>
					P
				</Kbd>
				<span aria-hidden>
					— печать
				</span>
			</KbdGroup>
			<Kbd>
				Esc
			</Kbd>
		</div>
	),
	parameters: story('Типичные сочетания в подсказках интерфейса.'),
};

/** Стрелки делят базовую линию с буквенными клавишами. */
export const ArrowKeys: Story<KbdProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			gap: 'var(--altum-g-space-3)'
		}}
		>
			<KbdGroup>
				<Kbd>
					↑
				</Kbd>
				<Kbd>
					↓
				</Kbd>
				<Kbd>
					←
				</Kbd>
				<Kbd>
					→
				</Kbd>
			</KbdGroup>
			<KbdGroup>
				<Kbd>
					W
				</Kbd>
				<Kbd>
					A
				</Kbd>
				<Kbd>
					S
				</Kbd>
				<Kbd>
					D
				</Kbd>
				<span aria-hidden>
					—
				</span>
				<Kbd>
					↑
				</Kbd>
				<Kbd>
					↓
				</Kbd>
			</KbdGroup>
		</div>
	),
	parameters: story('Стрелки с `.kbdSymbol` рядом с буквенными клавишами.'),
};
