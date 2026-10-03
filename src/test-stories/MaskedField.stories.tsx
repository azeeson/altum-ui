import type {Meta, StoryObj} from '@storybook/react';
import React, {useState} from 'react';
import {MaskedField} from '../components/MaskedField/MaskedField';
import {Button} from '../components/Button/Button';
import {Inline, Stack} from '../components/Layout';
import {Text} from '../components/Text/Text';

const meta = {
	title: 'altum/Test/MaskedField',
	parameters: {
		layout: 'padded',
		docs: {disable: true},
	},
} satisfies Meta;

export default meta;

type Story = StoryObj;

const digitsOutputStyle: React.CSSProperties = {
	display: 'block',
	marginTop: 8,
	fontFamily: 'var(--altum-g-font-family-mono)',
};

function DigitsOutput({value, testId = 'masked-digits'}: {
	value: string;
	testId?: string
}) {
	return (
		<output data-testid={testId} style={digitsOutputStyle}>
			{value}
		</output>
	);
}

export const PhoneControlled: Story = {
	render: function PhoneControlledRender() {
		const [value, setValue] = useState('');

		return (
			<div style={{maxWidth: 360}}>
				<MaskedField
					label='Телефон'
					mask='+7 (999) 999-99-99'
					value={value}
					onChange={setValue}
					id='test-masked-phone'
					data-testid='masked-input'
					width='full'
				/>
				<DigitsOutput value={value} />
				<Inline
					gap='sm'
					wrap
					style={{marginTop: 12}}
				>
					<Button
						size='sm'
						data-testid='fill-partial'
						onClick={() => setValue('912')}
					>
						Частично
					</Button>
					<Button
						size='sm'
						data-testid='fill-full'
						onClick={() => setValue('9123456789')}
					>
						Полностью
					</Button>
					<Button
						size='sm'
						data-testid='fill-formatted-value'
						onClick={() => setValue('+7 (900) 111-22-33')}
					>
						Форматированное значение
					</Button>
					<Button
						size='sm'
						variant='secondary'
						data-testid='reset'
						onClick={() => setValue('')}
					>
						Сбросить
					</Button>
				</Inline>
			</div>
		);
	},
};

export const DateControlled: Story = {
	render: function DateControlledRender() {
		const [value, setValue] = useState('');

		return (
			<div style={{maxWidth: 280}}>
				<MaskedField
					label='Дата'
					mask='99.99.9999'
					value={value}
					onChange={setValue}
					id='test-masked-date'
					data-testid='masked-input'
					width='full'
				/>
				<DigitsOutput value={value} />
			</div>
		);
	},
};

export const TimeControlled: Story = {
	render: function TimeControlledRender() {
		const [value, setValue] = useState('');

		return (
			<div style={{maxWidth: 200}}>
				<MaskedField
					label='Время'
					mask='99:99'
					value={value}
					onChange={setValue}
					id='test-masked-time'
					data-testid='masked-input'
					width='full'
				/>
				<DigitsOutput value={value} />
			</div>
		);
	},
};

export const WithClear: Story = {
	render: function WithClearRender() {
		const [value, setValue] = useState('9123456789');

		return (
			<div style={{maxWidth: 360}}>
				<MaskedField
					label='Телефон'
					mask='+7 (999) 999-99-99'
					value={value}
					onChange={setValue}
					onClear={() => setValue('')}
					clearLabel='Очистить'
					id='test-masked-clear'
					data-testid='masked-input'
					width='full'
				/>
				<DigitsOutput value={value} />
			</div>
		);
	},
};

export const MaskAsPlaceholder: Story = {
	render: function MaskAsPlaceholderRender() {
		const [value, setValue] = useState('');

		return (
			<div style={{maxWidth: 280}}>
				<MaskedField
					aria-label='Дата'
					mask='99.99.9999'
					value={value}
					onChange={setValue}
					maskAsPlaceholder
					id='test-masked-placeholder'
					data-testid='masked-input'
					width='full'
				/>
				<DigitsOutput value={value} />
			</div>
		);
	},
};

export const DisabledAndReadOnly: Story = {
	render: function DisabledAndReadOnlyRender() {
		const [disabledValue, setDisabledValue] = useState('9123456789');
		const [readOnlyValue, setReadOnlyValue] = useState('9123456789');

		return (
			<Stack gap='lg' style={{maxWidth: 360}}>
				<div>
					<Text size='sm'>
						disabled
					</Text>
					<MaskedField
						label='Телефон (disabled)'
						mask='+7 (999) 999-99-99'
						value={disabledValue}
						onChange={setDisabledValue}
						disabled
						id='test-masked-disabled'
						data-testid='masked-input-disabled'
						width='full'
					/>
					<DigitsOutput value={disabledValue} testId='masked-digits-disabled' />
				</div>
				<div>
					<Text size='sm'>
						readOnly
					</Text>
					<MaskedField
						label='Телефон (readOnly)'
						mask='+7 (999) 999-99-99'
						value={readOnlyValue}
						onChange={setReadOnlyValue}
						readOnly
						id='test-masked-readonly'
						data-testid='masked-input-readonly'
						width='full'
					/>
					<DigitsOutput value={readOnlyValue} testId='masked-digits-readonly' />
				</div>
			</Stack>
		);
	},
};
