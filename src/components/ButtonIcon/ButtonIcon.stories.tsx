import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {ButtonIcon, ButtonIconProps} from './ButtonIcon';
import {Button} from '../Button/Button';
import {Inline, Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {Card} from '../Card/Card';
import {IconMenu} from '../../icons/icons/IconMenu';
import {IconPlus} from '../../icons/icons/IconPlus';
import {IconSearch} from '../../icons/icons/IconSearch';
import {IconCross} from '../../icons/icons/IconCross';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/ButtonIcon',
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
		appearance: {
			control: {
				type: 'select',
				options: ['default', 'diskClose'],
			},
			description: 'diskClose — chrome закрытия overlay, передайте icon',
		},
		disabled: {
			control: 'boolean',
			description: 'Заблокированное состояние'
		},
		'aria-label': {
			control: 'text',
			description: 'Доступная метка для скринридеров'
		},
		onClick: {
			action: 'click',
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
		appearance: 'default',
		disabled: false,
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Variants: Story<ButtonIconProps> = {
	render: () => (
		<Inline
			gap='sm'
			align='center'
			wrap
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
			<ButtonIcon
				icon={<IconPlus size={20} />}
				aria-label='Добавить'
				disabled
			/>
		</Inline>
	),
	parameters: story('Варианты оформления, форма и disabled.'),
};

export const Sizes: Story<ButtonIconProps> = {
	render: () => (
		<Inline gap='sm' align='center'>
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
		</Inline>
	),
	parameters: story('Размеры `sm` / `md` / `lg`.'),
};

export const DiskClose: Story<ButtonIconProps> = {
	render: () => (
		<ButtonIcon
			appearance='diskClose'
			icon={<IconCross size={16} />}
			aria-label='Закрыть'
		/>
	),
	parameters: story('`appearance="diskClose"` — chrome закрытия overlay, иконка передаётся явно.'),
};

export const Interaction: Story<ButtonIconProps> = {
	render: function InteractionRender() {
		const [open, setOpen] = useState(false);
		return (
			<Stack gap='sm'>
				<ButtonIcon
					icon={<IconMenu size={20} />}
					aria-label='Меню'
					active={open}
					onClick={() => setOpen((value) => !value)}
				/>
				<Text size='sm' color='muted'>
					{open ? 'открыто' : 'закрыто'}
				</Text>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		const button = canvasElement.querySelector('button');
		button?.click();
		button?.focus();
	},
	parameters: story('Play кликает иконку-меню (toggle `active`).'),
};

export const UsageExample: Story<ButtonIconProps> = {
	render: () => (
		<Card
			style={{maxWidth: 360}}
			header={(
				<Inline
					gap='sm'
					style={{
						width: '100%',
						justifyContent: 'space-between'
					}}
				>
					<Text weight='bold'>
						Заметка
					</Text>
					<ButtonIcon
						icon={<IconCross size={16} />}
						aria-label='Закрыть'
						size='sm'
					/>
				</Inline>
			)}
		>
			<Stack gap='md'>
				<Text size='sm'>
					Черновик сохранён локально.
				</Text>
				<Inline gap='sm'>
					<Button size='sm'>
						Открыть
					</Button>
					<ButtonIcon
						icon={<IconPlus size={16} />}
						aria-label='Добавить'
						variant='tinted'
						size='sm'
					/>
				</Inline>
			</Stack>
		</Card>
	),
	parameters: story('Иконки закрытия и добавления рядом с текстовой кнопкой в карточке.'),
};
