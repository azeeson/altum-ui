/**
 * Цифры литералов маски до первого слота `9` (например `7` в `+7 (999)…`).
 */
export const getStaticDigitsPrefix = (mask: string): string => {
	let prefix = '';
	for (let i = 0; i < mask.length; i++) {
		if (mask[i] === '9') break;
		if (/\d/.test(mask[i])) {
			prefix += mask[i];
		}
	}
	return prefix;
};

/**
 * Форматирует чистые цифры пользователя по маске (слот `9` = цифра).
 */
export const getFormattedValue = (inputValue: string, mask: string): string => {
	const cleanVal = inputValue.replace(/\D/g, '');
	let result = '';
	let cleanIndex = 0;

	for (let i = 0; i < mask.length; i++) {
		const maskChar = mask[i];
		if (maskChar === '9') {
			if (cleanIndex < cleanVal.length) {
				result += cleanVal[cleanIndex];
				cleanIndex++;
			} else {
				break;
			}
		} else {
			result += maskChar;
		}
	}
	return result;
};

/**
 * Хвост маски после уже отформатированного значения: `9` → `_`, литералы как есть.
 */
export const getRemainingGuides = (value: string, mask: string): string => {
	let result = '';
	for (let i = value.length; i < mask.length; i++) {
		if (mask[i] === '9') {
			result += '_';
		} else {
			result += mask[i];
		}
	}
	return result;
};
