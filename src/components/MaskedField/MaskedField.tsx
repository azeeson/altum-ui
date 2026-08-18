import type {
	MaskedFieldProps,
} from './MaskedField.types';
export type {
	MaskedFieldProps,
} from './MaskedField.types';

import React, {forwardRef, useState, useLayoutEffect, useRef} from 'react';
import {TextField} from '../TextField/TextField';
import styles from './MaskedField.module.css';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {
	getFormattedValue,
	getRemainingGuides,
	getStaticDigitsPrefix,
} from './MaskedField.utils';

export {
	getFormattedValue,
	getRemainingGuides,
	getStaticDigitsPrefix,
} from './MaskedField.utils';

/**
 * Текстовое поле с маской ввода: хранит только цифры, отображает форматированное значение.
 *
 * Типографика как у `TextField` (`--altum-g-font-family-ui` через FieldBase). Гиды маски
 * выравниваются прозрачным spacer’ом с уже введёнными символами; overlay совпадает
 * с content-box input (те же padding + border width), иначе литералы вроде «+7»
 * сдвигаются относительно значения. Не переопределяйте `padding` / `font-size` /
 * `border-width` на inner `input`.
 *
 * @component
 * @example
 * <MaskedField
 *   label="Телефон"
 *   mask="+7 (999) 999-99-99"
 *   value={phone}
 *   onChange={setPhone}
 *   onClear={() => setPhone('')}
 *   size="sm"
 *   labelPlacement="none"
 *   maskAsPlaceholder
 * />
 */
