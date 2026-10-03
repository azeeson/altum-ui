import {useContext, type Context, type KeyboardEvent, type Ref} from 'react';

/**
 * Сливает два рефа в один callback-реф.
 * Заменяет `composeRefs` и инлайновые callback-рефы в JSX.
 */
export const uRef = <T, >(r1?: Ref<T> | null, r2?: Ref<T> | null) => (node: T | null) => {
	const write = (ref?: Ref<T> | null) => {
		if (!ref) return;
		if (typeof ref === 'function') {
			ref(node);
			return;
		}
		(ref as {current: T | null}).current = node;
	};
	write(r1);
	write(r2);
};

/**
 * Перехватчик события: опционально гасит действие и всплытие, затем вызывает колбэк.
 * `stop` — `stopPropagation`. `prev` — `preventDefault` (если не задан, гасится вместе со `stop`).
 */
type StoppableEvent = {
	preventDefault: () => void;
	stopPropagation: () => void;
	defaultPrevented?: boolean;
};

export const uEv = <E extends StoppableEvent>(
	cb?: (event: E) => void,
	stop?: boolean,
	prev?: boolean,
) => (event: E) => {
	if (prev || (prev === undefined && stop)) event.preventDefault();
	if (stop) event.stopPropagation();
	cb?.(event);
};

/**
 * Цепочка двух обработчиков: сначала `a`, затем `b`, если `defaultPrevented` ещё false.
 * Без промежуточных массивов / Object.keys.
 */
export const uEvMerge = <E extends {defaultPrevented: boolean}>(
	a?: (event: E) => void,
	b?: (event: E) => void,
) => (
	!a ? b : !b ? a : (event: E) => {
		a(event);
		if (!event.defaultPrevented) b(event);
	}
);

/** Склеивает id для `aria-describedby` / `aria-labelledby`. Пустая строка не попадает в атрибут. */
export const ariaIds = (...ids: Array<string | false | null | undefined>) => (
	ids.filter(Boolean).join(' ') || undefined
);

/**
 * Стрелки, Home и End двигают фокус по элементам внутри контейнера.
 * Селектор — один compound (`:is(button, a)`), чтобы `:not([disabled])` применился ко всему списку.
 *
 * @param onMove - После перевода фокуса (индекс нового элемента).
 * @returns `true`, если клавиша была навигационной.
 */
export function handleRovingFocus(
	event: KeyboardEvent<HTMLElement> | globalThis.KeyboardEvent,
	container: HTMLElement,
	selector: string,
	onMove?: (index: number) => void,
): boolean {
	const items = Array.from(
		container.querySelectorAll<HTMLElement>(`${selector}:not([disabled]):not([hidden])`),
	);
	if (items.length === 0) return false;
	let index = items.indexOf(document.activeElement as HTMLElement);

	if (event.key === 'ArrowDown' || event.key === 'ArrowRight') index = (index + 1) % items.length;
	else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') index = (index - 1 + items.length) % items.length;
	else if (event.key === 'Home') index = 0;
	else if (event.key === 'End') index = items.length - 1;
	else return false;

	event.preventDefault();
	items[index]?.focus({preventScroll: true});
	onMove?.(index);
	return true;
}

/** Контекст или исключение, если провайдера нет. */
// Хук спрятан в микро-утилиту ядра: вызывается только из компонента.
export const getCtx = <T, >(context: Context<T | undefined>, message: string): T => {
	// getCtx — хук ядра; имя зафиксировано в API, не use*.
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const value = useContext(context);
	if (value === undefined) throw new Error(message);
	return value;
};
