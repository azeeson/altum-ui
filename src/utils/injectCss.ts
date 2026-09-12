/**
 * Инжект CSS Modules в document.head (вызывается из сгенерированных `*.module.css.js`).
 */
export function injectCss(css: string): void {
	if (typeof document === 'undefined') return;
	const el = document.createElement('style');
	el.textContent = css;
	document.head.appendChild(el);
}
