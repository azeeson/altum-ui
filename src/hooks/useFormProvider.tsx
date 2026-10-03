import {
	createContext,
	createElement,
	useRef,
	useState,
	type ReactNode,
} from 'react';

import {useRequiredContext} from './useRequiredContext';
import {useForm, type UseFormReturn} from './useForm';

const FormContext = createContext<UseFormReturn<Record<string, unknown>> | null>(null);

/**
 * Форма из ближайшего `FormProvider`.
 * Тот же набор, что у `useForm`: `register`, `setValue`, `errors` и остальные методы.
 *
 * @template T - Форма как объект полей. Задайте его явно: контекст сам тип не выводит.
 * @returns API формы, в которой лежит компонент.
 * @throws Если вызван вне `FormProvider`.
 *
 * @example
 * const {register, errors} = useFormContext<{email: string}>();
 * <TextField {...register('email')} error={errors.email} />
 */
export function useFormContext<T extends Record<string, unknown>>(): UseFormReturn<T> {
	return useRequiredContext(
		FormContext,
		'useFormContext должен вызываться внутри FormProvider',
	) as UseFormReturn<T>;
}

/**
 * `useForm` плюс `FormProvider` для вложенных полей.
 * Аргумент тот же: начальные значения. Компонент провайдера стабилен между рендерами,
 * чтобы поля внутри не перемонтировались.
 *
 * @template T - Форма как объект полей (ключи → значения).
 * @param initialValues - Начальные значения; ключи = имена полей.
 * @returns Всё от `useForm` и `FormProvider`.
 *
 * @example
 * const {FormProvider, handleSubmit} = useFormProvider({email: ''});
 * <FormProvider>
 *   <form onSubmit={handleSubmit(save)}>
 *     <EmailField />
 *   </form>
 * </FormProvider>
 */
export function useFormProvider<T extends Record<string, unknown>>(initialValues: T) {
	const form = useForm(initialValues);
	const formRef = useRef(form);
	// Дети читают API этой же отрисовки. В эффекте значение опоздало бы на кадр.
	formRef.current = form;

	const [FormProvider] = useState(() => {
		function FormProvider({children}: {children?: ReactNode}) {
			return createElement(
				FormContext.Provider,
				{value: formRef.current as UseFormReturn<Record<string, unknown>>},
				children,
			);
		}
		return FormProvider;
	});

	return {
		...form,
		FormProvider,
	};
}
