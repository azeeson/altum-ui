import {createContext, useContext} from 'react';

/**
 * Контекст `ActionSheetTrigger` → `Overflow` / `SwipeToAction`.
 */
export interface ActionSheetContextValue {
	overflowOpen: boolean;
	setOverflowOpen: (open: boolean) => void;
	/**
	 * Показывать кнопку ⋯ у Overflow.
	 * На coarse + mobile по умолчанию `false` (меню открывается long-press).
	 */
	shouldShowOverflowTrigger: boolean;
	/**
	 * Сбросить pending long-press (вызывать при горизонтальном свайпе
	 * во вложенном `SwipeToAction`).
	 */
	cancelLongPress: () => void;
}

const ActionSheetContext = createContext<ActionSheetContextValue | null>(null);

export function useActionSheetContext(): ActionSheetContextValue | null {
	return useContext(ActionSheetContext);
}

export const ActionSheetProvider = ActionSheetContext.Provider;
