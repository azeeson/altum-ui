import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {SegmentedControl, SegmentedControlProps} from './SegmentedControl';
import {Text} from '../Text/Text';
import {TextField} from '../TextField/TextField';
import {Inline, Stack} from '../Layout/Layout';
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
	title: 'altum-ui/Components/SegmentedControl',
	component: SegmentedControl,
	tags: ['autodocs'],
	parameters: componentParameters('Переключатель сегментов для выбора одного значения из набора опций.'),
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
					'primary',
					'tinted',
					'secondary',
					'ghost',
					'plain'
				]
			},
			description: 'primary — плотный акцент; tinted — приглушённая заливка; secondary — нейтральный; ghost — прозрачный трек; plain — минимальный',
		},
		borderless: {
			control: 'boolean',
			description: 'Без рамки у трека',
		},
		itemFit: {
			control: {
				type: 'select',
				options: ['equal', 'content']
			},
			description: 'equal — равная ширина; content — по контенту, суммарно на всю ширину',
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
		variant: 'primary',
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
								labelPlacement='outside'
								size={size}
								width='sm'
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
				<div>
					<div style={{marginBottom: '6px'}}>
						<Text size='sm'>
							secondary + без рамки:
						</Text>
					</div>
					<SegmentedControl
						options={OPTIONS}
						value={val2}
						onChange={setVal2}
						size='md'
						variant='secondary'
						borderless
					/>
				</div>
			</div>
		);
	},
	parameters: story('Размеры (`sm`–`lg`), варианты и `borderless`.'),
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
