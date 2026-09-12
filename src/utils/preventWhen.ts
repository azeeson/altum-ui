/**
 * Если условие истинно — `preventDefault` и выход, иначе вызывает handler.
 * Для read-only контролов: нативный toggle не проходит, потребительский handler не зовётся.
 *
 * @param condition - Когда `true`, событие глушится.
 * @param handler - Обработчик при `condition === false`.
 * @returns Handler для JSX.
 *
 * @example
 * onClick={preventWhen(readOnly, onClick)}
 */
export function preventWhen<E extends {preventDefault: () => void}>(
	condition: boolean,
	handler?: (event: E) => void,
): (event: E) => void {
	return (event: E) => {
		if (condition) {
			event.preventDefault();
			return;
		}
		handler?.(event);
	};
}
