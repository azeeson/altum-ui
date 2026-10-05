import type {TypeName, TypeProps} from './Type.types';
export type {TypeName, TypeProps} from './Type.types';

import type {ElementType, Ref} from 'react';
import {Text} from '../Text/Text';
import type {TextProps} from '../Text/Text.types';
import {Title} from '../Title/Title';
import {cn} from '../../core/utils/cn';
import styles from './Type.module.css';

const HEADING_LEVEL = {
	page: 1,
	modal: 2,
	section: 2,
	card: 3,
} as const;

type HeadingName = keyof typeof HEADING_LEVEL;

const COPY: Record<Exclude<TypeName, HeadingName>, {
	as: ElementType;
	size: NonNullable<TextProps['size']>;
	weight: NonNullable<TextProps['weight']>;
	color: NonNullable<TextProps['color']>;
}> = {
	lead: {
		as: 'p',
		size: 'lg',
		weight: 'normal',
		color: 'secondary',
	},
	body: {
		as: 'p',
		size: 'md',
		weight: 'normal',
		color: 'primary',
	},
	subtitle: {
		as: 'p',
		size: 'sm',
		weight: 'normal',
		color: 'secondary',
	},
	label: {
		as: 'span',
		size: 'sm',
		weight: 'medium',
		color: 'primary',
	},
	caption: {
		as: 'p',
		size: 'xs',
		weight: 'normal',
		color: 'muted',
	},
};

function isHeading(type: TypeName): type is HeadingName {
	return type in HEADING_LEVEL;
}

/**
 * Готовая роль текста: заголовок через `Title` или абзац через `Text`.
 * Размер, вес и тег заголовка не настраиваются по месту — их задаёт `type`,
 * чтобы экран, диалог и карточка не разъезжались.
 *
 * Заголовки компонентов (`Header`, `Modal.Header`, `Accordion`, `Alert`,
 * `EmptyState`) уже со своим кеглем. `Type` — для экранов, которые собираете сами.
 *
 * @component
 * @example
 * <Type type="page">Настройки</Type>
 * <Type type="lead">Профиль, доступ и уведомления.</Type>
 * @example
 * <Type type="modal">Удалить проект</Type>
 * <Type type="subtitle">Восстановить его будет нельзя.</Type>
 * @example
 * <Type type="card">Счета</Type>
 * <Type type="caption">Обновлено сегодня</Type>
 */
export const Type = ({
	type = 'body',
	as,
	className,
	rootRef,
	...rest
}: TypeProps) => {
	if (isHeading(type)) {
		return (
			<Title
				{...rest}
				level={HEADING_LEVEL[type]}
				weight='medium'
				rootRef={rootRef as Ref<HTMLHeadingElement> | undefined}
				className={cn(styles.role, className)}
				data-type={type}
			/>
		);
	}

	const recipe = COPY[type];
	return (
		<Text
			{...rest}
			as={as ?? recipe.as}
			size={recipe.size}
			weight={recipe.weight}
			color={recipe.color}
			rootRef={rootRef}
			className={cn(styles.role, className)}
			data-type={type}
		/>
	);
};
