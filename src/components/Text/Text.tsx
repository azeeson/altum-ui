import type {
	TextProps,
} from './Text.types';
export type {
	TextProps,
} from './Text.types';

import {Typography} from '../../base/Typography';
import styles from './Text.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Базовый текстовый примитив с типографическими токенами размера, веса и цвета.
 * По умолчанию рендерит **`span`** (inline). Для блочного текста (заголовок + подсказка
 * друг под другом) передайте `as="p"` или `as="div"` — иначе соседние `Text` склеятся
 * в одну строку без пробела.
 * Семантические цвета (`primary` / `secondary` / …) читают `--altum-type-*`.
 *
 * @component
 * @example
 * <Text as="p" size="lg" weight="medium">Заголовок секции</Text>
 * <Text as="p" size="sm" color="secondary">Подсказка под заголовком</Text>
 * <Text size="sm" color="secondary" title="Подсказка" id="hint">Подсказка</Text>
 */
export const Text = ({
	color = 'primary',
	size = 'md',
	weight = 'normal',
	as = 'span',
	className,
	rootRef,
	...rest
}: TextProps) => (
	<Typography
		as={as}
		rootRef={rootRef}
		className={cn(styles.text, className)}
		data-color={color !== 'primary' ? color : undefined}
		data-size={size !== 'md' ? size : undefined}
		data-weight={weight !== 'normal' ? weight : undefined}
		{...rest}
	/>
);
