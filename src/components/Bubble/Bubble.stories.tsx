import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Bubble, BubbleProps} from './Bubble';
import {Stack} from '../Layout/Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

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

export const Thread: Story<BubbleProps> = {
	render: () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-1)',
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
		</div>
	),
	parameters: story(
		'Демо переписки: входящие/исходящие группы, реакции и сворачиваемый длинный текст.',
	),
};
