import type {MaskedFieldProps} from './MaskedField.types';
export type {MaskedFieldProps} from './MaskedField.types';

import {forwardRef} from 'react';
import {TextField} from '../TextField/TextField';
import styles from './MaskedField.module.css';
import {composeEventHandlers} from '../../utils/composeEvents';
import {composeRefs} from '../../utils/composeRefs';
import {fieldOverlayClassName} from '../../base/FieldBase';
import {useDigitMask} from '../../hooks/useDigitMask';
import {getRemainingGuides} from './MaskedField.utils';

export {
	getFormattedValue,
	getRemainingGuides,
	getStaticDigitsPrefix,
} from './MaskedField.utils';

/**
 * Текстовое поле с маской ввода: хранит только цифры, отображает форматированное значение.
 *
 * @component
 * @example
 * <MaskedField label="Телефон" mask="+7 (999) 999-99-99" value={phone} onChange={setPhone} />
 */
export const MaskedField = forwardRef<HTMLInputElement, MaskedFieldProps>(function MaskedField(
	{
		mask,
		value,
		onChange,
		onClear,
		clearLabel,
		onKeyDown,
		disabled,
		readOnly,
		maskAsPlaceholder = false,
		placeholder: placeholderProp,
		onClick,
		...props
	},
	ref,
) {
	const maskInput = useDigitMask({
		mask,
		value,
		disabled,
		readOnly,
		onChange,
	});

	return (
		<TextField
			{...props}
			ref={composeRefs(ref, maskInput.inputRef)}
			type='text'
			value={maskInput.displayVal}
			disabled={disabled}
			readOnly={readOnly}
			onChange={maskInput.handleChange}
			onKeyDown={composeEventHandlers(onKeyDown, maskInput.handleKeyDown)}
			onClick={composeEventHandlers(onClick, maskInput.handleClick)}
			placeholder={maskAsPlaceholder ? getRemainingGuides('', mask) : placeholderProp}
			onClear={onClear ? () => {
				onChange('');
				onClear();
			} : undefined}
			clearLabel={clearLabel}
			controlOverlay={maskInput.remainingGuides.length > 0 ? (
				<div
					className={fieldOverlayClassName()}
					aria-hidden='true'
					data-testid='masked-overlay'
				>
					<span className={styles.maskOffset}>
						{maskInput.displayVal}
					</span>
					<span className={styles.guideChar}>
						{maskInput.remainingGuides}
					</span>
				</div>
			) : null}
		/>
	);
});

MaskedField.displayName = 'MaskedField';
