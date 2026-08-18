/**
 * Объединяет обработчик потребителя и внутренний: сначала внешний,
 * внутренний — только если `event.defaultPrevented` ещё false.
 *
 * @template E - DOM/React-событие с флагом `defaultPrevented`.
 * @param consumer - Обработчик с пропсов компонента.
 * @param internal - Внутренняя логика (toggle, close, roving focus).
 * @returns Составной handler для JSX.
 *
 * @example
 * onClick={composeEventHandlers(onClick, () => toggle(value))}
 */
export function composeEventHandlers<E extends {defaultPrevented: boolean}>(
	consumer?: (event: E) => void,
	internal?: (event: E) => void,
): (event: E) => void {
	return (event: E) => {
		consumer?.(event);
		if (!event.defaultPrevented) internal?.(event);
	};
}
