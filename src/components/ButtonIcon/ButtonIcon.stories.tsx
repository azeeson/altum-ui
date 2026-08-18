import type {Meta} from '@storybook/react';
import React from 'react';
import {ButtonIcon, ButtonIconProps} from './ButtonIcon';
import {IconMenu} from '../../icons/icons/IconMenu';
import {IconPlus} from '../../icons/icons/IconPlus';
import {IconSearch} from '../../icons/icons/IconSearch';
import {IconCross} from '../../icons/icons/IconCross';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/ButtonIcon',
	component: ButtonIcon,
	tags: ['autodocs'],
	parameters: componentParameters('Кнопка с иконкой без текста для компактных действий в интерфейсе.'),
	argTypes: {
		variant: {
			control: {
				type: 'select',
				options: [
					'primary',
					'tinted',
					'secondary',
					'ghost',
					'link',
				]
			},
			description: 'Вариант оформления',
		},
		status: {
			control: {
				type: 'select',
				options: ['default', 'danger'],
			},
		},
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg']
			},
			description: 'Размер кнопки',
		},
		shape: {
			control: {
				type: 'select',
				options: ['square', 'circle']
			},
			description: 'Форма кнопки',
		},
		disabled: {
			control: 'boolean',
			description: 'Заблокированное состояние'
		},
		'aria-label': {
			control: 'text',
			description: 'Доступная метка для скринридеров'
		},
	},
} satisfies Meta<typeof ButtonIcon>;

export const Playground: Story<ButtonIconProps> = {
	args: {
		icon: <IconMenu size={20} />,
		'aria-label': 'Меню',
		variant: 'ghost',
		size: 'md',
		shape: 'square',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Variants: Story<ButtonIconProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			gap: 12,
			alignItems: 'center',
			flexWrap: 'wrap'
		}}
		>
			<ButtonIcon icon={<IconMenu size={20} />} aria-label='Меню' />
			<ButtonIcon
				icon={<IconPlus size={20} />}
				aria-label='Добавить'
				variant='primary'
			/>
			<ButtonIcon
				icon={<IconPlus size={20} />}
				aria-label='Тонированная'
				variant='tinted'
			/>
			<ButtonIcon
				icon={<IconSearch size={20} />}
				aria-label='Поиск'
				variant='secondary'
				shape='circle'
			/>
			<ButtonIcon
				icon={<IconMenu size={20} />}
				aria-label='Призрачная'
				variant='ghost'
			/>
			<ButtonIcon
				icon={<IconCross size={18} />}
				aria-label='Удалить'
				variant='primary'
				status='danger'
			/>
		</div>
	),
	parameters: story('Варианты оформления и формы иконочной кнопки.'),
};

export const Sizes: Story<ButtonIconProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			gap: 12,
			alignItems: 'center'
		}}
		>
			<ButtonIcon
				icon={<IconMenu size={12} />}
				aria-label='Меню'
				size='sm'
			/>
			<ButtonIcon
				icon={<IconMenu size={16} />}
				aria-label='Меню'
				size='sm'
			/>
			<ButtonIcon
				icon={<IconMenu size={20} />}
				aria-label='Меню'
				size='md'
			/>
			<ButtonIcon
				icon={<IconMenu size={24} />}
				aria-label='Меню'
				size='lg'
			/>
		</div>
	),
	parameters: story('Размеры `sm` / `md` / `lg`.'),
};
