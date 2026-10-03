import type {Meta} from '@storybook/react';
import React, {useRef, useState} from 'react';
import {Sheet, SheetProps} from './Sheet';
import {Button} from '../Button/Button';
import {Badge} from '../Badge/Badge';
import {Text} from '../Text/Text';
import {Title} from '../Title/Title';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Sheet',
	component: Sheet,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Универсальная панель: `Sheet.Header` / `Body` / `Footer`, заголовок — `Title`. `mode` (auto / sidebar / sheet), `direction`. Подложка — нативный dialog.',
	),
	argTypes: {
		mode: {
			control: {
				type: 'select',
				options: ['auto', 'sidebar', 'sheet']
			},
			description: 'Режим панели',
		},
		direction: {
			control: {
				type: 'select',
				options: ['start', 'end']
			},
			description: 'Сторона: start = left/top, end = right/bottom',
		},
	},
} satisfies Meta<typeof Sheet>;

export const Playground: Story<SheetProps> = {
	render: function PlaygroundRender(args) {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<>
				<Button variant='primary' onClick={() => setIsOpen(true)}>
					Открыть Sheet
				</Button>
				<Sheet
					{...args}
					open={isOpen}
					onOpenChange={setIsOpen}
				>
					<Sheet.Header>
						<Title level={3}>
							Действия
						</Title>
					</Sheet.Header>
					<Sheet.Body>
						<Text size='md'>
							Режим и направление настраиваются в Controls.
						</Text>
					</Sheet.Body>
				</Sheet>
			</>
		);
	},
	args: {
		mode: 'sheet',
		direction: 'end',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const WithControls: Story<SheetProps> = {
	render: function WithControlsRender() {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<>
				<Button variant='secondary' onClick={() => setIsOpen(true)}>
					Фильтры
				</Button>
				<Sheet
					open={isOpen}
					onOpenChange={setIsOpen}
					mode='sheet'
				>
					<Sheet.Header
						leftControls={(
							<Button
								variant='secondary'
								size='sm'
								onClick={() => setIsOpen(false)}
							>
								Назад
							</Button>
						)}
						rightControls={(
							<Button
								variant='primary'
								size='sm'
								onClick={() => setIsOpen(false)}
							>
								Применить
							</Button>
						)}
					>
						<Title level={3}>
							Фильтры
						</Title>
					</Sheet.Header>
					<Sheet.Body>
						<div style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 'var(--altum-g-space-3)'
						}}
						>
							<Text size='sm'>
								Статус: активные
							</Text>
							<Text size='sm'>
								Период: последние 7 дней
							</Text>
							<Text size='sm'>
								Сортировка: по дате
							</Text>
						</div>
					</Sheet.Body>
				</Sheet>
			</>
		);
	},
	parameters: story('Контроллеры слева и справа, заголовок по центру.'),
};

export const WithoutTitle: Story<SheetProps> = {
	render: function WithoutTitleRender() {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<>
				<Button variant='secondary' onClick={() => setIsOpen(true)}>
					Поделиться
				</Button>
				<Sheet
					open={isOpen}
					onOpenChange={setIsOpen}
					mode='sheet'
				>
					<Sheet.Body>
						<div style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 'var(--altum-g-space-3)'
						}}
						>
							<Text size='md' weight='medium'>
								Поделиться ссылкой
							</Text>
							<Text size='sm' color='muted'>
								Без шапки: только `Sheet.Body` — контент без chrome.
							</Text>
							<Button
								variant='primary'
								fullWidth
								onClick={() => setIsOpen(false)}
							>
								Скопировать ссылку
							</Button>
							<Button
								variant='secondary'
								fullWidth
								onClick={() => setIsOpen(false)}
							>
								Отмена
							</Button>
						</div>
					</Sheet.Body>
				</Sheet>
			</>
		);
	},
	parameters: story('Sheet без Header — только `Sheet.Body`.'),
};

export const ControlsOnly: Story<SheetProps> = {
	render: function ControlsOnlyRender() {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<>
				<Button variant='secondary' onClick={() => setIsOpen(true)}>
					Быстрые действия
				</Button>
				<Sheet
					open={isOpen}
					onOpenChange={setIsOpen}
					mode='sheet'
				>
					<Sheet.Header
						leftControls={(
							<Text size='sm' weight='medium'>
								Шаг 1 из 2
							</Text>
						)}
					/>
					<Sheet.Body>
						<Text size='md'>
							Header с side slots без Title — контроллеры по бокам.
						</Text>
					</Sheet.Body>
				</Sheet>
			</>
		);
	},
	parameters: story('`Sheet.Header` с `leftControls` / `rightControls` без `Title`.'),
};

