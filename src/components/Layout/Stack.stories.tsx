import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Stack, type StackProps} from './Stack';
import {ControlRow} from './ControlRow';
import {Inline} from './Inline';
import {Button} from '../Button/Button';
import {Chip} from '../Chip/Chip';
import {TextField} from '../TextField/TextField';
import {Select} from '../Select/Select';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Stack',
	component: Stack,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Вертикальный flex-стек с токенным gap. Для секций формы, колонок в сайдбаре и списков блоков. '
		+ 'Не для горизонтальных рядов — там Inline / ControlRow / Split.',
	),
} satisfies Meta<typeof Stack>;

const CITY_OPTIONS = [
	{
		label: 'Москва',
		value: 'msk'
	},
	{
		label: 'Казань',
		value: 'kzn'
	},
];

export const Playground: Story<StackProps> = {
	render: function FormSectionsRender() {
		const [city, setCity] = useState('');
		return (
			<Stack
				gap='md'
				style={{maxWidth: 420}}
			>
				<Text size='sm' color='muted'>
					Поля друг под другом с единым вертикальным ритмом (gap=«md»).
				</Text>
				<TextField label='Имя' width='full' />
				<ControlRow gap='sm' align='end'>
					<ControlRow.Item grow>
						<Select.Root
							options={CITY_OPTIONS}
							value={city}
							onChange={(value) => { if (!Array.isArray(value)) setCity(value); }}
						>
							<Select.Trigger label='Город' width='full' />
							<Select.Panel>
								<Select.List />
							</Select.Panel>
						</Select.Root>
					</ControlRow.Item>
					<Button variant='secondary'>
						Сброс
					</Button>
				</ControlRow>
				<Inline gap='xs'>
					<Chip variant='success' size='sm'>
						Готово
					</Chip>
					<Chip variant='info' size='sm'>
						Черновик
					</Chip>
					<Chip
						mode='tag'
						variant='secondary'
						size='sm'
					>
						v0.2
					</Chip>
				</Inline>
				<Button variant='primary'>
					Сохранить
				</Button>
			</Stack>
		);
	},
	parameters: story('Типичная форма: Stack → поля → ControlRow → Inline чипов.'),
};

export const WithGapScale: Story<StackProps> = {
	render: () => (
		<Stack gap='lg'>
			{([
				'xs',
				'sm',
				'md',
				'lg',
				'xl'
			] as const).map((gap) => (
				<Stack
					key={gap}
					gap={gap}
				>
					<Text size='sm' color='muted'>
						{`gap="${gap}"`}
					</Text>
					<div style={{
						height: 8,
						background: 'var(--altum-color-bg-muted, var(--altum-color-surface))',
						borderRadius: 'var(--altum-g-radius-sm)',
					}}
					/>
					<div style={{
						height: 8,
						background: 'var(--altum-color-bg-muted, var(--altum-color-surface))',
						borderRadius: 'var(--altum-g-radius-sm)',
					}}
					/>
				</Stack>
			))}
		</Stack>
	),
	parameters: story('Шкала токенных отступов Stack.'),
};
