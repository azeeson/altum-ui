import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Steps, StepsProps} from './Steps';
import {Button} from '../Button/Button';
import {Stack} from '../Layout/Layout';
import {IconUser} from '../../icons/icons/IconUser';
import {IconCheckmark} from '../../icons/icons/IconCheckmark';
import {componentParameters, story, Story} from '../../storybook/meta';

const STEPS = [{title: 'Авторизация'}, {title: 'Загрузка документов'}, {title: 'Подписание договора'},];

export default {
	title: 'altum-ui/Components/Steps',
	component: Steps,
	tags: ['autodocs'],
	parameters: componentParameters('Пошаговый индикатор прогресса для многоэтапных процессов.'),
	argTypes: {},
} satisfies Meta<typeof Steps>;

export const Playground: Story<StepsProps> = {
	render: function PlaygroundRender() {
		const [current, setCurrent] = useState(0);
		return (
			<div style={{maxWidth: '600px'}}>
				<Steps currentStep={current} items={STEPS} />
				<div style={{
					display: 'flex',
					gap: '12px',
					marginTop: '32px'
				}}
				>
					<Button
						variant='secondary'
						size='sm'
						disabled={current === 0}
						onClick={() => setCurrent(current - 1)}
					>
						Назад
					</Button>
					<Button
						variant='primary'
						size='sm'
						disabled={current === STEPS.length - 1}
						onClick={() => setCurrent(current + 1)}
					>
						Далее
					</Button>
				</div>
			</div>
		);
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Vertical: Story<StepsProps> = {
	render: function VerticalRender() {
		const [current, setCurrent] = useState(1);
		return (
			<div style={{maxWidth: 320}}>
				<Steps
					orientation='vertical'
					currentStep={current}
					onStepClick={setCurrent}
					items={[
						{
							title: 'Контакты',
							description: 'Email и телефон'
						},
						{
							title: 'Адрес доставки',
							description: 'Город и индекс'
						},
						{
							title: 'Оплата',
							description: 'Карта или счёт'
						},
					]}
				/>
			</div>
		);
	},
	parameters: story('Вертикальная ориентация с кликабельными шагами.'),
};

export const WithIcons: Story<StepsProps> = {
	render: () => (
		<div style={{maxWidth: 640}}>
			<Steps
				currentStep={1}
				items={[
					{
						title: 'Профиль',
						icon: <IconUser size={14} aria-hidden />,
						status: 'complete',
					},
					{
						title: 'Подтверждение',
						icon: <IconCheckmark size={14} aria-hidden />,
						status: 'current',
					},
					{
						title: 'Готово',
						status: 'pending'
					},
				]}
			/>
		</div>
	),
	parameters: story('Кастомные иконки в круге вместо номера.'),
};

export const ErrorStatus: Story<StepsProps> = {
	render: () => (
		<div style={{maxWidth: 640}}>
			<Steps
				currentStep={1}
				items={[
					{
						title: 'Контакты',
						status: 'complete'
					},
					{
						title: 'Оплата',
						status: 'error',
						description: 'Карта отклонена'
					},
					{
						title: 'Подтверждение',
						status: 'pending'
					},
				]}
			/>
		</div>
	),
	parameters: story('Явный `status="error"` на шаге.'),
};

export const CompactSizes: Story<StepsProps> = {
	render: () => (
		<Stack gap='lg' style={{maxWidth: 640}}>
			<Steps
				size='sm'
				currentStep={0}
				items={STEPS}
			/>
			<Steps
				size='md'
				currentStep={1}
				items={STEPS}
			/>
			<Steps
				size='lg'
				currentStep={2}
				items={STEPS}
			/>
		</Stack>
	),
	parameters: story('Размеры sm / md / lg.'),
};
