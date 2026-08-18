import type {Meta, StoryObj} from '@storybook/react';

export type Story<T> = StoryObj<Meta<T>>;

const docsSource = {
	type: 'code' as const,
	excludeDecorators: true,
};

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
