/* eslint-disable @stylistic/indent -- Существующее форматирование фикстуры раскладки сохраняет примеры inline-вёрстки. */
import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Accordion} from '../Accordion/Accordion';
import {Alert} from '../Alert/Alert';
import {AspectRatio} from '../AspectRatio/AspectRatio';
import {Avatar} from '../Avatar/Avatar';
import {Badge} from '../Badge/Badge';
import {BarChart} from '../BarChart/BarChart';
import {Box} from '../Box/Box';
import {Button} from '../Button/Button';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Checkbox, CheckboxGroup} from '../Checkbox/Checkbox';
import {Chip} from '../Chip/Chip';
import {Card} from '../Card/Card';
import {DateRangeField} from '../DateRangeField/DateRangeField';
import {DayStripCalendar} from '../DayStripCalendar/DayStripCalendar';
import {DescriptionList} from '../DescriptionList/DescriptionList';
import {DonutChart} from '../DonutChart/DonutChart';
import {FieldLabel} from '../FieldLabel/FieldLabel';
import {Fieldset} from '../Fieldset/Fieldset';
import {ImageGallery} from '../ImageGallery/ImageGallery';
import {Inline, Split, Stack} from '../Layout/Layout';
import {MaskedField} from '../MaskedField/MaskedField';
import {Modal} from '../Modal/Modal';
import {NumberField} from '../NumberField/NumberField';
import {PasswordField} from '../PasswordField/PasswordField';
import {PinInput} from '../PinInput/PinInput';
import {RadioGroup} from '../Radio/Radio';
import {Slider} from '../Slider/Slider';
import {Rating} from '../Rating/Rating';
import {RelativeTime} from '../RelativeTime/RelativeTime';
import {SafeArea} from '../SafeArea/SafeArea';
import {ScrollArea} from '../ScrollArea/ScrollArea';
import {SearchField} from '../SearchField/SearchField';
import {SegmentedControl} from '../SegmentedControl/SegmentedControl';
import {Select} from '../Select/Select';
import {Separator} from '../Separator/Separator';
import {Steps} from '../Steps/Steps';
import {Switch} from '../Switch/Switch';
import {Tabs} from '../Tabs/Tabs';
import {Text} from '../Text/Text';
import {TextField} from '../TextField/TextField';
import {TextareaField} from '../TextareaField/TextareaField';
import {Timeline} from '../Timeline/Timeline';
import {Title} from '../Title/Title';
import {IconBell} from '../../icons/icons/IconBell';
import {IconCard} from '../../icons/icons/IconCard';
import {IconPlus} from '../../icons/icons/IconPlus';
import {demoImage} from '../../storybook/demoImages';
import {Story} from '../../storybook/meta';
import styles from './ScreenLayouts.stories.module.css';

export default {
	title: 'altum/Examples/Screen Layouts',
	parameters: {
		layout: 'padded',
		controls: {disable: true},
		actions: {disable: true},
		docs: {
			disable: true,
			description: {
				component:
					'Верстки экранов: дашборд, настройки прав, чекаут, мобильная оболочка, превью API, канбан.',
			},
		},
	},
} satisfies Meta;

interface DemoFilterChip {
	id: string;
	label: React.ReactNode;
	active?: boolean;
}

function DemoKpiCard({
	label,
	value,
	delta,
	deltaColor = 'success',
	description,
}: {
	label: React.ReactNode;
	value: React.ReactNode;
	delta?: React.ReactNode;
	deltaColor?: 'success' | 'error' | 'muted';
	description?: React.ReactNode;
}) {
	return (
		<Card>
			<Stack gap='xs'>
				<Text size='xs' color='muted'>
					{label}
				</Text>
				<Title level={3}>
					{value}
				</Title>
				{delta != null && (
					<Text size='sm' color={deltaColor}>
						{delta}
					</Text>
				)}
				{description != null && (
					<Text size='xs' color='muted'>
						{description}
					</Text>
				)}
			</Stack>
		</Card>
	);
}

function DemoHeader({
	crumbs,
	title,
	description,
	actions,
	level = 3,
}: {
	crumbs?: string;
	title: React.ReactNode;
	description?: React.ReactNode;
	actions?: React.ReactNode;
	level?: 1 | 2 | 3 | 4;
}) {
	const heading = (
		<Stack gap='xs'>
			{crumbs ? (
				<Text size='xs' color='muted'>
					{crumbs}
				</Text>
			) : null}
			<Title level={level}>
				{title}
			</Title>
			{description ? (
				<Text size='sm' color='muted'>
					{description}
				</Text>
			) : null}
		</Stack>
	);

	if (!actions) {
		return heading;
	}

	return (
		<Split align='start' gap='md'>
			{heading}
			{actions}
		</Split>
	);
}

function DemoCode({language, code}: {
language?: string;
code: string
}) {
	return (
		<Box
			variant='outlined'
			border
			padding='md'
			radius='md'
		>
			{language ? (
				<Text size='xs' color='muted'>
					{language}
				</Text>
			) : null}
			<Text
				as='pre'
				size='sm'
				style={{
margin: 0,
whiteSpace: 'pre-wrap'
}}
			>
				{code}
			</Text>
		</Box>
	);
}