export const LongContent: Story<SheetProps> = {
	render: function LongContentRender() {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<>
				<Button variant='primary' onClick={() => setIsOpen(true)}>
					Длинный список
				</Button>
				<Sheet
					open={isOpen}
					onOpenChange={setIsOpen}
					mode='sheet'
				>
					<Sheet.Header>
						<Title level={3}>
							Выберите город
						</Title>
					</Sheet.Header>
					<Sheet.Body>
						<div style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 'var(--altum-g-space-2)'
						}}
						>
							{[
								'Москва',
								'Санкт-Петербург',
								'Новосибирск',
								'Екатеринбург',
								'Казань',
								'Нижний Новгород',
								'Красноярск',
								'Челябинск',
								'Самара',
								'Уфа',
								'Ростов-на-Дону',
								'Краснодар',
								'Воронеж',
								'Пермь',
								'Волгоград',
							].map((city) => (
								<Button
									key={city}
									variant='secondary'
									fullWidth
									onClick={() => setIsOpen(false)}
								>
									{city}
								</Button>
							))}
						</div>
					</Sheet.Body>
				</Sheet>
			</>
		);
	},
	parameters: story('При переполнении появляется вертикальный скролл внутри Sheet.'),
};

export const WithHandle: Story<SheetProps> = {
	render: function WithHandleRender() {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<>
				<Button variant='primary' onClick={() => setIsOpen(true)}>
					Sheet с handle
				</Button>
				<Sheet
					open={isOpen}
					onOpenChange={setIsOpen}
					mode='sheet'
					showHandle
				>
					<Sheet.Header>
						<Title level={3}>
							Нижняя панель
						</Title>
					</Sheet.Header>
					<Sheet.Body>
						<Text size='md'>
							Ручка сверху — iOS-affordance для нижней панели.
						</Text>
					</Sheet.Body>
				</Sheet>
			</>
		);
	},
	parameters: story('Опциональный `showHandle` — визуальная полоска сверху.'),
};

export const WithRef: Story<SheetProps> = {
	render: function WithRefRender() {
		const [isOpen, setIsOpen] = useState(false);
		const sheetRef = useRef<HTMLDivElement>(null);

		return (
			<>
				<Button
					variant='secondary'
					onClick={() => {
						setIsOpen(true);
						queueMicrotask(() => {
							sheetRef.current?.scrollIntoView({block: 'nearest'});
						});
					}}
				>
					Открыть с ref
				</Button>
				<Sheet
					rootRef={sheetRef}
					open={isOpen}
					onOpenChange={setIsOpen}
					mode='sheet'
					data-testid='sheet-panel'
				>
					<Sheet.Header>
						<Title level={3}>
							Ref доступен
						</Title>
					</Sheet.Header>
					<Sheet.Body>
						<Text size='md'>
							rootRef указывает на поверхность панели.
						</Text>
					</Sheet.Body>
				</Sheet>
			</>
		);
	},
	parameters: story('Демонстрация rootRef на поверхность Sheet.'),
};

export const SidebarMode: Story<SheetProps> = {
	render: function SidebarModeRender() {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<>
				<Button variant='primary' onClick={() => setIsOpen(true)}>
					Открыть sidebar
				</Button>
				<Sheet
					open={isOpen}
					onOpenChange={setIsOpen}
					mode='sidebar'
					direction='start'
					width={320}
				>
					<Sheet.Header showClose>
						<Title level={3}>
							Навигация
						</Title>
					</Sheet.Header>
					<Sheet.Body>
						<Text size='md'>
							Боковая панель на базе Sheet (`mode=&quot;sidebar&quot;`).
						</Text>
					</Sheet.Body>
				</Sheet>
			</>
		);
	},
	parameters: story('`mode="sidebar"` + `direction="start"` — выезд слева.'),
};

export const AutoMode: Story<SheetProps> = {
	render: function AutoModeRender() {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<>
				<Button variant='secondary' onClick={() => setIsOpen(true)}>
					Открыть auto
				</Button>
				<Sheet
					open={isOpen}
					onOpenChange={setIsOpen}
					mode='auto'
				>
					<Sheet.Header showClose>
						<Title level={3}>
							Адаптивная панель
						</Title>
					</Sheet.Header>
					<Sheet.Body>
						<Text size='md'>
							`mode=&quot;auto&quot;`: на mobile — sheet снизу, на desktop — sidebar слева.
							Измените ширину viewport в Storybook, чтобы увидеть переключение.
						</Text>
					</Sheet.Body>
				</Sheet>
			</>
		);
	},
	parameters: story('`mode="auto"` — sheet на mobile, sidebar на desktop.'),
};

export const WithBackdrop: Story<SheetProps> = {
	render: function WithBackdropRender() {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<>
				<Button variant='primary' onClick={() => setIsOpen(true)}>
					Открыть
				</Button>
				<Sheet
					open={isOpen}
					onOpenChange={setIsOpen}
					mode='sheet'
					direction='end'
				>
					<Sheet.Header showClose>
						<Title level={3}>
							Подтверждение
						</Title>
					</Sheet.Header>
					<Sheet.Body>
						<Text size='md'>
							Клик по подложке и Escape закрывают панель.
						</Text>
					</Sheet.Body>
				</Sheet>
			</>
		);
	},
	parameters: story('Подложка dialog затемняет фон, клик по ней закрывает панель.'),
};

