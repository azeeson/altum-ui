import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Checkbox, CheckboxGroup, CheckboxProps} from './Checkbox';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Checkbox',
	component: Checkbox,
	tags: ['autodocs'],
	parameters: componentParameters('Флажок для одиночного выбора или группы связанных опций.'),
	argTypes: {
		label: {
			control: 'text',
			description: 'Метка флажка'
		},
		checked: {
			control: 'boolean',
			description: 'Состояние выбора'
		},
		disabled: {
			control: 'boolean',
			description: 'Заблокированное состояние'
		},
	},
} satisfies Meta<typeof Checkbox>;

export const Playground: Story<CheckboxProps> = {
	render: function PlaygroundRender(args) {
		const [val, setVal] = useState(false);
		return (
			<Checkbox
				{...args}
				label={args.label ?? 'Запомнить меня на 30 дней'}
				checked={val}
				onChange={(e) => setVal(e.target.checked)}
			/>
		);
	},
	args: {
		label: 'Запомнить меня на 30 дней',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Group: Story<CheckboxProps> = {
	render: function GroupRender() {
		const [val, setVal] = useState<string[]>([]);
		return (
			<CheckboxGroup
				options={[
					{
						label: 'Получать Email-уведомления',
						value: 'email'
					},
					{
						label: 'Получать SMS-уведомления',
						value: 'sms'
					},
					{
						label: 'Получать Push-уведомления',
						value: 'push'
					},
				]}
				value={val}
				onChange={setVal}
			/>
		);
	},
	parameters: story('Группа флажков с множественным выбором.'),
};

export const Indeterminate: Story<CheckboxProps> = {
	render: function IndeterminateRender() {
		const [selected, setSelected] = useState<string[]>(['email']);
		const allValues = ['email', 'sms', 'push'];
		const allChecked = selected.length === allValues.length;
		const indeterminate = selected.length > 0 && !allChecked;

		const toggleAll = () => {
			setSelected(allChecked ? [] : allValues);
		};

		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-3)',
			}}
			>
				<Checkbox
					label='Выбрать все каналы'
					checked={allChecked}
					indeterminate={indeterminate}
					onChange={toggleAll}
				/>
				{allValues.map((value) => (
					<Checkbox
						key={value}
						label={value.toUpperCase()}
						checked={selected.includes(value)}
						onChange={(e) => {
							if (e.target.checked) {
								setSelected([...selected, value]);
							} else {
								setSelected(selected.filter((v) => v !== value));
							}
						}}
					/>
				))}
			</div>
		);
	},
	parameters: story('`indeterminate` — частичный выбор в «Выбрать все».'),
};

export const Sizes: Story<CheckboxProps> = {
	render: function SizesRender() {
		const [sm, setSm] = useState(false);
		const [md, setMd] = useState(true);
		const [lg, setLg] = useState(false);
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-4)',
			}}
			>
				<Checkbox
					label='Маленький'
					size='sm'
					checked={sm}
					onChange={(e) => setSm(e.target.checked)}
				/>
				<Checkbox
					label='Средний'
					size='md'
					checked={md}
					onChange={(e) => setMd(e.target.checked)}
				/>
				<Checkbox
					label='Большой'
					size='lg'
					checked={lg}
					onChange={(e) => setLg(e.target.checked)}
				/>
			</div>
		);
	},
	parameters: story('Размеры sm / md / lg.'),
};

export const TaskMode: Story<CheckboxProps> = {
	render: function TaskModeRender() {
		const [tasks, setTasks] = useState([
			{
				id: 1,
				title: 'Проверить pull request',
				done: true
			},
			{
				id: 2,
				title: 'Обновить документацию',
				done: false
			},
			{
				id: 3,
				title: 'Выкатить на staging',
				done: false
			},
		]);

		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-3)',
			}}
			>
				{tasks.map((task) => (
					<div
						key={task.id}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 'var(--altum-g-space-3)',
							fontSize: 'var(--altum-g-font-size-sm)',
						}}
					>
						<Checkbox
							mode='task'
							checked={task.done}
							aria-label={task.title}
							onChange={() =>
								setTasks((prev) =>
									prev.map((t) => (t.id === task.id ? {
										...t,
										done: !t.done,
									} : t)))
							}
						/>
						<span style={{
							textDecoration: task.done ? 'line-through' : 'none',
							opacity: task.done ? 0.6 : 1,
						}}
						>
							{task.title}
						</span>
					</div>
				))}
			</div>
		);
	},
	parameters: story('`mode="task"` — круглый чекбокс для списков задач.'),
};

export const LabelHidden: Story<CheckboxProps> = {
	render: function LabelHiddenRender() {
		const [checked, setChecked] = React.useState(false);
		return (
			<Checkbox
				mode='task'
				labelVisibility='hidden'
				aria-label='Отметить задачу'
				checked={checked}
				onChange={(event) => setChecked(event.target.checked)}
			/>
		);
	},
	parameters: story('`labelVisibility="hidden"` — без места под текст; обязателен aria-label / aria-labelledby.'),
};

/** Task-чекбокс выравнивается по первой строке многострочных соседей. */
export const TaskMultiLineAlign: Story<CheckboxProps> = {
	render: function TaskMultiLineAlignRender() {
		const [done, setDone] = React.useState(false);
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-4)',
				maxWidth: 360
			}}
			>
				<div style={{
					display: 'flex',
					gap: 'var(--altum-g-space-3)',
					alignItems: 'flex-start'
				}}
				>
					<Checkbox
						mode='task'
						align='start'
						labelVisibility='hidden'
						aria-label='Задача'
						checked={done}
						onChange={(event) => setDone(event.target.checked)}
					/>
					<div>
						<div style={{fontWeight: 600}}>
							Многострочная задача с длинным заголовком
						</div>
						<div style={{
							fontSize: 'var(--altum-g-font-size-sm)',
							color: 'var(--altum-color-ink-muted)'
						}}
						>
							Мета: сегодня · проект Design System · 2 комментария
						</div>
					</div>
				</div>
				<Checkbox
					mode='task'
					align='center'
					label={(
						<span>
							<strong>
								align=center
							</strong>
							{' '}
							— бокс по центру всего блока
						</span>
					)}
					checked={false}
					readOnly
				/>
			</div>
		);
	},
	parameters: story('`align` start (default для task) | center.'),
};
