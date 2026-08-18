import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Card, CardProps} from './Card';
import {Text} from '../Text/Text';
import {Button} from '../Button/Button';
import {Stack} from '../Layout/Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/Card',
	component: Card,
	tags: ['autodocs'],
	parameters: componentParameters('Контейнер с опциональным заголовком, подвалом и эффектом при наведении.'),
	argTypes: {
		hoverable: {
			control: 'boolean',
			description: 'Эффект при наведении курсора'
		},
	},
} satisfies Meta<typeof Card>;

export const Playground: Story<CardProps> = {
	render: (args) => (
		<div style={{maxWidth: '350px'}}>
			<Card {...args}>
				<Card.Header>
					<Text weight='bold'>
						Базовый отчёт
					</Text>
				</Card.Header>
				<Card.Body>
					<Text size='sm'>
						Элементы базы данных прошли проверку целостности.
					</Text>
				</Card.Body>
				<Card.Actions>
					<Text size='xs'>
						Обновлено 5 минут назад
					</Text>
				</Card.Actions>
			</Card>
		</div>
	),
	args: {hoverable: false},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const HoverableCard: Story<CardProps> = {
	render: () => (
		<div style={{maxWidth: '350px'}}>
			<Card hoverable>
				<Card.Header>
					<Text weight='bold'>
						Интерактивная панель
					</Text>
				</Card.Header>
				<Card.Body>
					<Text size='sm'>
						Эта карточка приподнимается при наведении курсора мыши.
					</Text>
				</Card.Body>
			</Card>
		</div>
	),
	parameters: story('Карточка с эффектом при наведении.'),
};

export const Variants: Story<CardProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 350}}>
			<Card variant='outlined'>
				<Card.Header>
					<Text weight='bold'>
						Outlined
					</Text>
				</Card.Header>
				<Card.Body>
					<Text size='sm'>
						Рамка без тени — по умолчанию.
					</Text>
				</Card.Body>
			</Card>
			<Card variant='elevated'>
				<Card.Header>
					<Text weight='bold'>
						Elevated
					</Text>
				</Card.Header>
				<Card.Body>
					<Text size='sm'>
						Приподнятая карточка с тенью.
					</Text>
				</Card.Body>
			</Card>
			<Card variant='ghost'>
				<Card.Header>
					<Text weight='bold'>
						Ghost
					</Text>
				</Card.Header>
				<Card.Body>
					<Text size='sm'>
						Без рамки и фона — только контент.
					</Text>
				</Card.Body>
			</Card>
		</Stack>
	),
	parameters: story('Варианты: outlined / elevated / ghost.'),
};

export const Compound: Story<CardProps> = {
	render: () => (
		<div style={{maxWidth: 360}}>
			<Card variant='elevated'>
				<Card.Header>
					<Text weight='bold'>
						Составной API
					</Text>
				</Card.Header>
				<Card.Media>
					<div style={{
						height: 140,
						background: 'var(--altum-color-surface)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
					>
						<Text size='sm' color='secondary'>
							Слот Media
						</Text>
					</div>
				</Card.Media>
				<Card.Body>
					<Text size='sm'>
						Header, Media, Body и Actions — отдельные секции.
					</Text>
				</Card.Body>
				<Card.Actions>
					<Button size='sm' variant='secondary'>
						Отмена
					</Button>
					<Button size='sm'>
						Открыть
					</Button>
				</Card.Actions>
			</Card>
		</div>
	),
	parameters: story('Составной API: Card.Header / Media / Body / Actions.'),
};

export const Loading: Story<CardProps> = {
	render: function LoadingRender() {
		const [loading, setLoading] = useState(true);
		return (
			<div style={{maxWidth: 350}}>
				<Card loading={loading}>
					<Card.Header>
						<Text weight='bold'>
							Загрузка данных
						</Text>
					</Card.Header>
					<Card.Body>
						<Text size='sm'>
							Спиннер поверх контента при `loading`.
						</Text>
					</Card.Body>
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
	parameters: story('`loading` — overlay со Spinner.'),
};