export const TopSheet: Story<SheetProps> = {
	render: function TopSheetRender() {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<>
				<Button variant='primary' onClick={() => setIsOpen(true)}>
					Верхний sheet
				</Button>
				<Sheet
					open={isOpen}
					onOpenChange={setIsOpen}
					mode='sheet'
					direction='start'
				>
					<Sheet.Header showClose>
						<Title level={3}>
							Уведомления
						</Title>
					</Sheet.Header>
					<Sheet.Body>
						<Text size='md'>
							`mode=&quot;sheet&quot;` + `direction=&quot;start&quot;` — выезд сверху.
						</Text>
					</Sheet.Body>
				</Sheet>
			</>
		);
	},
	parameters: story('Верхний sheet: `mode="sheet"` + `direction="start"`.'),
};

export const CompoundSlots: Story<SheetProps> = {
	render: function CompoundSlotsRender() {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<>
				<Button variant='primary' onClick={() => setIsOpen(true)}>
					Составной Sheet
				</Button>
				<Sheet
					open={isOpen}
					onOpenChange={setIsOpen}
					mode='sheet'
					direction='end'
					showHandle
				>
					<Sheet.Header variant='plain' showClose>
						<Badge
							variant='info'
							size='sm'
							label='Черновик'
						/>
						<Title level={3}>
							Карточка сделки
						</Title>
						<Button size='sm' variant='secondary'>
							В архив
						</Button>
					</Sheet.Header>
					<Sheet.Body padding={false}>
						<div style={{padding: 'var(--altum-g-space-4)'}}>
							<Text size='md'>
								Свой chrome: Header / Body / Footer. Body с padding=false — во всю ширину.
							</Text>
						</div>
						<div
							style={{
								height: 120,
								background: 'var(--altum-color-option-hover)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Text size='sm' color='secondary'>
								Блок во всю ширину
							</Text>
						</div>
					</Sheet.Body>
					<Sheet.Footer>
						<Button variant='secondary' onClick={() => setIsOpen(false)}>
							Отмена
						</Button>
						<Button variant='primary' onClick={() => setIsOpen(false)}>
							Сохранить
						</Button>
					</Sheet.Footer>
				</Sheet>
			</>
		);
	},
	parameters: story(
		'Составной: `Header` (plain) + `Body padding={false}` + `Footer`.',
	),
};

export const Empty: Story<SheetProps> = {
	render: function EmptyRender() {
		const [isOpen, setIsOpen] = useState(true);
		return (
			<Sheet
				open={isOpen}
				onOpenChange={setIsOpen}
				mode='sheet'
			>
				<Sheet.Header showClose>
					<Title level={3}>
						Пустая панель
					</Title>
				</Sheet.Header>
				<Sheet.Body>
					<Text size='md' color='muted'>
						Контента пока нет.
					</Text>
				</Sheet.Body>
			</Sheet>
		);
	},
	parameters: story('Открытый Sheet без полезной нагрузки.'),
};

export const OverflowText: Story<SheetProps> = {
	render: function OverflowTextRender() {
		const [isOpen, setIsOpen] = useState(true);
		return (
			<Sheet
				open={isOpen}
				onOpenChange={setIsOpen}
				mode='sheet'
			>
				<Sheet.Header showClose>
					<Title level={3}>
						Очень длинный заголовок нижней панели фильтров и дополнительных параметров отчёта
					</Title>
				</Sheet.Header>
				<Sheet.Body>
					<Text size='md'>
						Длинный заголовок и абзац проверяют перенос в chrome Sheet.
					</Text>
				</Sheet.Body>
			</Sheet>
		);
	},
	parameters: story('Длинный Title в шапке Sheet.'),
};

export const Interaction: Story<SheetProps> = {
	render: function InteractionRender() {
		const [isOpen, setIsOpen] = useState(false);
		return (
			<>
				<Button variant='primary' onClick={() => setIsOpen(true)}>
					Открыть Sheet
				</Button>
				<Sheet
					open={isOpen}
					onOpenChange={setIsOpen}
					mode='sheet'
					direction='end'
				>
					<Sheet.Header>
						<Title level={3}>
							Действия
						</Title>
					</Sheet.Header>
					<Sheet.Body>
						<Text size='md'>
							Панель открыта сценарием play.
						</Text>
					</Sheet.Body>
				</Sheet>
			</>
		);
	},
	play: async ({canvasElement}) => {
		const trigger = canvasElement.querySelector('button');
		trigger?.click();
	},
	parameters: story('Play: клик по триггеру открывает Sheet.'),
};
