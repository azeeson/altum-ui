import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {SegmentedControl, SegmentedControlProps} from './SegmentedControl';
import {Text} from '../Text/Text';
import {TextField} from '../TextField/TextField';
import {Inline, Stack} from '../Layout';
import {Card} from '../Card/Card';
import {componentParameters, story, Story} from '../../storybook/meta';

const OPTIONS = [
	{
		label: 'Панель 1',
		value: 'one'
	},
	{
		label: 'Панель 2',
		value: 'two'
	},
];

const MULTI_LINE_OPTIONS = [
	{
		label: 'День месяца',
		value: 'day'
	},
	{
		label: 'N-й день недели',
		value: 'nth'
	},
	{
		label: 'Последний день',
		value: 'last'
	},
	{
		label: 'Последний будний',
		value: 'weekday'
	},
];

export default {
	title: 'altum/Components/SegmentedControl',
	component: SegmentedControl,
	tags: ['autodocs'],
	parameters: componentParameters('Один сегмент: SelectionGroup, выбранный пункт — заливка кнопки.'),
	argTypes: {
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg']
			},
			description: 'Размер переключателя',
		},
		variant: {
			control: {
				type: 'select',
				options: [
					'pill',
					'primary',
					'tinted',
					'secondary',
					'ghost',
					'plain'
				]
			},
			description: 'pill — скруглённый трек (default); primary — плотный акцент; tinted — приглушённая заливка; secondary — алиас pill; ghost — прозрачный трек; plain — минимальный',
		},
		itemFit: {
			control: {
				type: 'select',
				options: ['equal', 'content']
			},
			description: 'equal — равная ширина; content — по контенту, суммарно на всю ширину',
		},
		disabled: {
			control: 'boolean',
		},
		readOnly: {
			control: 'boolean',
		},
		orientation: {
			control: {
				type: 'select',
				options: ['horizontal', 'vertical'],
			},
			description: 'Ряд или колонка',
		},
		onChange: {
			action: 'change',
		},
	},
} satisfies Meta<typeof SegmentedControl>;

export const Playground: Story<SegmentedControlProps> = {
	render: function PlaygroundRender(args) {
		const [value, setValue] = useState('one');
		return (
			<SegmentedControl
				{...args}
				options={OPTIONS}
				value={value}
				onChange={setValue}
			/>
		);
	},
	args: {
		size: 'md',
		variant: 'pill',
		itemFit: 'equal',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const HeightsVsTextField: Story<SegmentedControlProps> = {
	render: function HeightsVsTextFieldRender() {
		const [md, setMd] = useState('day');
		const [lg, setLg] = useState('day');

		return (
			<Stack gap='md' style={{maxWidth: 720}}>
				{(
					['sm', 'md', 'lg',] as const
				).map((size) => (
					<div key={size}>
						<Text size='sm' color='secondary'>
							{size}
						</Text>
						<Inline gap='sm' align='center'>
							<TextField
								label={`Field ${size}`}
								size={size}
								width='md'
								defaultValue='1'
							/>
							<div style={{
								flex: 1,
								minWidth: 0
							}}
							>
								<SegmentedControl
									options={OPTIONS}
									value='one'
									onChange={() => {}}
									size={size}
									variant='secondary'
								/>
							</div>
						</Inline>
					</div>
				))}
				<div>
					<Text size='sm' color='secondary'>
						md — 1–2 строки (высота не растёт)
					</Text>
					<SegmentedControl
						options={MULTI_LINE_OPTIONS}
						value={md}
						onChange={setMd}
						size='md'
						variant='secondary'
					/>
				</div>
				<div>
					<Text size='sm' color='secondary'>
						lg — 1–2 строки (высота не растёт)
					</Text>
					<SegmentedControl
						options={MULTI_LINE_OPTIONS}
						value={lg}
						onChange={setLg}
						size='lg'
						variant='secondary'
					/>
				</div>
			</Stack>
		);
	},
	parameters: story('Высота = chrome TextField; md/lg с длинными лейблами не раздвигаются.'),
};

export const AllVariants: Story<SegmentedControlProps> = {
	render: function AllVariantsRender() {
		const [val1, setVal1] = useState('one');
		const [val2, setVal2] = useState('one');
		const [val3, setVal3] = useState('one');
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '20px'
			}}
			>
				<div>
					<div style={{marginBottom: '6px'}}>
						<Text size='sm'>
							Маленький (sm):
						</Text>
					</div>
					<SegmentedControl
						options={OPTIONS}
						value={val1}
						onChange={setVal1}
						size='sm'
					/>
				</div>
				<div>
					<div style={{marginBottom: '6px'}}>
						<Text size='sm'>
							Стандартный (md):
						</Text>
					</div>
					<SegmentedControl
						options={OPTIONS}
						value={val2}
						onChange={setVal2}
						size='md'
					/>
				</div>
				<div>
					<div style={{marginBottom: '6px'}}>
						<Text size='sm'>
							Крупный (lg):
						</Text>
					</div>
					<SegmentedControl
						options={OPTIONS}
						value={val3}
						onChange={setVal3}
						size='lg'
					/>
				</div>
				<div>
					<div style={{marginBottom: '6px'}}>
						<Text size='sm'>
							Вариант tinted, md:
						</Text>
					</div>
					<SegmentedControl
						options={OPTIONS}
						value={val2}
						onChange={setVal2}
						size='md'
						variant='tinted'
					/>
				</div>
				<div>
					<div style={{marginBottom: '6px'}}>
						<Text size='sm'>
							Вариант secondary, sm:
						</Text>
					</div>
					<SegmentedControl
						options={OPTIONS}
						value={val1}
						onChange={setVal1}
						size='sm'
						variant='secondary'
					/>
				</div>
				<div>
					<div style={{marginBottom: '6px'}}>
						<Text size='sm'>
							Вариант secondary, md:
						</Text>
					</div>
					<SegmentedControl
						options={OPTIONS}
						value={val2}
						onChange={setVal2}
						size='md'
						variant='secondary'
					/>
				</div>
				<div>
					<div style={{marginBottom: '6px'}}>
						<Text size='sm'>
							Вариант ghost, md:
						</Text>
					</div>
					<SegmentedControl
						options={OPTIONS}
						value={val2}
						onChange={setVal2}
						size='md'
						variant='ghost'
					/>
				</div>
				<div>
					<div style={{marginBottom: '6px'}}>
						<Text size='sm'>
							Вариант plain, md:
						</Text>
					</div>
					<SegmentedControl
						options={OPTIONS}
						value={val2}
						onChange={setVal2}
						size='md'
						variant='plain'
					/>
				</div>
				<div>
					<div style={{marginBottom: '6px'}}>
						<Text size='sm'>
							Вариант secondary, lg:
						</Text>
					</div>
					<SegmentedControl
						options={OPTIONS}
						value={val3}
						onChange={setVal3}
						size='lg'
						variant='secondary'
					/>
				</div>
			</div>
		);
	},
	parameters: story('Размеры (`sm`–`lg`) и варианты.'),
};

