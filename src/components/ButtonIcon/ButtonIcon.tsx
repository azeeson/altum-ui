import type {ButtonIconProps} from './ButtonIcon.types';
export type {
	ButtonVariant,
	ButtonStatus,
	ButtonIconProps,
} from './ButtonIcon.types';

import React, {forwardRef, useEffect} from 'react';
import {ButtonBase} from '../../base/ButtonBase';
import styles from './ButtonIcon.module.css';
import {cn} from '../../utils/cn';

/** Общий крестик для Modal / Sheet `appearance="diskClose"` (новый элемент на каждое монтирование). */
function DiskCloseIcon() {
	return (
		<svg
			className={styles.diskCloseIcon}
			width={12}
			height={12}
			viewBox='0 0 24 24'
			aria-hidden
		>
			<path
				d='M6 6l12 12M18 6L6 18'
				fill='none'
				stroke='currentColor'
				strokeWidth={2.5}
				strokeLinecap='round'
			/>
		</svg>
	);
}

/**
 * Компактная кнопка только с иконкой — для панелей инструментов и вторичных действий.
 *
 * @component
 * @example
 * <ButtonIcon icon={<IconPlus />} aria-label="Добавить" variant="tinted" />
 */
export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(
	function ButtonIcon(
		{
			variant = 'ghost',
			status = 'default',
			size = 'md',
			shape = 'square',
			appearance = 'default',
			icon,
			children,
			className = '',
			active,
			'aria-label': ariaLabel,
			'aria-labelledby': ariaLabelledBy,
			...props
		},
		ref,
	) {
		const isDiskClose = appearance === 'diskClose';
		const content = icon || children;
		const hasVisibleText = typeof children === 'string' && children.trim() !== '';

		useEffect(() => {
			if (
				process.env.NODE_ENV !== 'production'
				&& !ariaLabel
				&& !ariaLabelledBy
				&& !hasVisibleText
			) {
				console.warn(
					'[ButtonIcon] нужен aria-label, aria-labelledby или видимый текст.',
				);
			}
		}, [ariaLabel, ariaLabelledBy, hasVisibleText]);

		return (
			<ButtonBase
				ref={ref}
				variant={isDiskClose ? 'ghost' : variant}
				status={status}
				size={size}
				active={active}
				className={cn(
					styles.iconBtn,
					isDiskClose ? styles.diskClose : styles[shape],
					className,
				)}
				contentClassName={styles.btnContent}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
				{...props}
			>
				{isDiskClose && !content ? <DiskCloseIcon /> : content}
			</ButtonBase>
		);
	},
);

ButtonIcon.displayName = 'ButtonIcon';
