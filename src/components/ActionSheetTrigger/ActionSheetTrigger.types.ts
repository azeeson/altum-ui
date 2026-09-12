import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Свойства `ActionSheetTrigger`.
 */
export interface ActionSheetTriggerProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/**
	 * Контент (строка, `SwipeToAction`, …) и вложенный `Overflow`.
	 * Long-press по обёртке открывает overflow.
	 */
	children: React.ReactNode;
	/**
	 * На touch + mobile показывать кнопку ⋯ у вложенного `Overflow`.
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
