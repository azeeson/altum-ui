import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Checkbox, CheckboxGroup, CheckboxProps} from './Checkbox';
import {Inline, Stack} from '../Layout';
import {Card} from '../Card/Card';
import {Text} from '../Text/Text';
import {Button} from '../Button/Button';
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
		readOnly: {
			control: 'boolean',
		},
		indeterminate: {
			control: 'boolean',
			description: 'Частичный выбор',
		},
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg'],
			},
		},
		mode: {
			control: {
				type: 'select',
				options: ['default', 'task'],
			},
			description: 'default — квадрат; task — круглый для задач',
		},
		labelSide: {
			control: {
				type: 'radio',
				options: ['start', 'end'],
			},
		},
		labelVisibility: {
			control: {
				type: 'select',
				options: ['visible', 'hidden'],
			},
		},
		align: {
			control: {
				type: 'select',
				options: ['start', 'center'],
			},
		},
		onChange: {
			action: 'change',
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
				onChange={(event) => {
					setVal(event.target.checked);
					args.onChange?.(event);
				}}
			/>
		);
	},
	args: {
		label: 'Запомнить меня на 30 дней',
		size: 'md',
		mode: 'default',
		disabled: false,
		readOnly: false,
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Group: Story<CheckboxProps> = {
	render: function GroupRender() {
		const [val, setVal] = useState<string[]>([]);
		return (
			<CheckboxGroup
				label='Каналы'
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

export const Horizontal: Story<CheckboxProps> = {
	render: function HorizontalRender() {
		const [val, setVal] = useState<string[]>(['a']);
		return (
			<CheckboxGroup
				orientation='horizontal'
				options={[
					{
						label: 'A',
						value: 'a'
					},
					{
						label: 'B',
						value: 'b'
					},
					{
						label: 'C',
						value: 'c'
					},
				]}
				value={val}
				onChange={setVal}
			/>
		);
	},
	parameters: story('`orientation="horizontal"`.'),
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
			<Stack gap='sm'>
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
						onChange={(event) => {
							if (event.target.checked) {
								setSelected([...selected, value]);
							} else {
								setSelected(selected.filter((item) => item !== value));
							}
						}}
					/>
				))}
			</Stack>
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
			<Stack gap='md'>
				<Checkbox
					label='Маленький'
					size='sm'
					checked={sm}
					onChange={(event) => setSm(event.target.checked)}
				/>
				<Checkbox
					label='Средний'
					size='md'
					checked={md}
					onChange={(event) => setMd(event.target.checked)}
				/>
				<Checkbox
					label='Большой'
					size='lg'
					checked={lg}
					onChange={(event) => setLg(event.target.checked)}
				/>
			</Stack>
		);
	},
	parameters: story('Размеры sm / md / lg.'),
};

export const States: Story<CheckboxProps> = {
	render: () => (
		<Stack gap='sm'>
			<Checkbox
				label='Не выбран'
				checked={false}
				onChange={() => {}}
			/>
			<Checkbox
				label='Выбран'
				checked
				onChange={() => {}}
			/>
			<Checkbox
				label='Disabled'
				checked={false}
				disabled
				onChange={() => {}}
			/>
			<Checkbox
				label='Disabled + checked'
				checked
				disabled
				onChange={() => {}}
			/>
			<Checkbox
				label='Read-only'
				checked
				readOnly
				onChange={() => {}}
			/>
		</Stack>
	),
	parameters: story('Обычный, выбранный, disabled и readOnly.'),
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
			<Stack gap='sm'>
				{tasks.map((task) => (
					<Inline
						key={task.id}
						gap='sm'
						align='center'
					>
						<Checkbox
							mode='task'
							checked={task.done}
							aria-label={task.title}
							onChange={() =>
								setTasks((prev) =>
									prev.map((item) => (item.id === task.id ? {
										...item,
										done: !item.done,
									} : item)))
							}
						/>
						<Text
							size='sm'
							style={{
								textDecoration: task.done ? 'line-through' : 'none',
								opacity: task.done ? 0.6 : 1,
							}}
						>
							{task.title}
						</Text>
					</Inline>
				))}
			</Stack>
		);
	},
	parameters: story('`mode="task"` — круглый чекбокс для списков задач.'),
};

export const LabelHidden: Story<CheckboxProps> = {
	render: function LabelHiddenRender() {
		const [checked, setChecked] = useState(false);
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
	parameters: story('`labelVisibility="hidden"` — без места под текст; обязателен aria-label.'),
};

export const TaskMultiLineAlign: Story<CheckboxProps> = {
	render: function TaskMultiLineAlignRender() {
		const [done, setDone] = useState(false);
		return (
			<Stack gap='md' style={{maxWidth: 360}}>
				<Inline gap='sm' align='start'>
					<Checkbox
						mode='task'
						align='start'
						labelVisibility='hidden'
						aria-label='Задача'
						checked={done}
						onChange={(event) => setDone(event.target.checked)}
					/>
					<Stack gap='xs'>
						<Text weight='bold'>
							Многострочная задача с длинным заголовком
						</Text>
						<Text size='sm' color='muted'>
							Мета: сегодня · проект Design System · 2 комментария
						</Text>
					</Stack>
				</Inline>
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
			</Stack>
		);
	},
	parameters: story('`align` start (default для task) | center.'),
};

export const OverflowText: Story<CheckboxProps> = {
	render: () => (
		<div style={{maxWidth: 240}}>
			<Checkbox
				label='Согласен с политикой конфиденциальности и условиями обработки персональных данных'
				checked={false}
				onChange={() => {}}
			/>
		</div>
	),
	parameters: story('Длинная подпись в узком контейнере.'),
};

export const Interaction: Story<CheckboxProps> = {
	render: function InteractionRender() {
		const [checked, setChecked] = useState(false);
		return (
			<Stack gap='sm'>
				<Checkbox
					label='Принять условия'
					checked={checked}
					onChange={(event) => setChecked(event.target.checked)}
				/>
				<Text size='sm' color='muted'>
					{checked ? 'принято' : 'не принято'}
				</Text>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		const input = canvasElement.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
		input?.click();
		input?.focus();
	},
	parameters: story('Play отмечает флажок и ставит фокус.'),
};

export const UsageExample: Story<CheckboxProps> = {
	render: function UsageExampleRender() {
		const [accepted, setAccepted] = useState(false);
		return (
			<Card
				style={{maxWidth: 400}}
				header={(
					<Text weight='bold'>
						Регистрация
					</Text>
				)}
			>
				<Stack gap='md'>
					<Checkbox
						label='Согласен с условиями использования'
						checked={accepted}
						onChange={(event) => setAccepted(event.target.checked)}
					/>
					<Button
						size='sm'
						disabled={!accepted}
					>
						Продолжить
					</Button>
				</Stack>
			</Card>
		);
	},
	parameters: story('Флажок согласия блокирует кнопку в карточке формы.'),
};
