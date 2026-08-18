import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Свойства `ActionSheetTrigger`.
 */
export interface ActionSheetTriggerProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/**
	 * Контент (строка, `SwipeToAction`, …) и вложенный `OverflowActions`.
	 * Long-press по обёртке открывает overflow.
	 */
	children: React.ReactNode;
	/**
	 * Сливает long-press-обработчики в единственный child-элемент (`button` / `a`)
	 * вместо обёртки-`div`. Child обязан быть одним React-элементом.
	 */
	asChild?: boolean;
	/**
	 * На touch + mobile показывать кнопку ⋯ у вложенного `OverflowActions`.
	 * `false` — ⋯ скрыт (меню открывается long-press).
	 * @default false
	 */
	showOverflowTrigger?: boolean;
	/** Задержка long-press, мс. @default 500 */
	longPressMs?: number;
	/**
	 * Порог смещения (px) для отмены long-press.
	 * Должен быть ≤ порога распознавания свайпа у `SwipeToAction`.
	 * @default 8
	 */
	moveThreshold?: number;
	disabled?: boolean;
}
