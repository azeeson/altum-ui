import type {Meta} from '@storybook/react';
import React from 'react';
import {FieldLabel, FieldLabelProps} from './FieldLabel';
import {TextField} from '../TextField/TextField';
import {Text} from '../Text/Text';
import {Stack} from '../Layout/Layout';
import {Switch} from '../Switch/Switch';
import {Card} from '../Card/Card';
import {Button} from '../Button/Button';
import {FormMessage} from '../FormMessage/FormMessage';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/FieldLabel',
	component: FieldLabel,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Лейбл и контент: vertical / horizontal. В horizontal — align (start/center/baseline) и justify (start/between).',
	),
	argTypes: {
		label: {
			control: 'text',
			description: 'Текст или узел подписи',
		},
		layout: {
			control: 'select',
			options: ['vertical', 'horizontal'],
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'baseline'],
		},
		justify: {
			control: 'select',
			options: ['start', 'between'],
		},
		htmlFor: {
			control: 'text',
			description: 'id связанного контрола',
		},
		labelWidth: {
			control: 'text',
			description: 'Фиксированная ширина лейбла в horizontal',
		},
	},
} satisfies Meta<typeof FieldLabel>;

export const Playground: Story<FieldLabelProps> = {
	render: (args) => (
		<div style={{maxWidth: 360}}>
			<FieldLabel {...args}>
				<Text>
					alex@example.com
				</Text>
			</FieldLabel>
		</div>
	),
	args: {
		label: 'Эл. почта',
		layout: 'vertical',
		size: 'md',
		align: 'center',
		justify: 'start',
	},
	parameters: story('Лейбл сверху, значение снизу.'),
};

export const VerticalWithField: Story<FieldLabelProps> = {
	render: () => (
		<div style={{maxWidth: 360}}>
			<FieldLabel
				label='Телефон'
				layout='vertical'
			>
				<TextField
					label='Телефон'
					defaultValue='+7 (900) 123-45-67'
					width='full'
				/>
			</FieldLabel>
		</div>
	),
	parameters: story('Вертикальный layout: лейбл над полем ввода.'),
};

export const HorizontalAlign: Story<FieldLabelProps> = {
	render: () => (
		<Stack
			gap='lg'
			style={{maxWidth: 520}}
		>
			<FieldLabel
				label='Старт (сверху)'
				layout='horizontal'
				labelWidth={160}
				align='start'
			>
				<div>
					<Text weight='medium'>
						Многострочный
					</Text>
					<Text color='muted' size='sm'>
						контент выше одной строки
					</Text>
				</div>
			</FieldLabel>
			<FieldLabel
				label='По центру'
				layout='horizontal'
				labelWidth={160}
				align='center'
			>
				<div>
					<Text weight='medium'>
						Многострочный
					</Text>
					<Text color='muted' size='sm'>
						контент выше одной строки
					</Text>
				</div>
			</FieldLabel>
			<FieldLabel
				label='Базовая линия'
				layout='horizontal'
				labelWidth={160}
				align='baseline'
			>
				<Text weight='medium'>
					WM-1042-A
				</Text>
			</FieldLabel>
		</Stack>
	),
	parameters: story('align: start / center / baseline — выравнивание лейбла относительно контента.'),
};

export const HorizontalBetween: Story<FieldLabelProps> = {
	render: function BetweenRender() {
		const [notify, setNotify] = React.useState(true);
		return (
			<Stack
				gap='md'
				style={{maxWidth: 480}}
			>
				<FieldLabel
					label='Серийный номер'
					layout='horizontal'
					justify='between'
					align='baseline'
				>
					<Text weight='medium'>
						WM-1042-A
					</Text>
				</FieldLabel>
				<FieldLabel
					label='Статус'
					layout='horizontal'
					justify='between'
					align='baseline'
				>
					<Text color='success' weight='medium'>
						Активен
					</Text>
				</FieldLabel>
				<FieldLabel
					label='Уведомления'
					layout='horizontal'
					justify='between'
					align='center'
				>
					<Switch checked={notify} onChange={setNotify} />
				</FieldLabel>
				<FieldLabel
					label='Адрес'
					layout='horizontal'
					labelWidth={120}
					justify='between'
					align='start'
				>
					<Text>
						г. Москва, ул. Примерная, д. 12
					</Text>
				</FieldLabel>
			</Stack>
		);
	},
	parameters: story('justify="between": лейбл слева, контент у правого края.'),
};

