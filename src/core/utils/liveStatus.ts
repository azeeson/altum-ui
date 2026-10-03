type AriaHidden = boolean | 'true' | 'false' | undefined;

/**
 * ARIA live-region для статусных индикаторов (`Spinner`, прогресс).
 * При `aria-hidden` возвращает пустой объект — атрибуты не ставятся.
 *
 * @param hidden - Значение `aria-hidden` с хоста.
 * @param label - Доступное имя статуса.
 */
export function liveStatus(
	hidden: AriaHidden,
	label?: string,
): {
	role?: 'status';
	'aria-live'?: 'polite';
	'aria-label'?: string;
} {
	if (hidden === true || hidden === 'true') return {};
	return {
		role: 'status',
		'aria-live': 'polite',
		'aria-label': label,
	};
}
