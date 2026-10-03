import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {LiveRegion, type LiveRegionProps} from './LiveRegion';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Utilities/LiveRegion',
	component: LiveRegion,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Скрытая область: скринридер озвучивает `message`. Пустое сообщение ничего не рендерит.',
	),
	argTypes: {
		politeness: {
			control: 'select',
			options: ['polite', 'assertive'],
		},
	},
} satisfies Meta<typeof LiveRegion>;

export const Playground: Story<LiveRegionProps> = {
	render: function PlaygroundRender(args) {
		const [message, setMessage] = useState('Файл сохранён');
		return (
			<>
				<Button
					variant='secondary'
					onClick={() => setMessage('Изменения сохранены')}
				>
					Сохранить
				</Button>
				<LiveRegion
					message={message}
					politeness={args.politeness}
				/>
			</>
		);
	},
	args: {
		politeness: 'polite',
	},
	parameters: story('Кнопка меняет текст, который озвучит скринридер.'),
};

export const Assertive: Story<LiveRegionProps> = {
	render: () => (
		<LiveRegion
			message='Соединение потеряно'
			politeness='assertive'
		/>
	),
	parameters: story('`assertive` перебивает текущую речь.'),
};
