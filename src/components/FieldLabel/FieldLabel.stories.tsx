import type {Meta} from '@storybook/react';
import React from 'react';
import {FieldLabel, FieldLabelProps} from './FieldLabel';
import {TextField} from '../TextField/TextField';
import {Text} from '../Text/Text';
import {Stack} from '../Layout/Layout';
import {Switch} from '../Switch/Switch';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/FieldLabel',
	component: FieldLabel,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Лейбл и контент: vertical / horizontal. В horizontal — align (start/center/baseline) и justify (start/between).',
	),
	argTypes: {
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
