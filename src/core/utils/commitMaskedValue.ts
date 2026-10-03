/**
 * Коммитит значение маски: успешный parse или пусто.
 * Незавершённый ввод родителя не трогает.
 *
 * @param digits - Сырые цифры маски.
 * @param parse - Полный parse или `undefined`.
 * @param onCommit - Вызывается только для полного значения или очистки.
 */
export function commitMaskedValue<T>(
	digits: string,
	parse: (digits: string) => T | undefined,
	onCommit: (next: T | undefined) => void,
): void {
	if (!digits) {
		onCommit(undefined);
		return;
	}
	const parsed = parse(digits);
	if (parsed !== undefined) onCommit(parsed);
}
