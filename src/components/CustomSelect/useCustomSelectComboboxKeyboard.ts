import {useCallback} from 'react';
import {handleListHighlightKeyDown, isKey} from '../../utils/keyboard';
import {useCustomSelectContext} from './CustomSelect.context';

interface CustomSelectComboboxKeyboardOptions {
	/** Enter без выбранной опции в списке */
	onEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
	/** После Escape и закрытия dropdown */
	onEscape?: () => void;
	/** Home/End при открытом списке @default true */
	includeHomeEnd?: boolean;
}

/**
 * Делегирует Arrow/Home/End/Enter/Escape с combobox-input на `CustomSelect.List` / Listbox.
 * Вызывать только внутри `CustomSelect.Root`.
 */
export function useCustomSelectComboboxKeyboard(
	options: CustomSelectComboboxKeyboardOptions = {},
) {
	const {listboxRef, open, setOpen, interactive} = useCustomSelectContext(
		'useCustomSelectComboboxKeyboard',
	);
	const {onEnter, onEscape, includeHomeEnd = true} = options;

	return useCallback((
		event: React.KeyboardEvent<HTMLInputElement>,
		triggerKeyDown?: React.KeyboardEventHandler<HTMLElement>,
	) => {
		triggerKeyDown?.(event);
		if (event.defaultPrevented || !interactive) return;

		const listbox = listboxRef.current;

		if (handleListHighlightKeyDown(event, {
			onNext: () => {
				if (!open) setOpen(true);
				listbox?.highlightNext();
			},
			onPrev: () => {
				if (!open) setOpen(true);
				listbox?.highlightPrev();
			},
			onFirst: () => listbox?.highlightFirst(),
			onLast: () => listbox?.highlightLast(),
			includeHomeEnd: open && includeHomeEnd,
		})) {
			return;
		}

		if (isKey(event, 'Enter') && open) {
			event.preventDefault();
			if (listbox?.selectHighlighted()) return;
			onEnter?.(event);
			return;
		}

		if (isKey(event, 'Escape') && open) {
			event.preventDefault();
			setOpen(false);
			onEscape?.();
		}
	}, [
		includeHomeEnd,
		interactive,
		listboxRef,
		onEnter,
		onEscape,
		open,
		setOpen,
	]);
}
