import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';

/**
 * Свойства `PullToRefresh`.
 */
export interface PullToRefreshProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children: React.ReactNode;
	/** Вызывается при отпускании после порога; дождаться Promise */
	onRefresh: () => void | Promise<void>;
	/** Порог в px. @default 64 */
	threshold?: number;
	/** Отключить. @default false */
	disabled?: boolean;
	/** Прокручиваемый корень. */
	rootRef?: Ref<HTMLDivElement>;
	/** Подпись в состоянии pull */
	pullLabel?: string;
	releaseLabel?: string;
	refreshingLabel?: string;
}
