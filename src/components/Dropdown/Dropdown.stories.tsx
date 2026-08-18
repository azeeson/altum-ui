import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {Dropdown, type DropdownWidthMode} from './Dropdown';
import {Button} from '../Button/Button';
import {Text} from '../Text/Text';
import {componentParameters, story} from '../../storybook/meta';

type StoryArgs = {
	widthMode?: DropdownWidthMode;
	mobileTitle?: string;
};

export default {
	title: 'altum-ui/Components/Dropdown',
	component: Dropdown,
	tags: ['autodocs'],
	parameters: componentParameters('Выпадающая панель, привязанная к элементу-триггеру, с настройкой ширины. На экранах ≤768px использует Sheet.'),
	argTypes: {
		widthMode: {
			control: {
				type: 'select',
				options: ['content', 'trigger']
			},
			description: 'Режим ширины: по контенту или по триггеру',
		},
		mobileTitle: {
			control: 'text',
			description: 'Заголовок Sheet на мобильных экранах',
		},
	},
} satisfies Meta<typeof Dropdown>;

type DropdownStory = StoryObj<StoryArgs>;

export const Playground: DropdownStory = {
	render: (args) => (
		<Dropdown
			widthMode={args.widthMode ?? 'content'}
			mobileTitle={args.mobileTitle ?? 'Меню'}
		>
			<Dropdown.Trigger asChild>
				<Button variant='primary'>
					Открыть ▼
				</Button>
			</Dropdown.Trigger>
			<Dropdown.Content>
				<div style={{padding: '12px'}}>
					<Text size='sm'>
						Содержимое выпадающей панели
					</Text>
				</div>
			</Dropdown.Content>
		</Dropdown>
	),
	args: {widthMode: 'content'},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const WithWidthModes: DropdownStory = {
	render: () => (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			gap: '40px',
			maxWidth: '400px'
		}}
		>
			<div>
				<div style={{marginBottom: '8px'}}>
					<Text weight='bold'>
						Ширина по контенту (widthMode=&quot;content&quot;)
					</Text>
				</div>
				<Dropdown
					widthMode='content'
				>
					<Dropdown.Trigger asChild>
						<Button variant='primary'>
							Узкая кнопка и широкий контент ▼
						</Button>
					</Dropdown.Trigger>
					<Dropdown.Content>
						<div style={{padding: '12px'}}>
							<Text size='sm' weight='medium'>
								Очень широкий контент, который шире самой кнопки!
							</Text>
						</div>
					</Dropdown.Content>
				</Dropdown>
			</div>
			<div>
				<div style={{marginBottom: '8px'}}>
					<Text weight='bold'>
						Ширина по триггеру (widthMode=&quot;trigger&quot;)
					</Text>
				</div>
				<Dropdown
					widthMode='trigger'
				>
					<Dropdown.Trigger asChild>
						<Button variant='secondary'>
							Широкий элемент-триггер ▼
						</Button>
					</Dropdown.Trigger>
					<Dropdown.Content>
						<div style={{padding: '12px'}}>
							<Text size='sm'>
								Опция А
							</Text>
						</div>
					</Dropdown.Content>
				</Dropdown>
			</div>
		</div>
	),
	parameters: story('Сравнение режимов ширины выпадающей панели.'),
};
