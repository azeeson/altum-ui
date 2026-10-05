import type {
	ComponentPropsWithoutRef,
	ElementType,
	ReactNode,
	Ref,
} from 'react';

/**
 * Роль начертания.
 * Заголовки рисует `Title`, остальное — `Text`.
 * Кегль, вес и тег заголовка задаёт роль. Снаружи уровень не передаётся.
 */
export type TypeName =
	| 'page'
	| 'modal'
	| 'section'
	| 'card'
	| 'lead'
	| 'body'
	| 'subtitle'
	| 'label'
	| 'caption';

/**
 * Свойства `Type`.
 * Тег заголовка зашит в роль: `page` — `h1`, `modal` и `section` — `h2`, `card` — `h3`.
 * `as` — только у текстовых ролей (`lead`, `body`, `subtitle`, `label`, `caption`).
 */
export interface TypeProps extends Omit<ComponentPropsWithoutRef<'h2'>, 'color'> {
	/**
	 * Роль начертания.
	 * @default `body`
	 */
	type?: TypeName;
	/**
	 * Тег текстовой роли.
	 * У заголовков тег принадлежит роли.
	 */
	as?: ElementType;
	children?: ReactNode;
	/** DOM-узел. */
	rootRef?: Ref<HTMLElement>;
}
