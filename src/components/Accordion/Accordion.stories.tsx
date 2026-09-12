import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Accordion, type AccordionProps} from './Accordion';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {Title} from '../Title/Title';
import {componentParameters, story, Story} from '../../storybook/meta';
import {playClick} from '../../storybook/play';

export default {
	title: 'altum/Components/Accordion',
	component: Accordion,
	tags: ['autodocs'],
	parameters: componentParameters(
		'`Accordion.Item` с `title` и содержимым в `children`. Одиночное или множественное раскрытие.',
	),
	argTypes: {
		multiple: {
			control: 'boolean',
			description: 'Разрешить раскрытие нескольких секций одновременно',
		},
		variant: {
			control: {
				type: 'select',
				options: ['flush', 'bordered'],
			},
			description: 'Chrome контейнера',
		},
		onOpenChange: {
			action: 'openChange',
			description: 'Колбэк смены открытых id',
		},
	},
} satisfies Meta<typeof Accordion>;

function DemoItems() {
	return (
		<>
			<Accordion.Item value='1' title='Как изменить тарифный план?'>
				Вы можете изменить тариф во вкладке Настроек профиля.
			</Accordion.Item>
			<Accordion.Item value='2' title='Есть ли бесплатный период?'>
				Да, все аккаунты получают бесплатный период Pro на 14 дней.
			</Accordion.Item>
		</>
	);
}

export const Playground: Story<AccordionProps> = {
	args: {
		multiple: false,
		variant: 'flush',
	},
	render: (args) => (
		<div style={{maxWidth: 480}}>
			<Accordion {...args}>
				<DemoItems />
			</Accordion>
		</div>
	),
	parameters: story('Используйте панель Controls для настройки.'),
};

export const MultipleExpanded: Story<AccordionProps> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<Accordion multiple defaultOpenIds={['a', 'b']}>
				<Accordion.Item value='a' title='Где посмотреть историю оплат?'>
					Во вкладке Транзакции в главном меню.
				</Accordion.Item>
				<Accordion.Item value='b' title='Как связаться с поддержкой?'>
					Вы можете отправить тост-сообщение или написать на support@example.com.
				</Accordion.Item>
			</Accordion>
		</div>
	),
	parameters: story('Режим с одновременным раскрытием нескольких секций.'),
};

export const Flush: Story<AccordionProps> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<Accordion variant='flush' defaultOpenIds={['1']}>
				<DemoItems />
			</Accordion>
		</div>
	),
	parameters: story('`variant="flush"` — без внешней рамки (по умолчанию).'),
};

export const Bordered: Story<AccordionProps> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<Accordion variant='bordered' defaultOpenIds={['1']}>
				<DemoItems />
			</Accordion>
		</div>
	),
	parameters: story('`variant="bordered"` — карточки с рамкой.'),
};

export const DisabledItem: Story<AccordionProps> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<Accordion defaultOpenIds={['1']}>
				<Accordion.Item value='1' title='Доступный раздел'>
					Эту секцию можно раскрыть.
				</Accordion.Item>
				<Accordion.Item
					value='2'
					title='Недоступный раздел'
					disabled
				>
					Контент скрыт — пункт disabled.
				</Accordion.Item>
				<Accordion.Item value='3' title='Ещё один раздел'>
					Обычный пункт после disabled.
				</Accordion.Item>
			</Accordion>
		</div>
	),
	parameters: story('`Accordion.Item` с `disabled` не раскрывается.'),
};

export const OverflowText: Story<AccordionProps> = {
	render: () => (
		<div style={{maxWidth: 320}}>
			<Accordion defaultOpenIds={['long']}>
				<Accordion.Item
					value='long'
					title='Как перенести подписку на другой аккаунт, если текущий email больше не используется и нет доступа к почте?'
				>
					<Text as='p' size='sm'>
						Очень длинный ответ: напишите в поддержку с подтверждением личности,
						укажите номер договора и последние четыре цифры карты, с которой
						списывалась оплата. Срок обработки — до трёх рабочих дней.
					</Text>
				</Accordion.Item>
			</Accordion>
		</div>
	),
	parameters: story('Длинный заголовок и текст в узком контейнере.'),
};

export const Compound: Story<AccordionProps> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<Accordion>
				<Accordion.Item value='custom' title='Кастомная разметка в Content'>
					<Stack gap='sm'>
						<Text size='sm'>
							Любой React-узел внутри Content.
						</Text>
						<Button
							type='button'
							size='sm'
							variant='secondary'
						>
							Действие
						</Button>
					</Stack>
				</Accordion.Item>
			</Accordion>
		</div>
	),
	parameters: story('Сборка из частей без массива `items`.'),
};

export const Controlled: Story<AccordionProps> = {
	render: function ControlledRender() {
		const [openIds, setOpenIds] = useState<string[]>(['1']);
		return (
			<Stack gap='sm' style={{maxWidth: 480}}>
				<Accordion openIds={openIds} onOpenChange={setOpenIds}>
					<DemoItems />
				</Accordion>
				<Text size='xs' color='muted'>
					openIds:
					{' '}
					{JSON.stringify(openIds)}
				</Text>
			</Stack>
		);
	},
	parameters: story('Контролируемый режим: `openIds` + `onOpenChange`.'),
};

export const Interaction: Story<AccordionProps> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<Accordion>
				<DemoItems />
			</Accordion>
		</div>
	),
	play: async ({canvasElement}) => {
		await playClick(canvasElement, 'button[aria-expanded="false"]');
	},
	parameters: story('Play: клик по первому триггеру раскрывает секцию.'),
};

export const UsageExample: Story<AccordionProps> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<Card
				header={(
					<Title level={3}>
						Частые вопросы
					</Title>
				)}
			>
				<Accordion variant='flush'>
					<Accordion.Item value='billing' title='Когда списывается оплата?'>
						<Text
							as='p'
							size='sm'
							color='secondary'
						>
							Списание в день продления. За 3 дня приходит письмо-напоминание.
						</Text>
					</Accordion.Item>
					<Accordion.Item value='cancel' title='Как отменить подписку?'>
						<Stack gap='sm'>
							<Text
								as='p'
								size='sm'
								color='secondary'
							>
								В разделе «Тариф» нажмите «Отменить». Доступ сохранится до конца периода.
							</Text>
							<Button size='sm' variant='secondary'>
								Открыть тариф
							</Button>
						</Stack>
					</Accordion.Item>
				</Accordion>
			</Card>
		</div>
	),
	parameters: story('FAQ внутри Card: заголовок, секции и действие в контенте.'),
};
