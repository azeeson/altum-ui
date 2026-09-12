import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {
	CustomSelect,
	type CustomSelectOption,
	type CustomSelectRenderTargetContext,
	type CustomSelectRootProps,
} from './CustomSelect';
import {Button} from '../Button/Button';
import {Chip} from '../Chip/Chip';
import {Card} from '../Card/Card';
import {Stack, Inline} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {
	componentParameters,
	story,
	Story,
} from '../../storybook/meta';
import {playClick, playFocus} from '../../storybook/play';
import styles from './CustomSelect.stories.module.css';

const CITY_OPTIONS: CustomSelectOption[] = [
	{
		label: 'Москва',
		value: 'moscow'
	},
	{
		label: 'Санкт-Петербург',
		value: 'spb'
	},
	{
		label: 'Новосибирск',
		value: 'novosibirsk'
	},
	{
		label: 'Екатеринбург',
		value: 'ekaterinburg'
	},
	{
		label: 'Казань',
		value: 'kazan'
	},
	{
		label: 'Нижний Новгород',
		value: 'nizhny-novgorod'
	},
];

export default {
	title: 'altum/Components/CustomSelect',
	component: CustomSelect.Root,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Составной примитив для select/combobox: Dropdown + Listbox, кастомный trigger через renderTarget.',
	),
	argTypes: {
		disabled: {
			control: 'boolean',
			description: 'Заблокированное состояние',
		},
		readOnly: {
			control: 'boolean',
			description: 'Только чтение',
		},
		selectionMode: {
			control: {
				type: 'select',
				options: ['single', 'multiple', 'path'],
			},
			description: 'Режим выбора',
		},
		onChange: {
			action: 'onChange',
			description: 'Колбэк изменения значения',
		},
		onOpenChange: {
			action: 'onOpenChange',
			description: 'Колбэк открытия панели',
		},
		options: {control: false},
		renderTarget: {control: false},
		children: {control: false},
	},
} satisfies Meta<typeof CustomSelect.Root>;

function optionLabels(options: CustomSelectOption[]): React.ReactNode {
	return options.map((option) => (
		<span key={option.value}>
			{typeof option.label === 'string' ? option.label : option.value}
		</span>
	));
}

function ButtonTarget({
	ctx,
	options,
	fallback,
}: {
	ctx: CustomSelectRenderTargetContext;
	options: CustomSelectOption[];
	fallback: string;
}) {
	const {
		triggerRef,
		triggerAttrs,
		disabled,
		selectedOptions,
	} = ctx;
	const label = selectedOptions[0]?.label ?? fallback;
	return (
		<div
			ref={triggerRef}
			className={styles.triggerWrap}
		>
			<span className={styles.triggerSizer} aria-hidden>
				{optionLabels(options)}
			</span>
			<Button
				{...triggerAttrs}
				className={styles.triggerButton}
				variant='secondary'
				disabled={disabled}
				fullWidth
				aria-haspopup='listbox'
			>
				{typeof label === 'string' ? label : 'Выбрано'}
			</Button>
		</div>
	);
}

export const Playground: Story<CustomSelectRootProps> = {
	render: function ButtonTargetRender() {
		const [value, setValue] = useState('moscow');

		return (
			<CustomSelect.Root
				options={CITY_OPTIONS}
				value={value}
				onChange={(next) => setValue(typeof next === 'string' ? next : next[0] ?? '')}
				renderTarget={(ctx) => (
					<ButtonTarget
						ctx={ctx}
						options={CITY_OPTIONS}
						fallback='Выберите город'
					/>
				)}
				mobileTitle='Город'
			>
				<CustomSelect.Filter placeholder='Поиск города...' />
				<CustomSelect.List aria-label='Города' />
			</CustomSelect.Root>
		);
	},
	parameters: story('Триггер — Button; поиск через CustomSelect.Filter.'),
};

