import type {ButtonGroupRootProps} from './ButtonGroup.types';
export type {
	ButtonGroupOrientation,
	ButtonGroupItemFit,
	ButtonGroupVariant,
	ButtonGroupRootProps,
} from './ButtonGroup.types';

import type {HTMLAttributes, KeyboardEvent} from 'react';
import styles from './ButtonGroup.module.css';
import {cn} from '../../core/utils/cn';
import {handleRovingFocus} from '../../core/utils/bundle';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_buttonGroup} from '../../locales/slices/buttonGroup.ru';

const localeFallback = {
	buttonGroup: ru_buttonGroup,
};

/**
 * Коробка для независимых кнопок: склейка, радиус по краям, зазор и ось.
 * Внутрь кладётся `Button`. Кнопки не выбирают друг друга.
 * Выбор — `SelectionGroup`. `SegmentedControl` — тот же выбор с заливкой пункта.
 * Стрелки двигают фокус по кнопкам внутри. В tab-порядке сначала сама группа.
 *
 * @component
 * @example
 * <ButtonGroup aria-label="Навигация">
 *   <Button aria-label="Вверх" prefix={<IconChevronUp />} />
 *   <Button aria-label="Вниз" prefix={<IconChevronDown />} />
 * </ButtonGroup>
 */
export const ButtonGroup = ({
	children,
	variant = 'secondary',
	size = 'md',
	disabled = false,
	focusable = true,
	width = 'auto',
	itemFit = 'equal',
	orientation = 'horizontal',
	role = 'group',
	'aria-label': ariaLabel,
	className,
	onKeyDown,
	rootRef,
	...rest
}: ButtonGroupRootProps) => {
	const {t} = useLocale(localeFallback);
	const readOnly = (rest as {'data-readonly'?: unknown})['data-readonly'] != null;
	const isInteractive = focusable && !disabled && !readOnly;

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		onKeyDown?.(event);
		if (!isInteractive || event.defaultPrevented) return;
		handleRovingFocus(event, event.currentTarget, ':is(button, a)');
	};

	return (
		<div
			ref={rootRef}
			className={cn(styles.group, className)}
			{...rest}
			role={role}
			aria-label={ariaLabel ?? t('buttonGroup.ariaLabel')}
			aria-disabled={disabled || undefined}
			data-variant={variant}
			data-size={size !== 'md' ? size : undefined}
			data-disabled={disabled ? '' : undefined}
			data-width={width === 'full' ? 'full' : undefined}
			data-fit={itemFit === 'content' ? 'content' : undefined}
			data-orientation={orientation}
			tabIndex={disabled || !focusable ? -1 : 0}
			onKeyDown={handleKeyDown}
			{...(disabled ? {inert: ''} as HTMLAttributes<HTMLDivElement> : {})}
		>
			{children}
		</div>
	);
};
