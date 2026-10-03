function isPlainRecord(value: object): value is Record<string, unknown> {
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}

/**
 * Совпадают ли два значения формы: примитивы по `Object.is`,
 * `Date` по времени, массивы и плоские объекты — по составу.
 * Остальные объекты — только по ссылке.
 *
 * @param left - Текущее или исходное значение.
 * @param right - Второе значение.
 * @returns `true`, если для формы это одно и то же.
 */
export function formValuesEqual(left: unknown, right: unknown): boolean {
	if (Object.is(left, right)) return true;
	if (left instanceof Date || right instanceof Date) {
		return left instanceof Date && right instanceof Date && left.getTime() === right.getTime();
	}
	if (typeof left !== 'object' || typeof right !== 'object' || left === null || right === null) {
		return false;
	}
	if (Array.isArray(left) || Array.isArray(right)) {
		if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
		return left.every((item, index) => formValuesEqual(item, right[index]));
	}
	if (!isPlainRecord(left) || !isPlainRecord(right)) return false;
	const leftKeys = Object.keys(left);
	const rightKeys = Object.keys(right);
	if (leftKeys.length !== rightKeys.length) return false;
	return leftKeys.every((key) => formValuesEqual(left[key], right[key]));
}
