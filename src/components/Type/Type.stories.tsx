import type {Meta} from '@storybook/react';
import React from 'react';
import {Type, TypeProps} from './Type';
import {Box} from '../Box/Box';
import {Stack} from '../Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

const TYPES = [
	'page',
	'modal',
	'section',
	'card',
	'lead',
	'body',
	'subtitle',
	'label',
	'caption',
] as const;

const frame = {
	maxWidth: 480,
	padding: 'var(--altum-g-space-5)',
};

export default {
	title: 'altum/Components/Type',
	component: Type,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Роль текста: Title или Text с фиксированным кеглем. Гайд — история Guide.',
	),
	argTypes: {
		type: {
			control: 'select',
			options: [...TYPES],
			description: 'Роль начертания. Тег заголовка зашит в роль',
		},
		children: {control: 'text'},
	},
} satisfies Meta<typeof Type>;

export const Playground: Story<TypeProps> = {
	args: {
		type: 'page',
		children: 'Настройки',
	},
	parameters: story('Одна роль. Размер и вес менять нечем — только `type`.'),
};

export const Guide: Story<TypeProps> = {
	render: () => (
		<Stack
			gap='lg'
			style={{maxWidth: 640}}
		>
			<Stack gap='xs'>
				<Type type='caption'>
					Экран
				</Type>
				<Box
					variant='plain'
					border={false}
					shadow='none'
					style={frame}
				>
					<Stack gap='sm'>
						<Type type='page'>
							Настройки
						</Type>
						<Type type='lead'>
							Профиль, доступ и уведомления команды.
						</Type>
						<Type type='section'>
							Оплата
						</Type>
						<Type type='subtitle'>
							Способ списания и закрывающие документы.
						</Type>
						<Type type='body'>
							Счёт выставляется первого числа. Закрывающие документы приходят на почту владельца.
						</Type>
						<Type type='caption'>
							Следующее списание — 1 ноября
						</Type>
					</Stack>
				</Box>
			</Stack>
			<Stack gap='xs'>
				<Type type='caption'>
					Диалог и карточка
				</Type>
				<Box
					variant='elevated'
					style={frame}
				>
					<Stack gap='sm'>
						<Type type='modal'>
							Удалить проект
						</Type>
						<Type type='subtitle'>
							Восстановить его будет нельзя.
						</Type>
						<Type type='card'>
							Счета
						</Type>
						<Type type='body'>
							Три неоплаченных счёта за сентябрь.
						</Type>
						<Type type='label'>
							Команда
						</Type>
						<Type type='caption'>
							12 человек · обновлено сегодня
						</Type>
					</Stack>
				</Box>
			</Stack>
		</Stack>
	),
	parameters: story(
		'Один заголовок экрана. Диалог тише страницы, карточка тише секции. Пояснение — subtitle, длинный текст — body, мета — caption.',
	),
};
