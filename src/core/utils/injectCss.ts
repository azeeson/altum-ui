import {CSS_SHRINK_TOKENS} from './cssShrinkTokens';

/**
 * Разворачивает control-символы `\x01…` в исходные CSS-подстроки (сборка symbol-shrink).
 */
function expandCss(css: string): string {
	let out = css;
	for (let i = 0; i < CSS_SHRINK_TOKENS.length; i++) {
		const token = CSS_SHRINK_TOKENS[i];
		if (!token) continue;
		out = out.split(String.fromCharCode(1 + i)).join(token);
	}
	return out;
}

/**
 * Инжект CSS Modules в document.head (вызывается из сгенерированных `*.module.css.js`).
 * Слой `altum` ниже обычного CSS приложения: один класс в `className` перекрывает
 * размер и hover `Button` и статус `Chip`, даже если этот `<style>` вставлен позже.
 */
export function injectCss(css: string): void {
	if (typeof document === 'undefined') return;
	const el = document.createElement('style');
	el.textContent = `@layer altum{${expandCss(css)}}`;
	document.head.appendChild(el);
}
