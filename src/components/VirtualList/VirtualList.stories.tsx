import type {Meta} from '@storybook/react';
import React, {useMemo, useRef, useState} from 'react';
import {
	VirtualList,
	VirtualListHandle,
	VirtualListProps,
} from './VirtualList';
import {Button} from '../Button/Button';
import {ButtonGroup} from '../ButtonGroup/ButtonGroup';
import {Card} from '../Card/Card';
import {EmptyState} from '../EmptyState/EmptyState';
import {Inline, Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {TextField} from '../TextField/TextField';
import {componentParameters, story, Story} from '../../storybook/meta';
import {playClick} from '../../storybook/play';
import styles from './VirtualList.stories.module.css';

type Row = {
	id: string;
	title: string;
	body: string;
};

function createRows(count: number): Row[] {
	return Array.from({length: count}, (_, index) => {
		const lines = (index % 5) + 1;
		const body = Array.from({length: lines}, (__, line) => (
			`Строка ${line + 1}: контент элемента #${index + 1}. `
		)).join('');

		return {
			id: `row-${index}`,
			title: `Элемент ${index + 1}`,
			body,
		};
	});
}

export default {
	title: 'altum/Components/VirtualList',
	component: VirtualList,
	tags: ['autodocs'],
	parameters: {
		...componentParameters(
			'Виртуализированный список для больших наборов данных. Высота каждой строки измеряется по контенту (ResizeObserver).',
		),
		controls: {
			exclude: [
				'items',
				'renderItem',
				'getItemKey',
				'onScroll'
			],
		},
	},
	argTypes: {
		items: {
			control: false,
			table: {disable: true}
		},
		renderItem: {
			control: false,
			table: {disable: true}
		},
		getItemKey: {
			control: false,
			table: {disable: true}
		},
		height: {
			control: 'text',
			description: 'Высота собственного вьюпорта',
		},
		estimateSize: {
			control: 'number',
			description: 'Оценка высоты строки до измерения',
		},
		overscan: {
			control: 'number',
			description: 'Дополнительные строки за краем вьюпорта',
		},
		gap: {
			control: 'number',
			description: 'Промежуток между строками, px',
		},
		useWindowScroll: {
			control: 'boolean',
			description: 'Виртуализация относительно window',
		},
		onScroll: {
			action: 'scroll',
			table: {disable: true},
		},
		onRangeChange: {
			action: 'rangeChange',
			table: {disable: true},
		},
	},
} satisfies Meta;

export const VariableHeight: Story<VirtualListProps<Row>> = {
	render: function VariableHeightRender() {
		const items = useMemo(() => createRows(5_000), []);
		const listRef = useRef<VirtualListHandle>(null);

		return (
			<div className={styles.demo}>
				<div className={styles.toolbar}>
					<Text size='sm'>
						5 000 элементов разной высоты
					</Text>
					<ButtonGroup
						size='sm'
						aria-label='Прокрутка'
					>
						<ButtonGroup.Item
							onClick={() => listRef.current?.scrollToIndex(0)}
						>
							В начало
						</ButtonGroup.Item>
						<ButtonGroup.Item
							onClick={() => listRef.current?.scrollToIndex(2499, {align: 'start'})}
						>
							К #2500
						</ButtonGroup.Item>
						<ButtonGroup.Item
							onClick={() => listRef.current?.scrollToIndex(items.length - 1, {align: 'end'})}
						>
							В конец
						</ButtonGroup.Item>
					</ButtonGroup>
				</div>
				<VirtualList
					ref={listRef}
					items={items}
					height={360}
					estimateSize={72}
					gap={8}
					getItemKey={(item) => item.id}
					renderItem={({item}) => (
						<div className={styles.row}>
							<strong className={styles.rowTitle}>
								{item.title}
							</strong>
							<p className={styles.rowBody}>
								{item.body}
							</p>
						</div>
					)}
				/>
			</div>
		);
	},
	parameters: story('Каждая строка занимает высоту по контенту; в DOM только видимые + overscan.'),
};

export const CompactRows: Story<VirtualListProps<Row>> = {
	render: function CompactRowsRender() {
		const items = useMemo(() => createRows(10_000).map((row) => ({
			...row,
			body: `Короткий текст для ${row.title}`,
		})), []);

		return (
			<VirtualList
				items={items}
				height={320}
				estimateSize={44}
				gap={4}
				getItemKey={(item) => item.id}
				renderItem={({item, index}) => (
					<div className={styles.compactRow}>
						<span className={styles.index}>
							{index + 1}
						</span>
						<span>
							{item.body}
						</span>
					</div>
				)}
			/>
		);
	},
	parameters: story('10 000 относительно коротких строк.'),
};

export const Playground: Story<VirtualListProps<Row>> = {
	render: function PlaygroundRender({height, estimateSize, overscan, gap}) {
		const items = useMemo(() => createRows(1_000), []);
		const listRef = useRef<VirtualListHandle>(null);
		const [rangeLabel, setRangeLabel] = useState('—');

		return (
			<div className={styles.demo}>
				<div className={styles.toolbar}>
					<Button
						size='sm'
						onClick={() => listRef.current?.scrollToIndex(500, {align: 'center'})}
					>
						К элементу 501
					</Button>
					<span
						aria-live='polite'
						style={{
							fontSize: 12,
							color: 'var(--altum-color-muted)',
						}}
					>
						{rangeLabel}
					</span>
				</div>
				<VirtualList
					ref={listRef}
					items={items}
					height={height}
					estimateSize={typeof estimateSize === 'number' ? estimateSize : 64}
					overscan={overscan}
					gap={gap}
					getItemKey={(item) => item.id}
					onRangeChange={({start, end, count}) => {
						if (end < start || count === 0) {
							setRangeLabel('Пусто');
							return;
						}
						setRangeLabel(`Показано ${start + 1}–${end + 1} из ${count}`);
					}}
					onRangeChangeOptions={{
						mode: 'visible',
						flush: 'idle'
					}}
					renderItem={({item}) => (
						<div className={styles.row}>
							<strong className={styles.rowTitle}>
								{item.title}
							</strong>
							<p className={styles.rowBody}>
								{item.body}
							</p>
						</div>
					)}
				/>
			</div>
		);
	},
	args: {
		height: 360,
		estimateSize: 64,
		overscan: 4,
		gap: 8,
	},
	parameters: story(
		'`onRangeChange` → a11y-summary «показано N–M из total». `onRangeChangeOptions.flush: idle` — не на каждый кадр.',
	),
};

export const ExternalScrollParent: Story<VirtualListProps<Row>> = {
	render: function ExternalScrollParentRender() {
		const items = useMemo(() => createRows(800), []);
		const scrollRef = useRef<HTMLDivElement>(null);
		const listRef = useRef<VirtualListHandle>(null);

		return (
			<div className={styles.externalDemo}>
				<div className={styles.toolbar}>
					<Text size='sm'>
						Список внутри общего workspace-скроллера
					</Text>
					<Button
						size='sm'
						onClick={() => listRef.current?.scrollToIndex(400, {align: 'start'})}
					>
						К #401
					</Button>
				</div>
				<div ref={scrollRef} className={styles.externalScroller}>
					<div className={styles.externalLead}>
						Шапка workspace — скролл общий для всей колонки.
					</div>
					<VirtualList
						ref={listRef}
						items={items}
						scrollElement={scrollRef}
						estimateSize={72}
						gap={8}
						getItemKey={(item) => item.id}
						renderItem={({item}) => (
							<div className={styles.row}>
								<strong className={styles.rowTitle}>
									{item.title}
								</strong>
								<p className={styles.rowBody}>
									{item.body}
								</p>
							</div>
						)}
					/>
					<div className={styles.externalLead}>
						Футер после списка.
					</div>
				</div>
			</div>
		);
	},
	parameters: story('`scrollElement` — виртуализация относительно внешнего overflow-контейнера.'),
};

export const Empty: Story<VirtualListProps<Row>> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 480}}>
			<VirtualList
				items={[]}
				height={200}
				estimateSize={64}
				renderItem={() => null}
			/>
			<EmptyState
				size='sm'
				title='Список пуст'
				description='Нет элементов для виртуализации.'
			/>
		</Stack>
	),
	parameters: story('Пустой набор: вьюпорт без строк.'),
};

