import type {Meta} from '@storybook/react';
import React, {useMemo, useState} from 'react';
import {SwipeToAction} from './SwipeToAction';
import type {SwipeAction, SwipeToActionProps} from './SwipeToAction.types';
import {Item} from '../Item/Item';
import {ActionSheetTrigger} from '../ActionSheetTrigger/ActionSheetTrigger';
import {Overflow} from '../Overflow/Overflow';
import {SortableList} from '../SortableList/SortableList';
import {VirtualList} from '../VirtualList/VirtualList';
import {Button} from '../Button/Button';
import {Stack} from '../Layout';
import {Text} from '../Text/Text';
import {IconCheckmark} from '../../icons/icons/IconCheckmark';
import {IconTrash} from '../../icons/icons/IconTrash';
import {IconArchive} from '../../icons/icons/IconArchive';
import {IconBell} from '../../icons/icons/IconBell';
import {IconClipboard} from '../../icons/icons/IconClipboard';
import {IconToDo} from '../../icons/icons/IconToDo';
import {IconStar} from '../../icons/icons/IconStar';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Mobile/SwipeToAction',
	component: SwipeToAction,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Touch-обёртка без chrome строки: свайп раскрывает действия (стиль iOS). '
		+ 'На desktop — только children. `swipeToTrigger` можно задать любому действию. '
		+ 'Высота кнопок = высота обёрнутого контента. Примеры — с `Item`.',
	),
} satisfies Meta<typeof SwipeToAction>;

function useLog() {
	const [log, setLog] = useState('—');
	const act = (name: string) => () => setLog(name);
	return {
		log,
		act
	};
}

export const WithItem: Story<SwipeToActionProps> = {
	render: function WithItemRender() {
		const {log, act} = useLog();
		const [gone, setGone] = useState(false);

		if (gone) {
			return (
				<Button
					variant='secondary'
					size='sm'
					onClick={() => setGone(false)}
				>
					Вернуть строку
				</Button>
			);
		}

		const leftActions: SwipeAction[] = [
			{
				id: 'done',
				label: 'Готово',
				icon: <IconCheckmark size={20} />,
				bg: 'var(--altum-color-status-success)',
				onClick: act('Готово'),
			},
		];

		const rightActions: SwipeAction[] = [
			{
				id: 'archive',
				label: 'Архив',
				icon: <IconArchive size={20} />,
				bg: 'var(--altum-color-status-info)',
				onClick: act('Архив'),
			},
			{
				id: 'delete',
				label: 'Удалить',
				icon: <IconTrash size={20} />,
				bg: 'var(--altum-color-status-error)',
				swipeToTrigger: true,
				onClick: () => {
					act('Удалить')();
					setGone(true);
				},
			},
		];

		return (
			<Stack gap='md' style={{maxWidth: 420}}>
				<Text size='sm' color='muted'>
					На touch: свайп влево/вправо. Full-swipe влево — «Удалить» (`swipeToTrigger`).
					На desktop обёртка прозрачна.
				</Text>
				<SwipeToAction leftActions={leftActions} rightActions={rightActions}>
					<Item
						interactive
						media={<IconBell size={20} />}
						mediaVariant='icon'
						title='Уведомление'
						description='Высота кнопок действий = высота Item'
					/>
				</SwipeToAction>
				<Text size='sm' color='muted'>
					Действие:
					{' '}
					{log}
				</Text>
			</Stack>
		);
	},
	parameters: story('Item внутри SwipeToAction; удаление с swipeToTrigger.'),
};

