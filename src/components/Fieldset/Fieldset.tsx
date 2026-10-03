import type {FieldsetProps} from './Fieldset.types';
export type {FieldsetVariant, FieldsetProps} from './Fieldset.types';

import type {CSSProperties} from 'react';
import {useFallbackId} from '../../hooks/useFallbackId';
import {cn} from '../../core/utils/cn';
import {spacingCss} from '../../core/utils/spacing';
import toggleGroup from '../../styles/toggleGroup.module.css';
import styles from './Fieldset.module.css';

/**
 * Группа полей формы: заголовок, описание и поля на корневых пропах.
 * Корень — `<div data-variant>`; футер снаружи `<fieldset>`, чтобы `disabled`
 * не блокировал кнопки футера.
 *
 * @component
 * @example
 * <Fieldset
 *   legend="Контакты"
 *   description="Для уведомлений"
 *   footer={<Button>Сохранить</Button>}
 * >
 *   <TextField label="Телефон" />
 * </Fieldset>
 */
export function Fieldset({
	variant = 'default',
	disabled = false,
	className,
	style,
	id: providedId,
	children,
	legend,
	description,
	hint,
	footer,
	gap = 'var(--altum-g-space-4)',
	rootRef,
	...rest
}: FieldsetProps) {
	const id = useFallbackId(providedId);
	const descriptionId = description ? `${id}-description` : undefined;
	const hintId = hint ? `${id}-hint` : undefined;

	return (
		<div
			{...rest}
			ref={rootRef}
			className={cn(styles.root, className)}
			style={style}
			data-variant={variant !== 'default' ? variant : undefined}
			data-disabled={disabled ? '' : undefined}
		>
			<fieldset
				id={id}
				className={cn(toggleGroup.fieldset, styles.fieldset)}
				disabled={disabled || undefined}
				aria-describedby={cn(descriptionId, hintId) || undefined}
				style={{'--altum-fieldset-gap': spacingCss(gap)} as CSSProperties}
			>
				{legend ? (
					<legend className={toggleGroup.legend}>
						{legend}
					</legend>
				) : null}
				{description ? (
					<p
						id={descriptionId}
						className={cn(styles.lede, styles.description)}
					>
						{description}
					</p>
				) : null}
				{hint ? (
					<p
						id={hintId}
						className={cn(styles.lede, styles.hint)}
					>
						{hint}
					</p>
				) : null}
				{children}
			</fieldset>
			{footer ? (
				<footer className={styles.footer}>
					{footer}
				</footer>
			) : null}
		</div>
	);
}
