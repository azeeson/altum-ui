/**
 * Словарь для symbol-shrink CSS на сборке (см. `cssSymbolShrinkPlugin` в rollup.config.mjs).
 * Не больше 30 строк: плейсхолдеры `\x01`…`\x1E` (индекс `i` → `String.fromCharCode(1 + i)`).
 * Выход за `\x1E` даёт печатаемые ASCII (пробел, `!`, `"`) и ломает CSS при expand.
 */
export const CSS_SHRINK_MAX_TOKENS = 30;

export const CSS_SHRINK_TOKENS: readonly string[] = [
	'var(--altum-color-',
	'var(--altum-g-space-',
	'var(--altum-g-font-size-',
	'var(--altum-g-font-weight-',
	'var(--altum-g-radius',
	'var(--altum-field-',
	'background-color:var(--altum-',
	'border-radius:var(--altum-',
	'box-shadow:var(--altum-',
	'border-color:var(--altum-',
	'1px solid var(--altum-',
	'font-size:var(--altum-',
	'font-weight:var(--altum-',
	'color:var(--altum-',
	'height:var(--altum-',
	'padding:var(--altum-',
	'gap:var(--altum-',
	'color-mix(in srgb,',
	'var(--altum-',
	'--altum-',
	'[data-orientation=',
	'[data-variant=',
	'[data-layout=',
	'[data-status=',
	'[data-state=',
	'[data-size=',
	'[data-side=',
	'[data-mode=',
	'[data-disabled',
	'box-sizing:border-box',
];
