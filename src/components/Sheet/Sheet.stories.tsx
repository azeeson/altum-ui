import type {Meta} from '@storybook/react';
import React, {useRef, useState} from 'react';
import {Sheet, SheetProps} from './Sheet';
import {Button} from '../Button/Button';
import {Badge} from '../Badge/Badge';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Sheet',
	component: Sheet,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Универсальная панель: составной API (`Sheet.Header` / `Title` / `Body` / `Footer`); `mode` (auto / sidebar / sheet), `direction`, Backdrop.',
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
		backdrop: {
			control: 'boolean',
			description: 'Показывать Backdrop',
		},
		zIndexTier: {
			control: {
				type: 'select',
				options: [
					'overlay',
					'modal',
					'dropdown',
					'lightbox',
					'notification'
				],
			},
			description:
				'Слой z-index (дефолт overlay = между chrome и Modal). notification — панель над Modal; меню внутри поднимаются автоматически.',
		},
		zIndex: {
			control: 'number',
			description: 'Сырой z-index (перебивает zIndexTier)',
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
						<Sheet.Title>
							Действия
						</Sheet.Title>
					</Sheet.Header>
					<Sheet.Body>
						<Text size='md'>
							Режим, направление и backdrop настраиваются в Controls.
						</Text>
					</Sheet.Body>
				</Sheet>
			</>
		);
	},
	args: {
		mode: 'sheet',
		direction: 'end',
		backdrop: false,
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
					backdrop={false}
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
						<Sheet.Title>
							Фильтры
						</Sheet.Title>
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
					backdrop={false}
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
					backdrop={false}
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
					backdrop={false}
				>
					<Sheet.Header>
						<Sheet.Title>
							Выберите город
						</Sheet.Title>
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
					backdrop={false}
					showHandle
				>
					<Sheet.Header>
						<Sheet.Title>
							Нижняя панель
						</Sheet.Title>
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
					ref={sheetRef}
					open={isOpen}
					onOpenChange={setIsOpen}
					mode='sheet'
					backdrop={false}
					data-testid='sheet-panel'
				>
					<Sheet.Header>
						<Sheet.Title>
							Ref доступен
						</Sheet.Title>
					</Sheet.Header>
					<Sheet.Body>
						<Text size='md'>
							ref указывает на корневой элемент панели (role=&quot;dialog&quot;).
						</Text>
					</Sheet.Body>
				</Sheet>
			</>
		);
	},
	parameters: story('Демонстрация forwardRef на корневой элемент Sheet.'),
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
						<Sheet.Title>
							Навигация
						</Sheet.Title>
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
					backdrop
				>
					<Sheet.Header showClose>
						<Sheet.Title>
							Адаптивная панель
						</Sheet.Title>
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
					С backdrop
				</Button>
				<Sheet
					open={isOpen}
					onOpenChange={setIsOpen}
					mode='sheet'
					direction='end'
					backdrop
				>
					<Sheet.Header showClose>
						<Sheet.Title>
							Подтверждение
						</Sheet.Title>
					</Sheet.Header>
					<Sheet.Body>
						<Text size='md'>
							Backdrop затемняет фон; клик по scrim закрывает панель.
						</Text>
					</Sheet.Body>
				</Sheet>
			</>
		);
	},
	parameters: story('`backdrop={true}` — scrim под панелью.'),
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
					backdrop
				>
					<Sheet.Header showClose>
						<Sheet.Title>
							Уведомления
						</Sheet.Title>
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
					backdrop
				>
					<Sheet.Header variant='plain' showClose>
						<Badge
							variant='info'
							size='sm'
							label='Черновик'
						/>
						<Sheet.Title>
							Карточка сделки
						</Sheet.Title>
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
				backdrop
			>
				<Sheet.Header showClose>
					<Sheet.Title>
						Пустая панель
					</Sheet.Title>
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
				backdrop
			>
				<Sheet.Header showClose>
					<Sheet.Title>
						Очень длинный заголовок нижней панели фильтров и дополнительных параметров отчёта
					</Sheet.Title>
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
						<Sheet.Title>
							Действия
						</Sheet.Title>
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