export const HorizontalRows: Story<FieldLabelProps> = {
	render: () => (
		<Stack
			gap='lg'
			style={{maxWidth: 520}}
		>
			<FieldLabel
				label='Серийный номер'
				layout='horizontal'
				labelWidth={160}
				align='center'
			>
				<Text weight='medium'>
					WM-1042-A
				</Text>
			</FieldLabel>
			<FieldLabel
				label='Адрес установки'
				layout='horizontal'
				labelWidth={160}
				align='center'
			>
				<Text>
					г. Москва, ул. Примерная, д. 12, кв. 45
				</Text>
			</FieldLabel>
			<FieldLabel
				label='Последняя проверка'
				layout='horizontal'
				labelWidth={160}
				align='center'
			>
				<Text color='muted'>
					12.03.2026, 14:30
				</Text>
			</FieldLabel>
			<FieldLabel
				label='Статус'
				layout='horizontal'
				labelWidth={160}
				align='center'
			>
				<Text color='success' weight='medium'>
					Активен
				</Text>
			</FieldLabel>
		</Stack>
	),
	parameters: story('Горизонтальный layout (justify start): лейбл слева, контент заполняет ряд.'),
};

export const HorizontalWithControl: Story<FieldLabelProps> = {
	render: () => (
		<div style={{maxWidth: 520}}>
			<FieldLabel
				label='Комментарий'
				layout='horizontal'
				labelWidth={140}
				align='start'
			>
				<TextField
					label='Комментарий'
					defaultValue=''
					width='full'
				/>
			</FieldLabel>
		</div>
	),
	parameters: story('Горизонтальный layout с полем ввода.'),
};

export const Sizes: Story<FieldLabelProps> = {
	render: () => (
		<Stack gap='xl'>
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<FieldLabel
					key={size}
					label={`Размер ${size}`}
					layout='vertical'
					size={size}
				>
					<Text>
						Значение поля
					</Text>
				</FieldLabel>
			))}
		</Stack>
	),
	parameters: story('Размеры sm / md / lg синхронизированы с полями формы.'),
};

export const Disabled: Story<FieldLabelProps> = {
	render: () => (
		<div style={{maxWidth: 360}}>
			<FieldLabel
				label='Архивный номер'
				layout='vertical'
				htmlFor='story-field-label-disabled'
			>
				<TextField
					id='story-field-label-disabled'
					label='Архивный номер'
					labelPlacement='none'
					defaultValue='WM-1042-A'
					width='full'
					disabled
				/>
			</FieldLabel>
		</div>
	),
	parameters: story('Лейбл рядом с заблокированным контролом.'),
};

export const OverflowText: Story<FieldLabelProps> = {
	render: () => (
		<Stack gap='lg' style={{maxWidth: 320}}>
			<FieldLabel
				label='Очень длинная подпись поля с единицами измерения, уточнениями и юридическими оговорками'
				layout='vertical'
			>
				<Text>
					Значение остаётся читаемым
				</Text>
			</FieldLabel>
			<FieldLabel
				label='Короткий лейбл'
				layout='horizontal'
				labelWidth={96}
				align='start'
			>
				<Text>
					г. Санкт-Петербург, Невский проспект, дом 28, литера А, офис 412, внутренний двор
				</Text>
			</FieldLabel>
		</Stack>
	),
	parameters: story('Длинная подпись и длинное значение в узком контейнере.'),
};

export const UsageExample: Story<FieldLabelProps> = {
	render: function UsageExampleRender() {
		const [notify, setNotify] = React.useState(true);
		const [email, setEmail] = React.useState('alex@example.com');

		return (
			<Card
				variant='outlined'
				header={(
					<Text weight='bold'>
						Профиль
					</Text>
				)}
				style={{maxWidth: 420}}
			>
				<Stack gap='md'>
					<FieldLabel
						label='Эл. почта'
						layout='vertical'
						htmlFor='story-field-label-usage-email'
					>
						<TextField
							id='story-field-label-usage-email'
							label='Эл. почта'
							labelPlacement='none'
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							width='full'
						/>
					</FieldLabel>
					<FieldLabel
						label='Уведомления'
						layout='horizontal'
						justify='between'
						align='center'
					>
						<Switch checked={notify} onChange={setNotify} />
					</FieldLabel>
					<FormMessage variant='hint'>
						Письма приходят на рабочий адрес.
					</FormMessage>
					<Button variant='primary'>
						Сохранить
					</Button>
				</Stack>
			</Card>
		);
	},
	parameters: story('Карточка профиля: лейблы с полем, свитчем и подсказкой.'),
};

export const Interaction: Story<FieldLabelProps> = {
	render: function InteractionRender() {
		const [value, setValue] = React.useState('');
		return (
			<div style={{maxWidth: 360}}>
				<FieldLabel
					label='Имя'
					layout='vertical'
					htmlFor='story-field-label-interaction'
				>
					<TextField
						id='story-field-label-interaction'
						label='Имя'
						labelPlacement='none'
						value={value}
						onChange={(event) => setValue(event.target.value)}
						width='full'
					/>
				</FieldLabel>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		const input = canvasElement.querySelector('input');
		if (!(input instanceof HTMLInputElement)) return;
		input.focus();
		const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
		setter?.call(input, 'Мария Иванова');
		input.dispatchEvent(new Event('input', {bubbles: true}));
	},
	parameters: story('Play: фокус и ввод в связанное поле.'),
};
