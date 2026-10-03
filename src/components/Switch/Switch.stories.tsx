import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Switch, SwitchProps} from './Switch';
import {Inline, Stack} from '../Layout';
import {Text} from '../Text/Text';
import {Card} from '../Card/Card';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Switch',
	component: Switch,
	tags: ['autodocs'],
	parameters: componentParameters('Переключатель вкл/выкл для булевых настроек.'),
	argTypes: {
		label: {
			control: 'text',
			description: 'Метка переключателя'
		},
		checked: {
			control: 'boolean',
			description: 'Состояние включения'
		},
		disabled: {
			control: 'boolean',
			description: 'Заблокированное состояние'
		},
		readOnly: {
			control: 'boolean',
		},
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg'],
			},
		},
		labelSide: {
			control: {
				type: 'radio',
				options: ['start', 'end'],
			},
			description: 'Сторона метки',
		},
		onChange: {
			action: 'change',
		},
	},
} satisfies Meta<typeof Switch>;

export const Playground: Story<SwitchProps> = {
	render: function PlaygroundRender(args) {
		const [active, setActive] = useState(false);
		return (
			<Switch
				{...args}
				label={args.label ?? 'Включить тёмный режим'}
				checked={active}
				onChange={(next) => {
					setActive(next);
					args.onChange?.(next);
				}}
			/>
		);
	},
	args: {
		label: 'Включить тёмный режим',
		size: 'md',
		labelSide: 'end',
		disabled: false,
		readOnly: false,
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Sizes: Story<SwitchProps> = {
	render: function SizesRender() {
		const [sm, setSm] = useState(false);
		const [md, setMd] = useState(true);
		const [lg, setLg] = useState(false);
		return (
			<Stack gap='md'>
				<Switch
					label='Маленький'
					size='sm'
					checked={sm}
					onChange={setSm}
				/>
				<Switch
					label='Средний'
					size='md'
					checked={md}
					onChange={setMd}
				/>
				<Switch
					label='Большой'
					size='lg'
					checked={lg}
					onChange={setLg}
				/>
			</Stack>
		);
	},
	parameters: story('Размеры sm / md / lg.'),
};

export const LabelSide: Story<SwitchProps> = {
	render: function LabelSideRender() {
		const [end, setEnd] = useState(true);
		const [start, setStart] = useState(false);
		return (
			<Stack gap='md'>
				<Switch
					label='Метка справа (end)'
					labelSide='end'
					checked={end}
					onChange={setEnd}
				/>
				<Switch
					label='Метка слева (start)'
					labelSide='start'
					checked={start}
					onChange={setStart}
				/>
			</Stack>
		);
	},
	parameters: story('`labelSide`: end (по умолчанию) и start.'),
};

export const States: Story<SwitchProps> = {
	render: () => (
		<Stack gap='md'>
			<Switch
				label='Выключен'
				checked={false}
				onChange={() => {}}
			/>
			<Switch
				label='Включён'
				checked
				onChange={() => {}}
			/>
			<Switch
				label='Disabled'
				checked={false}
				disabled
				onChange={() => {}}
			/>
			<Switch
				label='Disabled + on'
				checked
				disabled
				onChange={() => {}}
			/>
			<Switch
				label='Read-only'
				checked
				readOnly
				onChange={() => {}}
			/>
		</Stack>
	),
	parameters: story('Выкл / вкл, disabled и readOnly.'),
};

export const OverflowText: Story<SwitchProps> = {
	render: () => (
		<div style={{maxWidth: 240}}>
			<Switch
				label='Получать маркетинговые рассылки и персональные рекомендации по продуктам'
				checked={false}
				onChange={() => {}}
			/>
		</div>
	),
	parameters: story('Длинная подпись в узком контейнере.'),
};

export const Interaction: Story<SwitchProps> = {
	render: function InteractionRender() {
		const [on, setOn] = useState(false);
		return (
			<Stack gap='sm'>
				<Switch
					label='Уведомления'
					checked={on}
					onChange={setOn}
				/>
				<Text size='sm' color='muted'>
					{on ? 'вкл' : 'выкл'}
				</Text>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		const input = canvasElement.querySelector('input[role="switch"]') as HTMLInputElement | null;
		input?.click();
		input?.focus();
	},
	parameters: story('Play кликает переключатель и ставит фокус.'),
};

export const UsageExample: Story<SwitchProps> = {
	render: function UsageExampleRender() {
		const [email, setEmail] = useState(true);
		const [push, setPush] = useState(false);
		return (
			<Card
				style={{maxWidth: 360}}
				header={(
					<Text weight='bold'>
						Уведомления
					</Text>
				)}
			>
				<Stack gap='md'>
					<Switch
						label='Email'
						checked={email}
						onChange={setEmail}
					/>
					<Switch
						label='Push'
						checked={push}
						onChange={setPush}
					/>
					<Inline gap='sm'>
						<Button
							size='sm'
							onClick={() => {
								setEmail(true);
								setPush(true);
							}}
						>
							Включить все
						</Button>
						<Button
							size='sm'
							variant='ghost'
							onClick={() => {
								setEmail(false);
								setPush(false);
							}}
						>
							Сбросить
						</Button>
					</Inline>
				</Stack>
			</Card>
		);
	},
	parameters: story('Пара переключателей в карточке настроек.'),
};
