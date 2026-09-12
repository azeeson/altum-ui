import type {Meta} from '@storybook/react';
import React from 'react';
import {Kbd, KbdGroup, KbdProps} from './Kbd';
import {Card} from '../Card/Card';
import {Inline, Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Kbd',
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
		symbol: {
			control: 'boolean',
			description: 'Оптический центр для стрелок и символов',
		},
	},
} satisfies Meta<typeof Kbd>;

export const Playground: Story<KbdProps> = {
	args: {
		children: '⌘',
		symbol: false,
	},
	render: function PlaygroundRender(args) {
		return (
			<Stack gap='md'>
				<Kbd {...args} />
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
			</Stack>
		);
	},
	parameters: story('Controls для одной клавиши; ниже — модификаторы и Ctrl + B.'),
};

export const WithCommonShortcuts: Story<KbdProps> = {
	render: () => (
		<Stack gap='sm'>
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
		</Stack>
	),
	parameters: story('Типичные сочетания в подсказках интерфейса.'),
};

/** Стрелки делят базовую линию с буквенными клавишами. */
export const ArrowKeys: Story<KbdProps> = {
	render: () => (
		<Stack gap='sm'>
			<KbdGroup>
				<Kbd symbol>
					↑
				</Kbd>
				<Kbd symbol>
					↓
				</Kbd>
				<Kbd symbol>
					←
				</Kbd>
				<Kbd symbol>
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
				<Kbd symbol>
					↑
				</Kbd>
				<Kbd symbol>
					↓
				</Kbd>
			</KbdGroup>
		</Stack>
	),
	parameters: story('Стрелки с `.kbdSymbol` рядом с буквенными клавишами.'),
};

export const OverflowText: Story<KbdProps> = {
	render: () => (
		<Kbd>
			PageDown
		</Kbd>
	),
	parameters: story('Длинная подпись клавиши без аббревиатуры.'),
};

export const UsageExample: Story<KbdProps> = {
	render: () => (
		<Card
			variant='outlined'
			header={(
				<Text weight='bold'>
					Навигация
				</Text>
			)}
			style={{maxWidth: 360}}
		>
			<Stack gap='sm'>
				<Inline
					gap='sm'
					align='center'
					justify='between'
				>
					<Text size='sm'>
						Палитра команд
					</Text>
					<KbdGroup>
						<Kbd>
							⌘
						</Kbd>
						<Kbd>
							K
						</Kbd>
					</KbdGroup>
				</Inline>
				<Inline
					gap='sm'
					align='center'
					justify='between'
				>
					<Text size='sm'>
						Закрыть
					</Text>
					<Kbd>
						Esc
					</Kbd>
				</Inline>
			</Stack>
		</Card>
	),
	parameters: story('Kbd в карточке горячих клавиш.'),
};
