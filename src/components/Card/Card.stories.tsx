import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Card, CardProps} from './Card';
import {Text} from '../Text/Text';
import {Button} from '../Button/Button';
import {Badge} from '../Badge/Badge';
import {Grid} from '../Grid/Grid';
import {Stack, Inline} from '../Layout';
import {Media} from '../Media/Media';
import {demoImage} from '../../storybook/demoImages';
import {componentParameters, story, Story} from '../../storybook/meta';

const LONG_BODY = 'Элементы базы данных прошли проверку целостности, но отчёт содержит очень длинное описание, которое проверяет переполнение карточки и перенос строк. '.repeat(3);

export default {
	title: 'altum/Components/Card',
	component: Card,
	tags: ['autodocs'],
	parameters: componentParameters('Контейнер с опциональным заголовком, подвалом и эффектом при наведении.'),
	argTypes: {
		variant: {
			control: {
				type: 'select',
				options: ['outlined', 'elevated'],
			},
			description: 'Вариант поверхности',
		},
		hoverable: {
			control: 'boolean',
			description: 'Эффект при наведении курсора',
		},
		loading: {
			control: 'boolean',
			description: 'Спиннер поверх карточки',
		},
		radius: {
			control: {
				type: 'select',
				options: [
					'none',
					'sm',
					'md',
					'lg'
				],
			},
			description: 'Радиус скругления',
		},
		onClick: {
			action: 'onClick',
			description: 'Клик по карточке (корень станет button)',
		},
	},
} satisfies Meta<typeof Card>;

export const Playground: Story<CardProps> = {
	render: (args) => (
		<div style={{maxWidth: '350px'}}>
			<Card
				{...args}
				header={(
					<Text weight='bold'>
						Базовый отчёт
					</Text>
				)}
				actions={(
					<Text size='xs'>
						Обновлено 5 минут назад
					</Text>
				)}
			>
				<Text size='sm'>
					Элементы базы данных прошли проверку целостности.
				</Text>
			</Card>
		</div>
	),
	args: {
		hoverable: false,
		loading: false,
		variant: 'outlined',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const HoverableCard: Story<CardProps> = {
	render: () => (
		<div style={{maxWidth: '350px'}}>
			<Card
				hoverable
				header={(
					<Text weight='bold'>
						Интерактивная панель
					</Text>
				)}
			>
				<Text size='sm'>
					Эта карточка приподнимается при наведении курсора мыши.
				</Text>
			</Card>
		</div>
	),
	parameters: story('Карточка с эффектом при наведении.'),
};

export const Variants: Story<CardProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 350}}>
			<Card
				variant='outlined'
				header={(
					<Text weight='bold'>
						Outlined
					</Text>
				)}
			>
				<Text size='sm'>
					Рамка без тени — по умолчанию.
				</Text>
			</Card>
			<Card
				variant='elevated'
				header={(
					<Text weight='bold'>
						Elevated
					</Text>
				)}
			>
				<Text size='sm'>
					Приподнятая карточка с тенью.
				</Text>
			</Card>
		</Stack>
	),
	parameters: story('Варианты: outlined — рамка, elevated — тень.'),
};

export const Compound: Story<CardProps> = {
	render: () => (
		<div style={{maxWidth: 360}}>
			<Card
				variant='elevated'
				header={(
					<Text weight='bold'>
						Секции карточки
					</Text>
				)}
				media={(
					<Media
						src={demoImage(1)}
						alt='Превью'
						ratio={16 / 9}
						rounded={false}
					/>
				)}
				actions={(
					<>
						<Button size='sm' variant='secondary'>
							Отмена
						</Button>
						<Button size='sm'>
							Открыть
						</Button>
					</>
				)}
			>
				<Text size='sm'>
					header, media, children и actions — отдельные секции.
				</Text>
			</Card>
		</div>
	),
	parameters: story('Секции: header / media / children / actions.'),
};

export const Loading: Story<CardProps> = {
	render: function LoadingRender() {
		const [loading, setLoading] = useState(true);
		return (
			<div style={{maxWidth: 350}}>
				<Card
					loading={loading}
					header={(
						<Text weight='bold'>
							Загрузка данных
						</Text>
					)}
				>
					<Text size='sm'>
						Спиннер поверх контента при `loading`.
					</Text>
				</Card>
				<div style={{marginTop: 'var(--altum-g-space-3)'}}>
					<Button
						size='sm'
						variant='secondary'
						onClick={() => setLoading((v) => !v)}
					>
						{loading ? 'Завершить' : 'Загрузить снова'}
					</Button>
				</div>
			</div>
		);
	},
	parameters: story('`loading` — overlay и Spinner.'),
};

export const Empty: Story<CardProps> = {
	render: () => (
		<div style={{maxWidth: 350}}>
			<Card variant='outlined' />
		</div>
	),
	parameters: story('Пустая карточка без секций.'),
};

export const OverflowText: Story<CardProps> = {
	render: () => (
		<div style={{maxWidth: 280}}>
			<Card
				header={(
					<Text weight='bold'>
						Очень длинный заголовок карточки без сокращения
					</Text>
				)}
				actions={(
					<Button size='sm'>
						Подробнее о проверке целостности
					</Button>
				)}
			>
				<Text size='sm'>
					{LONG_BODY}
				</Text>
			</Card>
		</div>
	),
	parameters: story('Длинный заголовок, текст и действие в узкой карточке.'),
};

export const Clickable: Story<CardProps> = {
	render: () => (
		<div style={{maxWidth: 350}}>
			<Card
				hoverable
				as='button'
				onClick={() => {}}
				header={(
					<Text weight='bold'>
						Выбрать план
					</Text>
				)}
			>
				<Text size='sm'>
					Клик по всей карточке — корень `button`.
				</Text>
			</Card>
		</div>
	),
	play: async ({canvasElement}) => {
		const card = canvasElement.querySelector('button');
		if (!(card instanceof HTMLButtonElement)) {
			throw new Error('Не найдена кликабельная Card');
		}
		card.focus();
		card.click();
	},
	parameters: story('Play: фокус и клик по карточке-кнопке.'),
};

export const UsageExample: Story<CardProps> = {
	render: () => (
		<Grid
			columns={2}
			gap='md'
			style={{maxWidth: 640}}
		>
			{[
				{
					title: 'Отчёт за май',
					status: 'Готово',
					body: '12 страниц, без замечаний.'
				},
				{
					title: 'Отчёт за июнь',
					status: 'Черновик',
					body: 'Ожидает проверки аналитика.'
				},
			].map((item) => (
				<Card
					key={item.title}
					hoverable
					header={(
						<Inline
							gap='sm'
							align='center'
							justify='between'
						>
							<Text weight='bold'>
								{item.title}
							</Text>
							<Badge
								label={item.status}
								variant='secondary'
								position='standalone'
							/>
						</Inline>
					)}
					actions={(
						<Button size='sm' variant='secondary'>
							Открыть
						</Button>
					)}
				>
					<Text size='sm'>
						{item.body}
					</Text>
				</Card>
			))}
		</Grid>
	),
	parameters: story('Сетка карточек с Badge и кнопкой действия.'),
};