function DemoFilterBar({
	query,
	onQueryChange,
	searchPlaceholder,
	filters = [],
	onFilterChange,
	onClear,
	end,
}: {
	query?: string;
	onQueryChange?: (query: string) => void;
	searchPlaceholder?: string;
	filters?: DemoFilterChip[];
	onFilterChange?: (id: string, active: boolean) => void;
	onClear?: () => void;
	end?: React.ReactNode;
}) {
	const hasActiveFilters = filters.some((item) => item.active);
	const canClear = onClear && (Boolean(query?.length) || hasActiveFilters);

	return (
		<Stack gap='sm'>
			<SearchField
				label='Поиск'
				placeholder={searchPlaceholder}
				value={query ?? ''}
				width='full'
				size='sm'
				onChange={(event) => onQueryChange?.(event.target.value)}
				onClear={query ? () => onQueryChange?.('') : undefined}
			/>
			{(filters.length > 0 || canClear || end != null) && (
				<Split align='center'>
					{filters.length > 0 && (
						<Inline gap='sm' wrap>
							{filters.map((item) => (
								<Chip
									key={item.id}
									size='sm'
									variant={item.active ? 'tinted' : 'secondary'}
									as={item.active ? 'toggle' : 'chip'}
									onClick={onFilterChange
										? () => onFilterChange(item.id, !item.active)
										: undefined}
								>
									{item.label}
								</Chip>
							))}
						</Inline>
					)}
					<Inline gap='sm' align='center'>
						{canClear && (
							<Button
								type='button'
								variant='ghost'
								size='sm'
								onClick={onClear}
							>
								Сбросить
							</Button>
						)}
						{end}
					</Inline>
				</Split>
			)}
		</Stack>
	);
}

/* ---------- 1. Аналитический дашборд ---------- */

export const AnalyticsDashboard: Story<Record<string, never>> = {
	name: 'Аналитическая панель',
	render: function AnalyticsDashboardRender() {
		const [range, setRange] = useState<{
			start?: Date;
			end?: Date
		}>({
			start: new Date(2026, 5, 1),
			end: new Date(2026, 5, 30),
		});
		const [query, setQuery] = useState('');
		const [filters, setFilters] = useState([
			{
				id: 'web',
				label: 'Web',
				active: true
			},
			{
				id: 'ios',
				label: 'iOS',
				active: true
			},
			{
				id: 'android',
				label: 'Android',
				active: false
			},
		]);

		return (
			<div className={styles.shell}>
				<DemoHeader
					crumbs='Продукт / Аналитика'
					title='Аналитика продукта'
					description='Карточки KPI + SearchField/Chip + DateRangeField + BarChart/Donut + Alert'
					actions={(
						<Inline gap='sm'>
							<DateRangeField
								label='Период'
								size='sm'
								value={range}
								onChange={setRange}
							/>
							<Button size='sm' variant='secondary'>
								Экспорт
							</Button>
						</Inline>
					)}
				/>

				<Alert
					variant='warning'
					size='sm'
					title='Аномалия трафика'
					actions={(
						<Button size='sm' variant='ghost'>
							Разбор
						</Button>
					)}
				>
					В сегменте Android конверсия упала на 18% относительно базовой линии недели.
				</Alert>

				<DemoFilterBar
					query={query}
					onQueryChange={setQuery}
					searchPlaceholder='Сегмент, кампания…'
					filters={filters}
					onFilterChange={(id, active) => {
						setFilters((prev) => prev.map((item) => (item.id === id ? {
							...item,
							active
						} : item)));
					}}
					onClear={() => {
						setQuery('');
						setFilters((prev) => prev.map((item) => ({
							...item,
							active: item.id !== 'android'
						})));
					}}
					end={(
						<Select
							value='sessions'
							options={[
								{
									label: 'Сессии',
									value: 'sessions'
								},
								{
									label: 'Выручка',
									value: 'revenue'
								},
							]}
							onChange={() => undefined}
							label='Метрика'
							size='sm'
							width='md'
						/>
					)}
				/>

				<div className={styles.metrics}>
					<DemoKpiCard
						label='Сессии'
						value='184K'
						delta='+6.2%'
						description='к пред.'
					/>
					<DemoKpiCard
						label='Конверсия'
						value='3.8%'
						delta='−0.4 п.п.'
						deltaColor='error'
					/>
					<DemoKpiCard
						label='ARPU'
						value='₽640'
						delta='+2%'
					/>
					<DemoKpiCard
						label='Удержание D7'
						value='28%'
						delta='+1.1%'
					/>
				</div>

				<div className={styles.twoCol}>
					<div className={styles.panel}>
						<p className={styles.panelTitle}>
							Сессии по дням
						</p>
						<BarChart
							height={220}
							categories={[
								'1',
								'5',
								'10',
								'15',
								'20',
								'25',
								'30'
							]}
							datasets={[
								{
									name: 'Web',
									data: [
										12,
										18,
										15,
										22,
										19,
										24,
										21
									]
								},
								{
									name: 'iOS',
									data: [
										8,
										10,
										9,
										14,
										12,
										15,
										13
									]
								},
							]}
						/>
					</div>
					<div className={styles.panel}>
						<p className={styles.panelTitle}>
							Источники
						</p>
						<DonutChart
							size={150}
							centerLabel='трафик'
							centerValue='100%'
							segments={[
								{
									label: 'Органика',
									value: 42
								},
								{
									label: 'Платный',
									value: 28
								},
								{
									label: 'Рефералы',
									value: 18
								},
								{
									label: 'Прямой',
									value: 12
								},
							]}
						/>
					</div>
				</div>

				<Text size='sm' color='muted'>
					© Altum Analytics · демо
				</Text>
			</div>
		);
	},
};