export const CompoundMultiple: Story<CustomSelectRootProps> = {
	render: function ChipTargetRender() {
		const [value, setValue] = useState<string[]>(['moscow', 'kazan']);

		const renderTarget = (ctx: CustomSelectRenderTargetContext) => (
			<div
				{...ctx.triggerAttrs}
				ref={ctx.triggerRef}
				className={styles.chipTrigger}
				role='combobox'
				tabIndex={ctx.disabled ? -1 : 0}
				aria-disabled={ctx.disabled || undefined}
			>
				{ctx.selectedOptions.length === 0 && (
					<span className={styles.placeholder}>
						Выберите города
					</span>
				)}
				{ctx.selectedOptions.map((option) => {
					const text = typeof option.label === 'string' ? option.label : option.value;
					return (
						<Chip
							key={option.value}
							variant='secondary'
							size='sm'
							removeLabel={`Удалить ${text}`}
							onRemove={ctx.readOnly ? undefined : () => ctx.removeOption(option.value)}
						>
							{text}
						</Chip>
					);
				})}
			</div>
		);

		return (
			<CustomSelect.Root
				options={CITY_OPTIONS}
				selectionMode='multiple'
				value={value}
				onChange={(next) => setValue(Array.isArray(next) ? next : [])}
				renderTarget={renderTarget}
				triggerMode='combobox'
				mobileTitle='Города'
			>
				<CustomSelect.Filter />
				<CustomSelect.List aria-label='Города' showCheck />
			</CustomSelect.Root>
		);
	},
	parameters: story('Множественный выбор: chips в renderTarget + removeOption из контекста.'),
};

const GROUPED_OPTIONS: CustomSelectOption[] = [
	{
		value: 'react',
		label: 'React',
		groupId: 'frontend'
	},
	{
		value: 'vue',
		label: 'Vue',
		groupId: 'frontend'
	},
	{
		value: 'node',
		label: 'Node.js',
		groupId: 'backend'
	},
	{
		value: 'go',
		label: 'Go',
		groupId: 'backend'
	},
];

export const WithGroups: Story<CustomSelectRootProps> = {
	render: function GroupsRender() {
		const [value, setValue] = useState('react');
		const renderTarget = (ctx: CustomSelectRenderTargetContext) => (
			<ButtonTarget
				ctx={ctx}
				options={GROUPED_OPTIONS}
				fallback='Стек'
			/>
		);
		return (
			<CustomSelect.Root
				options={GROUPED_OPTIONS}
				groups={[
					{
						id: 'frontend',
						label: 'Фронтенд'
					},
					{
						id: 'backend',
						label: 'Бэкенд'
					},
				]}
				value={value}
				onChange={(next) => setValue(typeof next === 'string' ? next : next[0] ?? '')}
				renderTarget={renderTarget}
			>
				<CustomSelect.List aria-label='Стек' />
			</CustomSelect.Root>
		);
	},
	parameters: story('Группы: плоский `options` + `groups` + `groupId`.'),
};

export const Disabled: Story<CustomSelectRootProps> = {
	render: () => (
		<CustomSelect.Root
			options={CITY_OPTIONS}
			value='moscow'
			disabled
			renderTarget={(ctx) => (
				<ButtonTarget
					ctx={ctx}
					options={CITY_OPTIONS}
					fallback='Выберите город'
				/>
			)}
		>
			<CustomSelect.List aria-label='Города' />
		</CustomSelect.Root>
	),
	parameters: story('Заблокированный триггер.'),
};

export const Empty: Story<CustomSelectRootProps> = {
	render: function EmptyRender() {
		const [value, setValue] = useState('');
		return (
			<CustomSelect.Root
				options={CITY_OPTIONS}
				value={value}
				onChange={(next) => setValue(typeof next === 'string' ? next : next[0] ?? '')}
				renderTarget={(ctx) => (
					<ButtonTarget
						ctx={ctx}
						options={CITY_OPTIONS}
						fallback='Выберите город'
					/>
				)}
			>
				<CustomSelect.Filter placeholder='Поиск города...' />
				<CustomSelect.List aria-label='Города' />
			</CustomSelect.Root>
		);
	},
	parameters: story('Пустой триггер с fallback-подписью.'),
};