export const TriggerAnyAction: Story<SwipeToActionProps> = {
	render: function TriggerAnyActionRender() {
		const {log, act} = useLog();

		return (
			<Stack gap='md' style={{maxWidth: 420}}>
				<Text size='sm' color='muted'>
					`swipeToTrigger` на среднем действии («Архив»), не на крайнем.
				</Text>
				<SwipeToAction
					rightActions={[
						{
							id: 'share',
							label: 'Ещё',
							icon: <IconClipboard size={20} />,
							bg: 'var(--altum-color-status-info)',
							onClick: act('Ещё'),
						},
						{
							id: 'archive',
							label: 'Архив',
							icon: <IconArchive size={20} />,
							bg: 'var(--altum-color-brand)',
							swipeToTrigger: true,
							onClick: act('Архив (trigger)'),
						},
						{
							id: 'delete',
							label: 'Удалить',
							icon: <IconTrash size={20} />,
							bg: 'var(--altum-color-status-error)',
							onClick: act('Удалить'),
						},
					]}
				>
					<Item
						interactive
						media={<IconToDo size={20} />}
						mediaVariant='icon'
						title='Задача'
						description='Full-swipe раскрывает и запускает «Архив»'
					/>
				</SwipeToAction>
				<Text size='sm' color='muted'>
					Лог:
					{' '}
					{log}
				</Text>
			</Stack>
		);
	},
	parameters: story('swipeToTrigger на любом действии, не только последнем.'),
};

export const WithActionSheetTrigger: Story<SwipeToActionProps> = {
	render: function WithActionSheetTriggerRender() {
		const {log, act} = useLog();

		return (
			<Stack gap='md' style={{maxWidth: 420}}>
				<Text size='sm' color='muted'>
					Long-press (ActionSheetTrigger) открывает Overflow; свайп — отдельные
					действия. На touch+mobile ⋯ скрыты.
				</Text>
				<ActionSheetTrigger>
					<div>
						<SwipeToAction
							rightActions={[
								{
									id: 'delete',
									label: 'Удалить',
									icon: <IconTrash size={20} />,
									bg: 'var(--altum-color-status-error)',
									swipeToTrigger: true,
									onClick: act('Свайп: Удалить'),
								},
							]}
						>
							<Item
								interactive
								media={<IconBell size={20} />}
								mediaVariant='icon'
								title='Сообщение'
								description='Long-press → меню · свайп → удалить'
								actions={(
									<Overflow visibleCount={0}>
										<Overflow.Item
											icon={<IconStar size={16} />}
											label='В избранное'
											onSelect={act('Меню: Избранное')}
										/>
										<Overflow.Item
											icon={<IconArchive size={16} />}
											label='Архив'
											onSelect={act('Меню: Архив')}
										/>
										<Overflow.Item
											icon={<IconTrash size={16} />}
											label='Удалить'
											onSelect={act('Меню: Удалить')}
										/>
									</Overflow>
								)}
							/>
						</SwipeToAction>
					</div>
				</ActionSheetTrigger>
				<Text size='sm' color='muted'>
					Лог:
					{' '}
					{log}
				</Text>
			</Stack>
		);
	},
	parameters: story('Связка ActionSheetTrigger + SwipeToAction + Item + Overflow.'),
};

type SortRow = {
	id: string;
	title: string;
	subtitle: string
};

