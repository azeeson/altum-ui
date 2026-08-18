import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {Popover, type PopoverTriggerMode} from './Popover';
import {Button} from '../Button/Button';
import {Text} from '../Text/Text';
import {componentParameters, story} from '../../storybook/meta';
import type {AnchorAlign, AnchorSide} from '../../types';

type StoryArgs = {
	side?: AnchorSide;
	align?: AnchorAlign;
	trigger?: PopoverTriggerMode;
	defaultOpen?: boolean;
};

export default {
	title: 'altum/Components/Popover',
	component: Popover,
	tags: ['autodocs'],
	parameters: {
		...componentParameters(
			'Плавающий слой на Overlay: click по умолчанию; hover — для превью по наведению.',
		),
		controls: {exclude: ['children', 'onOpenChange', 'open']},
	},
	argTypes: {
		side: {
			control: {
				type: 'select',
				options: [
					'top',
					'bottom',
					'left',
					'right'
				],
			},
			description: 'Приоритет стороны; при нехватке места — flip на противоположную',
		},
		align: {
			control: {
				type: 'select',
				options: ['start', 'center', 'end'],
			},
			description: 'Выравнивание вдоль стороны',
		},
		trigger: {
			control: {
				type: 'select',
				options: ['click', 'hover', 'manual'],
			},
			description: 'Способ открытия',
		},
		defaultOpen: {
			control: 'boolean',
			description: 'Открыт по умолчанию (неконтролируемый режим)',
		},
	},
} satisfies Meta<typeof Popover>;

type PopoverStory = StoryObj<StoryArgs>;

export const Playground: PopoverStory = {
	render: (args) => (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				padding: 'var(--altum-g-space-8)',
			}}
		>
			<Popover
				side={args.side}
				align={args.align}
				trigger={args.trigger}
				defaultOpen={args.defaultOpen}
			>
				<Popover.Trigger asChild>
					<Button variant='secondary'>
						Открыть popover
					</Button>
				</Popover.Trigger>
				<Popover.Content>
					<Text>
						Описание или форма внутри всплывающей панели.
					</Text>
				</Popover.Content>
			</Popover>
		</div>
	),
	args: {
		side: 'bottom',
		align: 'center',
		trigger: 'click',
		defaultOpen: false,
	},
	parameters: story('Триггер — Popover.Trigger asChild + Button. Настройте side / align / trigger в Controls.'),
};

export const WithHoverTrigger: PopoverStory = {
	render: () => (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				padding: 'var(--altum-g-space-8)',
			}}
		>
			<Popover
				trigger='hover'
				openDelay={150}
				closeDelay={100}
				side='top'
			>
				<Popover.Trigger asChild>
					<Button variant='ghost'>
						Наведи
					</Button>
				</Popover.Trigger>
				<Popover.Content variant='tooltip'>
					Как у Tooltip — trigger=&quot;hover&quot; + variant=&quot;tooltip&quot;.
				</Popover.Content>
			</Popover>
		</div>
	),
	parameters: story('Режим hover: превью по наведению / компактные подсказки.'),
};
