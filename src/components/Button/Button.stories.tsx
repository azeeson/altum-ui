import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Button, ButtonProps} from './Button';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Inline, Stack} from '../Layout';
import {Text} from '../Text/Text';
import {Card} from '../Card/Card';
import {IconPlus} from '../../icons/icons/IconPlus';
import {IconCross} from '../../icons/icons/IconCross';
import {IconSearch} from '../../icons/icons/IconSearch';
import {IconMenu} from '../../icons/icons/IconMenu';
import {componentParameters, story, Story} from '../../storybook/meta';
import overlayClose from '../../styles/overlayClose.module.css';

const VARIANTS = [
	'primary',
	'tinted',
	'secondary',
	'danger',
	'danger_tinted',
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
		onClick: {
			action: 'click',
		},
	},
} satisfies Meta<typeof Button>;

export const Playground: Story<ButtonProps> = {
	args: {
		children: 'Продолжить',
		variant: 'primary',
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
			<Button variant='danger'>
				Удалить
			</Button>
			<Button variant='danger_tinted'>
				Удалить
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

export const AsLink: Story<ButtonProps> = {
	render: () => (
		<Inline
			gap='md'
			wrap
			align='center'
		>
			<Button>
				Действие
			</Button>
			<Button disabled>
				Недоступно
			</Button>
			<Button as='a' href='#base-link'>
				Ссылка
			</Button>
		</Inline>
	),
	parameters: story('`as="a"` рендерит якорь; `disabled` на кнопке и на ссылке.'),
};

export const Sizes: Story<ButtonProps> = {
	render: () => (
		<Stack gap='md'>
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
			<Inline gap='md' align='center'>
				<Button
					variant='link'
					size='sm'
					prefix={<IconPlus />}
				>
					Small
				</Button>
				<Button
					variant='link'
					size='md'
					prefix={<IconPlus />}
				>
					Medium
				</Button>
				<Button
					variant='link'
					size='lg'
					prefix={<IconPlus />}
				>
					Large
				</Button>
			</Inline>
		</Stack>
	),
	parameters: story('Размеры sm / md / lg, в том числе у variant="link".'),
};

export const Danger: Story<ButtonProps> = {
	render: () => (
		<Inline gap='md' wrap>
			<Button variant='danger'>
				Удалить
			</Button>
			<Button variant='danger_tinted'>
				Удалить
			</Button>
			<Button variant='danger' disabled>
				Удалить
			</Button>
		</Inline>
	),
	parameters: story('`variant="danger"` и `danger_tinted`.'),
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
				<Button variant='danger' disabled>
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
		prefix: <IconPlus size={14} />,
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
						variant='danger'
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

export const IconOnly: Story<ButtonProps> = {
	render: () => (
		<Inline
			gap='sm'
			align='center'
			wrap
		>
			<ButtonIcon
				variant='ghost'
				aria-label='Меню'
				icon={<IconMenu size={20} />}
			/>
			<ButtonIcon
				variant='primary'
				aria-label='Добавить'
				icon={<IconPlus size={20} />}
			/>
			<ButtonIcon
				variant='tinted'
				aria-label='Тонированная'
				icon={<IconPlus size={20} />}
			/>
			<ButtonIcon
				variant='secondary'
				data-shape='circle'
				aria-label='Поиск'
				icon={<IconSearch size={20} />}
			/>
			<ButtonIcon
				variant='danger'
				aria-label='Удалить'
				icon={<IconCross size={18} />}
			/>
			<ButtonIcon
				variant='ghost'
				aria-label='Добавить'
				icon={<IconPlus size={20} />}
				disabled
			/>
		</Inline>
	),
	parameters: story('`data-icon-only` и `data-shape="circle"` — компактные кнопки только с иконкой.'),
};

export const DiskClose: Story<ButtonProps> = {
	render: () => (
		<ButtonIcon
			variant='ghost'
			className={overlayClose.close}
			data-shape='circle'
			data-appearance='diskClose'
			aria-label='Закрыть'
			icon={<IconCross size={16} />}
		/>
	),
	parameters: story('Закрытие overlay: `overlayClose.close` + `data-appearance="diskClose"`.'),
};