/* ---------- 2. Настройки прав команды ---------- */

export const TeamPermissionsSettings: Story<Record<string, never>> = {
	name: 'Права команды',
	render: function TeamPermissionsSettingsRender() {
		const [tab, setTab] = useState('roles');
		const [role, setRole] = useState('editor');
		const [perms, setPerms] = useState(['read', 'comment', 'export']);
		const [notif, setNotif] = useState({
			email: true,
			push: false,
			digest: true
		});

		const rolesContent = (
			<div className={styles.panel}>
				<Stack gap='md'>
					<SegmentedControl
						aria-label='Роль'
						value={role}
						onChange={setRole}
						options={[
							{
								value: 'viewer',
								label: 'Наблюдатель'
							},
							{
								value: 'editor',
								label: 'Редактор'
							},
							{
								value: 'admin',
								label: 'Админ'
							},
						]}
					/>
					<CheckboxGroup
						label='Права роли'
						value={perms}
						onChange={setPerms}
						options={[
							{
value: 'read',
label: 'Чтение проектов'
},
							{
value: 'comment',
label: 'Комментарии'
},
							{
value: 'export',
label: 'Экспорт'
},
							{
value: 'billing',
label: 'Биллинг'
},
							{
value: 'invite',
label: 'Приглашения'
},
							{
value: 'audit',
label: 'Журнал аудита'
},
						]}
					/>
					<Alert
						variant='info'
						size='sm'
						title='Подсказка'
					>
						CheckboxGroup отражает права выбранного профиля SegmentedControl.
					</Alert>
				</Stack>
			</div>
		);

		const securityContent = (
			<div className={styles.panel}>
				<Stack gap='md'>
					<Fieldset
						variant='card'
						legend='Доступ'
						description='SSO и сессии'
					>
								<FieldLabel
									label='Требовать 2FA'
									layout='horizontal'
									justify='between'
								>
									<Switch
										checked
										onChange={() => undefined}
										aria-label='2FA'
									/>
								</FieldLabel>
								<FieldLabel
									label='Таймаут сессии'
									layout='horizontal'
									justify='between'
								>
									<Select
										value='8h'
										options={[
											{
												label: '1 час',
												value: '1h'
											},
											{
												label: '8 часов',
												value: '8h'
											},
											{
												label: '24 часа',
												value: '24h'
											},
										]}
										onChange={() => undefined}
										label='Таймаут'
										size='sm'
									/>
								</FieldLabel>
								<PasswordField
									label='Мастер-ключ API'
									value='••••••••••••'
									onChange={() => undefined}
									width='full'
								/>
					</Fieldset>
					<Accordion>
						<Accordion.Item value='ip' title='Разрешённые IP'>
							<Text size='sm' color='muted'>
								Разрешены офисные подсети 10.0.0.0/8.
							</Text>
						</Accordion.Item>
						<Accordion.Item value='devices' title='Доверенные устройства'>
							<Text size='sm' color='muted'>
								3 устройства · последнее сегодня.
							</Text>
						</Accordion.Item>
					</Accordion>
				</Stack>
			</div>
		);

		const notificationsContent = (
			<div className={styles.panel}>
				<Fieldset variant='plain' legend='Каналы'>
							<FieldLabel
								label='Эл. почта'
								layout='horizontal'
								justify='between'
							>
								<Switch
									checked={notif.email}
									onChange={(checked) => setNotif((p) => ({
										...p,
										email: checked
									}))}
									aria-label='Эл. почта'
								/>
							</FieldLabel>
							<FieldLabel
								label='Пуш'
								layout='horizontal'
								justify='between'
							>
								<Switch
									checked={notif.push}
									onChange={(checked) => setNotif((p) => ({
										...p,
										push: checked
									}))}
									aria-label='Пуш'
								/>
							</FieldLabel>
							<FieldLabel
								label='Еженедельный дайджест'
								layout='horizontal'
								justify='between'
							>
								<Switch
									checked={notif.digest}
									onChange={(checked) => setNotif((p) => ({
										...p,
										digest: checked
									}))}
									aria-label='Дайджест'
								/>
							</FieldLabel>
				</Fieldset>
			</div>
		);

		return (
			<div className={styles.shell}>
				<DemoHeader
					crumbs='Рабочая область / Настройки'
					title='Настройки рабочей области'
					description='Tabs + CheckboxGroup + Fieldset/Switch + Accordion'
				/>

				<Tabs
					orientation='vertical'
					value={tab}
					onChange={setTab}
				>
					<Tabs.List>
						<Tabs.Trigger value='roles'>
							Роли
						</Tabs.Trigger>
						<Tabs.Trigger value='security' badge={1}>
							Безопасность
						</Tabs.Trigger>
						<Tabs.Trigger value='notifications'>
							Уведомления
						</Tabs.Trigger>
						<Tabs.Trigger value='billing' disabled>
							Биллинг
						</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Panel value='roles'>
						{rolesContent}
					</Tabs.Panel>
					<Tabs.Panel value='security'>
						{securityContent}
					</Tabs.Panel>
					<Tabs.Panel value='notifications'>
						{notificationsContent}
					</Tabs.Panel>
					<Tabs.Panel value='billing'>
						{null}
					</Tabs.Panel>
				</Tabs>
			</div>
		);
	},
};

