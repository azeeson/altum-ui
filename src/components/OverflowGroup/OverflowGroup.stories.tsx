import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {
	OverflowGroup,
	type OverflowGroupProps,
} from './OverflowGroup';
import {Chip} from '../Chip/Chip';
import {Button} from '../Button/Button';
import {ButtonGroup} from '../ButtonGroup/ButtonGroup';
import {Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

const CHIP_LABELS = [
	'React',
	'TypeScript',
	'CSS Modules',
	'Storybook',
	'a11y',
	'Дизайн-токены',
	'Формы',
	'Оверлей',
	'Выпадающий список',
	'Темизация',
];

const BUTTON_LABELS = [
	'Изменить',
	'Копировать',
	'Поделиться',
	'Архив',
	'Экспорт',
	'Удалить',
];

export default {
	title: 'altum/Components/OverflowGroup',
	component: OverflowGroup,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Однострочная обёртка: children, не помещающиеся по ширине, уходят за ⋯ в Dropdown. '
		+ 'В отличие от OverflowActions — лимит по измерению ширины, меню рендерит children as-is.',
	),
	argTypes: {
		gap: {
			control: {type: 'select'},
			options: ['sm', 'md', 'lg'],
		},
		size: {
			control: {type: 'select'},
			options: ['sm', 'md', 'lg'],
		},
		maxVisible: {
			control: {
				type: 'number',
				min: 0,
				max: 12
			},
		},
	},
} satisfies Meta<typeof OverflowGroup>;

type PlaygroundArgs = OverflowGroupProps & {
	containerWidth: number;
};

export const Playground: Story<PlaygroundArgs> = {
	render: function PlaygroundRender({gap, size, maxVisible, containerWidth}) {
		return (
			<div style={{
				width: containerWidth,
				maxWidth: '100%'
			}}
			>
				<OverflowGroup
					gap={gap}
					size={size}
					maxVisible={maxVisible}
				>
					{CHIP_LABELS.map((label) => (
						<Chip
							key={label}
							variant='tinted'
							size={size}
						>
							{label}
						</Chip>
					))}
				</OverflowGroup>
			</div>
		);
	},
	args: {
		gap: 'md',
		size: 'md',
		containerWidth: 320,
	},
	argTypes: {
		containerWidth: {
			control: {
				type: 'range',
				min: 160,
				max: 640,
				step: 8
			},
		},
	},
	parameters: story('Сузьте контейнер — часть Chip уйдёт в меню ⋯.'),
};

export const WithChips: Story<OverflowGroupProps> = {
	render: function WithChipsRender() {
		const [tags, setTags] = useState(CHIP_LABELS);

		return (
			<Stack gap='md'>
				<Text size='sm' color='muted'>
					Ширина 280px · removable Chip
				</Text>
				<div style={{
					width: 280,
					maxWidth: '100%'
				}}
				>
					<OverflowGroup
						gap='sm'
						size='sm'
						aria-label='Теги'
					>
						{tags.map((label) => (
							<Chip
								key={label}
								variant='secondary'
								size='sm'
								onRemove={() => {
									setTags((prev) => prev.filter((item) => item !== label));
								}}
							>
								{label}
							</Chip>
						))}
					</OverflowGroup>
				</div>
			</Stack>
		);
	},
	parameters: story('Chip (в т.ч. removable): невидимые в строке доступны в dropdown.'),
};

export const WithButtonGroup: Story<OverflowGroupProps> = {
	render: function WithButtonGroupRender() {
		const [active, setActive] = useState('edit');

		return (
			<Stack gap='md'>
				<Text size='sm' color='muted'>
					Ширина 300px · ButtonGroup + fit=&quot;container&quot; (⋯ справа)
				</Text>
				<div style={{
					width: 300,
					maxWidth: '100%'
				}}
				>
					<ButtonGroup
						aria-label='Панель действий'
						size='sm'
						width='full'
					>
						<OverflowGroup
							fit='container'
							gap='sm'
							size='sm'
						>
							{[
								{
									id: 'edit',
									label: 'Изменить'
								},
								{
									id: 'copy',
									label: 'Копировать'
								},
								{
									id: 'share',
									label: 'Поделиться'
								},
								{
									id: 'archive',
									label: 'Архив'
								},
								{
									id: 'export',
									label: 'Экспорт'
								},
								{
									id: 'delete',
									label: 'Удалить'
								},
							].map((item) => (
								<ButtonGroup.Item
									key={item.id}
									active={active === item.id}
									onClick={() => setActive(item.id)}
								>
									{item.label}
								</ButtonGroup.Item>
							))}
						</OverflowGroup>
					</ButtonGroup>
				</div>
			</Stack>
		);
	},
	parameters: story(
		'Внутри ButtonGroup используйте `fit="container"`: трек на всю ширину, ⋯ в конце, стиль триггера как у Item.',
	),
}

export const WithButtons: Story<OverflowGroupProps> = {
	render: () => (
		<Stack gap='md'>
			<Text size='sm' color='muted'>
				Ширина 360px · обычные Button
			</Text>
			<div style={{
				width: 360,
				maxWidth: '100%'
			}}
			>
				<OverflowGroup
					gap='sm'
					size='sm'
					aria-label='Действия'
				>
					{BUTTON_LABELS.map((label) => (
						<Button
							key={label}
							variant='secondary'
							size='sm'
						>
							{label}
						</Button>
					))}
				</OverflowGroup>
			</div>
		</Stack>
	),
	parameters: story('Ряд кнопок без ButtonGroup — лишние за ⋯.'),
};
