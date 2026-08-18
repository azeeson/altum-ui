import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {
	OverflowActions,
	type OverflowActionsProps,
} from './OverflowActions';
import {ActionSheetTrigger} from '../ActionSheetTrigger/ActionSheetTrigger';
import {Inline, Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {IconCopy} from '../../icons/icons/IconCopy';
import {IconPencil} from '../../icons/icons/IconPencil';
import {IconTrash} from '../../icons/icons/IconTrash';
import {IconExport} from '../../icons/icons/IconExport';
import {IconStar} from '../../icons/icons/IconStar';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/OverflowActions',
	component: OverflowActions,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Панель действий с overflow в Dropdown (⋯). Составной: OverflowActions + Item. '
		+ '`visibleCount={0}` — всё в меню; `display` влияет только на видимые кнопки.',
	),
} satisfies Meta<typeof OverflowActions>;

function useLog() {
	const [log, setLog] = useState('—');
	const on = (name: string) => () => setLog(name);
	return {
		log,
		on
	};
}

export const VisibleTwo: Story<OverflowActionsProps> = {
	render: function VisibleTwoRender() {
		const {log, on} = useLog();
		return (
			<Stack gap='md'>
				<OverflowActions visibleCount={2} display='icon-label'>
					<OverflowActions.Item
						icon={<IconPencil size={16} />}
						label='Изменить'
						onSelect={on('Изменить')}
					/>
					<OverflowActions.Item
						icon={<IconCopy size={16} />}
						label='Копировать'
						onSelect={on('Копировать')}
					/>
					<OverflowActions.Item
						icon={<IconExport size={16} />}
						label='Поделиться'
						onSelect={on('Поделиться')}
					/>
					<OverflowActions.Item
						label='Удалить'
						onSelect={on('Удалить')}
					/>
				</OverflowActions>
				<Text size='sm' color='muted'>
					Последнее действие:
					{' '}
					{log}
				</Text>
			</Stack>
		);
	},
	parameters: story('Два действия снаружи, остальные в ⋯ (без иконки — только лейбл).'),
};

export const IconsOnly: Story<OverflowActionsProps> = {
	render: () => (
		<OverflowActions visibleCount={3} display='icon'>
			<OverflowActions.Item
				icon={<IconStar size={16} />}
				label='В избранное'
				onSelect={() => undefined}
			/>
			<OverflowActions.Item
				icon={<IconPencil size={16} />}
				label='Изменить'
				onSelect={() => undefined}
			/>
			<OverflowActions.Item
				icon={<IconCopy size={16} />}
				label='Копировать'
				onSelect={() => undefined}
			/>
			<OverflowActions.Item
				icon={<IconTrash size={16} />}
				label='Удалить'
				onSelect={() => undefined}
			/>
		</OverflowActions>
	),
	parameters: story('`display="icon"` — снаружи только иконки; в меню всегда иконка + лейбл.'),
};

export const AllInOverflow: Story<OverflowActionsProps> = {
	render: () => (
		<OverflowActions visibleCount={0}>
			<OverflowActions.Item
				icon={<IconPencil size={16} />}
				label='Изменить'
				onSelect={() => undefined}
			/>
			<OverflowActions.Item
				icon={<IconCopy size={16} />}
				label='Копировать'
				onSelect={() => undefined}
			/>
			<OverflowActions.Item label='Архивировать' onSelect={() => undefined} />
			<OverflowActions.Item
				icon={<IconTrash size={16} />}
				label='Удалить'
				onSelect={() => undefined}
			/>
		</OverflowActions>
	),
	parameters: story('`visibleCount={0}` — все действия только за ⋯.'),
};

export const WithActionSheetTrigger: Story<OverflowActionsProps> = {
	render: function WithActionSheetTriggerRender() {
		const {log, on} = useLog();
		return (
			<Stack
				gap='md'
			
				style={{maxWidth: 420}}
			>
				<Text size='sm' color='muted'>
					Удерживайте строку (~500 мс): откроется меню. На touch+mobile кнопка ⋯ скрыта
					(`ActionSheetTrigger`, default showOverflowTrigger=false).
				</Text>
				<ActionSheetTrigger>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: 'var(--altum-g-space-3)',
							padding: 'var(--altum-g-space-3)',
							border: '1px solid var(--altum-color-border)',
							borderRadius: 'var(--altum-g-radius)',
							background: 'var(--altum-color-surface)',
						}}
					>
						<Stack gap='xs'>
							<Text size='sm'>
								Отчёт за июль
							</Text>
							<Text size='xs' color='muted'>
								Long-press → действия
							</Text>
						</Stack>
						<OverflowActions visibleCount={0}>
							<OverflowActions.Item
								icon={<IconExport size={16} />}
								label='Поделиться'
								onSelect={on('Поделиться')}
							/>
							<OverflowActions.Item
								icon={<IconPencil size={16} />}
								label='Переименовать'
								onSelect={on('Переименовать')}
							/>
							<OverflowActions.Item
								icon={<IconTrash size={16} />}
								label='Удалить'
								onSelect={on('Удалить')}
							/>
						</OverflowActions>
					</div>
				</ActionSheetTrigger>
				<Inline gap='sm'>
					<Text size='sm' color='muted'>
						Лог:
						{' '}
						{log}
					</Text>
				</Inline>
			</Stack>
		);
	},
	parameters: story('ActionSheetTrigger: долгое нажатие открывает OverflowActions; на мобиле ⋯ можно скрыть.'),
};