/* ---------- 3. Многошаговое оформление заказа ---------- */

export const CheckoutFlow: Story<Record<string, never>> = {
	name: 'Оформление заказа',
	render: function CheckoutFlowRender() {
		const [step, setStep] = useState(0);
		const [region, setRegion] = useState('msk');
		const [method, setMethod] = useState('card');
		const [budget, setBudget] = useState<[number, number]>([20, 80]);
		const [phone, setPhone] = useState('');
		const [card, setCard] = useState('');
		const [exp, setExp] = useState('');
		const [cvc, setCvc] = useState('');

		return (
			<div className={styles.shell}>
				<DemoHeader
					title='Оформление заказа'
					description='Steps + Select + RadioGroup + Slider (диапазон) + панель сводки'
				/>

				<Steps
					currentStep={step}
					onStepClick={setStep}
					items={[
						{
							title: 'Доставка',
							description: 'Адрес'
						},
						{
							title: 'Оплата',
							description: 'Способ'
						},
						{title: 'Подтверждение'},
					]}
				/>

				<div className={styles.twoCol}>
					<div className={styles.panel}>
						{step === 0 && (
							<Stack gap='md'>
								<Select
									options={[
										{
											value: 'msk',
											label: 'Москва'
										},
										{
											value: 'spb',
											label: 'Санкт-Петербург'
										},
										{
											value: 'ala',
											label: 'Алматы'
										},
										{
											value: 'ast',
											label: 'Астана'
										},
									]}
									value={region}
									onChange={(next) => {
										if (!Array.isArray(next) && next != null) setRegion(String(next));
									}}
									label='Регион / город'
									width='full'
									onClear={() => setRegion('')}
								/>
								<TextField
									label='Улица и дом'
									placeholder='ул. Примерная, 1'
									width='full'
								/>
								<MaskedField
									label='Телефон'
									mask='+7 (999) 999-99-99'
									value={phone}
									onChange={setPhone}
									width='full'
								/>
								<Button variant='primary' onClick={() => setStep(1)}>
									Далее
								</Button>
							</Stack>
						)}

						{step === 1 && (
							<Stack gap='md'>
								<RadioGroup
									name='pay-method'
									label='Способ оплаты'
									value={method}
									onChange={setMethod}
									options={[
										{
											value: 'card',
											label: 'Банковская карта'
										},
										{
											value: 'invoice',
											label: 'Счёт для юрлица'
										},
										{
											value: 'sbp',
											label: 'СБП'
										},
									]}
								/>
								{method === 'card' && (
									<>
										<MaskedField
											label='Номер карты'
											mask='9999 9999 9999 9999'
											value={card}
											onChange={setCard}
											width='full'
										/>
										<Inline gap='md'>
											<MaskedField
												label='MM/YY'
												mask='99/99'
												value={exp}
												onChange={setExp}
											/>
											<MaskedField
												label='CVC'
												mask='999'
												value={cvc}
												onChange={setCvc}
											/>
										</Inline>
									</>
								)}
								<FieldLabel label={`Бюджет кампании: ${budget[0]}–${budget[1]}K ₽`}>
									<Slider
										min={0}
										max={100}
										value={budget}
										onChange={setBudget}
										aria-label='Бюджет'
									/>
								</FieldLabel>
								<Inline gap='sm'>
									<Button variant='secondary' onClick={() => setStep(0)}>
										Назад
									</Button>
									<Button variant='primary' onClick={() => setStep(2)}>
										Далее
									</Button>
								</Inline>
							</Stack>
						)}

						{step === 2 && (
							<Stack gap='md'>
								<Alert
									variant='success'
									size='sm'
									title='Почти готово'
								>
									Проверьте сводку справа и подтвердите заказ.
								</Alert>
								<Checkbox label='Согласен с офертой и политикой возврата' defaultChecked />
								<Inline gap='sm'>
									<Button variant='secondary' onClick={() => setStep(1)}>
										Назад
									</Button>
									<Button variant='primary'>
										Оплатить
									</Button>
								</Inline>
							</Stack>
						)}
					</div>

					<aside className={styles.checkoutAside}>
						<p className={styles.panelTitle}>
							Сводка
						</p>
						<div className={styles.summaryRow}>
							<span className={styles.muted}>
								Регион
							</span>
							<span>
								{({
									msk: 'Москва',
									spb: 'Санкт-Петербург',
									ala: 'Алматы',
									ast: 'Астана',
								} as Record<string, string>)[region] || region || '—'}
							</span>
						</div>
						<div className={styles.summaryRow}>
							<span className={styles.muted}>
								Оплата
							</span>
							<span>
								{method === 'card' ? 'Карта' : method === 'invoice' ? 'Счёт' : 'СБП'}
							</span>
						</div>
						<div className={styles.summaryRow}>
							<span className={styles.muted}>
								Бюджет
							</span>
							<span>
								{budget[0]}
								–
								{budget[1]}
								K ₽
							</span>
						</div>
						<Separator />
						<div className={styles.summaryRow}>
							<strong>
								Итого
							</strong>
							<strong>
								₽12 490
							</strong>
						</div>
						<Rating
							value={4}
							readOnly
							size='sm'
							aria-label='Рейтинг продавца'
						/>
						<Text size='xs' color='muted'>
							Продавец с рейтингом 4.0 · доставка 2–4 дня
						</Text>
					</aside>
				</div>
			</div>
		);
	},
};

