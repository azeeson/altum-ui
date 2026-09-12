import {forwardRef} from 'react';
import {Flex} from '../../base/Flex';
import type {StackProps} from './Layout.types';

export type {LayoutAlign, LayoutGap, LayoutJustify, StackProps} from './Layout.types';

/**
 * Вертикальный flex-стек: секции формы, списки карточек, колонка в сайдбаре.
 * Всегда `width: 100%` родителя — ограничение ширины через родителя.
 *
 * **Когда использовать**
 * - поля формы друг под другом;
 * - блоки контента с одинаковым вертикальным ритмом (`gap`);
 * - колонка в `Layout.Content` / модалке.
 *
 * **Когда не использовать**
 * - элементы в одну линию → `Inline` / `ControlRow` / `Split`;
 * - сетка колонок → `Grid`;
 * - нестандартную раскладку с px-gap → локальный CSS-класс с токенами.
 *
 * @component
 * @example
 * <Stack gap="md" align="stretch">
 *   <TextField label="Имя" />
 *   <Button variant="primary">Сохранить</Button>
 * </Stack>
 */
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(props, ref) {
	return (
		<Flex
			ref={ref}
			gap='md'
			align='stretch'
			justify='start'
			{...props}
			direction='column'
		/>
	);
});

Stack.displayName = 'Stack';
