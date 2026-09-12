import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Chip, ChipGroup, ChipProps} from './Chip';
import {IconUserId} from '../../icons/icons/IconUserId';
import {IconCheckmark} from '../../icons/icons/IconCheckmark';
import {IconQuestion} from '../../icons/icons/IconQuestion';
import {IconFlag} from '../../icons/icons/IconFlag';
import {IconBell} from '../../icons/icons/IconBell';
import {Card} from '../Card/Card';
import {Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Chip',
	component: Chip,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Компактный чип, тег или toggle (`as`): статусы, размеры, иконка, удаление. Группировка — ChipGroup.',
	),
	argTypes: {
		as: {
			control: {
				type: 'select',
				options: ['chip', 'tag', 'toggle']
			},
			description: 'chip — скругление radius-sm; tag — pill; toggle — выбранный фильтр',
		},
		variant: {
			control: {
				type: 'select',
				options: [
					'primary',
					'tinted',
					'secondary',
					'success',
					'info',
					'warning',
					'error',
				],
			},
			description: 'Вариант оформления',
		},
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg'],
			},
			description: 'Размер чипа',
		},
		disabled: {
			control: 'boolean',
		},
		children: {
			control: 'text',
		},
		onClick: {
			action: 'click',
		},
		onRemove: {
			action: 'remove',
		},
	},
} satisfies Meta<typeof Chip>;

export const Playground: Story<ChipProps> = {
	args: {
		children: 'alex@example.com',
		size: 'md',
		onRemove: () => {},
	},
	parameters: story('Панель Controls: variant, size, as, onRemove.'),
};

export const Variants: Story<ChipProps> = {
	render: () => (
		<ChipGroup aria-label='Варианты чипов'>
			<Chip variant='primary'>
				Primary
			</Chip>
			<Chip variant='tinted'>
				Tinted
			</Chip>
			<Chip variant='secondary'>
				Secondary
			</Chip>
			<Chip variant='success'>
				Success
			</Chip>
			<Chip variant='info'>
				Info
			</Chip>
			<Chip variant='warning'>
				Warning
			</Chip>
			<Chip variant='error'>
				Danger
			</Chip>
		</ChipGroup>
	),
	parameters: story('Статусные и базовые варианты.'),
};

export const Sizes: Story<ChipProps> = {
	render: () => (
		<ChipGroup aria-label='Размеры' gap='md'>
			<Chip size='sm' variant='secondary'>
				sm
			</Chip>
			<Chip size='md' variant='secondary'>
				md
			</Chip>
			<Chip size='lg' variant='secondary'>
				lg
			</Chip>
			<Chip
				size='sm'
				variant='info'
				onRemove={() => {}}
			>
				sm + удаление
			</Chip>
			<Chip
				size='md'
				variant='info'
				onRemove={() => {}}
			>
				md + удаление
			</Chip>
			<Chip
				size='lg'
				variant='info'
				onRemove={() => {}}
			>
				lg + удаление
			</Chip>
		</ChipGroup>
	),
	parameters: story('Размеры `sm` / `md` / `lg`.'),
};

export const Modes: Story<ChipProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			gap: 'var(--altum-g-space-4)',
		}}
		>
			<div>
				<div style={{
					marginBottom: 'var(--altum-g-space-2)',
					fontSize: 13,
					color: 'var(--altum-color-muted)'
				}}
				>
					as=&quot;chip&quot; — небольшое скругление (`--altum-g-radius-sm`)
				</div>
				<ChipGroup aria-label='Режим chip'>
					<Chip
						as='toggle'
						variant='primary'
						onClick={() => {}}
					>
						Фильтр
					</Chip>
					<Chip
						as='chip'
						variant='tinted'
						onClick={() => {}}
					>
						Тонированный
					</Chip>
					<Chip
						as='chip'
						variant='success'
						onRemove={() => {}}
					>
						Удаляемый
					</Chip>
				</ChipGroup>
			</div>
			<div>
				<div style={{
					marginBottom: 'var(--altum-g-space-2)',
					fontSize: 13,
					color: 'var(--altum-color-muted)'
				}}
				>
					as=&quot;tag&quot; — pill (скруглённые края)
				</div>
				<ChipGroup aria-label='Режим tag'>
					<Chip as='tag' variant='primary'>
						Статус
					</Chip>
					<Chip as='tag' variant='success'>
						Готово
					</Chip>
					<Chip
						as='tag'
						variant='warning'
						onRemove={() => {}}
					>
						С удалением
					</Chip>
					<Chip
						as='tag'
						variant='info'
						onClick={() => {}}
					>
						Кликабельный
					</Chip>
				</ChipGroup>
			</div>
		</div>
	),
	parameters: story('Сравнение скругления: `chip` — углы radius-sm, `tag` — pill. Tag с `onClick` — hover как у chip.'),
};

