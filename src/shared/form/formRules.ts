/**
 * Проверка одного поля. Строка — текст ошибки, `undefined` — значение годится.
 * Второй аргумент — вся форма, чтобы правило видело соседние поля.
 */
export type FormRule<T extends Record<string, unknown> = Record<string, unknown>> = (
	value: unknown,
	values: T,
) => string | undefined;

function isEmptyFormValue(value: unknown): boolean {
	return value === undefined || value === null || value === '';
}

/**
 * Ошибка, если значение пустое (`undefined`, `null`, `''`).
 * `0` и `false` пустыми не считаются.
 *
 * @param message - Текст ошибки.
 * @returns Правило для `register` / `compose`.
 */
export function required(message: string): FormRule {
	return (value) => (isEmptyFormValue(value) ? message : undefined);
}

/**
 * Ошибка, если непустое значение не совпадает с шаблоном.
 * Пустое значение пропускается — пару с обязательностью даёт `compose(required(...), pattern(...))`.
 *
 * @param regex - Шаблон.
 * @param message - Текст ошибки.
 * @returns Правило для `register` / `compose`.
 */
export function pattern(regex: RegExp, message: string): FormRule {
	return (value) => {
		if (isEmptyFormValue(value)) return undefined;
		return regex.test(String(value)) ? undefined : message;
	};
}

/**
 * Первая ошибка из правил по порядку. Остальные не вызываются.
 *
 * @param rules - Правила от более важного к менее важному.
 * @returns Одно правило.
 */
export function compose<T extends Record<string, unknown> = Record<string, unknown>>(
	...rules: FormRule<T>[]
): FormRule<T> {
	return (value, values) => {
		for (const rule of rules) {
			const error = rule(value, values);
			if (error) return error;
		}
		return undefined;
	};
}

/**
 * Прежний объект правил `useForm.register`.
 * Ошибка берётся по приоритету: `required` → `pattern` → `validate`.
 * Для новых форм удобнее `compose`, `required` и `pattern`.
 */
export interface ValidationRules {
	/** Текст ошибки, если значение пустое (`undefined` / `null` / `''`; `0` — не пустое) */
	required?: string;
	pattern?: {
		value: RegExp;
		message: string;
	};
	/**
	 * Верните строку ошибки, `true` (ок) или `false`.
	 * `false` — провал: текст `required`, иначе `'Invalid'`.
	 */
	validate?: (val: unknown) => string | boolean;
}

/**
 * Адаптер старого объекта `ValidationRules` в одно правило.
 * `pattern` здесь по-прежнему проверяет и пустую строку, если нет `required`.
 *
 * @param rules - Прежние правила поля.
 * @returns Правило для `register`.
 *
 * @example
 * register('email', {validate: fieldRules({required: 'Обязательно'})})
 */
export function fieldRules(rules: ValidationRules): FormRule {
	return (value) => {
		if (rules.required && isEmptyFormValue(value)) return rules.required;
		if (rules.pattern && !rules.pattern.value.test(String(value ?? ''))) {
			return rules.pattern.message;
		}
		if (!rules.validate) return undefined;
		const extra = rules.validate(value);
		if (typeof extra === 'string') return extra;
		if (extra === false) return rules.required || 'Invalid';
		return undefined;
	};
}

/**
 * `checked` из нативного change чекбокса. В `useForm` не вшито:
 * передайте как `getValue` у `register`.
 *
 * @param payload - Событие change или любое другое значение.
 * @returns `true`, только если у события `target.checked`.
 */
export function checkedValue(payload: unknown): boolean {
	const eventLike = payload as {target?: {checked?: boolean}} | null;
	return Boolean(eventLike && typeof eventLike === 'object' && eventLike.target?.checked);
}
