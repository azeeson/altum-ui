import {forwardRef, type ElementType} from 'react';
import {cn} from '../../utils/cn';
import {alignClass, flexStyles as styles, gapClass, justifyClass} from './layoutClasses';
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
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
	{
		children,
		gap = 'md',
		align = 'stretch',
		justify = 'start',
		className,
		as: Component = 'div',
		style,
		...rest
	},
	ref,
) {
	const Element = Component as ElementType;

	return (
		<Element
			ref={ref as never}
			className={cn(
				styles.base,
				styles.stack,
				gapClass(gap),
				alignClass(align),
				justifyClass(justify),
				className,
			)}
			style={style}
			{...rest}
		>
			{children}
		</Element>
	);
});

Stack.displayName = 'Stack';
