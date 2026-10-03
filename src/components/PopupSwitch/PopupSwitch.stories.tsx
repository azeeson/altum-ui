import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {PopupSwitch, PopupSwitchProps} from './PopupSwitch';
import {IconClock} from '../../icons/icons/IconClock';
import {IconList} from '../../icons/icons/IconList';
import {IconStar} from '../../icons/icons/IconStar';
import {componentParameters, story, Story} from '../../storybook/meta';

const OPTIONS = [
	{
		label: 'День',
		value: 'day',
	},
	{
		label: 'Неделя',
		value: 'week',
	},
	{
		label: 'Месяц',
		value: 'month',
	},
];

const ICON_OPTIONS = [
	{
		label: 'День',
		value: 'day',
		icon: <IconClock />,
	},
	{
		label: 'Неделя',
		value: 'week',
		icon: <IconList />,
	},
	{
		label: 'Месяц',
		value: 'month',
		icon: <IconStar />,
	},
];

const LONG_OPTIONS = Array.from({length: 24}, (_, index) => ({
	label: `Пункт ${index + 1}`,
	value: `item-${index + 1}`,
}));

function Controlled({
	initial,
	options = OPTIONS,
	...rest
}: Partial<PopupSwitchProps<string>> & {
	initial: string;
	options?: PopupSwitchProps<string>['options'];
}) {
	const [value, setValue] = useState(initial);
	return (
		<PopupSwitch
			{...rest}
			options={options}
			value={value}
			onChange={setValue}
		/>
	);
}

export default {
	title: 'altum/Components/PopupSwitch',
	component: PopupSwitch,
	tags: ['autodocs'],
	parameters: componentParameters('Кнопка текущего значения. Список открывается под кнопкой: позицию считает CSS Anchor.'),
	args: {
		size: 'md',
		variant: 'secondary',
		align: 'start',
		width: 'auto',
		disabled: false,
		placeholder: 'Период',
	},
	argTypes: {
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg'],
			},
			description: 'Размер кнопки и пунктов',
		},
		variant: {
			control: {
				type: 'select',
				options: ['secondary', 'tinted', 'ghost'],
			},
			description: 'Вариант кнопки',
		},
		align: {
			control: {
				type: 'select',
				options: ['start', 'center', 'end'],
			},
			description: 'Горизонталь панели относительно кнопки',
		},
		width: {
			control: {
				type: 'select',
				options: ['auto', 'options'],
			},
			description: 'auto — по выбранной подписи, options — по самой длинной',
		},
		disabled: {
			control: 'boolean',
			description: 'Заблокированное состояние',
		},
		placeholder: {
			control: 'text',
			description: 'Текст, если значение не найдено среди опций',
		},
		options: {control: false},
		value: {control: false},
		onChange: {control: false},
	},
} satisfies Meta<typeof PopupSwitch>;

export const Playground: Story<PopupSwitchProps<string>> = {
	parameters: story('Текущее значение — «Неделя», средний пункт списка.'),
	render: function PlaygroundRender(args) {
		return (
			<div style={{paddingTop: 48}}>
				<Controlled
					{...args}
					initial='week'
					options={OPTIONS}
				/>
			</div>
		);
	},
};

export const StableWidth: Story<Record<string, never>> = {
	parameters: story('Ширина по самой длинной подписи: «День» и «Неделя» одного размера.'),
	render: function StableWidthRender() {
		return (
			<Controlled
				initial='day'
				width='options'
				options={OPTIONS}
			/>
		);
	},
};

export const Icons: Story<Record<string, never>> = {
	parameters: story('Иконка выбранного пункта на кнопке и в списке.'),
	render: function IconsRender() {
		return (
			<Controlled
				initial='week'
				options={ICON_OPTIONS}
			/>
		);
	},
};

export const Placeholder: Story<Record<string, never>> = {
	parameters: story('Значения нет в списке — на кнопке placeholder, панель от верхнего края.'),
	render: function PlaceholderRender() {
		return (
			<Controlled
				initial='missing'
				placeholder='Не выбрано'
				options={OPTIONS}
			/>
		);
	},
};

export const Disabled: Story<Record<string, never>> = {
	parameters: story('Кнопка недоступна, список не открывается.'),
	render: function DisabledRender() {
		return (
			<Controlled
				initial='week'
				disabled
				options={OPTIONS}
			/>
		);
	},
};

export const LongList: Story<Record<string, never>> = {
	parameters: story('Длинный список: у панели max-height и внутренний скролл.'),
	render: function LongListRender() {
		return (
			<Controlled
				initial='item-12'
				options={LONG_OPTIONS}
			/>
		);
	},
};

export const NearTop: Story<Record<string, never>> = {
	parameters: {
		layout: 'fullscreen',
		...story('Кнопка у верхнего края, выбран последний пункт.'),
	},
	render: function NearTopRender() {
		return (
			<div style={{padding: 12}}>
				<Controlled
					initial='item-24'
					options={LONG_OPTIONS}
				/>
			</div>
		);
	},
};

export const NearBottom: Story<Record<string, never>> = {
	parameters: {
		layout: 'fullscreen',
		...story('Кнопка у нижнего края: длинный список остаётся внутри вьюпорта.'),
	},
	render: function NearBottomRender() {
		return (
			<div style={{
				display: 'flex',
				alignItems: 'flex-end',
				boxSizing: 'border-box',
				height: '100vh',
				padding: 16,
			}}
			>
				<Controlled
					initial='item-12'
					options={LONG_OPTIONS}
				/>
			</div>
		);
	},
};
