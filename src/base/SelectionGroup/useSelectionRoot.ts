import {useCallback, useRef} from 'react';
import type {KeyboardEvent, MouseEvent} from 'react';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {getFormControlState} from '../../core/utils/form';
import {
	handleSelectionClick,
	handleSelectionKeyDown,
	nextSelectionValue,
	SELECTION_LIST_ATTR,
	SELECTION_ROOT_ATTR,
	type SelectionType,
} from './SelectionGroup.utils';

type SelectionTrigger = (itemValue: string) => void;

export type SelectionRootConfig<T extends string | readonly string[]> = {
	type?: SelectionType;
	value?: T;
	defaultValue?: T;
	onChange?: (value: T) => void;
	disabled?: boolean;
	readOnly?: boolean;
	orientation?: 'horizontal' | 'vertical';
	activateOnFocus?: boolean;
};

/**
 * Значение выбора в React. Пункты рисует вызывающий код, стрелки и клик читают DOM.
 *
 * @returns Значение, data-атрибуты и обработчики клика и стрелок.
 */
export function useSelectionRoot<T extends string | readonly string[] = string>({
	type = 'radio',
	value: controlledValue,
	defaultValue,
	onChange,
	disabled = false,
	readOnly = false,
	orientation = 'horizontal',
	activateOnFocus = true,
}: SelectionRootConfig<T>) {
	const {isReadOnly, isInteractive: interactive} = getFormControlState({
		disabled,
		readOnly,
	});
	const fallback = (type === 'checkbox' ? [] : '') as T;
	const [value, setValueRaw] = useControlledStateWithCallback<T>(
		controlledValue,
		defaultValue ?? fallback,
		onChange,
	);

	const snapshotRef = useRef({
		type,
		value: value as string | readonly string[],
		interactive,
	});
	const commitRef = useRef(setValueRaw);
	snapshotRef.current = {
		type,
		value,
		interactive,
	};
	commitRef.current = setValueRaw;

	const trigger = useCallback<SelectionTrigger>((itemValue) => {
		const snap = snapshotRef.current;
		if (!snap.interactive) return;
		const next = nextSelectionValue(snap.type, snap.value, itemValue) as T;
		snapshotRef.current = {
			...snap,
			value: next,
		};
		commitRef.current(next);
	}, []);

	const onClick = (event: MouseEvent<HTMLElement>) => {
		handleSelectionClick(event, trigger);
	};
	const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		handleSelectionKeyDown(event, trigger);
	};

	return {
		value,
		isReadOnly,
		onClick,
		onKeyDown,
		dataProps: {
			[SELECTION_ROOT_ATTR]: '' as const,
			[SELECTION_LIST_ATTR]: '' as const,
			'data-selection-type': type,
			'data-orientation': orientation,
			'data-disabled': disabled ? '' as const : undefined,
			'data-readonly': isReadOnly ? '' as const : undefined,
			'data-activate-on-focus': activateOnFocus ? undefined : 'false' as const,
		},
	};
}