/* ---------- 4. Мобильная оболочка главной ---------- */

export const MobileHomeShell: Story<Record<string, never>> = {
	name: 'Мобильная оболочка «Главная»',
	render: function MobileHomeShellRender() {
		const [tab, setTab] = useState('home');

		return (
			<div className={styles.mobileFrame}>
				<SafeArea
					className={styles.mobileSafe}
					fill
					edges={['left', 'right']}
				>
					<div className={styles.mobileHeader}>
						<DemoHeader
							title={tab === 'home' ? 'Сегодня' : tab === 'wallet' ? 'Кошелёк' : tab === 'profile' ? 'Профиль' : 'Ещё'}
							level={4}
							actions={(
								<ButtonIcon
									variant='ghost'
									size='sm'
									aria-label='Уведомления'
									icon={<IconBell size={18} />}
								/>
							)}
						/>
					</div>
					<div className={styles.mobileBody}>
						{tab === 'home' && (
							<>
								<div className={styles.metrics} style={{gridTemplateColumns: '1fr 1fr'}}>
									<DemoKpiCard
										label='Баланс'
										value='₽8 420'
									/>
									<DemoKpiCard
										label='Кэшбек'
										value='₽312'
										delta='+40'
									/>
								</div>
								{[
									{
										title: 'Подписка Pro',
										when: Date.now() - 3600_000 * 5
									},
									{
										title: 'Перевод · Анна',
										when: Date.now() - 3600_000 * 26
									},
									{
										title: 'Кафе · чек',
										when: Date.now() - 3600_000 * 50
									},
								].map((item) => (
									<div key={item.title} className={styles.feedCard}>
										<Split align='center'>
											<Stack gap='none'>
												<Text size='sm'>
													{item.title}
												</Text>
												<RelativeTime date={new Date(item.when)} />
											</Stack>
											<Chip
												as='tag'
												size='sm'
												variant='secondary'
											>
												−₽
											</Chip>
										</Split>
									</div>
								))}
							</>
						)}
						{tab === 'wallet' && (
							<Fieldset variant='card' legend='Карты'>
								<Inline gap='sm' align='center'>
									<IconCard size={20} />
									<Text size='sm'>
										·· 4242
									</Text>
									<Badge size='sm' variant='success'>
										Активна
									</Badge>
								</Inline>
							</Fieldset>
						)}
						{tab === 'profile' && (
							<Stack gap='md'>
								<Inline gap='sm' align='center'>
									<Avatar name='Alex' size={48} />
									<Stack gap='none'>
										<Text>
											Alex Petrov
										</Text>
										<Text size='xs' color='muted'>
											alex@altum.dev
										</Text>
									</Stack>
								</Inline>
								<Button variant='secondary' fullWidth>
									Редактировать
								</Button>
							</Stack>
						)}
						{tab === 'more' && (
							<Text size='sm' color='muted'>
								Tabs держат 4 раздела в SafeArea-фрейме.
							</Text>
						)}
					</div>
				</SafeArea>
				<nav className={styles.mobileNav} aria-label='Разделы'>
					<Tabs
						value={tab}
						onChange={setTab}
						variant='pill'
					>
						<Tabs.List>
							<Tabs.Trigger value='home'>
								Главная
							</Tabs.Trigger>
							<Tabs.Trigger value='wallet' badge={2}>
								Кошелёк
							</Tabs.Trigger>
							<Tabs.Trigger value='profile'>
								Профиль
							</Tabs.Trigger>
							<Tabs.Trigger value='more'>
								Ещё
							</Tabs.Trigger>
						</Tabs.List>
					</Tabs>
				</nav>
			</div>
		);
	},
};

/* ---------- 5. Превью API / документации ---------- */

