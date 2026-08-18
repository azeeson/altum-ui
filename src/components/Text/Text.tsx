import type {
	TextProps,
} from './Text.types';
export type {
	TextProps,
} from './Text.types';

import {forwardRef} from 'react';
import styles from './Text.module.css';
import {cn} from '../../utils/cn';

/**
 * Базовый текстовый примитив с типографическими токенами размера, веса и цвета.
 * По умолчанию рендерит **`span`** (inline). Для блочного текста (заголовок + подсказка
 * друг под другом) передайте `as="p"` или `as="div"` — иначе соседние `Text` склеятся
 * в одну строку без пробела.
 * Семантические цвета (`primary` / `secondary` / …) читают `--altum-type-*` (адаптация в `Box`).
 *
 * @component
 * @example
 * <Text as="p" size="lg" weight="medium">Заголовок секции</Text>
 * <Text as="p" size="sm" color="secondary">Подсказка под заголовком</Text>
 * <Text size="sm" color="secondary" title="Подсказка" id="hint">Подсказка</Text>
 */
export const Text = forwardRef<HTMLElement, TextProps>(function Text(
	{
		size = 'md',
		weight = 'normal',
		color = 'primary',
		children,
		className,
		style,
		as: Component = 'span',
		...rest
	},
	ref,
) {
	return (
		<Component
			ref={ref}
			className={cn(
				styles.text,
				styles[size],
				styles[weight],
				styles[`col_${color}`],
				className,
			)}
			style={style}
			{...rest}
		>
			{children}
		</Component>
	);
});

Text.displayName = 'Text';