export const Active: Story<ChipProps> = {
	render: function ActiveRender() {
		const [selected, setSelected] = useState<string[]>(['inbox']);

		const toggle = (id: string) => {
			setSelected((current) => (
				current.includes(id)
					? current.filter((item) => item !== id)
					: [...current, id]
			));
		};

		const filters = [
			{
				id: 'inbox',
				label: 'Входящие',
				variant: 'primary' as const,
			},
			{
				id: 'starred',
				label: 'Избранное',
				variant: 'warning' as const,
			},
			{
				id: 'done',
				label: 'Готово',
				variant: 'success' as const,
			},
			{
				id: 'alerts',
				label: 'Алерты',
				variant: 'error' as const,
			},
		];

		return (
			<ChipGroup aria-label='Фильтры'>
				{filters.map((filter) => (
					<Chip
						key={filter.id}
						variant={filter.variant}
						as={selected.includes(filter.id) ? 'toggle' : 'chip'}
						onClick={() => toggle(filter.id)}
					>
						{filter.label}
					</Chip>
				))}
			</ChipGroup>
		);
	},
	parameters: story('`as="toggle"` + onClick — фильтры с aria-pressed.'),
};

export const WithIcon: Story<ChipProps> = {
	render: () => (
		<ChipGroup aria-label='Чипы с иконками'>
			<Chip
				variant='success'
				icon={<IconCheckmark size={14} />}
				onRemove={() => {}}
			>
				Готово
			</Chip>
			<Chip variant='info' icon={<IconQuestion size={14} />}>
				Подсказка
			</Chip>
			<Chip variant='warning' icon={<IconFlag size={14} />}>
				Внимание
			</Chip>
			<Chip
				variant='error'
				icon={<IconBell size={14} />}
				onRemove={() => {}}
			>
				Ошибка
			</Chip>
			<Chip icon={<IconUserId size={14} />} onRemove={() => {}}>
				Общий пользователь
			</Chip>
		</ChipGroup>
	),
	parameters: story('Иконка в начале и опциональный крестик.'),
};

export const Removable: Story<ChipProps> = {
	render: function RemovableRender() {
		const [chips, setChips] = useState(['React', 'TypeScript', 'CSS Modules']);

		return (
			<ChipGroup aria-label='Удаляемые чипы'>
				{chips.map((chip) => (
					<Chip
						key={chip}
						variant='secondary'
						onRemove={() => setChips((current) => current.filter((item) => item !== chip))}
						removeLabel={`Удалить ${chip}`}
					>
						{chip}
					</Chip>
				))}
			</ChipGroup>
		);
	},
	parameters: story('Крестик вызывает onRemove.'),
};

export const Clickable: Story<ChipProps> = {
	render: function ClickableRender() {
		const [log, setLog] = useState('—');
		return (
			<Stack gap='sm'>
				<ChipGroup aria-label='Кликабельные чипы'>
					<Chip variant='primary' onClick={() => setLog('Активные')}>
						Фильтр: Активные
					</Chip>
					<Chip variant='info' onClick={() => setLog('Инфо')}>
						Инфо-фильтр
					</Chip>
				</ChipGroup>
				<Text size='sm' color='muted'>
					Выбрано:
					{' '}
					{log}
				</Text>
			</Stack>
		);
	},
	parameters: story('Кликабельный чип-фильтр.'),
};

export const Disabled: Story<ChipProps> = {
	render: () => (
		<ChipGroup aria-label='Заблокированные'>
			<Chip disabled>
				Chip
			</Chip>
			<Chip
				as='tag'
				variant='info'
				disabled
				onRemove={() => {}}
			>
				Tag
			</Chip>
			<Chip
				as='toggle'
				disabled
				onClick={() => {}}
			>
				Toggle
			</Chip>
		</ChipGroup>
	),
	parameters: story('`disabled` снимает клик и удаление.'),
};

export const OverflowText: Story<ChipProps> = {
	render: () => (
		<div style={{maxWidth: 200}}>
			<Chip
				variant='secondary'
				onRemove={() => {}}
			>
				Очень длинная метка фильтра, которая не помещается в одну строку
			</Chip>
		</div>
	),
	parameters: story('Длинный текст внутри чипа.'),
};

