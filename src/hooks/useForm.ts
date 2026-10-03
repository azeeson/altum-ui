import {useEffect, useRef, useState, type Dispatch, type SetStateAction} from 'react';

import {omit} from '../core/utils/object';
import type {FormRule} from '../shared/form/formRules';
import {formValuesEqual} from '../shared/form/formValues';

/**
 * Ошибки полей: ключ есть только там, где есть текст.
 */
export type FormErrors<T extends Record<string, unknown>> = Partial<Record<keyof T, string>>;

/**
 * Проверка поля. Строка — ошибка, `undefined` — значение годится.
 * `values` — форма после текущего изменения.
 */
export type FieldValidate<T extends Record<string, unknown>, K extends keyof T> = (
	value: T[K],
	values: T,
) => string | undefined;

/**
 * Как прочитать аргумент `onChange` и чем проверить поле.
 * Хук не знает про обязательность и шаблоны — это `validate` снаружи.
 */
export interface RegisterOptions<T extends Record<string, unknown>, K extends keyof T> {
	/**
	 * Достаёт значение из аргумента `onChange`.
	 * Без опции: `target.value` у события, иначе аргумент как есть.
	 */
	getValue?: (payload: unknown) => T[K];
	/** Синхронная проверка. Сохраняется и для `handleSubmit`. */
	validate?: FieldValidate<T, K>;
}

function readEventValue(payload: unknown): unknown {
	const eventLike = payload as {target?: {value?: unknown}} | null;
	if (eventLike && typeof eventLike === 'object' && eventLike.target) {
		return eventLike.target.value;
	}
	return payload;
}

function omitError<T extends Record<string, unknown>>(
	errors: FormErrors<T>,
	name: keyof T,
): FormErrors<T> {
	if (!(name in errors)) return errors;
	return omit(errors, [name]) as FormErrors<T>;
}

/**
 * Контролируемая форма: значения, ошибки и `register`.
 * Валидация на change — только если у поля передали `validate`.
 * `handleSubmit` прогоняет сохранённые проверки и зовёт `onValid`, когда ошибок нет.
 * Вложенные пути хук не пишет: обновите их через `setValues` и `set` из `altum/utils`.
 *
 * @template T - Форма как объект полей (ключи → значения).
 * @param initialValues - Начальные значения; ключи = имена полей. Это чистый снимок: `isDirty` сравнивает с ним. `reset(next)` подменяет снимок.
 * @returns Стейт, `isDirty`, `register` и команды `setValue` / `setError` / `clearErrors` / `reset` / `handleSubmit`.
 *
 * @example
 * import {compose, pattern, required, useForm} from 'altum/hooks';
 *
 * const {errors, register, handleSubmit} = useForm({email: ''});
 * const email = register('email', {
 *   validate: compose(required('Обязательно'), pattern(/@/, 'Не почта')),
 * });
 * <form onSubmit={handleSubmit((values) => save(values))}>
 *   <TextField {...email} error={errors.email} />
 * </form>
 */
export function useForm<T extends Record<string, unknown>>(initialValues: T) {
	const [values, setValuesState] = useState<T>(initialValues);
	const [errors, setErrors] = useState<FormErrors<T>>({});
	const [baseline, setBaseline] = useState<T>(initialValues);
	const valuesRef = useRef(values);
	const validatorsRef = useRef<Partial<Record<keyof T, FormRule<T>>>>({});
	const [registered] = useState(() => new Set<keyof T>());
	registered.clear();

	useEffect(() => {
		(Object.keys(validatorsRef.current) as (keyof T)[]).forEach((name) => {
			if (!registered.has(name)) delete validatorsRef.current[name];
		});
	});

	const commitError = (name: keyof T, error: string | undefined) => {
		setErrors((prev) => {
			if (error) {
				if (prev[name] === error) return prev;
				return {
					...prev,
					[name]: error
				};
			}
			return omitError(prev, name);
		});
	};

	const writeValue = <K extends keyof T>(name: K, value: T[K]) => {
		const next = {
			...valuesRef.current,
			[name]: value
		} as T;
		valuesRef.current = next;
		setValuesState(next);
		return next;
	};

	const register = <K extends keyof T>(name: K, options?: RegisterOptions<T, K>) => {
		registered.add(name);
		if (options?.validate) {
			validatorsRef.current[name] = options.validate as FormRule<T>;
		} else {
			delete validatorsRef.current[name];
		}

		return {
			value: values[name],
			onChange: (payload: unknown) => {
				const value = (options?.getValue ?? readEventValue)(payload) as T[K];
				const next = writeValue(name, value);
				commitError(name, validatorsRef.current[name]?.(value, next));
			},
		};
	};

	const setValues: Dispatch<SetStateAction<T>> = (action) => {
		setValuesState((prev) => {
			const next = typeof action === 'function' ? action(prev) : action;
			valuesRef.current = next;
			return next;
		});
	};

	const setValue = <K extends keyof T>(name: K, value: T[K]) => {
		const next = writeValue(name, value);
		const validate = validatorsRef.current[name];
		if (validate) commitError(name, validate(value, next));
	};

	const setError = (name: keyof T, message: string) => {
		setErrors((prev) => (prev[name] === message ? prev : {
			...prev,
			[name]: message
		}));
	};

	const clearErrors = (name?: keyof T) => {
		if (name === undefined) {
			setErrors({});
			return;
		}
		setErrors((prev) => omitError(prev, name));
	};

	const reset = (next?: T) => {
		const resolved = next ?? baseline;
		valuesRef.current = resolved;
		setValuesState(resolved);
		setErrors({});
		if (next !== undefined) setBaseline(resolved);
	};

	const isDirty = !formValuesEqual(values, baseline);

	const handleSubmit = (onValid: (values: T) => void) => {
		return (event?: {preventDefault?: () => void}) => {
			event?.preventDefault?.();
			const current = valuesRef.current;
			const nextErrors: FormErrors<T> = {};
			(Object.keys(validatorsRef.current) as (keyof T)[]).forEach((name) => {
				const error = validatorsRef.current[name]?.(current[name], current);
				if (error) nextErrors[name] = error;
			});
			setErrors(nextErrors);
			if (Object.keys(nextErrors).length === 0) onValid(current);
		};
	};

	const hasErrors = Object.keys(errors).length > 0;

	return {
		values,
		errors,
		isDirty,
		register,
		hasErrors,
		setValues,
		setValue,
		setError,
		clearErrors,
		reset,
		handleSubmit,
	};
}

/** Всё, что возвращает `useForm`. Этот же набор кладётся в `FormProvider`. */
export type UseFormReturn<T extends Record<string, unknown>> = ReturnType<typeof useForm<T>>;
