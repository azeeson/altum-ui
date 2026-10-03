import type {Meta, StoryObj} from '@storybook/react';
import type {ArgTypes} from '@storybook/types';

export type Story<T> = StoryObj<Meta<T>>;

const docsSource = {
	type: 'code' as const,
	excludeDecorators: true,
};

/** Общие Controls для полей на `TextField`. */
export const fieldArgTypes = {
	label: {
		control: 'text',
		description: 'Метка поля',
	},
	size: {
		control: {
			type: 'select',
			options: ['sm', 'md', 'lg'],
		},
		description: 'Размер поля',
	},
	width: {
		control: {
			type: 'select',
			options: ['md', 'full'],
		},
		description: 'Ширина оболочки: `md` или `full`',
	},
	disabled: {
		control: 'boolean',
		description: 'Заблокированное состояние',
	},
	readOnly: {
		control: 'boolean',
		description: 'Только чтение',
	},
	error: {
		control: 'text',
		description: 'Текст ошибки валидации',
	},
	description: {
		control: 'text',
		description: 'Подсказка под полем',
	},
	placeholder: {
		control: 'text',
		description: 'Подсказка в поле (без `label`)',
	},
	onChange: {
		action: 'onChange',
		description: 'Колбэк изменения значения',
	},
	onClear: {
		action: 'onClear',
		description: 'Колбэк очистки; если задан — кнопка очистки',
	},
	prefix: {control: false},
	postfix: {control: false},
} satisfies Partial<ArgTypes>;

/** Длинная метка для проверки ellipsis floating-label. */
export const STORY_OVERFLOW_LABEL =
	'Очень длинная подпись поля с единицами измерения и уточнениями';

/** Длинное значение для проверки переполнения control. */
export const STORY_OVERFLOW_VALUE =
	'super-long-identifier-that-overflows-the-control@example.com';

/** Собирает блок `parameters` для meta компонента (внутри литерала `export default`). */
export function componentParameters(description: string) {
	return {
		layout: 'padded' as const,
		docs: {
			toc: true,
			description: {component: description},
			source: docsSource,
		},
	};
}

/** Описание конкретной story + панель исходного кода. */
export function story(description: string) {
	return {
		docs: {
			description: {story: description},
			source: docsSource,
		},
	};
}
