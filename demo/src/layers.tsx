import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
	Button,
	Checkbox,
	ControlRow,
	Inline,
	Layout,
	Link,
	LocaleProvider,
	Menu,
	Modal,
	NumberField,
	RadioGroup,
	SearchField,
	Select,
	Sheet,
	Stack,
	Switch,
	Text,
	TextField,
	TextareaField,
	ThemeProvider,
	Title,
	Tooltip,
	useTheme,
	type Theme,
} from 'altum';
import './demo.css';
import './layers.css';

const DEPARTMENTS = [
	{
		value: 'support',
		label: 'Поддержка',
	},
	{
		value: 'billing',
		label: 'Оплата',
	},
	{
		value: 'product',
		label: 'Продукт',
	},
];

const CHANNELS = [
	{
		value: 'mail',
		label: 'Почта',
	},
	{
		value: 'chat',
		label: 'Чат',
	},
	{
		value: 'phone',
		label: 'Телефон',
	},
];

const MENU_ITEMS = [
	{
		id: 'duplicate',
		label: 'Дублировать',
	},
	{
		id: 'archive',
		label: 'В архив',
	},
	{
		type: 'separator' as const,
	},
	{
		id: 'delete',
		label: 'Удалить',
		tone: 'danger' as const,
	},
];

function ThemeSwitch() {
	const {theme, setTheme} = useTheme();

	return (
		<SegmentedTheme theme={theme} setTheme={setTheme} />
	);
}

function SegmentedTheme({
	theme,
	setTheme,
}: {
	theme: Theme;
	setTheme: (next: Theme) => void;
}) {
	return (
		<Inline gap='sm' wrap>
			<Button
				variant={theme === 'light' ? 'primary' : 'secondary'}
				size='sm'
				onClick={() => setTheme('light')}
			>
				Light
			</Button>
			<Button
				variant={theme === 'dark' ? 'primary' : 'secondary'}
				size='sm'
				onClick={() => setTheme('dark')}
			>
				Dark
			</Button>
		</Inline>
	);
}

function Hint({
	content,
	side = 'top',
	children,
}: {
	content: string;
	side?: 'top' | 'bottom' | 'left' | 'right';
	children: React.ReactElement;
}) {
	return (
		<Tooltip
			content={content}
			side={side}
			openDelay={120}
		>
			{children}
		</Tooltip>
	);
}