export const OverflowText: Story<CustomSelectRootProps> = {
	render: function OverflowRender() {
		const [value, setValue] = useState('nizhny-novgorod');
		return (
			<div style={{maxWidth: 200}}>
				<CustomSelect.Root
					options={CITY_OPTIONS}
					value={value}
					onChange={(next) => setValue(typeof next === 'string' ? next : next[0] ?? '')}
					renderTarget={(ctx) => (
						<ButtonTarget
							ctx={ctx}
							options={CITY_OPTIONS}
							fallback='Выберите город'
						/>
					)}
				>
					<CustomSelect.List aria-label='Города' />
				</CustomSelect.Root>
			</div>
		);
	},
	parameters: story('Длинный пункт в узком триггере — сайзер не уже самого длинного label.'),
};

export const Focused: Story<CustomSelectRootProps> = {
	render: function FocusedRender() {
		const [value, setValue] = useState('moscow');
		return (
			<CustomSelect.Root
				options={CITY_OPTIONS}
				value={value}
				onChange={(next) => setValue(typeof next === 'string' ? next : next[0] ?? '')}
				renderTarget={(ctx) => (
					<ButtonTarget
						ctx={ctx}
						options={CITY_OPTIONS}
						fallback='Выберите город'
					/>
				)}
			>
				<CustomSelect.List aria-label='Города' />
			</CustomSelect.Root>
		);
	},
	play: async ({canvasElement}) => {
		await playFocus(canvasElement, 'button');
	},
	parameters: story('Фокус кнопки-триггера.'),
};

export const Interaction: Story<CustomSelectRootProps> = {
	render: function InteractionRender() {
		const [value, setValue] = useState('moscow');
		return (
			<CustomSelect.Root
				options={CITY_OPTIONS}
				value={value}
				onChange={(next) => setValue(typeof next === 'string' ? next : next[0] ?? '')}
				renderTarget={(ctx) => (
					<ButtonTarget
						ctx={ctx}
						options={CITY_OPTIONS}
						fallback='Выберите город'
					/>
				)}
				mobileTitle='Город'
			>
				<CustomSelect.Filter placeholder='Поиск города...' />
				<CustomSelect.List aria-label='Города' />
			</CustomSelect.Root>
		);
	},
	play: async ({canvasElement}) => {
		await playClick(canvasElement, 'button');
	},
	parameters: story('Play: открытие панели и фильтра по клику на Button.'),
};

export const UsageExample: Story<CustomSelectRootProps> = {
	render: function UsageExampleRender() {
		const [city, setCity] = useState('moscow');
		return (
			<Card
				header='Фильтры списка'
				style={{maxWidth: 480}}
			>
				<Stack gap='md'>
					<Text size='sm' color='secondary'>
						Кастомный триггер — Button; панель с поиском.
					</Text>
					<Inline gap='sm' align='center'>
						<CustomSelect.Root
							options={CITY_OPTIONS}
							value={city}
							onChange={(next) => setCity(typeof next === 'string' ? next : next[0] ?? '')}
							renderTarget={(ctx) => (
								<ButtonTarget
									ctx={ctx}
									options={CITY_OPTIONS}
									fallback='Город'
								/>
							)}
							mobileTitle='Город'
						>
							<CustomSelect.Filter placeholder='Поиск города...' />
							<CustomSelect.List aria-label='Города' />
						</CustomSelect.Root>
						<Button variant='primary'>
							Применить
						</Button>
					</Inline>
				</Stack>
			</Card>
		);
	},
	parameters: story('CustomSelect как фильтр в карточке тулбара.'),
};
