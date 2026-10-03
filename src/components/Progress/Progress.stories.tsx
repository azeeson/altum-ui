import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Progress, ProgressCircle, ProgressProps} from './Progress';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {Inline, Stack} from '../Layout';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Progress',
	component: Progress,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Линейный и круговой прогресс: determinate / indeterminate, label / valueText.',
	),
	argTypes: {
		percentage: {
			control: {
				type: 'range',
				min: 0,
				max: 100,
			},
			description: 'Процент 0–100',
		},
		indeterminate: {
			control: 'boolean',
			description: 'Неопределённый прогресс',
		},
		label: {
			control: 'text',
		},
		valueText: {
			control: 'text',
			description: 'Подпись значения (вместо %)',
		},
		showValueText: {
			control: 'boolean',
		},
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg'],
			},
		},
		variant: {
			control: {
				type: 'select',
				options: [
					'auto',
					'primary',
					'success',
					'warning',
					'error',
					'info'
				],
			},
		},
	},
} satisfies Meta<typeof Progress>;

export const Playground: Story<ProgressProps> = {
	render: (args) => (
		<div style={{maxWidth: 320}}>
			<Progress {...args} />
		</div>
	),
	args: {
		percentage: 65,
		label: 'Загрузка',
		indeterminate: false,
		showValueText: true,
		size: 'md',
		variant: 'auto',
	},
	parameters: story('Определённое значение с лейблом и %-valueText.'),
};

export const Sizes: Story<ProgressProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 320}}>
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<Progress
					key={size}
					percentage={40}
					size={size}
					label={size}
				/>
			))}
		</Stack>
	),
	parameters: story('Толщина линии sm / md / lg.'),
};

export const Variants: Story<ProgressProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 320}}>
			<Progress
				percentage={30}
				variant='primary'
				label='primary'
			/>
			<Progress
				percentage={55}
				variant='info'
				label='info'
			/>
			<Progress
				percentage={70}
				variant='success'
				label='success'
			/>
			<Progress
				percentage={85}
				variant='warning'
				label='warning'
			/>
			<Progress
				percentage={40}
				variant='error'
				label='error'
			/>
			<Progress
				percentage={100}
				variant='auto'
				label='auto → success на 100%'
			/>
		</Stack>
	),
	parameters: story('Тоны заполнения; `auto` становится success при 100%.'),
};

export const Indeterminate: Story<ProgressProps> = {
	render: () => (
		<div style={{maxWidth: 320}}>
			<Progress indeterminate label='Синхронизация…' />
		</div>
	),
	parameters: story('Неопределённый прогресс.'),
};

export const Empty: Story<ProgressProps> = {
	render: () => (
		<div style={{maxWidth: 320}}>
			<Progress
				percentage={0}
				label='Ожидание'
			/>
		</div>
	),
	parameters: story('Нулевое значение.'),
};

export const OverflowLabel: Story<ProgressProps> = {
	render: () => (
		<div style={{maxWidth: 240}}>
			<Progress
				percentage={42}
				label='Загрузка ежеквартального финансового отчёта с приложениями'
				valueText='4 из 12 файлов'
			/>
		</div>
	),
	parameters: story('Длинный label и кастомный valueText.'),
};

export const Circular: Story<ProgressProps> = {
	render: () => (
		<Inline gap='md' align='center'>
			<ProgressCircle percentage={45} label='CPU' />
			<ProgressCircle percentage={85} diameter={70} />
			<ProgressCircle
				indeterminate
				diameter={56}
				label='Ожидание'
				showValueText={false}
			/>
		</Inline>
	),
	parameters: story('ProgressCircle в публичном API.'),
};

export const CircularSizes: Story<ProgressProps> = {
	render: () => (
		<Inline gap='md' align='end'>
			<ProgressCircle
				percentage={60}
				size='sm'
				label='sm'
			/>
			<ProgressCircle
				percentage={60}
				size='md'
				label='md'
			/>
			<ProgressCircle
				percentage={60}
				size='lg'
				label='lg'
			/>
		</Inline>
	),
	parameters: story('Диаметры круга по size.'),
};

export const Interaction: Story<ProgressProps> = {
	render: function InteractionRender() {
		const [value, setValue] = useState(20);
		return (
			<Stack gap='md' style={{maxWidth: 320}}>
				<Progress
					percentage={value}
					label='Загрузка'
				/>
				<Inline gap='sm'>
					<Button
						size='sm'
						variant='secondary'
						onClick={() => setValue((n) => Math.max(0, n - 15))}
					>
						−15%
					</Button>
					<Button
						size='sm'
						onClick={() => setValue((n) => Math.min(100, n + 15))}
					>
						+15%
					</Button>
				</Inline>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		const plus = Array.from(canvasElement.querySelectorAll('button'))
			.find((el) => el.textContent?.includes('+15%'));
		if (!(plus instanceof HTMLButtonElement)) {
			throw new Error('Не найдена кнопка увеличения прогресса');
		}
		plus.click();
		plus.click();
	},
	parameters: story('Play: два клика +15% (20 → 50).'),
};

export const UsageExample: Story<ProgressProps> = {
	render: () => (
		<Card
			variant='outlined'
			header={(
				<Text weight='bold'>
					Экспорт отчёта
				</Text>
			)}
			style={{maxWidth: 360}}
		>
			<Stack gap='md'>
				<Progress
					percentage={72}
					label='PDF'
					size='sm'
				/>
				<Progress
					percentage={40}
					label='CSV'
					size='sm'
					variant='info'
				/>
			</Stack>
		</Card>
	),
	parameters: story('Несколько Progress в карточке экспорта.'),
};
