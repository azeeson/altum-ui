import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {Tooltip} from './Tooltip';
import {Button} from '../Button/Button';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Card} from '../Card/Card';
import {Inline, Stack} from '../Layout';
import {Text} from '../Text/Text';
import {TextField} from '../TextField/TextField';
import {IconHome} from '../../icons/icons/IconHome';
import {IconSearch} from '../../icons/icons/IconSearch';
import {IconGear} from '../../icons/icons/IconGear';
import {IconHelp} from '../../icons/icons/IconHelp';
import {componentParameters, story} from '../../storybook/meta';
import {playFocus} from '../../storybook/play';

export default {
	title: 'altum/Components/Tooltip',
	component: Tooltip,
	tags: ['autodocs'],
	parameters: componentParameters('Всплывающая подсказка при наведении на дочерний элемент.'),
	argTypes: {
		content: {
			control: 'text',
			description: 'Текст подсказки'
		},
		side: {
			control: {
				type: 'select',
				options: [
					'top',
					'bottom',
					'left',
					'right'
				]
			},
			description: 'Сторона подсказки',
		},
		disabled: {
			control: 'boolean',
			description: 'Не показывать подсказку',
		},
		wrap: {
			control: 'boolean',
			description: 'Обернуть триггер в span (для disabled-кнопок)',
		},
		openDelay: {
			control: 'number',
			description: 'Задержка открытия, мс',
		},
		closeDelay: {
			control: 'number',
			description: 'Задержка закрытия, мс',
		},
	},
} satisfies Meta<typeof Tooltip>;

type TooltipStory = StoryObj<typeof Tooltip>;

