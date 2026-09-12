import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Button, ButtonProps} from './Button';
import {Inline, Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {Card} from '../Card/Card';
import {IconPlus} from '../../icons/icons/IconPlus';
import {componentParameters, story, Story} from '../../storybook/meta';

const VARIANTS = [
	'primary',
	'tinted',
	'secondary',
	'ghost',
	'link',
] as const;

export default {
	title: 'altum/Components/Button',
	component: Button,
	tags: ['autodocs'],
	parameters: componentParameters('Кнопка с вариантами оформления, размерами, иконками и состоянием загрузки.'),
	argTypes: {
		variant: {
			control: {
				type: 'select',
				options: [...VARIANTS],
			},
			description: 'Вариант оформления (primary = Prominent, tinted = приглушённый акцент)',
		},
		status: {
			control: {
				type: 'select',
				options: ['default', 'danger'],
			},
			description: 'Семантический статус (danger — опасное действие)',
		},
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg']
			},
			description: 'Размер кнопки',
		},
		disabled: {
			control: 'boolean',
			description: 'Заблокированное состояние'
		},
		loading: {
			control: 'boolean',
			description: 'Состояние загрузки'
		},
		fullWidth: {
			control: 'boolean',
			description: 'Растянуть на всю ширину'
		},
		active: {
			control: 'boolean',
			description: 'Toggle-состояние (aria-pressed)',
		},
		children: {
			control: 'text',
			description: 'Текст кнопки'
		},
		shortcut: {
			control: 'text',
			description: 'Подпись шортката (mod+s)',
		},
		onClick: {
			action: 'click',
		},
	},
} satisfies Meta<typeof Button>;

export const Playground: Story<ButtonProps> = {
	args: {
		children: 'Продолжить',
		variant: 'primary',
		status: 'default',
		size: 'md',
		disabled: false,
		loading: false,
		fullWidth: false,
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const AllVariants: Story<ButtonProps> = {
	render: () => (
		<Inline gap='md' wrap>
			<Button variant='primary'>
				Продолжить
			</Button>
			<Button variant='tinted'>
				Tinted
			</Button>
			<Button variant='secondary'>
				Отмена
			</Button>
			<Button variant='ghost'>
				Ghost
			</Button>
			<Button variant='link'>
				Link
			</Button>
			<Button variant='primary' disabled>
				Заблокировано
			</Button>
			<Button variant='primary' loading>
				Сохранение
			</Button>
		</Inline>
	),
	parameters: story('Все визуальные варианты.'),
};

export const Sizes: Story<ButtonProps> = {
	render: () => (
		<Inline gap='md' align='center'>
			<Button size='sm'>
				Small
			</Button>
			<Button size='md'>
				Medium
			</Button>
			<Button size='lg'>
				Large
			</Button>
		</Inline>
	),
	parameters: story('Размеры sm / md / lg.'),
};

export const Danger: Story<ButtonProps> = {
	render: () => (
		<Inline gap='md' wrap>
			<Button
				variant='primary'
				status='danger'
			>
				Удалить
			</Button>
			<Button
				variant='secondary'
				status='danger'
			>
				Удалить
			</Button>
			<Button
				variant='ghost'
				status='danger'
			>
				Удалить
			</Button>
			<Button
				variant='link'
				status='danger'
			>
				Удалить
			</Button>
			<Button
				variant='primary'
				status='danger'
				disabled
			>
				Удалить
			</Button>
		</Inline>
	),
	parameters: story('`status="danger"` на разных вариантах.'),
};

/** Disabled — та же форма × opacity; loading сохраняет заливку enabled. */
export const PrimaryEnabledVsDisabled: Story<ButtonProps> = {
	render: () => (
		<Stack gap='md'>
			<Inline
				gap='sm'
				align='center'
				wrap
				style={{
					padding: 'var(--altum-g-space-4)',
					background: 'var(--altum-color-dropdown-bg)',
					border: '1px solid var(--altum-color-border)',
					borderRadius: 'var(--altum-g-radius)',
				}}
			>
				<Button variant='primary'>
					Сохранить
				</Button>
				<Button variant='primary' disabled>
					Сохранить
				</Button>
				<Button variant='primary' loading>
					Сохранение
				</Button>
				<Button
					variant='primary'
					status='danger'
					disabled
				>
					Удалить
				</Button>
				<Button variant='secondary'>
					Отмена
				</Button>
			</Inline>
			<Text size='xs' color='muted'>
				Disabled = приглушённая заливка и читаемый текст; loading не перекрашивается в disabled.
			</Text>
		</Stack>
	),
	parameters: story('Disabled — приглушённая заливка и читаемый текст; loading остаётся enabled-chrome.'),
};

export const WithIcon: Story<ButtonProps> = {
	args: {
		variant: 'primary',
		size: 'sm',
		iconStart: <IconPlus size={14} />,
		children: 'Быстрый старт',
	},
	parameters: story('Компактная кнопка с иконкой в начале.'),
};

export const FullWidth: Story<ButtonProps> = {
	render: () => (
		<div style={{maxWidth: 280}}>
			<Button fullWidth>
				Войти
			</Button>
		</div>
	),
	parameters: story('`fullWidth` растягивает кнопку на контейнер.'),
};

export const WithShortcut: Story<ButtonProps> = {
	args: {
		children: 'Сохранить',
		shortcut: 'mod+s',
	},
	parameters: story('`shortcut` задаёт `aria-keyshortcuts` и title.'),
};

export const OverflowText: Story<ButtonProps> = {
	render: () => (
		<div style={{maxWidth: 180}}>
			<Button fullWidth>
				Очень длинная подпись действия, которая не помещается
			</Button>
		</div>
	),
	parameters: story('Длинный текст в узкой кнопке.'),
};

export const Interaction: Story<ButtonProps> = {
	render: function InteractionRender() {
		const [count, setCount] = useState(0);
		return (
			<Stack gap='sm'>
				<Button onClick={() => setCount((n) => n + 1)}>
					Нажать
				</Button>
				<Text size='sm' color='muted'>
					Кликов:
					{' '}
					{count}
				</Text>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		const button = canvasElement.querySelector('button');
		button?.click();
		button?.focus();
	},
	parameters: story('Play кликает кнопку и ставит фокус.'),
};

export const UsageExample: Story<ButtonProps> = {
	render: () => (
		<Card
			style={{maxWidth: 360}}
			header={(
				<Text weight='bold'>
					Удалить проект
				</Text>
			)}
		>
			<Stack gap='md'>
				<Text size='sm'>
					Действие необратимо. Экспорт данных заранее.
				</Text>
				<Inline gap='sm'>
					<Button
						variant='primary'
						status='danger'
						size='sm'
					>
						Удалить
					</Button>
					<Button
						variant='secondary'
						size='sm'
					>
						Отмена
					</Button>
				</Inline>
			</Stack>
		</Card>
	),
	parameters: story('Пара кнопок в карточке подтверждения.'),
};
