import type {Meta} from '@storybook/react';
import React from 'react';
import {SkipLink, SkipLinkProps} from './SkipLink';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Utilities/SkipLink',
	component: SkipLink,
	tags: ['autodocs'],
	parameters: componentParameters(
		'«Перейти к содержимому» — появляется при фокусе (a11y-база).',
	),
} satisfies Meta<typeof SkipLink>;

export const Playground: Story<SkipLinkProps> = {
	render: () => (
		<div>
			<SkipLink href='#skip-main'>
				К основному содержимому
			</SkipLink>
			<header style={{
				padding: 'var(--altum-g-space-4)',
				borderBottom: '1px solid var(--altum-color-input-border)'
			}}
			>
				<Text size='md' weight='medium'>
					Шапка приложения
				</Text>
				<Text size='sm' color='secondary'>
					Нажмите Tab — skip-link появится вверху экрана.
				</Text>
			</header>
			<main
				id='skip-main'
				tabIndex={-1}
				style={{
					padding: 'var(--altum-g-space-6)',
					outline: 'none',
				}}
			>
				<Text size='md'>
					Основной контент страницы. Фокус переходит сюда по ссылке.
				</Text>
			</main>
		</div>
	),
	parameters: story('Ссылка видна только при фокусе (Tab с начала страницы).'),
};

export const WithCustomTarget: Story<SkipLinkProps> = {
	render: () => (
		<div>
			<SkipLink href='#settings-panel'>
				К настройкам
			</SkipLink>
			<nav style={{
				padding: 'var(--altum-g-space-4)',
				borderBottom: '1px solid var(--altum-color-input-border)',
			}}
			>
				<Text size='sm'>
					Навигация приложения
				</Text>
			</nav>
			<section
				id='settings-panel'
				tabIndex={-1}
				style={{
					padding: 'var(--altum-g-space-6)',
					outline: 'none',
				}}
			>
				<Text size='md'>
					Панель настроек — фокус переходит сюда по skip-link.
				</Text>
			</section>
		</div>
	),
	parameters: story('Кастомный href и текст ссылки.'),
};
