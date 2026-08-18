import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {LocaleProvider, useLocale, type LocaleCode} from './LocaleProvider';
import {Button} from '../Button/Button';
import {Pagination} from '../Pagination/Pagination';
import {Stack, Inline} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Utilities/LocaleProvider',
	component: LocaleProvider,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Провайдер локали и встроенных строк библиотеки (`t`, `messages`).',
	),
	argTypes: {
		locale: {
			control: {
				type: 'select',
				options: ['ru', 'en']
			},
		},
	},
} satisfies Meta<typeof LocaleProvider>;

function LocaleDemo() {
	const {locale, t} = useLocale();
	const [page, setPage] = useState(1);
	return (
		<Stack gap='md'>
			<Text size='sm'>
				locale:
				{' '}
				<strong>
					{locale}
				</strong>
			</Text>
			<Text size='sm'>
				t(common.close):
				{' '}
				{t('common.close')}
			</Text>
			<Text size='sm'>
				t(pagination.summary):
				{' '}
				{t('pagination.summary', {
					start: 1,
					end: 10,
					total: 48,
				})}
			</Text>
			<Pagination
				currentPage={page}
				totalPages={5}
				onPageChange={setPage}
			>
				<Pagination.Summary totalItems={48} pageSize={10} />
				<Pagination.Controls />
			</Pagination>
		</Stack>
	);
}

export const Playground: Story<React.ComponentProps<typeof LocaleProvider>> = {
	render: (args) => (
		<LocaleProvider {...args}>
			<LocaleDemo />
		</LocaleProvider>
	),
	args: {
		locale: 'ru',
	},
	parameters: story('Панель Controls: locale ru / en.'),
};

export const Locales: Story<React.ComponentProps<typeof LocaleProvider>> = {
	render: function LocalesRender() {
		const [locale, setLocale] = useState<LocaleCode>('ru');
		return (
			<Stack gap='md'>
				<Inline gap='sm'>
					{(['ru', 'en'] as LocaleCode[]).map((code) => (
						<Button
							key={code}
							size='sm'
							variant={locale === code ? 'primary' : 'secondary'}
							onClick={() => setLocale(code)}
						>
							{code}
						</Button>
					))}
				</Inline>
				<LocaleProvider locale={locale}>
					<LocaleDemo />
				</LocaleProvider>
			</Stack>
		);
	},
	parameters: story('Переключение ru ↔ en на одних и тех же строках.'),
};

export const MessageOverride: Story<React.ComponentProps<typeof LocaleProvider>> = {
	render: () => (
		<LocaleProvider
			locale='ru'
			messages={{common: {close: 'Закрыть окно'}}}
		>
			<LocaleDemo />
		</LocaleProvider>
	),
	parameters: story('Частичный override словаря через `messages`.'),
};