export const OverflowText: Story<VirtualListProps<Row>> = {
	render: function OverflowTextRender() {
		const items = useMemo(() => [
			{
				id: 'long-1',
				title: 'Очень длинный заголовок элемента, который не помещается в одну строку карточки списка',
				body: 'super-long-identifier-that-overflows-the-control@example.com — дополнительное пояснение с единицами измерения и уточнениями',
			},
			{
				id: 'long-2',
				title: 'Ещё один элемент с переполнением',
				body: 'Короткий текст',
			},
		], []);

		return (
			<VirtualList
				items={items}
				height={220}
				estimateSize={88}
				gap={8}
				getItemKey={(item) => item.id}
				renderItem={({item}) => (
					<div className={styles.row}>
						<strong className={styles.rowTitle}>
							{item.title}
						</strong>
						<p className={styles.rowBody}>
							{item.body}
						</p>
					</div>
				)}
			/>
		);
	},
	parameters: story('Длинный текст в строке виртуального списка.'),
};

export const Interaction: Story<VirtualListProps<Row>> = {
	render: function InteractionRender() {
		const items = useMemo(() => createRows(200), []);
		const listRef = useRef<VirtualListHandle>(null);

		return (
			<div className={styles.demo}>
				<div className={styles.toolbar}>
					<Button
						size='sm'
						onClick={() => listRef.current?.scrollToIndex(80, {align: 'center'})}
					>
						К элементу 81
					</Button>
				</div>
				<VirtualList
					ref={listRef}
					items={items}
					height={280}
					estimateSize={64}
					gap={8}
					getItemKey={(item) => item.id}
					renderItem={({item}) => (
						<div className={styles.row}>
							<strong className={styles.rowTitle}>
								{item.title}
							</strong>
							<p className={styles.rowBody}>
								{item.body}
							</p>
						</div>
					)}
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playClick(canvasElement, 'button');
	},
	parameters: story('Play прокручивает список к элементу 81.'),
};

export const UsageExample: Story<VirtualListProps<Row>> = {
	render: function UsageExampleRender() {
		const allItems = useMemo(() => createRows(400).map((row) => ({
			...row,
			body: `Короткий текст для ${row.title}`,
		})), []);
		const [query, setQuery] = useState('');
		const filtered = useMemo(() => {
			const needle = query.trim().toLowerCase();
			if (!needle) return allItems;
			return allItems.filter((item) => item.title.toLowerCase().includes(needle));
		}, [allItems, query,]);

		return (
			<Card
				style={{maxWidth: 480}}
				header={(
					<Text weight='bold'>
						Журнал событий
					</Text>
				)}
			>
				<Stack gap='md'>
					<TextField
						label='Поиск'
						labelPlacement='none'
						placeholder='Фильтр по названию'
						value={query}
						onChange={(event) => setQuery(event.target.value)}
					/>
					{filtered.length === 0 ? (
						<EmptyState
							size='sm'
							title='Ничего не найдено'
							description='Измените запрос'
						/>
					) : (
						<VirtualList
							items={filtered}
							height={280}
							estimateSize={44}
							gap={4}
							getItemKey={(item) => item.id}
							renderItem={({item, index}) => (
								<div className={styles.compactRow}>
									<span className={styles.index}>
										{index + 1}
									</span>
									<span>
										{item.title}
									</span>
								</div>
							)}
						/>
					)}
					<Inline gap='sm'>
						<Text size='sm' color='muted'>
							{filtered.length}
							{' '}
							из
							{' '}
							{allItems.length}
						</Text>
					</Inline>
				</Stack>
			</Card>
		);
	},
	parameters: story('Карточка с поиском и виртуализированным журналом.'),
};
