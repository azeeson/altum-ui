import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Fieldset, FieldsetProps} from './Fieldset';
import {TextField} from '../TextField/TextField';
import {Select} from '../Select/Select';
import {Button} from '../Button/Button';
import {Text} from '../Text/Text';
import {Inline, Stack} from '../Layout/Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

const ROLE_OPTIONS = [
	{
		label: 'Администратор',
		value: 'admin'
	},
	{
		label: 'Менеджер',
		value: 'manager'
	},
	{
		label: 'Наблюдатель',
		value: 'viewer'
	},
];

export default {
	title: 'altum-ui/Components/Fieldset',
	component: Fieldset,
	tags: ['autodocs'],
	parameters: componentParameters('Секция формы с legend, описанием и единым отступом между полями.'),
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'card', 'plain'],
		},
		disabled: {control: 'boolean'},
	},
} satisfies Meta<typeof Fieldset>;

export const Playground: Story<FieldsetProps> = {
	render: (args) => (
		<div style={{maxWidth: 420}}>
			<Fieldset {...args}>
				<Fieldset.Inner>
					<Fieldset.Legend>
						Контактные данные
					</Fieldset.Legend>
					<Fieldset.Description>
						Используются для уведомлений и восстановления доступа.
					</Fieldset.Description>
					<Fieldset.Hint>
						Эл. почта должна быть рабочей — на неё придёт письмо подтверждения.
					</Fieldset.Hint>
					<Fieldset.Content>
						<TextField
							label='Имя'
							defaultValue='Алексей'
							width='full'
						/>
						<TextField
							label='Эл. почта'
							defaultValue='alex@example.com'
							width='full'
						/>
					</Fieldset.Content>
				</Fieldset.Inner>
			</Fieldset>
		</div>
	),
	args: {
		variant: 'default',
	},
	parameters: story('Базовая секция с заголовком и полями.'),
};

export const FormSections: Story<FieldsetProps> = {
	render: function FormSectionsRender() {
		const [role, setRole] = useState('manager');
		return (
			<Stack
				gap='lg'
				style={{maxWidth: 480}}
			>
				<Fieldset>
					<Fieldset.Inner>
						<Fieldset.Legend>
							Профиль
						</Fieldset.Legend>
						<Fieldset.Description>
							Основная информация о пользователе.
						</Fieldset.Description>
						<Fieldset.Content>
							<TextField
								label='ФИО'
								defaultValue='Иванова Мария Петровна'
								width='full'
							/>
							<TextField
								label='Должность'
								defaultValue='Инженер'
								width='full'
							/>
						</Fieldset.Content>
					</Fieldset.Inner>
				</Fieldset>

				<Fieldset variant='card'>
					<Fieldset.Inner>
						<Fieldset.Legend>
							Доступ
						</Fieldset.Legend>
						<Fieldset.Description>
							Роль определяет набор разрешений в системе.
						</Fieldset.Description>
						<Fieldset.Content>
							<Select.Root
								options={ROLE_OPTIONS}
								value={role}
								onChange={(value) => { if (!Array.isArray(value)) setRole(value); }}
							>
								<Select.Trigger label='Роль' width='full' />
								<Select.Panel>
									<Select.List />
								</Select.Panel>
							</Select.Root>
						</Fieldset.Content>
					</Fieldset.Inner>
					<Fieldset.Footer>
						<Text size='xs' style={{opacity: 0.75}}>
							Изменения вступают в силу после сохранения.
						</Text>
					</Fieldset.Footer>
				</Fieldset>

				<Fieldset variant='plain'>
					<Fieldset.Inner>
						<Fieldset.Legend>
							Действия
						</Fieldset.Legend>
						<Fieldset.Content>
							<Text size='sm'>
								Проверьте данные перед отправкой формы.
							</Text>
						</Fieldset.Content>
					</Fieldset.Inner>
					<Fieldset.Footer>
						<Inline gap='sm'>
							<Button variant='primary'>
								Сохранить
							</Button>
							<Button variant='secondary'>
								Отмена
							</Button>
						</Inline>
					</Fieldset.Footer>
				</Fieldset>
			</Stack>
		);
	},
	parameters: story('Несколько секций в одной форме: default, card и plain.'),
};

export const Disabled: Story<FieldsetProps> = {
	render: () => (
		<div style={{maxWidth: 420}}>
			<Fieldset
				disabled
			>
				<Fieldset.Inner>
					<Fieldset.Legend>
						Архивная запись
					</Fieldset.Legend>
					<Fieldset.Description>
						Редактирование недоступно.
					</Fieldset.Description>
					<Fieldset.Content>
						<TextField
							label='Номер'
							defaultValue='WM-1042'
							width='full'
							disabled
						/>
						<TextField
							label='Адрес'
							defaultValue='ул. Примерная, 12'
							width='full'
							disabled
						/>
					</Fieldset.Content>
				</Fieldset.Inner>
			</Fieldset>
		</div>
	),
	parameters: story('disabled на fieldset блокирует все вложенные контролы.'),
};
