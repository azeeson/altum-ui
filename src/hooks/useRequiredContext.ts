import {useContext, type Context} from 'react';

/**
 * Читает React context и бросает, если провайдера нет.
 * Для составных слотов (`Accordion.Item`, позже Tabs / ButtonGroup).
 *
 * @param ctx - Контекст, созданный с `null`.
 * @param name - Текст ошибки (имя слота / компонента).
 * @returns Значение контекста.
 * @throws Если хук вызван вне `Provider`.
 * @example
 * const ctx = useRequiredContext(AccordionContext, 'Accordion.Item должен использоваться внутри Accordion');
 */
export function useRequiredContext<T>(ctx: Context<T | null>, name: string): T {
	const value = useContext(ctx);
	if (!value) throw new Error(name);
	return value;
}
