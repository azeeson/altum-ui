import React, {useRef, useState} from 'react';
import {
	Accordion,
	Alert,
	Badge,
	Box,
	Button,
	Card,
	Checkbox,
	Chip,
	ChipGroup,
	ControlRow,
	Inline,
	Layout,
	LocaleProvider,
	Modal,
	NotificationProvider,
	SegmentedControl,
	Select,
	Stack,
	Switch,
	Tabs,
	Text,
	TextField,
	ThemeProvider,
	Title,
	useTheme,
	type Theme,
} from 'altum';

const SELECT_OPTIONS = [
	{
		value: 'alpha',
		label: 'Alpha'
	},
	{
		value: 'beta',
		label: 'Beta'
	},
	{
		value: 'gamma',
		label: 'Gamma'
	},
];

function ThemeToolbar() {
	const {theme, setTheme} = useTheme();

	return (
		<ControlRow justify='between' wrap>
			<Stack gap='xs'>
				<Title level={2}>
					Altum dist demo
				</Title>
				<Text color='secondary' size='sm'>
					Импорт из собранного
					{' '}
					<code>
						dist/
					</code>
					{' '}
					(не
					{' '}
					<code>
						src/
					</code>
					).
				</Text>
			</Stack>
			<SegmentedControl
				aria-label='Тема'
				width='auto'
				value={theme}
				onChange={(next) => setTheme(next as Theme)}
				options={[
					{
						value: 'light',
						label: 'Light'
					},
					{
						value: 'dark',
						label: 'Dark'
					},
				]}
			/>
		</ControlRow>
	);
}

function DemoSections() {
	const [name, setName] = useState('Alex');
	const [city, setCity] = useState('alpha');
	const [checked, setChecked] = useState(true);
	const [enabled, setEnabled] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const tabsRef = useRef<HTMLDivElement>(null);

	return (
		<Layout padding='lg' gap='lg'>
			<ThemeToolbar />

			<Card>
				<Stack gap='md' style={{padding: 16}}>
					<Title level={3}>
						Кнопки и бейджи
					</Title>
					<Inline gap='sm' wrap>
						<Button variant='primary'>
							Primary
						</Button>
						<Button variant='tinted'>
							Tinted
						</Button>
						<Button variant='secondary'>
							Secondary
						</Button>
						<Button variant='ghost'>
							Ghost
						</Button>
						<Button variant='danger'>
							Danger
						</Button>
						<Badge>
							Badge
						</Badge>
						<Chip>
							Chip
						</Chip>
					</Inline>
					<ChipGroup aria-label='Фильтры'>
						<Chip mode='toggle'>
							Filter
						</Chip>
						<Chip mode='tag'>
							Tag
						</Chip>
					</ChipGroup>
				</Stack>
			</Card>

			<Card>
				<Stack gap='md' style={{padding: 16}}>
					<Title level={3}>
						Поля
					</Title>
					<TextField
						label='Имя'
						value={name}
						onChange={(event) => setName(event.target.value)}
					/>
					<Select
						label='Город'
						options={SELECT_OPTIONS}
						value={city}
						onChange={(value) => setCity(String(value))}
					/>
					<Inline gap='md' wrap>
						<Checkbox
							label='Согласен'
							checked={checked}
							onCheckedChange={setChecked}
						/>
						<Switch
							label='Уведомления'
							checked={enabled}
							onChange={setEnabled}
						/>
					</Inline>
				</Stack>
			</Card>

			<Card>
				<Stack gap='md' style={{padding: 16}}>
					<Title level={3}>
						Алерты и оверлеи
					</Title>
					<Alert variant='info' title='Info'>
						Стили инжектятся из
						{' '}
						<code>
							*.module.css.js
						</code>
						{' '}
						через
						{' '}
						<code>
							injectCss
						</code>
						.
					</Alert>
					<Alert variant='success' title='Success'>
						Тема и токены берутся из ThemeProvider (dist).
					</Alert>
					<ControlRow>
						<Button variant='primary' onClick={() => setModalOpen(true)}>
							Открыть Modal
						</Button>
					</ControlRow>
					<Modal
						open={modalOpen}
						onOpenChange={setModalOpen}
						aria-label='Демо Modal'
						showClose
					>
						<Modal.Header>
							<Title level={3}>
								Modal из dist
							</Title>
						</Modal.Header>
						<Modal.Body>
							<Text>
								Если видишь корректные токены и крестик — сборка и CSS inject работают.
							</Text>
						</Modal.Body>
						<Modal.Footer>
							<ControlRow justify='end'>
								<Button variant='secondary' onClick={() => setModalOpen(false)}>
									Закрыть
								</Button>
								<Button variant='primary' onClick={() => setModalOpen(false)}>
									Ок
								</Button>
							</ControlRow>
						</Modal.Footer>
					</Modal>
				</Stack>
			</Card>

			<Card>
				<Stack gap='md' style={{padding: 16}}>
					<Title level={3}>
						Accordion / Box
					</Title>
					<Box variant='outlined' style={{padding: 16}}>
						<Text>
							Box variant=outlined — проверка data-variant и CSS-переменных.
						</Text>
					</Box>
					<Accordion
						variant='bordered'
						items={[
							{
								value: 'one',
								title: 'Секция 1',
								children: 'Контент первой секции.',
							},
							{
								value: 'two',
								title: 'Секция 2',
								children: 'Контент второй секции.',
							},
						]}
					/>
				</Stack>
			</Card>

			<Card>
				<Stack gap='md' style={{padding: 16}}>

					<Tabs
						rootRef={tabsRef}
						defaultValue='profile'
						variant='pill'
						items={[
							{
								value: 'profile',
								label: 'Профиль',
							},
							{
								value: 'billing',
								label: 'Оплата',
							},
							{
								value: 'team',
								label: 'Команда',
							},
						]}
					/>
					<Tabs.Panel tabsRef={tabsRef} value='profile'>
						<Text size='sm'>
							Доступный раздел
						</Text>
					</Tabs.Panel>
					<Tabs.Panel tabsRef={tabsRef} value='billing'>
						<Text size='sm'>
							Недоступно
						</Text>
					</Tabs.Panel>
					<Tabs.Panel tabsRef={tabsRef} value='team'>
						<Text size='sm'>
							Участники
						</Text>
					</Tabs.Panel>
				</Stack>
			</Card>
		</Layout>
	);
}

export function App() {
	return (
		<ThemeProvider applyTo='document' initialTheme='light'>
			<LocaleProvider locale='ru'>
				<NotificationProvider>
					<DemoSections />
				</NotificationProvider>
			</LocaleProvider>
		</ThemeProvider>
	);
}
