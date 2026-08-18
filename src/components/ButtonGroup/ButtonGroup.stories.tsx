import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {ButtonGroup, ButtonGroupRootProps} from './ButtonGroup';
import {IconChevronUp} from '../../icons/icons/IconChevronUp';
import {IconChevronDown} from '../../icons/icons/IconChevronDown';
import {IconAlignLeft} from '../../icons/icons/IconAlignLeft';
import {IconMenu} from '../../icons/icons/IconMenu';
import {IconViewList} from '../../icons/icons/IconViewList';
import {Text} from '../Text/Text';
import {Stack} from '../Layout/Layout';
import {componentParameters, story, Story} from '../../storybook/meta';
import type {ButtonVariant} from '../../base/ButtonBase';

const VARIANTS: ButtonVariant[] = [
	'primary',
	'tinted',
	'secondary',
	'ghost',
	'link',
];

export default {
	title: 'altum/Components/ButtonGroup',
	component: ButtonGroup,
	tags: ['autodocs'],
	parameters: {
		...componentParameters(
			'Составная группа кнопок: `ButtonGroup` + `ButtonGroup.Item`. Стили на Root (`variant` / `status` / `size`), toggle через `active` на Item.',
		),
	},
	argTypes: {
		size: {
			control: {type: 'select'},
			options: ['sm', 'md', 'lg'],
		},
		variant: {
			control: {type: 'select'},
			options: VARIANTS,
		},
		status: {
			control: {type: 'select'},
			options: ['default', 'danger'],
		},
		borderless: {
			control: 'boolean',
		},
	},
} satisfies Meta<typeof ButtonGroup>;

export const Playground: Story<ButtonGroupRootProps> = {
	render: ({size, variant, status, borderless}) => (
		<ButtonGroup
			size={size}
			variant={variant}
			status={status}
			borderless={borderless}
			aria-label='Навигация'
		>
			<ButtonGroup.Item icon={<IconChevronUp />} aria-label='Вверх' />
			<ButtonGroup.Item icon={<IconChevronDown />} aria-label='Вниз' />
		</ButtonGroup>
	),
	args: {
		size: 'md',
		variant: 'secondary',
		status: 'default',
		borderless: false,
	},
	parameters: story('Иконки без toggle-состояния.'),
};

export const WithLabels: Story<ButtonGroupRootProps> = {
	render: () => (
		<ButtonGroup aria-label='Действия'>
			<ButtonGroup.Item icon={<IconViewList />}>
				Список
			</ButtonGroup.Item>
			<ButtonGroup.Item icon={<IconMenu />}>
				Меню
			</ButtonGroup.Item>
			<ButtonGroup.Item icon={<IconAlignLeft />}>
				Слева
			</ButtonGroup.Item>
		</ButtonGroup>
	),
	parameters: story('Иконка + подпись.'),
};

export const ToggleToolbar: Story<ButtonGroupRootProps> = {
	render: function ToggleToolbarRender() {
		const [bold, setBold] = useState(false);
		const [italic, setItalic] = useState(true);

		return (
			<ButtonGroup aria-label='Форматирование' variant='secondary'>
				<ButtonGroup.Item
					active={bold}
					onClick={() => setBold((value) => !value)}
					aria-label='Жирный'
				>
					Ж
				</ButtonGroup.Item>
				<ButtonGroup.Item
					active={italic}
					onClick={() => setItalic((value) => !value)}
					aria-label='Курсив'
				>
					К
				</ButtonGroup.Item>
			</ButtonGroup>
		);
	},
	parameters: story('Независимые toggle-кнопки с `active` и `aria-pressed`.'),
};

export const AllVariants: Story<ButtonGroupRootProps> = {
	render: () => (
		<Stack gap='md'>
			{VARIANTS.map((variant) => (
				<div key={variant}>
					<Text size='sm'>
						{variant}
					</Text>
					<ButtonGroup
						variant={variant}
						aria-label={variant}
						size='md'
					>
						<ButtonGroup.Item active>
							One
						</ButtonGroup.Item>
						<ButtonGroup.Item>
							Two
						</ButtonGroup.Item>
						<ButtonGroup.Item>
							Three
						</ButtonGroup.Item>
					</ButtonGroup>
				</div>
			))}
		</Stack>
	),
	parameters: story('Все варианты заливки; первый сегмент с `active`.'),
};

export const Borderless: Story<ButtonGroupRootProps> = {
	render: () => (
		<Stack gap='md'>
			{(['secondary', 'ghost', 'tinted'] as const).map((variant) => (
				<div key={variant}>
					<Text size='sm'>
						{variant}
						{' '}
						+ borderless
					</Text>
					<ButtonGroup
						variant={variant}
						borderless
						aria-label={variant}
					>
						<ButtonGroup.Item active>
							A
						</ButtonGroup.Item>
						<ButtonGroup.Item>
							B
						</ButtonGroup.Item>
						<ButtonGroup.Item>
							C
						</ButtonGroup.Item>
					</ButtonGroup>
				</div>
			))}
		</Stack>
	),
	parameters: story('`borderless` снимает рамку трека (ортогонально `variant`).'),
};

export const Sizes: Story<ButtonGroupRootProps> = {
	render: () => (
		<Stack gap='md' align='start'>
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<div key={size}>
					<Text size='sm'>
						size=
						{size}
					</Text>
					<ButtonGroup
						size={size}
						variant='secondary'
						aria-label={size}
					>
						<ButtonGroup.Item active>
							One
						</ButtonGroup.Item>
						<ButtonGroup.Item>
							Two
						</ButtonGroup.Item>
						<ButtonGroup.Item icon={<IconMenu />} aria-label='Меню' />
					</ButtonGroup>
				</div>
			))}
		</Stack>
	),
	parameters: story('Размеры `sm` / `md` / `lg`.'),
};