export const ApiPlaygroundScreen: Story<Record<string, never>> = {
	name: 'Песочница API',
	render: function ApiPlaygroundScreenRender() {
		const snippet = `curl -X POST https://api.altum.dev/v1/events \\
  -H "Authorization: Bearer $TOKEN" \\
  -d '{"type":"signup","userId":"u_42"}'`;

		return (
			<div className={styles.shell}>
				<DemoHeader
					title='API событий'
					description='Сниппет + ScrollArea + Accordion'
				/>
				<div className={styles.splitHost}>
					<div className={styles.editorPane}>
						<p className={styles.panelTitle}>
							Запрос
						</p>
						<DemoCode language='bash' code={snippet} />
						<TextareaField
							label='Тело JSON'
							defaultValue={'{\n  "type": "signup",\n  "userId": "u_42"\n}'}
							width='full'
						/>
						<Button size='sm' variant='primary'>
							Отправить
						</Button>
					</div>
					<div className={styles.previewPane}>
						<p className={styles.panelTitle}>
							Ответ · 201
						</p>
						<ScrollArea maxHeight={220}>
							<DemoCode
								language='json'
								code={'{\n  "id": "evt_91",\n  "ok": true,\n  "receivedAt": "2026-07-15T12:00:00Z"\n}'}
							/>
						</ScrollArea>
						<Accordion>
							<Accordion.Item value='auth' title='Авторизация'>
								<Text size='sm'>
									Bearer-токен из Настройки → ключи API.
								</Text>
							</Accordion.Item>
							<Accordion.Item value='errors' title='Ошибки'>
								<Text size='sm'>
									429 при превышении 100 rps на workspace.
								</Text>
							</Accordion.Item>
						</Accordion>
					</div>
				</div>
			</div>
		);
	},
};

/* ---------- 6. Доска проекта / канбан ---------- */

interface BoardCard {
	id: string;
	title: string;
	owner: string;
	points: number;
}

interface BoardColumn {
	id: string;
	title: string;
	items: BoardCard[];
}

