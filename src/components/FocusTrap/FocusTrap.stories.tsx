import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {FocusTrap, FocusTrapProps} from './FocusTrap';
import {Button} from '../Button/Button';
import {TextField} from '../TextField/TextField';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Utilities/FocusTrap',
	component: FocusTrap,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Ловушка клавиатурного фокуса для модальных поверхностей (Modal, Sheet).',
	),
} satisfies Meta<typeof FocusTrap>;

export const Playground: Story<FocusTrapProps> = {
	render: function PlaygroundRender() {
		const [active, setActive] = useState(false);

		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-3)'
			}}
			>
				<Button
					variant='secondary'
					size='sm'
					onClick={() => setActive((v) => !v)}
				>
					{active ? 'Выключить FocusTrap' : 'Включить FocusTrap'}
				</Button>
				<FocusTrap active={active}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 'var(--altum-g-space-2)',
							padding: 'var(--altum-g-space-4)',
							border: '1px solid var(--altum-color-border)',
							borderRadius: 'var(--altum-g-radius)',
						}}
					>
						<TextField label='Имя' defaultValue='' />
						<TextField label='Эл. почта' defaultValue='' />
						<Button variant='primary' size='sm'>
							Сохранить
						</Button>
					</div>
				</FocusTrap>
			</div>
		);
	},
	parameters: story('При active Tab циклится только внутри блока.'),
};

export const States: Story<FocusTrapProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			gap: 'var(--altum-g-space-3)',
		}}
		>
			<TextField label='Вне ловушки' defaultValue='' />
			<FocusTrap active={false}>
				<div style={{
					padding: 'var(--altum-g-space-4)',
					border: '1px solid var(--altum-color-border)',
					borderRadius: 'var(--altum-g-radius)',
				}}
				>
					<TextField label='Внутри (inactive)' defaultValue='' />
				</div>
			</FocusTrap>
			<TextField label='Снова вне' defaultValue='' />
		</div>
	),
	parameters: story('`active={false}` — Tab проходит через блок как обычно.'),
};
