import {useCallback, useState} from 'react';

/**
 * Контролируемое / неконтролируемое состояние для компонентов с опциональными `value` + `defaultValue`.
 *
 * @returns `[value, setValue, isControlled]`
 */
export function useControlledState<T>(
	controlled: T | undefined,
	defaultValue: T,
): [T, (next: T) => void, boolean] {
	const isControlled = controlled !== undefined;
	const [uncontrolled, setUncontrolled] = useState(defaultValue);
	const value = isControlled ? controlled! : uncontrolled;

	const setValue = useCallback((next: T) => {
		if (!isControlled) {
			setUncontrolled(next);
		}
	}, [isControlled]);

	return [value, setValue, isControlled];
}

/**
 * Контролируемое / неконтролируемое состояние с колбэком при изменении (onChange / onOpenChange).
 */
export function useControlledStateWithCallback<T>(
	controlled: T | undefined,
	defaultValue: T,
	onChange?: (next: T) => void,
): [T, (next: T) => void, boolean] {
	const isControlled = controlled !== undefined;
	const [uncontrolled, setUncontrolled] = useState(defaultValue);
	const value = isControlled ? controlled! : uncontrolled;

	const setValue = useCallback((next: T) => {
		if (!isControlled) {
			setUncontrolled(next);
		}
		onChange?.(next);
	}, [isControlled, onChange]);

	return [value, setValue, isControlled];
}
