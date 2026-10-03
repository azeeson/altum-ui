import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {DialogLayout, type DialogLayoutProps} from './DialogLayout';
import {Button} from '../Button/Button';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/DialogLayout',
	component: DialogLayout,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Поверхность диалога: Box и крестик в правом верхнем углу поверх контента, без сдвига содержимого.',
	),
} satisfies Meta<typeof DialogLayout>;

export const Playground: Story<DialogLayoutProps> = {
	render: function PlaygroundRender() {
		const [open, setOpen] = useState(true);
		if (!open) {
			return (
				<Button variant='primary' onClick={() => setOpen(true)}>
					Открыть
				</Button>
			);
		}
		return (
			<DialogLayout
				variant='floating'
				radius='lg'
				onClose={() => setOpen(false)}
				style={{width: 360}}
			>
				<Text size='md' style={{padding: 'var(--altum-g-space-4)'}}>
					Строка доходит до правого края поверхности. Крестик лежит сверху и не отодвигает текст.
				</Text>
			</DialogLayout>
		);
	},
	parameters: story('Крестик поверх текста, содержимое без дополнительного отступа под кнопку.'),
};
