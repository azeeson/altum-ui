/**
 * Игнорирует закрытие overlay/dropdown по клику,
 * если клик только возвращает фокус в окно браузера.
 *
 * Chromium часто восстанавливает focus до click — поэтому держим флаг blur.
 * Firefox/Safari на pointerdown иногда ещё без focus — проверяем document.hasFocus().
 */

let ignoreDismissFromWindowBlur = false;

function onWindowBlur() {
	ignoreDismissFromWindowBlur = true;
}

function onWindowFocus() {
	// Даём текущему user-gesture (mousedown/click) увидеть флаг, затем сбрасываем.
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			ignoreDismissFromWindowBlur = false;
		});
	});
}

let listenersAttached = false;

function ensureWindowFocusListeners() {
	if (listenersAttached || typeof window === 'undefined') return;
	listenersAttached = true;
	window.addEventListener('blur', onWindowBlur);
	window.addEventListener('focus', onWindowFocus);
}

ensureWindowFocusListeners();

/** @returns true — dismiss нужно пропустить */
export function shouldIgnoreOverlayDismiss(): boolean {
	ensureWindowFocusListeners();

	if (typeof document !== 'undefined' && !document.hasFocus()) {
		return true;
	}

	if (ignoreDismissFromWindowBlur) {
		ignoreDismissFromWindowBlur = false;
		return true;
	}

	return false;
}

export function wrapOverlayDismiss(onDismiss?: () => void): (() => void) | undefined {
	if (!onDismiss) return undefined;

	return () => {
		if (shouldIgnoreOverlayDismiss()) return;
		onDismiss();
	};
}
