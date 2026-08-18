/**
 * Вычисляет производные флаги состояния поля формы из `disabled` и `readOnly`.
 * `readOnly` игнорируется, если элемент disabled; интерактивность — только когда оба false.
 *
 * @param options - Пропсы disabled/readOnly контрола.
 * @returns Объект с `disabled`, `isReadOnly` и `isInteractive`.
 */
export function getFormControlState(options: {
	disabled?: boolean;
	readOnly?: boolean;
}): {
	disabled: boolean;
	isReadOnly: boolean;
	isInteractive: boolean;
} {
	const disabled = !!options.disabled;
	const isReadOnly = !!options.readOnly && !disabled;
	return {
		disabled,
		isReadOnly,
		isInteractive: !disabled && !isReadOnly,
	};
}