function LayersPage() {
	const [sheetOpen, setSheetOpen] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [name, setName] = useState('');
	const [note, setNote] = useState('');
	const [query, setQuery] = useState('');
	const [amount, setAmount] = useState<number | undefined>(1);
	const [department, setDepartment] = useState('support');
	const [channel, setChannel] = useState('mail');
	const [priority, setPriority] = useState('normal');
	const [agree, setAgree] = useState(false);
	const [notify, setNotify] = useState(true);
	const [action, setAction] = useState('Не выбрано');
	const [saved, setSaved] = useState(false);

	return (
		<Layout padding='lg' gap='lg'>
			<ControlRow justify='between' wrap>
				<Stack gap='xs'>
					<Title level={2}>
						Слои
					</Title>
					<Text
						color='secondary'
						size='sm'
						className='lead'
					>
						Панель, подсказки внутри
						{' '}
						<code>
							overflow: hidden
						</code>
						, и форма в модальном окне поверх панели.
					</Text>
					<Link href='/' size='sm'>
						К общему demo
					</Link>
				</Stack>
				<ThemeSwitch />
			</ControlRow>

			<Button variant='primary' onClick={() => setSheetOpen(true)}>
				Открыть Sheet
			</Button>

			<Sheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				mode='sheet'
				showHandle
				height='min(760px, 88vh)'
				aria-label='Карточка обращения'
			>
				<Sheet.Header>
					<Title level={3}>
						Обращение
					</Title>
				</Sheet.Header>
				<Sheet.Body>
					<Stack gap='md'>
						<Text size='sm' color='secondary'>
							Подсказки открываются из обрезанных контейнеров и не должны оставаться внутри рамки.
						</Text>

						<div className='clip clipShort'>
							<div className='clipInner'>
								<Hint content='Подсказка над верхним краем обрезанного блока.' side='top'>
									<Button size='sm' variant='secondary'>
										Сверху, у края
									</Button>
								</Hint>
								<Hint content='Подсказка справа: блок режет содержимое, пузырь остаётся снаружи.' side='right'>
									<Button size='sm' variant='tinted'>
										Справа
									</Button>
								</Hint>
								<Hint content='Эта кнопка ниже видимой области. Подсказка всё равно в top layer.' side='bottom'>
									<Button size='sm' variant='ghost'>
										Ниже сгиба
									</Button>
								</Hint>
							</div>
						</div>

						<div className='clip clipRow'>
							<div className='clipRowInner'>
								<Hint content='Узкая лента скрывает хвост, подсказка не обрезается.' side='top'>
									<Button size='sm' variant='secondary'>
										Видимая
									</Button>
								</Hint>
								<Hint content='Кнопка у правого среза ленты.' side='bottom'>
									<Button size='sm' variant='secondary'>
										У среза
									</Button>
								</Hint>
								<Button size='sm' variant='ghost'>
									Спрятана лентой
								</Button>
							</div>
						</div>
					</Stack>
				</Sheet.Body>
				<Sheet.Footer align='space-between'>
					<Button variant='secondary' onClick={() => setSheetOpen(false)}>
						Закрыть
					</Button>
					<Hint content='Модальное окно открывается поверх Sheet.' side='top'>
						<Button variant='primary' onClick={() => setModalOpen(true)}>
							Открыть форму
						</Button>
					</Hint>
				</Sheet.Footer>
			</Sheet>

			<Modal
				open={modalOpen}
				onOpenChange={setModalOpen}
				size='lg'
				aria-label='Новая заявка'
				showClose
			>
				<Modal.Header>
					<Modal.Header.Title level={3}>
						Новая заявка
					</Modal.Header.Title>
				</Modal.Header>
				<Modal.Body>
					<form
						onSubmit={(event) => {
							event.preventDefault();
							setSaved(true);
						}}
					>
						<div className='formClip'>
							<Stack gap='md'>
								<Text size='sm' color='secondary'>
									Поля, списки и подсказки лежат в контейнере с
									{' '}
									<code>
										overflow: hidden
									</code>
									.
								</Text>
								<div className='hintRow'>
									<Text size='sm' weight='medium'>
										Контакт
									</Text>
									<Hint content='Имя попадёт в карточку обращения.' side='right'>
										<Button
											size='sm'
											variant='ghost'
											type='button'
											aria-label='Подсказка про имя'
										>
											?
										</Button>
									</Hint>
								</div>
								<TextField
									label='Имя'
									value={name}
									onChange={(event) => setName(event.target.value)}
									width='full'
								/>
								<SearchField
									label='Поиск по базе'
									value={query}
									onChange={(event) => setQuery(event.target.value)}
									width='full'
								/>
								<TextareaField
									label='Комментарий'
									value={note}
									onChange={(event) => setNote(event.target.value)}
									minRows={3}
									width='full'
								/>
								<div className='clipField'>
									<div className='hintRow'>
										<div className='grow'>
											<Select
												label='Отдел'
												options={DEPARTMENTS}
												value={department}
												onChange={(value) => setDepartment(String(value))}
												width='full'
											/>
										</div>
										<Hint content='Список Select открывается поверх обрезанного блока и поверх Sheet.' side='top'>
											<Button
												size='sm'
												variant='ghost'
												type='button'
												aria-label='Подсказка про отдел'
											>
												?
											</Button>
										</Hint>
									</div>
								</div>
								<Select
									label='Канал'
									options={CHANNELS}
									value={channel}
									onChange={(value) => setChannel(String(value))}
									width='full'
								/>
								<NumberField
									label='Количество'
									value={amount}
									min={1}
									max={99}
									onChange={setAmount}
									width='full'
								/>
								<RadioGroup
									name='priority'
									label='Приоритет'
									orientation='horizontal'
									value={priority}
									onChange={setPriority}
									options={[
										{
											value: 'low',
											label: 'Низкий',
										},
										{
											value: 'normal',
											label: 'Обычный',
										},
										{
											value: 'high',
											label: 'Высокий',
										},
									]}
								/>
								<Inline gap='md' wrap>
									<Checkbox
										label='Согласен с условиями'
										checked={agree}
										onCheckedChange={setAgree}
									/>
									<Switch
										label='Уведомить отдел'
										checked={notify}
										onChange={setNotify}
									/>
								</Inline>
								<div className='clipField'>
									<div className='hintRow'>
										<Hint content='Menu — команды, не выбор значения. Панель тоже вне overflow.' side='top'>
											<Menu
												trigger={(
													<Button
														type='button'
														variant='secondary'
														size='sm'
													>
														Действия
													</Button>
												)}
												items={MENU_ITEMS}
												onAction={(item) => setAction(String(item.label))}
											/>
										</Hint>
										<Text size='sm' color='secondary'>
											{action}
										</Text>
									</div>
								</div>
								{saved ? (
									<Text size='sm'>
										Заявка сохранена в этом окне.
									</Text>
								) : null}
							</Stack>
						</div>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<ControlRow justify='end'>
						<Button
							variant='secondary'
							type='button'
							onClick={() => setModalOpen(false)}
						>
							Отмена
						</Button>
						<Hint content='Сохраняет форму, Sheet под окном остаётся открытым.' side='top'>
							<Button
								variant='primary'
								type='button'
								onClick={() => setSaved(true)}
							>
								Сохранить
							</Button>
						</Hint>
					</ControlRow>
				</Modal.Footer>
			</Modal>
		</Layout>
	);
}

export function LayersApp() {
	return (
		<ThemeProvider applyTo='document' initialTheme='light'>
			<LocaleProvider locale='ru'>
				<LayersPage />
			</LocaleProvider>
		</ThemeProvider>
	);
}

const root = document.getElementById('root');
if (!root) {
	throw new Error('Не найден #root');
}

createRoot(root).render(
	<React.StrictMode>
		<LayersApp />
	</React.StrictMode>,
); 
