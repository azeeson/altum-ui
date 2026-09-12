/**
 * Play-хелперы для Storybook 7 (CSF3).
 * `@storybook/test` — пакет Storybook 8; здесь — нативные DOM-события,
 * совместимые с controlled React-инпутами.
 */

export function queryStoryControl(
	root: HTMLElement,
	selector = 'input, textarea, [role="combobox"], [role="spinbutton"]',
): HTMLElement | null {
	return root.querySelector(selector);
}

/** Запись value так, чтобы сработал React onChange. */
export function setReactInputValue(
	element: HTMLInputElement | HTMLTextAreaElement,
	value: string,
) {
	const proto = element instanceof HTMLTextAreaElement
		? HTMLTextAreaElement.prototype
		: HTMLInputElement.prototype;
	Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(element, value);
	element.dispatchEvent(new Event('input', {bubbles: true}));
}

/** Фокус контрола — chrome `:focus-within`. */
export async function playFocus(
	canvasElement: HTMLElement,
	selector?: string,
) {
	queryStoryControl(canvasElement, selector)?.focus();
}

/** Ввод текста в input/textarea. */
export async function playType(
	canvasElement: HTMLElement,
	value: string,
	selector = 'input, textarea',
) {
	const el = canvasElement.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector);
	if (!el) return;
	el.focus();
	setReactInputValue(el, value);
}

/** Клик по элементу внутри canvas. */
export async function playClick(
	canvasElement: HTMLElement,
	selector: string,
) {
	canvasElement.querySelector<HTMLElement>(selector)?.click();
}
