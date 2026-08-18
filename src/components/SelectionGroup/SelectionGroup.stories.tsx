import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {
	SelectionGroup,
	type SelectionGroupRootProps,
} from './SelectionGroup';
import {componentParameters, story, Story} from '../../storybook/meta';
import styles from './SelectionGroup.stories.module.css';

export default {
	title: 'altum-ui/Components/SelectionGroup',
	component: SelectionGroup.Root,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Без UI (составной): exclusive selection + roving focus. База для SegmentedControl и Tabs.',
	),
} satisfies Meta<typeof SelectionGroup.Root>;

export const Playground: Story<SelectionGroupRootProps> = {
	render: function RadiogroupRender() {
		const [value, setValue] = useState('day');

		return (
			<SelectionGroup.Root value={value} onChange={setValue}>
				<SelectionGroup.List
					role='radiogroup'
					aria-label='Период'
					className={styles.track}
				>
					{[
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
					].map((option) => {
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