export const Playground: TooltipStory = {
	render: (args) => (
		<div style={{
			display: 'flex',
			justifyContent: 'center',
			padding: '40px'
		}}
		>
			<Tooltip
				content={args.content}
				side={args.side}
				disabled={args.disabled}
				openDelay={args.openDelay}
				closeDelay={args.closeDelay}
			>
				<Button variant='secondary'>
					Наведи на меня
				</Button>
			</Tooltip>
		</div>
	),
	args: {
		content: 'Полезная подсказка сверху',
		side: 'top',
		disabled: false,
		openDelay: 200,
		closeDelay: 100,
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Variants: TooltipStory = {
	render: () => (
		<div style={{
			display: 'flex',
			gap: '24px',
			justifyContent: 'center',
			padding: '40px'
		}}
		>
			<Tooltip
				content='Подсказка сверху'
				side='top'
			>
				<Button variant='secondary' size='sm'>
					Верх
				</Button>
			</Tooltip>
			<Tooltip
				content='Подсказка справа'
				side='right'
			>
				<Button variant='secondary' size='sm'>
					Право
				</Button>
			</Tooltip>
			<Tooltip
				content='Подсказка снизу'
				side='bottom'
			>
				<Button variant='secondary' size='sm'>
					Низ
				</Button>
			</Tooltip>
			<Tooltip
				content='Подсказка слева'
				side='left'
			>
				<Button variant='secondary' size='sm'>
					Лево
				</Button>
			</Tooltip>
		</div>
	),
	parameters: story('Подсказки во всех четырёх позициях.'),
};

export const Open: TooltipStory = {
	render: () => (
		<div style={{
			display: 'flex',
			justifyContent: 'center',
			padding: '48px'
		}}
		>
			<Tooltip
				content='Подсказка открыта по умолчанию'
				side='top'
				defaultOpen
				openDelay={0}
			>
				<Button variant='secondary'>
					Якорь
				</Button>
			</Tooltip>
		</div>
	),
	parameters: story('`defaultOpen` — видимая подсказка для визуальной регрессии.'),
};

export const Disabled: TooltipStory = {
	render: () => (
		<div style={{
			display: 'flex',
			justifyContent: 'center',
			padding: '40px'
		}}
		>
			<Tooltip
				content='Не должно появиться'
				disabled
			>
				<Button variant='secondary'>
					Без подсказки
				</Button>
			</Tooltip>
		</div>
	),
	parameters: story('`disabled` подавляет показ.'),
};

export const DisabledTrigger: TooltipStory = {
	render: () => (
		<div style={{
			display: 'flex',
			justifyContent: 'center',
			padding: '48px'
		}}
		>
			<Tooltip
				content='Действие недоступно'
				wrap
				defaultOpen
				openDelay={0}
			>
				<Button disabled>
					Удалить
				</Button>
			</Tooltip>
		</div>
	),
	parameters: story('`wrap` — подсказка на disabled-кнопке без pointer-events.'),
};

export const OverflowText: TooltipStory = {
	render: () => (
		<div style={{
			display: 'flex',
			justifyContent: 'center',
			padding: '64px'
		}}
		>
			<Tooltip
				content='Полный текст подсказки должен переноситься целиком: это длинное пояснение к полю, которое не умещается в одну строку.'
				side='top'
				defaultOpen
				openDelay={0}
			>
				<Button variant='secondary' size='sm'>
					Длинный текст
				</Button>
			</Tooltip>
		</div>
	),
	parameters: story('Длинный content с переносом строк.'),
};

/** Пузырь в top layer: предок с overflow:auto не должен его обрезать. */
export const InsideOverflowCard: TooltipStory = {
	render: () => (
		<div
			style={{
				overflow: 'auto',
				maxHeight: 120,
				maxWidth: 280,
				padding: 'var(--altum-g-space-4)',
				border: '1px solid var(--altum-color-border)',
				borderRadius: 'var(--altum-g-radius)',
			}}
		>
			<p
				style={{
					margin: '0 0 var(--altum-g-space-3)',
					color: 'var(--altum-color-ink-muted)',
				}}
			>
				Прокручиваемая карточка с overflow:auto.
			</p>
			<Tooltip
				content='Полный текст подсказки должен быть виден целиком, без обрезки середины слова.'
				side='top'
			>
				<Button variant='secondary' size='sm'>
					Наведи на меня
				</Button>
			</Tooltip>
		</div>
	),
	parameters: story('Пузырь в top layer: карточка с `overflow: auto` его не обрезает.'),
};

/** Не больше одной подсказки при наведении на плотный вертикальный стек иконок. */
export const IconStackMutex: TooltipStory = {
	render: () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-2)',
				padding: 'var(--altum-g-space-6)',
				width: 'fit-content',
			}}
			data-testid='tooltip-icon-stack'
		>
			{(
				[['Главная', IconHome] as const, ['Поиск', IconSearch] as const, ['Настройки', IconGear] as const,]
			).map(([label, Icon]) => (
				<Tooltip
					key={label}
					content={label}
					side='right'
					openDelay={200}
				>
					<ButtonIcon
						variant='ghost'
						size='sm'
						icon={<Icon size={18}/>}
						aria-label={label}
					/>
				</Tooltip>
			))}
		</div>
	),
	parameters: story(
		'Быстрый hover по стеку — не больше одной подсказки одновременно (hover mutex).',
	),
};

export const Interaction: TooltipStory = {
	render: () => (
		<div style={{
			display: 'flex',
			justifyContent: 'center',
			padding: '48px'
		}}
		>
			<Tooltip
				content='Открыто по фокусу'
				side='top'
				openDelay={0}
			>
				<Button variant='secondary'>
					Сфокусируй меня
				</Button>
			</Tooltip>
		</div>
	),
	play: async ({canvasElement}) => {
		await playFocus(canvasElement, 'button');
	},
	parameters: story('Play: клавиатурный фокус (`:focus-visible`) открывает подсказку.'),
};

export const UsageExample: TooltipStory = {
	render: () => (
		<div style={{
			maxWidth: 400,
			paddingTop: 48
		}}
		>
			<Card>
				<Stack gap='md'>
					<Inline gap='sm' align='center'>
						<Text size='sm' weight='medium'>
							API-ключ
						</Text>
						<Tooltip
							content='Ключ даёт доступ только к чтению метрик. Не публикуйте его в репозитории.'
							side='top'
						>
							<ButtonIcon
								variant='ghost'
								size='sm'
								icon={<IconHelp size={16}/>}
								aria-label='Подсказка про API-ключ'
							/>
						</Tooltip>
					</Inline>
					<TextField
						label='Ключ'
						defaultValue='altum_live_••••'
						width='full'
					/>
				</Stack>
			</Card>
		</div>
	),
	parameters: story('Подсказка у лейбла поля в карточке настроек.'),
};
