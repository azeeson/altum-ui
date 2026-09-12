import {useId, useState, type ChangeEvent, type FocusEventHandler} from 'react';
import {useControlledState} from './useControlledState';
import {composeEventHandlers} from '../utils/composeEvents';
import {fieldPlaceholder} from '../utils/fieldPlaceholder';
import {getFormControlState} from '../utils/formControl';
import type {FieldLabelPlacement} from '../base/FieldBase';

type FieldChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

/**
 * Строковое value, фокус, clear и placeholder текстового поля.
 *
 * @returns Состояние и обработчики для `FieldBase` + нативного control.
 * @example
 * const field = useFieldControl({ value, onChange, label, labelPlacement });
 */
export function useFieldControl(options: {
	id?: string;
	value?: string | number | readonly string[];
	defaultValue?: string | number | readonly string[];
	disabled?: boolean;
	readOnly?: boolean;
	label?: string;
	labelPlacement?: FieldLabelPlacement;
	placeholder?: string;
	keepPlaceholder?: boolean;
	onChange?: (event: FieldChangeEvent) => void;
	onFocus?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	onClear?: () => void;
}) {
	const generatedId = useId();
	const id = options.id || generatedId;
	const [focused, setFocused] = useState(false);
	const [currentValue, setUncontrolled, isControlled] = useControlledState(
		options.value === undefined ? undefined : String(options.value),
		options.defaultValue !== undefined ? String(options.defaultValue) : '',
	);
	const {isReadOnly} = getFormControlState(options);
	const isEmpty = currentValue.length === 0;
	const {onClear} = options;

	return {
		id,
		focused,
		isReadOnly,
		isEmpty,
		isControlled,
		currentValue,
		placeholder: fieldPlaceholder({
			placement: options.labelPlacement,
			focused,
			empty: isEmpty,
			placeholder: options.placeholder,
			label: options.label,
			keepPlaceholder: options.keepPlaceholder,
		}),
		handleClear: () => {
			if (!isControlled) setUncontrolled('');
			onClear?.();
		},
		onFocus: composeEventHandlers(options.onFocus, () => setFocused(true)),
		onBlur: composeEventHandlers(options.onBlur, () => setFocused(false)),
		onChange: composeEventHandlers(options.onChange, (event: FieldChangeEvent) => {
			if (!isControlled) setUncontrolled(event.target.value);
		}),
	};
}
