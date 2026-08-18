import type {Meta} from '@storybook/react';
import React from 'react';
import {VisuallyHidden, VisuallyHiddenProps} from './VisuallyHidden';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconCross} from '../../icons/icons/IconCross';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Utilities/VisuallyHidden',
	component: VisuallyHidden,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Контент скрыт визуально, но доступен скринридерам (sr-only).',
	),
} satisfies Meta<typeof VisuallyHidden>;

export const Playground: Story<VisuallyHiddenProps> = {
	render: () => (
		<ButtonIcon
			variant='ghost'
			size='md'
			aria-label='Закрыть'
		>
			<IconCross size={18} />
			<VisuallyHidden>
				Закрыть диалог
			</VisuallyHidden>
		</ButtonIcon>
	),
	parameters: story('Скрытая подпись внутри icon-only кнопки для SR.'),
};

export const WithFormLabel: Story<VisuallyHiddenProps> = {
	render: () => (
		<label style={{
			display: 'flex',
			alignItems: 'center',
			gap: 'var(--altum-g-space-2)'
		}}
		>
			<input type='checkbox' defaultChecked />
			<VisuallyHidden>
				Получать email-уведомления
			</VisuallyHidden>
			<span aria-hidden>
				🔔
			</span>
		</label>
	),
	parameters: story('Скрытая метка для checkbox с видимой иконкой.'),
};
