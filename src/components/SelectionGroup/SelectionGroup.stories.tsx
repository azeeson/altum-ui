import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {
	SelectionGroup,
	type SelectionGroupRootProps,
} from './SelectionGroup';
import {Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {Card} from '../Card/Card';
import {componentParameters, story, Story} from '../../storybook/meta';
import styles from './SelectionGroup.stories.module.css';

export default {
	title: 'altum/Components/SelectionGroup',
	component: SelectionGroup.Root,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Без UI (составной): exclusive selection + roving focus. База для Tabs, ColorSwatchGroup, TimeField.',
	),
	argTypes: {
		orientation: {
			control: {
				type: 'select',
				options: ['horizontal', 'vertical'],
			},
		},
		disabled: {
			control: 'boolean',
		},
		readOnly: {
			control: 'boolean',
		},
		activateOnFocus: {
			control: 'boolean',
			description: 'Менять value стрелками',
		},
		onChange: {
			action: 'change',
		},
	},
} satisfies Meta<typeof SelectionGroup.Root>;

const PERIODS = [
	{
		value: 'day',
		label: 'День'
	},
	{
		value: 'week',
		label: 'Неделя'
	},
	{
		value: 'month',
		label: 'Месяц'
	},
];

export const Playground: Story<SelectionGroupRootProps> = {
	render: function RadiogroupRender(args) {
		const [value, setValue] = useState('day');

		return (
			<SelectionGroup.Root
				{...args}
				value={value}
				onChange={(next) => {
					setValue(next);
					args.onChange?.(next);
				}}
			>
				<SelectionGroup.List
					role='radiogroup'
					aria-label='Период'
					className={styles.track}
				>
					{PERIODS.map((option) => {
						const selected = value === option.value;
						return (
							<SelectionGroup.Item
								key={option.value}
								value={option.value}
								role='radio'
								aria-checked={selected}
								className={`${styles.item} ${selected ? styles.itemActive : ''}`}
							>
								{option.label}
							</SelectionGroup.Item>
						);
					})}
				</SelectionGroup.List>
			</SelectionGroup.Root>
		);
	},
	args: {
		orientation: 'horizontal',
		disabled: false,
		readOnly: false,
		activateOnFocus: true,
	},
	parameters: story('Паттерн radiogroup / radio — как SegmentedControl.'),
};

export const WithTabsPattern: Story<SelectionGroupRootProps> = {
	render: function TabsPatternRender() {
		const [value, setValue] = useState('profile');

		const panels: Record<string, string> = {
			profile: 'Контент профиля',
			app: 'Контент приложения',
			notify: 'Контент уведомлений',
		};

		return (
			<SelectionGroup.Root
				value={value}
				onChange={setValue}
				className={styles.tabsRoot}
			>
				<SelectionGroup.List
					role='tablist'
					aria-orientation='horizontal'
					className={styles.tablist}
				>
					{[
						{
							value: 'profile',
							label: 'Профиль'
						},
						{
							value: 'app',
							label: 'Приложение'
						},
						{
							value: 'notify',
							label: 'Уведомления'
						},
					].map((tab) => {
						const selected = value === tab.value;
						return (
							<SelectionGroup.Item
								key={tab.value}
								value={tab.value}
								role='tab'
								id={`demo-tab-${tab.value}`}
								aria-selected={selected}
								aria-controls={`demo-panel-${tab.value}`}
								className={`${styles.tab} ${selected ? styles.tabActive : ''}`}
							>
								{tab.label}
							</SelectionGroup.Item>
						);
					})}
				</SelectionGroup.List>

				{Object.entries(panels).map(([id, text]) => (
					<SelectionGroup.Panel
						key={id}
						value={id}
						role='tabpanel'
						id={`demo-panel-${id}`}
						aria-labelledby={`demo-tab-${id}`}
						tabIndex={0}
						className={styles.panel}
					>
						{text}
					</SelectionGroup.Panel>
				))}
			</SelectionGroup.Root>
		);
	},
	parameters: story('Паттерн tablist / tab / tabpanel — как Tabs.'),
};

export const Disabled: Story<SelectionGroupRootProps> = {
	render: () => (
		<SelectionGroup.Root value='week' disabled>
			<SelectionGroup.List
				role='radiogroup'
				aria-label='Период'
				className={styles.track}
			>
				{PERIODS.map((option) => (
					<SelectionGroup.Item
						key={option.value}
						value={option.value}
						role='radio'
						aria-checked={option.value === 'week'}
						className={`${styles.item} ${option.value === 'week' ? styles.itemActive : ''}`}
					>
						{option.label}
					</SelectionGroup.Item>
				))}
			</SelectionGroup.List>
		</SelectionGroup.Root>
	),
	parameters: story('`disabled` на корне.'),
};

export const Interaction: Story<SelectionGroupRootProps> = {
	render: function InteractionRender() {
		const [value, setValue] = useState('day');
		return (
			<Stack gap='sm'>
				<SelectionGroup.Root value={value} onChange={setValue}>
					<SelectionGroup.List
						role='radiogroup'
						aria-label='Период'
						className={styles.track}
					>
						{PERIODS.map((option) => {
							const selected = value === option.value;
							return (
								<SelectionGroup.Item
									key={option.value}
									value={option.value}
									role='radio'
									aria-checked={selected}
									className={`${styles.item} ${selected ? styles.itemActive : ''}`}
								>
									{option.label}
								</SelectionGroup.Item>
							);
						})}
					</SelectionGroup.List>
				</SelectionGroup.Root>
				<Text size='sm' color='muted'>
					{value}
				</Text>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		const month = Array.from(canvasElement.querySelectorAll('[role="radio"]'))
			.find((item) => item.textContent?.includes('Месяц')) as HTMLButtonElement | undefined;
		month?.click();
		month?.focus();
	},
	parameters: story('Play выбирает «Месяц».'),
};

export const UsageExample: Story<SelectionGroupRootProps> = {
	render: function UsageExampleRender() {
		const [value, setValue] = useState('week');
		return (
			<Card
				style={{maxWidth: 360}}
				header={(
					<Text weight='bold'>
						Период отчёта
					</Text>
				)}
			>
				<Stack gap='md'>
					<SelectionGroup.Root value={value} onChange={setValue}>
						<SelectionGroup.List
							role='radiogroup'
							aria-label='Период'
							className={styles.track}
						>
							{PERIODS.map((option) => {
								const selected = value === option.value;
								return (
									<SelectionGroup.Item
										key={option.value}
										value={option.value}
										role='radio'
										aria-checked={selected}
										className={`${styles.item} ${selected ? styles.itemActive : ''}`}
									>
										{option.label}
									</SelectionGroup.Item>
								);
							})}
						</SelectionGroup.List>
					</SelectionGroup.Root>
					<Text size='sm'>
						Показаны данные за
						{' '}
						{value === 'day' ? 'день' : value === 'week' ? 'неделю' : 'месяц'}
						.
					</Text>
				</Stack>
			</Card>
		);
	},
	parameters: story('Выбор периода в карточке отчёта.'),
};
