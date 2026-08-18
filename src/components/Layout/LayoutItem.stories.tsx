import type {Meta} from '@storybook/react';
import React from 'react';
import {LayoutItem, type LayoutItemProps} from './LayoutItem';
import {ControlRow} from './ControlRow';
import {Split} from './Split';
import {Stack} from './Stack';
import {Button} from '../Button/Button';
import {TextField} from '../TextField/TextField';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/LayoutItem',
	component: LayoutItem,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Flex-ячейка с grow / shrink внутри Stack, Inline, Split или ControlRow. '
		+ 'Оборачивайте только элементы, которым нужно растянуться или не сжиматься. '
		+ 'Алиас: ControlRow.Item, Layout.Item.',
	),
} satisfies Meta<typeof LayoutItem>;

export const Playground: Story<LayoutItemProps> = {
	render: () => (
		<Stack gap='md'>
			<Text size='sm' color='muted'>
				Поле занимает оставшуюся ширину, кнопка — по содержимому (`shrink=
				{false}
				`).
			</Text>
			<ControlRow>
				<LayoutItem grow>
					<TextField label='Поиск' width='full' />
				</LayoutItem>
				<LayoutItem shrink={false}>
					<Button variant='primary'>
						Найти
					</Button>
				</LayoutItem>
			</ControlRow>
		</Stack>
	),
	parameters: story('grow у поля, shrink={false} у кнопки.'),
};

export const WithSplitRow: Story<LayoutItemProps> = {
	render: () => (
		<Split gap='md'>
			<LayoutItem grow>
				<Text size='sm'>
					Растягивается (`grow`)
				</Text>
			</LayoutItem>
			<LayoutItem shrink={false}>
				<Button size='sm' variant='secondary'>
					Действие
				</Button>
			</LayoutItem>
		</Split>
	),
	parameters: story('LayoutItem внутри Split: grow + shrink={false}.'),
};
