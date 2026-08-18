import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Accordion, type AccordionProps} from './Accordion';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Accordion',
	component: Accordion,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Составной: `Accordion` / `Item` / `Trigger` / `Content`. Одиночное или множественное раскрытие.',
	),
	argTypes: {
		multiple: {
			control: 'boolean',
			description: 'Разрешить раскрытие нескольких секций одновременно',
		},
	},
} satisfies Meta<typeof Accordion>;

function DemoItems() {
	return (
		<>
			<Accordion.Item value='1'>
				<Accordion.Trigger>
					Как изменить тарифный план?
				</Accordion.Trigger>
				<Accordion.Content>
					Вы можете изменить тариф во вкладке Настроек профиля.
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value='2'>
				<Accordion.Trigger>
					Есть ли бесплатный период?
				</Accordion.Trigger>
				<Accordion.Content>
					Да, все аккаунты получают бесплатный период Pro на 14 дней.
				</Accordion.Content>
			</Accordion.Item>
		</>
	);
}

export const Playground: Story<AccordionProps> = {
	args: {
		multiple: false,
	},
	render: (args) => (
		<Accordion {...args}>
			<DemoItems />
		</Accordion>
	),
	parameters: story('Используйте панель Controls для настройки.'),
};

export const MultipleExpanded: Story<AccordionProps> = {
	render: () => (
		<Accordion multiple defaultOpenIds={['a', 'b']}>
			<Accordion.Item value='a'>
				<Accordion.Trigger>
					Где посмотреть историю оплат?
				</Accordion.Trigger>
				<Accordion.Content>
					Во вкладке Транзакции в главном меню.
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value='b'>
				<Accordion.Trigger>
					Как связаться с поддержкой?
				</Accordion.Trigger>
				<Accordion.Content>
					Вы можете отправить тост-сообщение или написать на support@example.com.
				</Accordion.Content>
			</Accordion.Item>
		</Accordion>
	),
	parameters: story('Режим с одновременным раскрытием нескольких секций.'),
};

export const Flush: Story<AccordionProps> = {
	render: () => (
		<Accordion variant='flush'>
			<DemoItems />
		</Accordion>
	),
	parameters: story('`variant="flush"` — без внешней рамки контейнера.'),
};

export const Bordered: Story<AccordionProps> = {
	render: () => (
		<Accordion variant='bordered' defaultOpenIds={['1']}>
			<DemoItems />
		</Accordion>
	),
	parameters: story('`variant="bordered"` — карточка с рамкой (по умолчанию).'),
};

export const DisabledItem: Story<AccordionProps> = {
	render: () => (
		<Accordion>
			<Accordion.Item value='1'>
				<Accordion.Trigger>
					Доступный раздел
				</Accordion.Trigger>
				<Accordion.Content>
					Эту секцию можно раскрыть.
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value='2' disabled>
				<Accordion.Trigger>
					Недоступный раздел
				</Accordion.Trigger>
				<Accordion.Content>
					Контент скрыт — пункт disabled.
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value='3'>
				<Accordion.Trigger>
					Ещё один раздел
				</Accordion.Trigger>
				<Accordion.Content>
					Обычный пункт после disabled.
				</Accordion.Content>
			</Accordion.Item>
		</Accordion>
	),
	parameters: story('`Accordion.Item` с `disabled` не раскрывается.'),
};

export const Compound: Story<AccordionProps> = {
	render: () => (
		<Accordion>
			<Accordion.Item value='custom'>
				<Accordion.Trigger>
					Кастомная разметка в Content
				</Accordion.Trigger>
				<Accordion.Content>
					<div style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 8
					}}
					>
						<span>
							Любой React-узел внутри Content.
						</span>
						<button type='button'>
							Действие
						</button>
					</div>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion>
	),
	parameters: story('Сборка из частей без массива `items`.'),
};

export const Controlled: Story<AccordionProps> = {
	render: function ControlledRender() {
		const [openIds, setOpenIds] = useState<string[]>(['1']);
		return (
			<div style={{maxWidth: 480}}>
				<Accordion openIds={openIds} onOpenChange={setOpenIds}>
					<DemoItems />
				</Accordion>
				<pre style={{
					marginTop: 'var(--altum-g-space-3)',
					fontSize: 12,
					color: 'var(--altum-color-muted)',
				}}
				>
					openIds:
					{' '}
					{JSON.stringify(openIds)}
				</pre>
			</div>
		);
	},
	parameters: story('Контролируемый режим: `openIds` + `onOpenChange`.'),
};
