import type React from 'react';
import type {ComponentPropsWithoutRef, Ref} from 'react';

/**
 * Вариант отрисовки спиннера.
 * - `spin` — круговой бордер;
 * - `typing` — три точки в «пузыре» (чат / ассистент);
 * - `dots` — три точки без фона (inline / кнопка);
 * - `pulse` — пульсирующий диск.
 */
export type SpinnerVariant = 'spin' | 'typing' | 'dots' | 'pulse';

/**
 * Токенный размер спиннера.
 */
export type SpinnerSize = 'sm' | 'md' | 'lg';

/**
 * Свойства `Spinner`.
 */
export interface SpinnerProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/** DOM-узел индикатора. */
	rootRef?: Ref<HTMLDivElement>;
	/**
	 * `spin` — круг; `typing` — точки в пузыре; `dots` — точки inline; `pulse` — пульс.
	 * @default 'spin'
	 */
	variant?: SpinnerVariant;
	/**
	 * Токен `sm` | `md` | `lg`, либо число px (только для `spin`).
	 * @default 'md' (для spin без числа — 24px)
	 */
	size?: number | SpinnerSize;
	/** Подпись рядом с индикатором (`typing` / `dots`). */
	label?: React.ReactNode;
}
