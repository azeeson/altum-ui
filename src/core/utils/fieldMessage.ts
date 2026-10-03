import type {ReactNode} from 'react';

/**
 * Строковая подсказка поля, не пустая. Узел (`ReactNode`) сюда не попадает.
 */
export function isFieldDescriptionText(description: ReactNode): description is string {
	return typeof description === 'string' && description.length > 0;
}

/**
 * Идентификаторы ошибки и подсказки поля.
 * Строковая подсказка скрывается, когда задан `error`; узел описания остаётся слотом.
 */
export function resolveFieldMessages(
	id: string,
	options: {
		error?: boolean | string;
		description?: ReactNode;
	},
) {
	const {error, description} = options;
	const hasError = !!error;
	const isDescriptionText = isFieldDescriptionText(description);
	const errorId = typeof error === 'string' ? `${id}-error` : undefined;
	const descriptionId = isDescriptionText && !hasError ? `${id}-description` : undefined;
	const describedBy = [errorId, descriptionId].filter(Boolean).join(' ') || undefined;
	return {
		hasError,
		isDescriptionText,
		errorId,
		descriptionId,
		describedBy,
	};
}