export const MaskedField = forwardRef<HTMLInputElement, MaskedFieldProps>(function MaskedField(
	{
		mask,
		value,
		onChange,
		onClear,
		clearLabel,
		onFocus,
		onBlur,
		onKeyDown,
		disabled,
		readOnly,
		size = 'md',
		width = 'full',
		labelPlacement = 'inline',
		maskAsPlaceholder = false,
		placeholder: placeholderProp,
		prefix,
		postfix,
		wrapperClassName = '',
		onClick,
		className,
		...props
	},
	ref,
) {
	const [isFocused, setIsFocused] = useState(false);
	const internalInputRef = useRef<HTMLInputElement | null>(null);
	const caretRef = useRef<number | null>(null);
	const [caretTick, setCaretTick] = useState(0);
	const isReadOnly = !!readOnly && !disabled;

	const cleanDigits = value.replace(/\D/g, '');

	const scheduleCaret = (position: number) => {
		caretRef.current = position;
		setCaretTick((tick) => tick + 1);
	};

	// Синхронизировать каретку после commit DOM (layout, не paint)
	useLayoutEffect(() => {
		const input = internalInputRef.current;
		if (input && caretRef.current !== null) {
			input.setSelectionRange(caretRef.current, caretRef.current);
			caretRef.current = null;
		}
	}, [value, caretTick]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled || isReadOnly) return;
		const input = e.target;
		const originalSelectionStart = input.selectionStart || 0;

		const rawInput = input.value;
		let cleanInput = rawInput.replace(/\D/g, '');

		// Убрать статичные цифры префикса (как «7» в +7), если пользователь их ввёл или они снова извлеклись
		const staticPrefix = getStaticDigitsPrefix(mask);
		if (staticPrefix && cleanInput.startsWith(staticPrefix)) {
			cleanInput = cleanInput.slice(staticPrefix.length);
		}

		const maxDigits = mask.replace(/[^9]/g, '').length;
		const truncatedDigits = cleanInput.slice(0, maxDigits);

		const formatted = getFormattedValue(truncatedDigits, mask);

		// Сохранить позицию каретки до асинхронного commit состояния React.
		if (originalSelectionStart >= rawInput.length - 1) {
			scheduleCaret(formatted.length);
		} else {
			scheduleCaret(originalSelectionStart);
		}

		// Вызвать обработчик родителя только с цифрами, введёнными пользователем
		onChange(truncatedDigits);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (disabled || isReadOnly) return;

		const input = e.currentTarget;
		const start = input.selectionStart;
		const end = input.selectionEnd;
		const collapsed = start !== null && start === end;

		const deleteDigitAtMaskIndex = (maskIndex: number) => {
			let digitCount = 0;
			for (let i = 0; i < maskIndex; i++) {
				if (mask[i] === '9') {
					digitCount++;
				}
			}
			const digits = value.replace(/\D/g, '');
			const newDigits = digits.slice(0, digitCount) + digits.slice(digitCount + 1);
			const cursorPosition = getFormattedValue(newDigits.slice(0, digitCount), mask).length;
			scheduleCaret(cursorPosition);
			onChange(newDigits);
		};

		if (e.key === 'Backspace' && collapsed && start !== null && start > 0) {
			let prevCharIndex = start - 1;
			while (prevCharIndex >= 0 && mask[prevCharIndex] !== '9') {
				prevCharIndex--;
			}
			e.preventDefault();
			if (prevCharIndex >= 0) {
				deleteDigitAtMaskIndex(prevCharIndex);
			}
			// До первого слота цифры: no-op (не дёргать нативные литералы)
		}

		if (e.key === 'Delete' && collapsed && start !== null && start < mask.length) {
			let nextCharIndex = start;
			while (nextCharIndex < mask.length && mask[nextCharIndex] !== '9') {
				nextCharIndex++;
			}
			if (nextCharIndex < mask.length) {
				e.preventDefault();
				deleteDigitAtMaskIndex(nextCharIndex);
			}
		}
	};

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
	};

	const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
		const input = e.currentTarget;
		if (input.selectionStart !== null && input.selectionStart > displayVal.length) {
			input.setSelectionRange(displayVal.length, displayVal.length);
		}
	};

	// Только цифры пользователя; литералы маски («+7 (») без цифр не считаем значением —
	// иначе после onClear при фокусе поле снова выглядит заполненным.
	const displayVal = cleanDigits ? getFormattedValue(value, mask) : '';
	const remainingGuides = getRemainingGuides(displayVal, mask);
	const placeholder = maskAsPlaceholder
		? getRemainingGuides('', mask)
		: placeholderProp;

	const handleClear = () => {
		onChange('');
		onClear?.();
	};

	// Объединить проброшенный ref с локальным
	const handleRef = (el: HTMLInputElement | null) => {
		internalInputRef.current = el;
		if (typeof ref === 'function') {
			ref(el);
		} else if (ref) {
			ref.current = el;
		}
	};

	const isCentered = labelPlacement !== 'inline';
	const wrapperClasses = cn(
		styles.maskedWrapper,
		isCentered ? styles.centered : '',
		width === 'full' ? styles.fullWidth : '',
		wrapperClassName,
	);

	const maskOverlay = isFocused && remainingGuides.length > 0
		? (
			<div
				className={styles.maskOverlay}
				aria-hidden='true'
				data-testid='masked-overlay'
			>
				{/* Прозрачные введённые символы сдвигают оставшиеся гиды под пропорциональный UI-шрифт */}
				<span className={styles.maskOffset}>
					{displayVal}
				</span>
				<span className={styles.guideChar}>
					{remainingGuides}
				</span>
			</div>
		)
		: null;

	return (
		<TextField
			{...props}
			ref={handleRef}
			value={displayVal}
			disabled={disabled}
			readOnly={readOnly}
			size={size}
			width={width}
			labelPlacement={labelPlacement}
			prefix={prefix}
			postfix={postfix}
			onChange={handleChange}
			onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
			onFocus={composeEventHandlers(onFocus, handleFocus)}
			onBlur={composeEventHandlers(onBlur, handleBlur)}
			onClick={composeEventHandlers(onClick, handleClick)}
			placeholder={placeholder}
			onClear={onClear ? handleClear : undefined}
			clearLabel={clearLabel}
			wrapperClassName={wrapperClasses}
			controlOverlay={maskOverlay}
			className={cn(styles.input, className)}
		/>
	);
});

MaskedField.displayName = 'MaskedField';