export const ProjectBoardScreen: Story<Record<string, never>> = {
	name: 'Доска проекта',
	render: function ProjectBoardScreenRender() {
		const [columns, setColumns] = useState<BoardColumn[]>([
			{
				id: 'backlog',
				title: 'Бэклог',
				items: [
					{
						id: 'c1',
						title: 'Фильтры в Table',
						owner: 'Анна',
						points: 3
					},
					{
						id: 'c2',
						title: 'A11y для Sheet',
						owner: 'Игорь',
						points: 5
					},
				],
			},
			{
				id: 'doing',
				title: 'В работе',
				items: [
					{
						id: 'c3',
						title: 'Вложения композера',
						owner: 'Мария',
						points: 8
					},
				],
			},
			{
				id: 'done',
				title: 'Готово',
				items: [
					{
						id: 'c4',
						title: 'Дельты карточек KPI',
						owner: 'Олег',
						points: 2
					},
				],
			},
		]);
		const [createOpen, setCreateOpen] = useState(false);
		const [draft, setDraft] = useState('');

		return (
			<div className={styles.shell}>
				<DemoHeader
					title='Доска спринта'
					description='Колонки + Card + Modal создания'
					actions={(
						<Button
							size='sm'
							variant='primary'
							iconStart={<IconPlus size={16} />}
							onClick={() => setCreateOpen(true)}
						>
							Карточка
						</Button>
					)}
				/>

				<div className={styles.boardColumns}>
					{columns.map((column) => (
						<Card
							key={column.id}
							variant='outlined'
							header={(
								<Inline
									align='center'
									justify='between'
									gap='sm'
								>
									<Title level={4}>
										{column.title}
									</Title>
									<Chip
										as='tag'
										size='sm'
										variant='tinted'
									>
										{column.items.length}
									</Chip>
								</Inline>
							)}
						>
							<Stack gap='sm'>
								{column.items.map((item) => (
									<div key={item.id} className={styles.kanbanCardBody}>
										<Text size='sm'>
											{item.title}
										</Text>
										<Inline gap='sm' align='center'>
											<Avatar name={item.owner} size={22} />
											<Chip
												as='tag'
												size='sm'
												variant='tinted'
											>
												{item.points}
												{' '}
												сп
											</Chip>
										</Inline>
									</div>
								))}
							</Stack>
						</Card>
					))}
				</div>

				<Modal open={createOpen} onOpenChange={setCreateOpen}>
					<Modal.Header>
						<Modal.Title>
							Новая карточка
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<TextField
							label='Название'
							value={draft}
							onChange={(e) => setDraft(e.target.value)}
							width='full'
						/>
					</Modal.Body>
					<Modal.Footer>
						<Button variant='secondary' onClick={() => setCreateOpen(false)}>
							Отмена
						</Button>
						<Button
							variant='primary'
							onClick={() => {
								if (!draft.trim()) return;
								setColumns((prev) => prev.map((column, index) => (
									index === 0
										? {
											...column,
											items: [
												{
													id: `c-${Date.now()}`,
													title: draft.trim(),
													owner: 'Вы',
													points: 1
												},
												...column.items,
											],
										}
										: column
								)));
								setDraft('');
								setCreateOpen(false);
							}}
						>
							Добавить
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	},
};

/* ---------- 7. Онбординг + OTP ---------- */

export const OnboardingWizard: Story<Record<string, never>> = {
	name: 'Мастер онбординга',
	render: function OnboardingWizardRender() {
		const [step, setStep] = useState(0);
		const [pin, setPin] = useState('');
		const [name, setName] = useState('');

		return (
			<div className={styles.shell}>
				<DemoHeader
					title='Онбординг'
					description='Steps + PinInput + формы'
				/>
				<Steps
					currentStep={step}
					onStepClick={setStep}
					items={[{title: 'Обзор'}, {title: 'Профиль'}, {title: '2FA'},]}
				/>

				<div className={styles.onboardingHero}>
					{step === 0 && (
						<>
							<Stack gap='sm'>
								<Card
									variant='outlined'
									header={(
										<Title level={4}>
											Команды
										</Title>
									)}
								>
									<Text size='sm'>
										Собирайте команды и роли
									</Text>
								</Card>
								<Card
									variant='outlined'
									header={(
										<Title level={4}>
											Автоматизации
										</Title>
									)}
								>
									<Text size='sm'>
										Сценарии без кода
									</Text>
								</Card>
								<Card
									variant='outlined'
									header={(
										<Title level={4}>
											Аналитика
										</Title>
									)}
								>
									<Text size='sm'>
										Метрики с первого дня
									</Text>
								</Card>
							</Stack>
							<Button variant='primary' onClick={() => setStep(1)}>
								Продолжить
							</Button>
						</>
					)}

					{step === 1 && (
						<div className={styles.panel}>
							<Stack gap='md'>
								<TextField
									label='Имя'
									value={name}
									onChange={(e) => setName(e.target.value)}
									width='full'
								/>
								<Select
									value='pm'
									options={[
										{
											label: 'Продукт',
											value: 'pm'
										},
										{
											label: 'Дизайн',
											value: 'design'
										},
										{
											label: 'Разработка',
											value: 'eng'
										},
									]}
									onChange={() => undefined}
									label='Роль'
								/>
								<Inline gap='sm'>
									<Button variant='secondary' onClick={() => setStep(0)}>
										Назад
									</Button>
									<Button variant='primary' onClick={() => setStep(2)}>
										Далее
									</Button>
								</Inline>
							</Stack>
						</div>
					)}

					{step === 2 && (
						<div className={styles.panel}>
							<Stack gap='md'>
								<Alert
									variant='info'
									size='sm'
									title='Код из SMS'
								>
									Введите 6 цифр в PinInput.
								</Alert>
								<PinInput
									length={6}
									value={pin}
									onChange={setPin}
									aria-label='Код подтверждения'
								/>
								<Inline gap='sm'>
									<Button variant='secondary' onClick={() => setStep(1)}>
										Назад
									</Button>
									<Button variant='primary' disabled={pin.length < 6}>
										Готово
									</Button>
								</Inline>
							</Stack>
						</div>
					)}
				</div>
			</div>
		);
	},
};

/* ---------- 8. Карточка товара ---------- */

export const ProductDetailScreen: Story<Record<string, never>> = {
	name: 'Карточка товара',
	render: function ProductDetailScreenRender() {
		const [qty, setQty] = useState<number | undefined>(1);
		const [tab, setTab] = useState('desc');

		return (
			<div className={styles.shell}>
				<DemoHeader
					crumbs='Каталог / Освещение / Студийная лампа'
					title='Студийная лампа · дуб'
					description='AspectRatio + ImageGallery + Rating + Accordion + липкая панель покупки'
				/>

				<div className={styles.productHero}>
					<div className={styles.heroMedia}>
						<AspectRatio ratio={4 / 3}>
							<ImageGallery images={[demoImage(4), demoImage(5), demoImage(6)]} />
						</AspectRatio>
					</div>
					<Stack gap='md'>
						<Inline gap='sm' align='center'>
							<Chip
								as='tag'
								size='sm'
								variant='success'
							>
								В наличии
							</Chip>
							<Rating
								value={4}
								readOnly
								size='sm'
								aria-label='Рейтинг'
							/>
							<Text size='xs' color='muted'>
								128 отзывов
							</Text>
						</Inline>
						<Text>
							Настольная лампа с регулируемой температурой света и USB-C.
						</Text>
						<DescriptionList
							layout='inline'
							items={[
								{
									label: 'Цена',
									value: '₽12 900'
								},
								{
									label: 'Доставка',
									value: '2–4 дня'
								},
								{
									label: 'SKU',
									value: 'LAMP-OAK-24'
								},
							]}
						/>
						<FieldLabel label='Количество'>
							<NumberField
								label='Кол-во'
								value={qty}
								min={1}
								max={20}
								onChange={setQty}
							/>
						</FieldLabel>
						<Tabs
							value={tab}
							onChange={setTab}
						>
							<Tabs.List>
								<Tabs.Trigger value='desc'>
									Описание
								</Tabs.Trigger>
								<Tabs.Trigger value='specs'>
									Характеристики
								</Tabs.Trigger>
							</Tabs.List>
							<Tabs.Panel value='desc'>
								<Text size='sm' color='muted'>
									Алюминиевый корпус, диммирование, сенсорный управление.
								</Text>
							</Tabs.Panel>
							<Tabs.Panel value='specs'>
								<Accordion>
									<Accordion.Item value='p' title='Питание'>
										<Text size='sm'>
											USB-C 20W
										</Text>
									</Accordion.Item>
									<Accordion.Item value='s' title='Размеры'>
										<Text size='sm'>
											42 × 18 см
										</Text>
									</Accordion.Item>
								</Accordion>
							</Tabs.Panel>
						</Tabs>
					</Stack>
				</div>

				<div className={styles.buyBar}>
					<strong>
						₽
						{(12900 * (qty ?? 1)).toLocaleString('ru-RU')}
					</strong>
					<Inline gap='sm'>
						<Button variant='secondary'>
							В избранное
						</Button>
						<Button variant='primary'>
							В корзину
						</Button>
					</Inline>
				</div>
			</div>
		);
	},
};

/* ---------- 9. Воронка найма ---------- */

export const RecruitingPipelineScreen: Story<Record<string, never>> = {
	name: 'Воронка найма',
	render: function RecruitingPipelineScreenRender() {
		const [day, setDay] = useState(new Date());
		const [stage, setStage] = useState(1);
		const [activeId, setActiveId] = useState('c1');
		const [skills, setSkills] = useState(['react', 'a11y']);

		const candidates = [
			{
				id: 'c1',
				name: 'Мария Л.',
				role: 'Frontend',
				when: '10:30'
			},
			{
				id: 'c2',
				name: 'Илья К.',
				role: 'Fullstack',
				when: '12:00'
			},
			{
				id: 'c3',
				name: 'Софья Н.',
				role: 'Дизайн-инженер',
				when: '15:15'
			},
		];
		const active = candidates.find((c) => c.id === activeId)!;

		return (
			<div className={styles.shell}>
				<DemoHeader
					title='Интервью сегодня'
					description='DayStripCalendar + этапы Steps + навыки CustomSelect + Timeline'
					actions={(
						<Chip size='sm' variant='tinted'>
							{candidates.length}
							{' '}
							слота
						</Chip>
					)}
				/>

				<DayStripCalendar
					value={day}
					onChange={setDay}
					daysCount={7}
				/>

				<div className={styles.recruitGrid}>
					<div className={styles.candidateList}>
						{candidates.map((person) => (
							<button
								key={person.id}
								type='button'
								className={[styles.candidateRow, person.id === activeId ? styles.candidateRowActive : '',].filter(Boolean).join(' ')}
								onClick={() => setActiveId(person.id)}
							>
								<Split align='center'>
									<Inline gap='sm' align='center'>
										<Avatar name={person.name} size={28} />
										<Stack gap='none'>
											<Text size='sm'>
												{person.name}
											</Text>
											<Text size='xs' color='muted'>
												{person.role}
											</Text>
										</Stack>
									</Inline>
									<Chip
										as='tag'
										size='sm'
										variant='secondary'
									>
										{person.when}
									</Chip>
								</Split>
							</button>
						))}
					</div>

					<div className={styles.panel}>
						<Stack gap='md'>
							<Split align='center'>
								<Stack gap='none'>
									<strong>
										{active.name}
									</strong>
									<Text size='xs' color='muted'>
										{active.role}
									</Text>
								</Stack>
								<Badge size='sm' variant='info'>
									на месте
								</Badge>
							</Split>

							<Steps
								size='sm'
								currentStep={stage}
								onStepClick={setStage}
								items={[
									{title: 'Скрининг'},
									{title: 'Техсобес'},
									{title: 'Культура'},
									{title: 'Оффер'},
								]}
							/>

							<Select
								selectionMode='multiple'
								value={skills}
								onChange={(value) => { if (Array.isArray(value)) setSkills(value); }}
								options={[
									{
										label: 'React',
										value: 'react'
									},
									{
										label: 'TypeScript',
										value: 'ts'
									},
									{
										label: 'a11y',
										value: 'a11y'
									},
									{
										label: 'Дизайн-системы',
										value: 'ds'
									},
								]}
								label='Навыки'
							/>

							<Timeline
								items={[
									{
										id: '1',
										title: 'Резюме получено',
										time: 'пн',
										status: 'success'
									},
									{
										id: '2',
										title: 'Скрининг пройден',
										time: 'вт',
										status: 'success'
									},
									{
										id: '3',
										title: 'Техсобес сегодня',
										time: active.when,
										status: 'info'
									},
								]}
							/>

							<Inline gap='sm'>
								<Button size='sm' variant='secondary'>
									Отклонить
								</Button>
								<Button
									size='sm'
									variant='primary'
									onClick={() => setStage((s) => Math.min(3, s + 1))}
								>
									След. этап
								</Button>
							</Inline>
						</Stack>
					</div>
				</div>
			</div>
		);
	},
};
