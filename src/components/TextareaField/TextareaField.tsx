import type {TextareaFieldProps} from './TextareaField.types';
export type {TextareaFieldProps} from './TextareaField.types';

import {TextField} from '../TextField/TextField';
import styles from './TextareaField.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Многострочное поле с авто-ростом по контенту (`field-sizing: content`) и chrome TextField.
 *
 * @component
 * @example
 * <TextareaField label="Комментарий" value={note} onChange={(e) => setNote(e.target.value)} />
 */
export function TextareaField({
	className,
	wrapperClassName,
	autoResize = true,
	minRows = 1,
	maxHeight,
	rows,
	value,
	onChange,
	onClear,
	style,
	inputRef,
	...props
}: TextareaFieldProps) {
	const maxHeightCss = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;

	return (
		<TextField
			{...props}
			as='textarea'
			inputRef={inputRef}
			value={value}
			rows={autoResize ? minRows : (rows ?? minRows)}
			onChange={onChange}
			onClear={onClear}
			style={{
				...(maxHeightCss ? {'--local-textarea-max-height': maxHeightCss} : null),
				...style,
			}}
			className={className}
			wrapperClassName={cn(styles.root, wrapperClassName)}
			data-autoresize={autoResize ? '' : undefined}
		/>
	);
}
