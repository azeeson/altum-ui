import type {Meta} from '@storybook/react';
import React from 'react';
import {Button, ButtonProps} from './Button';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Button',
	component: Button,
	tags: ['autodocs'],
	parameters: componentParameters('Кнопка с вариантами оформления, размерами, иконками и состоянием загрузки.'),
	argTypes: {
		variant: {
			control: {
				type: 'select',
				options: [
					'primary',
					'tinted',
					'secondary',
					'ghost',
					'link',
				]
			},
			description: 'Вариант оформления (primary = Prominent, tinted = приглушённый акцент)',
		},
		status: {
			control: {
				type: 'select',
				options: ['default', 'danger'],
			},
			description: 'Семантический статус (danger — опасное действие)',
		},
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg']
			},
			description: 'Размер кнопки',
		},
		disabled: {
			control: 'boolean',
			description: 'Заблокированное состояние'
		},
		loading: {
			control: 'boolean',
			description: 'Состояние загрузки'
		},
		fullWidth: {
			control: 'boolean',
			description: 'Растянуть на всю ширину'
		},
		children: {
			control: 'text',
			description: 'Текст кнопки'
		},
	},
} satisfies Meta<typeof Button>;

export const Playground: Story<ButtonProps> = {
	args: {
		children: 'Продолжить',
		variant: 'primary',
		status: 'default',
		size: 'md',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const AllVariants: Story<ButtonProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			gap: '16px',
			flexWrap: 'wrap'
		}}
		>
			<Button variant='primary'>
				Продолжить
			</Button>
			<Button variant='tinted'>
				Tinted
			</Button>
			<Button variant='secondary'>
				Отмена
			</Button>
			<Button variant='ghost'>
				Ghost
			</Button>
			<Button variant='link'>
				Link
			</Button>
			<Button variant='primary' disabled>
				Заблокировано
			</Button>
			<Button variant='primary' loading>
				Сохранение
			</Button>
		</div>
	),
	parameters: story('Все визуальные варианты.'),
};

/** Включённый primary не должен выглядеть как disabled на светлых/тёмных поверхностях. */
export const PrimaryEnabledVsDisabled: Story<ButtonProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			gap: 'var(--altum-g-space-4)',
		}}
		>
			<div style={{
				display: 'flex',
				gap: 'var(--altum-g-space-3)',
				alignItems: 'center',
				padding: 'var(--altum-g-space-4)',
				background: 'var(--altum-color-dropdown-bg)',
				border: '1px solid var(--altum-color-border)',
				borderRadius: 'var(--altum-g-radius)',
			}}
			>
				<Button variant='primary'>
					Сохранить
				</Button>
				<Button variant='primary' disabled>
					Сохранить
				</Button>
				<Button variant='secondary'>
					Отмена
				</Button>
			</div>
			<p style={{
				margin: 0,
				fontSize: 'var(--altum-g-font-size-xs)',
				color: 'var(--altum-color-ink-muted)',
			}}
			>
				Enabled primary vs disabled (dedicated `--altum-color-brand-disabled`) vs secondary on sheet surface.
			</p>
		</div>
	),
	parameters: story('Включённый ≠ смывка disabled; проверьте light и dark globals.'),
};

export const SmallWithIcon: Story<ButtonProps> = {
	render: (args) => (
		<Button
			{...args}
			size='sm'
			iconStart={(
				<span>
					⚡
				</span>
			)}
		>
			Быстрый старт
		</Button>
	),
	args: {variant: 'primary'},
	parameters: story('Компактная кнопка с иконкой в начале.'),
};
