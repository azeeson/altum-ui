import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {ActionSheetTrigger, type ActionSheetTriggerProps} from './ActionSheetTrigger';
import {OverflowActions} from '../OverflowActions/OverflowActions';
import {Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {IconCopy} from '../../icons/icons/IconCopy';
import {IconTrash} from '../../icons/icons/IconTrash';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/ActionSheetTrigger',
	component: ActionSheetTrigger,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Невидимая обёртка: long-press по children открывает вложенный OverflowActions. '
		+ 'На touch+mobile по умолчанию скрывает кнопку ⋯.',
	),
} satisfies Meta<typeof ActionSheetTrigger>;

export const Playground: Story<ActionSheetTriggerProps> = {
	render: function PlaygroundRender() {
		const [log, setLog] = useState('—');
		return (
			<Stack gap='md' style={{maxWidth: 360}}>
				<Text size='sm' color='muted'>
					Зажмите карточку. На узком экране / touch эмулируйте device toolbar — ⋯ исчезнет,
					меню откроется long-press.
				</Text>
				<ActionSheetTrigger>
					<div
						style={{
							display: 'block',
							width: '100%',
							textAlign: 'left',
							padding: 'var(--altum-g-space-4)',
							border: '1px solid var(--altum-color-border)',
							borderRadius: 'var(--altum-g-radius)',
							background: 'var(--altum-color-surface)',
							font: 'inherit',
							color: 'inherit',
						}}
					>
						<Stack gap='sm'>
							<Text size='md'>
								Карточка задачи
							</Text>
							<OverflowActions visibleCount={0} display='icon'>
								<OverflowActions.Item
									icon={<IconCopy size={16} />}
									label='Дублировать'
									onSelect={() => setLog('Дублировать')}
								/>
								<OverflowActions.Item
									icon={<IconTrash size={16} />}
									label='Удалить'
									onSelect={() => setLog('Удалить')}
								/>
							</OverflowActions>
						</Stack>
					</div>
				</ActionSheetTrigger>
				<Text size='sm' color='muted'>
					Действие:
					{' '}
					{log}
				</Text>
			</Stack>
		);
	},
	parameters: story('Карточка без role="button": long-press на хосте открывает OverflowActions.'),
};

export const WithDesktopOverflow: Story<ActionSheetTriggerProps> = {
	render: function DesktopOverflowRender() {
		const [log, setLog] = useState('—');
		return (
			<Stack gap='md' style={{maxWidth: 360}}>
				<Text size='sm' color='muted'>
					На десктопе ⋯ виден; long-press дополнительно открывает sheet на touch.
				</Text>
				<ActionSheetTrigger showOverflowTrigger>
					<div
						style={{
							padding: 'var(--altum-g-space-4)',
							border: '1px solid var(--altum-color-border)',
							borderRadius: 'var(--altum-g-radius)',
							background: 'var(--altum-color-surface)',
						}}
					>
						<Stack gap='sm'>
							<Text size='md'>
								Заметка
							</Text>
							<OverflowActions visibleCount={0} display='icon'>
								<OverflowActions.Item
									icon={<IconCopy size={16} />}
									label='Копировать'
									onSelect={() => setLog('Копировать')}
								/>
								<OverflowActions.Item
									icon={<IconTrash size={16} />}
									label='Удалить'
									onSelect={() => setLog('Удалить')}
								/>
							</OverflowActions>
						</Stack>
					</div>
				</ActionSheetTrigger>
				<Text size='sm' color='muted'>
					Действие:
					{' '}
					{log}
				</Text>
			</Stack>
		);
	},
	parameters: story('`showOverflowTrigger` — кнопка ⋯ всегда видна.'),
};
