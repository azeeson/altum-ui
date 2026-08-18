import {createContext, useContext} from 'react';

/**
 * Контекст `ActionSheetTrigger` → `OverflowActions` / `SwipeToAction`.
 */
export interface ActionSheetContextValue {
	/** Открыть overflow-меню вложенного OverflowActions. */
	openOverflow: () => void;
	/** Закрыть overflow-меню. */
	closeOverflow: () => void;
	overflowOpen: boolean;
	setOverflowOpen: (open: boolean) => void;
	/**
	 * Показывать кнопку ⋯ у OverflowActions.
	 * На touch + mobile по умолчанию `false` (меню открывается long-press).
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
