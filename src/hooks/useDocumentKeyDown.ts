import {useEffect, useRef} from 'react';

/**
 * Публичный тип `DocumentKeyDownTarget`.
 */
export type DocumentKeyDownTarget = 'document' | 'window';

/**
 * Опции хука `useDocumentKeyDown`.
 */
export interface UseDocumentKeyDownOptions {
	/** Слушать события только пока `true` (`true` по умолчанию) */
	enabled?: boolean;
	/** `document` или `window` — где вешать `keydown` (`document` по умолчанию) */
	target?: DocumentKeyDownTarget;
}

const getTarget = (target: DocumentKeyDownTarget): Document | Window =>
	target === 'window' ? window : document;

/**
 * Подписка на глобальный `keydown` с актуальным handler через ref
 * (не нужно мемоизировать handler ради стабильности подписки).
 *
 * @param handler - Обработчик клавиатуры.
 * @param options - `enabled` / `target`.
 *
 * @returns Ничего — подписка на глобальный keydown.
 *
 * @example
 * useDocumentKeyDown((event) => {
 *   if (event.key === 'ArrowDown') moveFocus(1);
 * }, {enabled: isOpen});
 */
export function useDocumentKeyDown(
	handler: (event: KeyboardEvent) => void,
	options: UseDocumentKeyDownOptions = {},
): void {
	const {enabled = true, target = 'document'} = options;
	const savedHandler = useRef(handler);

	useEffect(() => {
		savedHandler.current = handler;
	});

	useEffect(() => {
		if (!enabled) {
			return;
		}

		const listenerTarget = getTarget(target);
		const listener = (event: KeyboardEvent) => {
			savedHandler.current(event);
		};

		listenerTarget.addEventListener('keydown', listener as EventListener);
		return () => listenerTarget.removeEventListener('keydown', listener as EventListener);
	}, [enabled, target]);
}
