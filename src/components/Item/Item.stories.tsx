import type {Meta} from '@storybook/react';
import React from 'react';
import {Item, ItemProps} from './Item';
import {Button} from '../Button/Button';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Card} from '../Card/Card';
import {Stack} from '../Layout';
import {Text} from '../Text/Text';
import {Avatar} from '../Avatar/Avatar';
import {IconGear} from '../../icons/icons/IconGear';
import {IconTrash} from '../../icons/icons/IconTrash';
import {IconFolder} from '../../icons/icons/IconFolder';
import {demoThumb} from '../../storybook/demoImages';
import {componentParameters, story, Story} from '../../storybook/meta';

const BOX_VARIANTS = [
	'ghost',
	'plain',
	'outlined',
	'elevated',
	'floating',
	'tinted',
	'secondary',
	'muted',
	'glass',
	'overlay',
] as const;

const LONG_TITLE = 'Очень длинное название документа без сокращения в узкой колонке списка';
const LONG_DESCRIPTION = 'Дополнительное описание с деталями, датами и ответственными, которое должно переноситься на несколько строк. '.repeat(2);

export default {
	title: 'altum/Components/Item',
	component: Item,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Универсальная строка контента: media + title/description + actions. Поверхность — Box (`variant`).',
	),
	argTypes: {
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg'],
			},
			description: 'Плотность строки',
		},
		variant: {
			control: {
				type: 'select',
				options: [...BOX_VARIANTS],
			},
			description: 'Вариант поверхности (Box)',
		},
		interactive: {
			control: 'boolean',
			description: 'Интерактивная строка (hover / курсор)',
		},
		wrap: {
			control: 'boolean',
			description: 'Перенос title и description вместо ellipsis',
		},
		mediaVariant: {
			control: {
				type: 'select',
				options: ['icon', 'image', 'avatar'],
			},
			description: 'Внешний вид media-слота',
		},
		title: {
			control: 'text',
		},
		description: {
			control: 'text',
		},
		onClick: {
			action: 'onClick',
		},
	},
} satisfies Meta<typeof Item>;

export const Playground: Story<ItemProps> = {
	render: (args) => (
		<div style={{maxWidth: 420}}>
			<Item
				{...args}
				media={<IconGear size={20} />}
				title={args.title ?? 'Настройки'}
				description={args.description ?? 'Профиль, уведомления и предпочтения'}
				actions={(
					<Button size='sm' variant='secondary'>
						Открыть
					</Button>
				)}
			/>
		</div>
	),
	args: {
		size: 'md',
		variant: 'ghost',
		interactive: false,
		wrap: false,
		title: 'Настройки',
		description: 'Профиль, уведомления и предпочтения',
	},
	parameters: story('Строка с иконкой, заголовком, описанием и действием.'),
};

export const Sizes: Story<ItemProps> = {
	render: () => (
		<Stack gap='sm' style={{maxWidth: 420}}>
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<Item
					key={size}
					size={size}
					variant='outlined'
					interactive
					media={<IconGear size={size === 'lg' ? 24 : size === 'md' ? 20 : 16} />}
					title={(
						<>
							Размер
							{' '}
							{size}
						</>
					)}
					description={(
						<>
							Плотность строки —
							{' '}
							{size}
						</>
					)}
					actions={(
						<Button size='sm' variant='secondary'>
							Открыть
						</Button>
					)}
				/>
			))}
		</Stack>
	),
	parameters: story('Варианты плотности sm / md / lg.'),
};

export const Variants: Story<ItemProps> = {
	render: () => (
		<Stack gap='sm' style={{maxWidth: 420}}>
			{BOX_VARIANTS.map((variant) => (
				<Item
					key={variant}
					variant={variant}
					interactive
					media={<IconGear size={20} />}
					title={(
						<>
							variant=
							{variant}
						</>
					)}
					description='Поверхность через Box'
				/>
			))}
		</Stack>
	),
	parameters: story('Варианты поверхности Box (`variant`).'),
};

export const MediaVariants: Story<ItemProps> = {
	render: () => (
		<Stack gap='sm' style={{maxWidth: 420}}>
			<Item
				mediaVariant='icon'
				media={<IconFolder size={20} />}
				title='Иконка'
				description='mediaVariant=icon'
			/>
			<Item
				mediaVariant='avatar'
				media={<Avatar name='Анна Иванова' size={32} />}
				title='Аватар'
				description='mediaVariant=avatar'
			/>
			<Item
				mediaVariant='image'
				media={(
					<img
						src={demoThumb(1)}
						alt=''
						width={40}
						height={40}
						style={{
							display: 'block',
							objectFit: 'cover'
						}}
					/>
				)}
				title='Изображение'
				description='mediaVariant=image'
			/>
		</Stack>
	),
	parameters: story('Слоты media: icon / avatar / image.'),
};

export const Interactive: Story<ItemProps> = {
	render: () => (
		<div style={{maxWidth: 420}}>
			<Item
				interactive
				as='button'
				onClick={() => {}}
				media={<IconGear size={20} />}
				title='Открыть настройки'
				description='Клик по всей строке'
			/>
		</div>
	),
	play: async ({canvasElement}) => {
		const row = canvasElement.querySelector('button');
		if (!(row instanceof HTMLButtonElement)) {
			throw new Error('Не найден интерактивный Item');
		}
		row.focus();
		row.click();
	},
	parameters: story('Play: фокус и клик по interactive-строке.'),
};

export const OverflowText: Story<ItemProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 280}}>
			<Item
				variant='outlined'
				media={<IconFolder size={20} />}
				title={LONG_TITLE}
				description={LONG_DESCRIPTION}
				actions={(
					<ButtonIcon
						variant='ghost'
						size='sm'
						icon={<IconTrash/>}
						aria-label='Удалить'
					/>
				)}
			/>
			<Item
				wrap
				variant='outlined'
				media={<IconFolder size={20} />}
				title={LONG_TITLE}
				description={LONG_DESCRIPTION}
				actions={(
					<ButtonIcon
						variant='ghost'
						size='sm'
						icon={<IconTrash/>}
						aria-label='Удалить'
					/>
				)}
			/>
		</Stack>
	),
	parameters: story('Длинный title / description: ellipsis по умолчанию и перенос с `wrap`.'),
};

export const TitleOnly: Story<ItemProps> = {
	render: () => (
		<div style={{maxWidth: 420}}>
			<Item title='Только заголовок' />
		</div>
	),
	parameters: story('Минимальная строка без media и actions.'),
};

export const UsageExample: Story<ItemProps> = {
	render: () => (
		<Card
			variant='outlined'
			header={(
				<Text weight='bold'>
					Файлы
				</Text>
			)}
			style={{maxWidth: 420}}
		>
			<Stack gap='xs'>
				<Item
					media={<IconFolder size={20} />}
					title='Документы'
					description='12 файлов'
					actions={(
						<Button size='sm' variant='ghost'>
							Открыть
						</Button>
					)}
				/>
				<Item
					media={<IconGear size={20} />}
					title='Настройки экспорта'
					description='PDF, CSV'
					actions={(
						<Button size='sm' variant='ghost'>
							Изменить
						</Button>
					)}
				/>
			</Stack>
		</Card>
	),
	parameters: story('Список Item внутри Card.'),
};
