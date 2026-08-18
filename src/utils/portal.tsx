import React from 'react';
import {createPortal} from 'react-dom';

interface LibraryPortalOptions {
	/** Портальный контейнер; по умолчанию `document.body`. */
	container?: HTMLElement | null;
}

/**
 * Рендерит библиотечный слой в заданный контейнер.
 * Безопасен при SSR: до появления `document` возвращает `null`.
 */
export function createLibraryPortal(
	node: React.ReactNode,
	{container}: LibraryPortalOptions = {},
): React.ReactPortal | null {
	if (typeof document === 'undefined') return null;
	return createPortal(node, container ?? document.body);
}
