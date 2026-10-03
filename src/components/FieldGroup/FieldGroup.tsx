import type {FieldGroupProps} from './FieldGroup.types';
export type {FieldGroupProps, FieldGroupWidth} from './FieldGroup.types';

import {cn} from '../../core/utils/cn';
import styles from './FieldGroup.module.css';

/**
 * Ряд без своего визуала: поля и кнопки стоят вплотную,
 * на стыке пропадает скругление и двойная рамка.
 *
 * @component
 * @example
 * <FieldGroup>
 *   <TextField label="Сумма" />
 *   <Button variant="secondary">OK</Button>
 * </FieldGroup>
 */
export function FieldGroup({
	width = 'auto',
	className,
	children,
	style,
	rootRef,
	...rest
}: FieldGroupProps) {
	return (
		<div
			{...rest}
			ref={rootRef}
			className={cn(styles.root, className)}
			data-width={width === 'full' ? 'full' : undefined}
			style={style}
		>
			{children}
		</div>
	);
}