const CONTENT_FIT_OPTIONS = [
	{
		label: '1-й',
		value: '1'
	},
	{
		label: '2-й',
		value: '2'
	},
	{
		label: '3-й',
		value: '3'
	},
	{
		label: '4-й',
		value: '4'
	},
	{
		label: '5-й',
		value: '5'
	},
	{
		label: 'Последний',
		value: 'last'
	},
];

export const ItemFitContent: Story<SegmentedControlProps> = {
	render: function ItemFitContentRender() {
		const [equal, setEqual] = useState('5');
		const [content, setContent] = useState('5');

		return (
			<Stack gap='md' style={{maxWidth: 560}}>
				<div>
					<div style={{marginBottom: '6px'}}>
						<Text size='sm' color='secondary'>
							itemFit=&quot;equal&quot; (по умолчанию)
						</Text>
					</div>
					<SegmentedControl
						options={CONTENT_FIT_OPTIONS}
						value={equal}
						onChange={setEqual}
						variant='secondary'
						itemFit='equal'
					/>
				</div>
				<div>
					<div style={{marginBottom: '6px'}}>
						<Text size='sm' color='secondary'>
							itemFit=&quot;content&quot; — ширина от подписи, трек на 100%
						</Text>
					</div>
					<SegmentedControl
						options={CONTENT_FIT_OPTIONS}
						value={content}
						onChange={setContent}
						variant='secondary'
						itemFit='content'
					/>
				</div>
			</Stack>
		);
	},
	parameters: story('Сравнение равных сегментов и ширины по контенту.'),
};

export const Disabled: Story<SegmentedControlProps> = {
	render: () => (
		<SegmentedControl
			options={OPTIONS}
			value='one'
			onChange={() => {}}
			disabled
		/>
	),
	parameters: story('`disabled` блокирует смену сегмента.'),
};

export const Interaction: Story<SegmentedControlProps> = {
	render: function InteractionRender() {
		const [value, setValue] = useState('one');
		return (
			<Stack gap='sm'>
				<SegmentedControl
					options={OPTIONS}
					value={value}
					onChange={setValue}
				/>
				<Text size='sm' color='muted'>
					{value}
				</Text>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		const two = Array.from(canvasElement.querySelectorAll('button'))
			.find((button) => button.textContent?.includes('Панель 2'));
		two?.click();
		two?.focus();
	},
	parameters: story('Play выбирает «Панель 2».'),
};

export const UsageExample: Story<SegmentedControlProps> = {
	render: function UsageExampleRender() {
		const [period, setPeriod] = useState('week');
		return (
			<Card
				style={{maxWidth: 420}}
				header={(
					<Text weight='bold'>
						Аналитика
					</Text>
				)}
			>
				<Stack gap='md'>
					<SegmentedControl
						options={[
							{
								label: 'День',
								value: 'day'
							},
							{
								label: 'Неделя',
								value: 'week'
							},
							{
								label: 'Месяц',
								value: 'month'
							},
						]}
						value={period}
						onChange={setPeriod}
						size='sm'
						variant='secondary'
					/>
					<Text size='sm'>
						Сводка за
						{' '}
						{period === 'day' ? 'день' : period === 'week' ? 'неделю' : 'месяц'}
						.
					</Text>
				</Stack>
			</Card>
		);
	},
	parameters: story('Сегменты периода в карточке аналитики.'),
};

export const Vertical: Story<SegmentedControlProps> = {
	render: function VerticalRender() {
		const [value, setValue] = useState('one');
		return (
			<div style={{width: 180}}>
				<SegmentedControl
					orientation='vertical'
					options={OPTIONS}
					value={value}
					onChange={setValue}
				/>
			</div>
		);
	},
	parameters: story('Вертикальный трек.'),
};
