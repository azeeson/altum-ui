import type {TypeProps} from './Type.types';
export type {
	TypeSize,
	TypeWeight,
	TypeProps,
} from './Type.types';

import {forwardRef} from 'react';
import {As} from '../As';
import typeStyles from '../../styles/type.module.css';
import {cn} from '../../utils/cn';

/**
 * Полиморфный текстовый примитив: reset, семейство, size/weight.
 * Дефолты `md` / `normal` живут на корневом классе.
 *
 * @component
 */
export const Type = forwardRef<HTMLElement, TypeProps>(function Type(
	{
		size = 'md',
		weight = 'normal',
		className,
		as = 'span',
		...rest
	},
	ref,
) {
	return (
		<As
			ref={ref}
			as={as}
			className={cn(
				typeStyles.type,
				size !== 'md' && typeStyles[size],
				weight !== 'normal' && typeStyles[weight],
				className,
			)}
			{...rest}
		/>
	);
});

Type.displayName = 'Type';