export const SortableListCombo: Story<SwipeToActionProps> = {
	render: function SortableListComboRender() {
		const [items, setItems] = useState<SortRow[]>([
			{
				id: '1',
				title: 'Дизайн-ревью',
				subtitle: 'Сегодня, 14:00'
			},
			{
				id: '2',
				title: 'Спринт-планирование',
				subtitle: 'Завтра, 10:30'
			},
			{
				id: '3',
				title: 'Релиз 0.2',
				subtitle: 'Пт, 16:00'
			},
		]);
		const {log, act} = useLog();

		return (
			<Stack gap='md' style={{maxWidth: 440}}>
				<Text size='sm' color='muted'>
					SortableList (plain) + ActionSheetTrigger + SwipeToAction + Item
				</Text>
				<SortableList
					variant='plain'
					items={items}
					onOrderChange={setItems}
					renderItem={(item) => (
						<ActionSheetTrigger>
							<div>
								<SwipeToAction
									leftActions={[
										{
											id: 'done',
											label: 'Готово',
											icon: <IconCheckmark size={20} />,
											bg: 'var(--altum-color-status-success)',
											onClick: act(`${item.title}: Готово`),
										},
									]}
									rightActions={[
										{
											id: 'delete',
											label: 'Удалить',
											icon: <IconTrash size={20} />,
											bg: 'var(--altum-color-status-error)',
											swipeToTrigger: true,
											onClick: () => {
												act(`${item.title}: Удалить`)();
												setItems((prev) => prev.filter((row) => row.id !== item.id));
											},
										},
									]}
								>
									<Item
										interactive
										title={item.title}
										description={item.subtitle}
										actions={(
											<Overflow visibleCount={0}>
												<Overflow.Item
													icon={<IconStar size={16} />}
													label='Закрепить'
													onSelect={act(`${item.title}: Закрепить`)}
												/>
												<Overflow.Item
													icon={<IconArchive size={16} />}
													label='Архив'
													onSelect={act(`${item.title}: Архив`)}
												/>
											</Overflow>
										)}
									/>
								</SwipeToAction>
							</div>
						</ActionSheetTrigger>
					)}
				/>
				<Text size='sm' color='muted'>
					Лог:
					{' '}
					{log}
				</Text>
			</Stack>
		);
	},
	parameters: story('Комбо: SortableList + ActionSheetTrigger + SwipeToAction + Item.'),
};

type MailRow = {
	id: string;
	from: string;
	subject: string;
	preview: string;
};

export const VirtualListCombo: Story<SwipeToActionProps> = {
	render: function VirtualListComboRender() {
		const {log, act} = useLog();
		const [items, setItems] = useState<MailRow[]>(() => Array.from({length: 40}, (_, i) => ({
			id: `m-${i}`,
			from: `Отправитель ${i + 1}`,
			subject: `Письмо #${i + 1}`,
			preview: 'Краткий превью текст сообщения для виртуального списка.',
		})));

		const keys = useMemo(() => items.map((item) => item.id), [items]);

		return (
			<Stack gap='md' style={{maxWidth: 480}}>
				<Text size='sm' color='muted'>
					VirtualList + ActionSheetTrigger + SwipeToAction + Item (
					{keys.length}
					{' '}
					строк)
				</Text>
				<VirtualList
					items={items}
					height={360}
					estimateSize={72}
					gap={8}
					getItemKey={(item) => item.id}
					aria-label='Письма'
					renderItem={({item, style}) => (
						<div style={style}>
							<ActionSheetTrigger>
								<div>
									<SwipeToAction
										rightActions={[
											{
												id: 'archive',
												label: 'Архив',
												icon: <IconArchive size={20} />,
												bg: 'var(--altum-color-status-info)',
												onClick: act(`${item.subject}: Архив`),
											},
											{
												id: 'delete',
												label: 'Удалить',
												icon: <IconTrash size={20} />,
												bg: 'var(--altum-color-status-error)',
												swipeToTrigger: true,
												onClick: () => {
													act(`${item.subject}: Удалить`)();
													setItems((prev) => prev.filter((row) => row.id !== item.id));
												},
											},
										]}
									>
										<Item
											interactive
											media={<IconBell size={18} />}
											mediaVariant='icon'
											title={item.from}
											description={(
												<>
													{item.subject}
													{' — '}
													{item.preview}
												</>
											)}
											actions={(
												<Overflow visibleCount={0}>
													<Overflow.Item
														icon={<IconStar size={16} />}
														label='Избранное'
														onSelect={act(`${item.subject}: Избранное`)}
													/>
													<Overflow.Item
														icon={<IconToDo size={16} />}
														label='Прочитано'
														onSelect={act(`${item.subject}: Прочитано`)}
													/>
												</Overflow>
											)}
										/>
									</SwipeToAction>
								</div>
							</ActionSheetTrigger>
						</div>
					)}
				/>
				<Text size='sm' color='muted'>
					Лог:
					{' '}
					{log}
				</Text>
			</Stack>
		);
	},
	parameters: story('Комбо: VirtualList + ActionSheetTrigger + SwipeToAction + Item.'),
};