export const Interaction: Story<ChipProps> = {
	render: function InteractionRender() {
		const [chips, setChips] = useState(['React', 'TypeScript']);
		return (
			<ChipGroup aria-label='Удаление'>
				{chips.map((chip) => (
					<Chip
						key={chip}
						variant='secondary'
						onRemove={() => setChips((current) => current.filter((item) => item !== chip))}
						removeLabel={`Удалить ${chip}`}
					>
						{chip}
					</Chip>
				))}
			</ChipGroup>
		);
	},
	play: async ({canvasElement}) => {
		const remove = canvasElement.querySelector('[aria-label="Удалить React"]') as HTMLButtonElement | null;
		remove?.click();
	},
	parameters: story('Play удаляет чип React.'),
};

export const UsageExample: Story<ChipProps> = {
	render: function UsageExampleRender() {
		const [selected, setSelected] = useState<string[]>(['inbox']);
		const toggle = (id: string) => {
			setSelected((current) => (
				current.includes(id)
					? current.filter((item) => item !== id)
					: [...current, id]
			));
		};
		return (
			<Card
				style={{maxWidth: 400}}
				header={(
					<Text weight='bold'>
						Фильтры почты
					</Text>
				)}
			>
				<Stack gap='md'>
					<ChipGroup aria-label='Фильтры'>
						{[
							{
								id: 'inbox',
								label: 'Входящие'
							},
							{
								id: 'starred',
								label: 'Избранное'
							},
							{
								id: 'done',
								label: 'Готово'
							},
						].map((filter) => (
							<Chip
								key={filter.id}
								as={selected.includes(filter.id) ? 'toggle' : 'chip'}
								variant='secondary'
								onClick={() => toggle(filter.id)}
							>
								{filter.label}
							</Chip>
						))}
					</ChipGroup>
					<Text size='sm' color='muted'>
						Выбрано:
						{' '}
						{selected.join(', ') || 'нет'}
					</Text>
				</Stack>
			</Card>
		);
	},
	parameters: story('Группа фильтров-чипов в карточке.'),
};

export const Group: Story<ChipProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			gap: 'var(--altum-g-space-4)',
		}}
		>
			<ChipGroup gap='sm' aria-label='Плотно'>
				<Chip variant='info' size='sm'>
					sm
				</Chip>
				<Chip variant='info' size='sm'>
					gap
				</Chip>
			</ChipGroup>
			<ChipGroup gap='md' aria-label='Обычно'>
				<Chip variant='success'>
					md
				</Chip>
				<Chip variant='success'>
					gap
				</Chip>
			</ChipGroup>
			<ChipGroup gap='lg' aria-label='Широко'>
				<Chip variant='warning' size='lg'>
					lg
				</Chip>
				<Chip variant='warning' size='lg'>
					gap
				</Chip>
			</ChipGroup>
			<ChipGroup
				layout='scrollX'
				gap='sm'
				aria-label='Горизонтальный скролл'
			>
				{[
					'React',
					'TypeScript',
					'CSS Modules',
					'Storybook',
					'a11y',
					'Дизайн-токены',
					'Формы',
					'Оверлей',
					'Токены'
				].map((label) => (
					<Chip
						key={label}
						variant='tinted'
						size='sm'
					>
						{label}
					</Chip>
				))}
			</ChipGroup>
			<div style={{maxWidth: 220}}>
				<ChipGroup
					layout='scrollX'
					gap='sm'
					overflowAffordance='fade'
					aria-label='С edge fade'
				>
					{[
						'один',
						'два',
						'три',
						'четыре',
						'пять',
						'шесть',
						'семь',
						'восемь'
					].map((label) => (
						<Chip
							key={label}
							as='tag'
							variant='info'
							size='sm'
						>
							{label}
						</Chip>
					))}
				</ChipGroup>
			</div>
		</div>
	),
	parameters: story(
		'ChipGroup — layout wrap|scrollX; OverflowAffordance fade (default на scrollX).',
	),
};

/** Wrap держит равный gap; последний ряд упакован влево (без растяжения space-between). */
export const WrapUnevenLabels: Story<ChipProps> = {
	render: () => (
		<div style={{
			width: 360,
			border: '1px solid var(--altum-color-border)',
			borderRadius: 'var(--altum-g-radius)',
			padding: 'var(--altum-g-space-3)'
		}}
		>
			<ChipGroup gap='md' aria-label='Неравные лейблы'>
				{[
					'Все',
					'Дизайн-система',
					'UI',
					'Доступность',
					'Формы',
					'Оверлеи и порталы',
					'Графики',
					'Документация',
				].map((label) => (
					<Chip
						key={label}
						variant='secondary'
						size='sm'
					>
						{label}
					</Chip>
				))}
			</ChipGroup>
		</div>
	),
	parameters: story(
		'~360px контейнер, unequal chips — gap ровный, хвост последней строки left-packed.',
	),
};

