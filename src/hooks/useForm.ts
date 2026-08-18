import {useState} from 'react';

function isEmptyFormValue(value: unknown): boolean {
	return value === undefined || value === null || value === '';
}

/**
 * Правила валидации поля формы для `useForm.register`.
 * При нескольких правилах ошибка берётся по приоритету: required → pattern → validate.
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
 * Лёгкий хелпер контролируемых форм: хранит values/errors и фабрику `register`.
 * Не делает submit — только локальный стейт и валидацию на change.
 *
 * @template T - Форма как объект полей (ключи → значения).
 * @param initialValues - Начальные значения; ключи = имена полей.
 * @returns `values`, `errors`, `register`, `hasErrors`, `setValues`.
 *
 * @example
 * import {useForm} from 'altum/hooks';
 *
 * const {values, errors, register, hasErrors} = useForm({email: ''});
 * <TextField {...register('email', {required: 'Обязательно'})} error={errors.email} />
 */
export function useForm<T extends Record<string, unknown>>(initialValues: T) {
	const [values, setValues] = useState<T>(initialValues);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const register = (name: keyof T, rules?: ValidationRules) => {
		return {
			value: values[name],
			onChange: (val: unknown) => {
				const eventLike = val as {target?: {value?: unknown}} | null;
				const value = eventLike?.target ? eventLike.target.value : val;
				setValues((prev) => ({
					...prev,
					[name]: value,
				}));

				if (rules) {
					let error = '';
					if (rules.required && isEmptyFormValue(value)) {
						error = rules.required;
					} else if (rules.pattern && !rules.pattern.value.test(String(value ?? ''))) {
						error = rules.pattern.message;
					} else if (rules.validate) {
						const extra = rules.validate(value);
						if (typeof extra === 'string') {
							error = extra;
						} else if (extra === false) {
							error = rules.required || 'Invalid';
						}
					}
					setErrors((prev) => ({
						...prev,
						[name as string]: error,
					}));
				}
			},
		};
	};

	const hasErrors = Object.values(errors).some((error) => !!error);

	return {
		values,
		errors,
		register,
		hasErrors,
		setValues,
	};
}
