import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Bubble, BubbleProps} from './Bubble';
import {Avatar} from '../Avatar/Avatar';
import {Card} from '../Card/Card';
import {Inline, Stack} from '../Layout';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';
import {playClick} from '../../storybook/play';

const longMessage = [
	'Проверил все изменения в ветке feature/calendar-board.',
	'Основные правки — группировка событий, sticky-заголовки и адаптив на мобильных.',
	'Нужно ещё прогнать визуальные тесты и проверить тёмную тему.',
	'Если всё ок — можно мержить после ревью.',
].join(' ');

export default {
	title: 'altum/Components/Bubble',
	component: Bubble,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Пузырь сообщения в переписке: варианты, выравнивание, группировка, реакции и схлопывание.',
	),
	argTypes: {
		variant: {
			control: {
				type: 'select',
				options: [
					'default',
					'outgoing',
					'incoming',
					'system'
				],
			},
			description: 'Визуальный вариант пузыря',
		},
		align: {
			control: {
				type: 'select',
				options: ['start', 'end'],
			},
			description: 'Выравнивание в ленте',
		},
		group: {
			control: {
				type: 'select',
				options: [
					'single',
					'first',
					'middle',
					'last'
				],
			},
			description: 'Группировка соседних сообщений',
		},
		collapsible: {
			control: 'boolean',
			description: 'Сворачиваемый длинный контент',
		},
		collapsedLines: {
			control: 'number',
			description: 'Видимые строки в свёрнутом виде',
		},
		meta: {
			control: 'text',
		},
		children: {
			control: 'text',
		},
	},
} satisfies Meta<typeof Bubble>;

export const Playground: Story<BubbleProps> = {
	render: (args) => (
		<div style={{
			maxWidth: 360,
			padding: 'var(--altum-g-space-4)'
		}}
		>
			<Bubble {...args} />
		</div>
	),
	args: {
		variant: 'outgoing',
		meta: 'Вы · 10:05',
		children: 'Сообщение готово к отправке.',
		group: 'single',
		collapsible: false,
	},
	parameters: story('Базовый пузырь — настройка через Controls.'),
};

export const Variants: Story<BubbleProps> = {
	render: () => (
		<Stack
			gap='md'
			style={{
				maxWidth: 360,
				padding: 'var(--altum-g-space-4)'
			}}
		>
			<Bubble variant='default'>
				Нейтральный пузырь по умолчанию.
			</Bubble>
			<Bubble variant='incoming' meta='Алексей · 10:02'>
				Входящее сообщение.
			</Bubble>
			<Bubble variant='outgoing' meta='Вы · 10:05'>
				Исходящее сообщение.
			</Bubble>
			<Bubble variant='system'>
				Системное уведомление: пользователь присоединился к чату.
			</Bubble>
		</Stack>
	),
	parameters: story('Все варианты: default / incoming / outgoing / system.'),
};

export const Align: Story<BubbleProps> = {
	render: () => (
		<Stack
			gap='sm'
			style={{
				maxWidth: 360,
				padding: 'var(--altum-g-space-4)'
			}}
		>
			<Bubble variant='incoming' align='start'>
				Выравнивание start (слева).
			</Bubble>
			<Bubble variant='outgoing' align='end'>
				Выравнивание end (справа).
			</Bubble>
			<Bubble variant='incoming' align='end'>
				Incoming с явным align=&quot;end&quot;.
			</Bubble>
		</Stack>
	),
	parameters: story('Явное выравнивание `align`: start и end.'),
};

export const WithReactions: Story<BubbleProps> = {
	render: function WithReactionsRender() {
		const [active, setActive] = useState(true);
		return (
			<div style={{
				maxWidth: 360,
				padding: 'var(--altum-g-space-4)'
			}}
			>
				<Bubble
					variant='outgoing'
					meta='Вы · 10:05'
					reactions={[
						{
							emoji: '👍',
							count: 3,
							active,
							onClick: () => setActive((value) => !value),
						},
						{
							emoji: '🔥',
							count: 1
						},
						{
							emoji: '✅',
							count: 2
						},
					]}
				>
					Готово к ревью — посмотри, пожалуйста.
				</Bubble>
			</div>
		);
	},
	parameters: story('Реакции под пузырём с toggle по клику.'),
};

export const Collapsible: Story<BubbleProps> = {
	render: () => (
		<div style={{
			maxWidth: 360,
			padding: 'var(--altum-g-space-4)'
		}}
		>
			<Bubble
				variant='outgoing'
				collapsible
				collapsedLines={3}
			>
				{longMessage}
			</Bubble>
		</div>
	),
	parameters: story('Длинный текст свёрнут до `collapsedLines`.'),
};

export const Thread: Story<BubbleProps> = {
	render: () => (
		<Stack
			gap='none'
			style={{
				maxWidth: 360,
				padding: 'var(--altum-g-space-4)',
			}}
		>
			<Bubble
				variant='incoming'
				group='first'
				meta='Алексей · 10:02'
			>
				Привет! Как продвигается ревью?
			</Bubble>
			<Bubble variant='incoming' group='last'>
				Жду фидбек по календарю.
			</Bubble>
			<Bubble
				variant='outgoing'
				group='first'
				meta='Вы · 10:05'
				reactions={[
					{
						emoji: '👍',
						count: 1
					},
					{
						emoji: '✅',
						count: 1,
						active: true
					},
				]}
			>
				Почти готово — осталось проверить тёмную тему.
			</Bubble>
			<Bubble
				variant='outgoing'
				group='last'
				collapsible
				collapsedLines={3}
			>
				{longMessage}
			</Bubble>
		</Stack>
	),
	parameters: story(
		'Демо переписки: входящие/исходящие группы, реакции и сворачиваемый длинный текст.',
	),
};

export const Interaction: Story<BubbleProps> = {
	render: function InteractionRender() {
		const [active, setActive] = useState(false);
		return (
			<div style={{
				maxWidth: 360,
				padding: 'var(--altum-g-space-4)'
			}}
			>
				<Bubble
					variant='outgoing'
					collapsible
					collapsedLines={2}
					reactions={[
						{
							emoji: '👍',
							count: active ? 2 : 1,
							active,
							onClick: () => setActive((value) => !value),
						},
					]}
				>
					{longMessage}
				</Bubble>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playClick(canvasElement, 'button[aria-expanded="false"]');
		await playClick(canvasElement, 'button[aria-pressed]');
	},
	parameters: story('Play: раскрыть длинный текст и переключить реакцию.'),
};

export const UsageExample: Story<BubbleProps> = {
	render: () => (
		<div style={{maxWidth: 400}}>
			<Card>
				<Stack gap='md'>
					<Inline gap='sm' align='center'>
						<Avatar
							name='Алексей Иванов'
							size='sm'
							status='online'
						/>
						<Text size='sm' weight='medium'>
							Алексей Иванов
						</Text>
					</Inline>
					<Stack gap='xs'>
						<Bubble variant='incoming' group='first'>
							Можешь глянуть PR?
						</Bubble>
						<Bubble
							variant='incoming'
							group='last'
							meta='10:02'
						>
							Там правки по Accordion и Tooltip.
						</Bubble>
						<Bubble variant='outgoing' meta='Вы · 10:05'>
							Смотрю — напишу в треде.
						</Bubble>
					</Stack>
				</Stack>
			</Card>
		</div>
	),
	parameters: story('Чат в карточке: аватар собеседника и лента пузырей.'),
};
