import type {
	ComponentPropsWithoutRef,
	ReactNode,
} from 'react';

/**
 * Именованный размер аватара.
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

/**
 * Статус (кольцо).
 */
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

/**
 * Свойства `Avatar`.
 */
export interface AvatarProps extends ComponentPropsWithoutRef<'div'> {
	src?: string;
	/** Имя для инициалов, если нет изображения */
	name?: string;
	/**
	 * Размер: токен `xs`…`xl` или число px.
	 * @default 'md'
	 */
	size?: AvatarSize;
	/** Кольцо статуса */
	status?: AvatarStatus;
	/** Fallback-иконка; по умолчанию `IconUser`, если нет name/src */
	icon?: ReactNode;
}

export type AvatarGroupProps = ComponentPropsWithoutRef<'div'>;
